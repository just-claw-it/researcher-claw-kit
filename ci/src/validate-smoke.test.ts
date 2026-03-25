/**
 * validate-smoke.test.ts
 *
 * Unit tests for the smoke validator.
 * These run without OpenClaw — they test the validation logic directly
 * by injecting synthetic skill output.
 */

import { describe, it, expect } from "@jest/globals";

// Extract pure validation functions for unit testing
// (validateJson and validateProse are not exported from validate-smoke.ts
// to keep the public API clean — we test via the behavior detectors directly)

// ─── Behavior detector tests ──────────────────────────────────────────────────

const BEHAVIOR_DETECTORS = {
  presents_inferred_method: (output: string) => {
    const methods = [
      "experiment", "case study", "grounded theory", "action research",
      "data science", "engineering research", "systematic review",
      "longitudinal", "replication", "repository mining",
      "qualitative survey", "questionnaire survey", "benchmarking",
      "mixed methods", "optimization", "simulation",
      "meta-science", "case survey",
    ];
    return methods.some((m) => output.toLowerCase().includes(m));
  },

  requests_confirmation: (output: string) => {
    const phrases = ["does this match", "is this accurate", "confirm", "correct anything"];
    return phrases.some((p) => output.toLowerCase().includes(p));
  },

  proceeds_to_evaluation_without_confirmation: (output: string) => {
    const evaluationMarkers = ["essential attributes", "pass / fail", "pass/fail", "verdict:"];
    const confirmationMarkers = ["does this match", "is this accurate", "confirm"];
    const lower = output.toLowerCase();
    return evaluationMarkers.some((m) => lower.includes(m)) &&
      !confirmationMarkers.some((m) => lower.includes(m));
  },

  fabricates_citation: (output: string) => {
    const hasSearchContext = output.toLowerCase().includes("search result") ||
      output.toLowerCase().includes("arxiv");
    if (hasSearchContext) return false;
    return /\b\w+ et al\.\s*\(\d{4}\)/.test(output);
  },

  reflects_back_idea: (output: string) => {
    const reflectionPhrases = [
      "you seem to be", "you want to", "you are investigating",
      "you're investigating", "your idea", "your research",
      "you described", "you mentioned", "if i understand",
      "what i heard", "you are interested in", "you're interested in",
    ];
    return reflectionPhrases.some((p) => output.toLowerCase().includes(p));
  },

  presents_search_strategy: (output: string) => {
    const lower = output.toLowerCase();
    const hasSearchTerms = lower.includes("search term") || lower.includes("search strateg") ||
      lower.includes("core term") || lower.includes("keyword");
    const hasVenues = lower.includes("venue") || lower.includes("arxiv") ||
      lower.includes("semantic scholar") || lower.includes("database");
    return hasSearchTerms || hasVenues;
  },
};

// ─── presents_inferred_method ─────────────────────────────────────────────────

describe("presents_inferred_method", () => {
  it("detects 'Experiment' in output", () => {
    const output = "Based on your paper, I believe the primary research method is **Experiment (with Human Participants)**, because you randomized participants across conditions.";
    expect(BEHAVIOR_DETECTORS.presents_inferred_method(output)).toBe(true);
  });

  it("detects 'case study' case-insensitively", () => {
    const output = "This looks like a Case Study because you observed one organization.";
    expect(BEHAVIOR_DETECTORS.presents_inferred_method(output)).toBe(true);
  });

  it("returns false when no method is named", () => {
    const output = "This is an interesting paper about software development practices.";
    expect(BEHAVIOR_DETECTORS.presents_inferred_method(output)).toBe(false);
  });
});

// ─── requests_confirmation ────────────────────────────────────────────────────

describe("requests_confirmation", () => {
  it("detects 'Does this match'", () => {
    const output = "Does this match your intent? Please correct anything that's wrong.";
    expect(BEHAVIOR_DETECTORS.requests_confirmation(output)).toBe(true);
  });

  it("detects 'confirm' as substring", () => {
    const output = "Please confirm before I proceed to the full review.";
    expect(BEHAVIOR_DETECTORS.requests_confirmation(output)).toBe(true);
  });

  it("returns false when no confirmation is requested", () => {
    const output = "The paper uses a controlled experiment. Moving on to the evaluation.";
    expect(BEHAVIOR_DETECTORS.requests_confirmation(output)).toBe(false);
  });
});

// ─── proceeds_to_evaluation_without_confirmation ──────────────────────────────

