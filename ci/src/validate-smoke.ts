/**
 * validate-smoke.ts
 *
 * Behavior detection library for smoke test validation.
 * Exports behavior detectors and validation functions that can be used
 * by CI (structural checks) and the web app (live output validation).
 *
 * The detectors check whether LLM output exhibits expected behaviors
 * (e.g. "presents inferred method", "requests confirmation") or
 * forbidden behaviors (e.g. "fabricates citation").
 */

import AjvModule from "ajv";

const Ajv = AjvModule.default ?? AjvModule;
const ajv = new Ajv();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SmokeInput {
  message: string;
  [key: string]: unknown;
}

interface JsonOutputSchema {
  type: "json";
  [key: string]: unknown;
}

interface ProseOutputSchema {
  type: "prose";
  validationStrategy: "contains";
  requiredPhrases: string[];
  requiredBehaviors: BehaviorKey[];
  forbiddenBehaviors: BehaviorKey[];
  validationNote?: string;
}

type OutputSchema = JsonOutputSchema | ProseOutputSchema;

export interface SmokeDefinition {
  skill: string;
  input: SmokeInput;
  outputSchema: OutputSchema;
}

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  strategy: "json" | "prose";
  rawOutput?: string;
}

// ─── Behavior Definitions ─────────────────────────────────────────────────────

export type BehaviorKey =
  | "presents_inferred_method"
  | "requests_confirmation"
  | "proceeds_to_evaluation_without_confirmation"
  | "fabricates_citation"
  | "provides_verdict"
  | "lists_essential_attribute_failures"
  | "presents_claim_evidence_alignment"
  | "reflects_back_idea"
  | "presents_search_strategy";

type BehaviorDetector = (output: string) => boolean;

export const BEHAVIOR_DETECTORS: Record<BehaviorKey, BehaviorDetector> = {

  presents_inferred_method: (output) => {
    const methods = [
      "experiment", "case study", "grounded theory", "action research",
      "data science", "engineering research", "systematic review",
      "longitudinal", "replication", "repository mining",
      "qualitative survey", "questionnaire survey", "benchmarking",
      "mixed methods", "optimization", "simulation",
      "meta-science", "case survey",
    ];
    const lower = output.toLowerCase();
    return methods.some((m) => lower.includes(m));
  },

  requests_confirmation: (output) => {
    const confirmationPhrases = [
      "does this match",
      "is this accurate",
      "confirm",
      "correct anything",
      "do you agree",
      "please confirm",
    ];
    const lower = output.toLowerCase();
    return confirmationPhrases.some((p) => lower.includes(p));
  },

  proceeds_to_evaluation_without_confirmation: (output) => {
    const evaluationMarkers = [
      "essential attributes",
      "pass / fail",
      "pass/fail",
      "claim–evidence",
      "claim-evidence",
      "verdict:",
    ];
    const confirmationMarkers = [
      "does this match",
      "is this accurate",
      "confirm",
    ];
    const lower = output.toLowerCase();
    const hasEvaluation = evaluationMarkers.some((m) => lower.includes(m));
    const hasConfirmation = confirmationMarkers.some((m) => lower.includes(m));
    return hasEvaluation && !hasConfirmation;
  },

  fabricates_citation: (output) => {
    const fabricationPatterns = [
      /\b\w+ et al\.\s*\(\d{4}\)/,
    ];
    const hasSearchContext = output.toLowerCase().includes("search result") ||
      output.toLowerCase().includes("arxiv") ||
      output.toLowerCase().includes("semantic scholar");
    if (hasSearchContext) return false;
    return fabricationPatterns.some((p) => p.test(output));
  },

  provides_verdict: (output) => {
    const verdicts = ["accept", "minor revision", "major revision", "reject"];
    const lower = output.toLowerCase();
    return verdicts.some((v) => lower.includes(v));
  },

  lists_essential_attribute_failures: (output) => {
    const lower = output.toLowerCase();
    return (lower.includes("fail") || lower.includes("partial")) &&
      lower.includes("essential");
  },

  presents_claim_evidence_alignment: (output) => {
    const lower = output.toLowerCase();
    return lower.includes("claim") &&
      (lower.includes("evidence") || lower.includes("supported") || lower.includes("unsupported"));
  },

  reflects_back_idea: (output) => {
    const reflectionPhrases = [
      "you seem to be",
      "you want to",
      "you are investigating",
      "you're investigating",
      "your idea",
      "your research",
      "you described",
      "you mentioned",
      "if i understand",
      "what i heard",
      "you are interested in",
      "you're interested in",
    ];
    const lower = output.toLowerCase();
    return reflectionPhrases.some((p) => lower.includes(p));
  },

  presents_search_strategy: (output) => {
    const lower = output.toLowerCase();
    const hasSearchTerms = lower.includes("search term") || lower.includes("search strateg") ||
      lower.includes("core term") || lower.includes("keyword");
    const hasVenues = lower.includes("venue") || lower.includes("arxiv") ||
      lower.includes("semantic scholar") || lower.includes("database");
    return hasSearchTerms || hasVenues;
  },
};

// ─── Validators ───────────────────────────────────────────────────────────────

export function validateJson(output: string, schema: JsonOutputSchema): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(output);
  } catch {
    const stripped = output.replace(/```json|```/g, "").trim();
    try {
      parsed = JSON.parse(stripped);
    } catch {
      errors.push("Output is not valid JSON and could not be parsed after stripping code fences.");
      return { passed: false, errors, warnings, strategy: "json", rawOutput: output };
    }
  }

  const validate = ajv.compile(schema);
  if (!validate(parsed)) {
    for (const err of validate.errors ?? []) {
      errors.push(`Schema violation at ${err.instancePath}: ${err.message}`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    strategy: "json",
    rawOutput: output,
  };
}

export function validateProse(output: string, schema: ProseOutputSchema): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lower = output.toLowerCase();

  for (const phrase of schema.requiredPhrases) {
    if (!lower.includes(phrase.toLowerCase())) {
      errors.push(`Required phrase not found in output: "${phrase}"`);
    }
  }

  for (const behaviorKey of schema.requiredBehaviors) {
    const detector = BEHAVIOR_DETECTORS[behaviorKey];
    if (!detector) {
      warnings.push(`Unknown required behavior key: "${behaviorKey}" — skipped`);
      continue;
    }
    if (!detector(output)) {
      errors.push(`Required behavior not detected: "${behaviorKey}"`);
    }
  }

  for (const behaviorKey of schema.forbiddenBehaviors) {
    const detector = BEHAVIOR_DETECTORS[behaviorKey];
    if (!detector) {
      warnings.push(`Unknown forbidden behavior key: "${behaviorKey}" — skipped`);
      continue;
    }
    if (detector(output)) {
      errors.push(`Forbidden behavior detected: "${behaviorKey}"`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    strategy: "prose",
    rawOutput: output,
  };
}