describe("proceeds_to_evaluation_without_confirmation", () => {
  it("detects forbidden behavior: evaluation without confirmation", () => {
    const output = `
      The paper uses a controlled experiment.
      Essential attributes: PASS / FAIL analysis follows.
      Verdict: Major revision required.
    `;
    expect(BEHAVIOR_DETECTORS.proceeds_to_evaluation_without_confirmation(output)).toBe(true);
  });

  it("does not flag when confirmation precedes evaluation", () => {
    const output = `
      I believe this is an Experiment. Does this match your intent?
      Once confirmed, I will check the essential attributes.
    `;
    expect(BEHAVIOR_DETECTORS.proceeds_to_evaluation_without_confirmation(output)).toBe(false);
  });

  it("does not flag a response with no evaluation content", () => {
    const output = "This looks like a case study. Does this match your description?";
    expect(BEHAVIOR_DETECTORS.proceeds_to_evaluation_without_confirmation(output)).toBe(false);
  });
});

// ─── fabricates_citation ──────────────────────────────────────────────────────

describe("fabricates_citation", () => {
  it("flags a citation with no search context", () => {
    const output = "This has been shown previously (Smith et al. (2023)) in several studies.";
    expect(BEHAVIOR_DETECTORS.fabricates_citation(output)).toBe(true);
  });

  it("does not flag when arxiv context is present", () => {
    const output = "According to my arXiv search, Smith et al. (2023) showed similar results.";
    expect(BEHAVIOR_DETECTORS.fabricates_citation(output)).toBe(false);
  });

  it("does not flag a response with no citations", () => {
    const output = "This paper appears to be a case study of an open source project.";
    expect(BEHAVIOR_DETECTORS.fabricates_citation(output)).toBe(false);
  });
});

// ─── reflects_back_idea ──────────────────────────────────────────────────────

describe("reflects_back_idea", () => {
  it("detects 'you seem to be investigating'", () => {
    const output = "You seem to be investigating how developers adopt LLMs for code review.";
    expect(BEHAVIOR_DETECTORS.reflects_back_idea(output)).toBe(true);
  });

  it("detects 'your research'", () => {
    const output = "Your research focuses on test-driven development in industry.";
    expect(BEHAVIOR_DETECTORS.reflects_back_idea(output)).toBe(true);
  });

  it("returns false when no reflection language is present", () => {
    const output = "Let me generate three framings for this problem.";
    expect(BEHAVIOR_DETECTORS.reflects_back_idea(output)).toBe(false);
  });
});

// ─── presents_search_strategy ────────────────────────────────────────────────

describe("presents_search_strategy", () => {
  it("detects 'search terms'", () => {
    const output = "Here are the core search terms I will use: TDD, defect density, industrial.";
    expect(BEHAVIOR_DETECTORS.presents_search_strategy(output)).toBe(true);
  });

  it("detects venue references like 'arxiv'", () => {
    const output = "I will search arXiv and IEEE Xplore for relevant papers.";
    expect(BEHAVIOR_DETECTORS.presents_search_strategy(output)).toBe(true);
  });

  it("detects 'Semantic Scholar'", () => {
    const output = "I will query Semantic Scholar with the following keywords.";
    expect(BEHAVIOR_DETECTORS.presents_search_strategy(output)).toBe(true);
  });

  it("returns false when no search strategy is mentioned", () => {
    const output = "This is a well-framed research question about developer productivity.";
    expect(BEHAVIOR_DETECTORS.presents_search_strategy(output)).toBe(false);
  });
});

// ─── presents_inferred_method: engineering research ──────────────────────────

describe("presents_inferred_method — engineering research", () => {
  it("detects 'engineering research'", () => {
    const output = "Based on your paper, I believe the primary research method is Engineering Research, because you built and evaluated a tool.";
    expect(BEHAVIOR_DETECTORS.presents_inferred_method(output)).toBe(true);
  });
});

// ─── Integration: full prose validation scenario ─────────────────────────────

describe("Prose validation: draft-review smoke test scenario", () => {
  const goodOutput = `
    Based on your abstract, I believe the primary research method is
    **Experiment (with Human Participants)**, because you mention a
    controlled experiment with randomized student participants, two
    treatment conditions (TDD vs test-last), and quantitative outcome
    measures (defect density, test coverage).

    Does this match your intent? If not, please describe how you
    collected and analyzed your data and I will re-infer.
  `;

  const badOutput = `
    This paper uses an experiment.
    Essential attributes: PASS/FAIL
    1. States formal hypotheses — FAIL
    Verdict: Major revision.
  `;

  it("passes for a good output that names method and requests confirmation", () => {
    const lower = goodOutput.toLowerCase();
    const hasMethod = ["experiment"].some((m) => lower.includes(m));
    const hasConfirmation = ["does this match"].some((p) => lower.includes(p));
    const proceededWithout = BEHAVIOR_DETECTORS
      .proceeds_to_evaluation_without_confirmation(goodOutput);

    expect(hasMethod).toBe(true);
    expect(hasConfirmation).toBe(true);
    expect(proceededWithout).toBe(false);
  });

  it("fails for bad output that jumps straight to evaluation", () => {
    const proceededWithout = BEHAVIOR_DETECTORS
      .proceeds_to_evaluation_without_confirmation(badOutput);
    expect(proceededWithout).toBe(true);
  });
});
