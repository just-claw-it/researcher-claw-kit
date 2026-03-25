/**
 * validate-kit.ts
 *
 * Kit validation pipeline. Called by CI on every PR.
 * Also usable locally: `cd ci && npx tsx src/validate-kit.ts ..`
 *
 * Sequence:
 *   1. Validate kit directory structure (required files present)
 *   2. Validate kit.json schema
 *   3. Validate smoke.json schema (structure only)
 *
 * Exits 0 on full pass. Exits 1 on any failure, with actionable error output.
 */

import * as fs from "fs/promises";
import * as path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KitJson {
  name: string;
  version: string;
  maintainer: string;
  description: string;
  skills: string[];
  requiredTools?: string[];
}

interface StepResult {
  name: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Required file structure ──────────────────────────────────────────────────

const REQUIRED_FILES = [
  "kit.json",
  "smoke.json",
  "SOUL.md",
  "AGENTS.md",
  "setup",
];

const REQUIRED_SKILL_FILES = (kitName: string, skillName: string) => [
  `.claude/skills/${kitName}/${skillName}/${skillName}.md`,
];

// ─── Step 1: Structure check ──────────────────────────────────────────────────

async function checkStructure(kitDir: string): Promise<StepResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const file of REQUIRED_FILES) {
    try {
      await fs.access(path.join(kitDir, file));
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  const kitJsonPath = path.join(kitDir, "kit.json");
  try {
    const raw = await fs.readFile(kitJsonPath, "utf-8");
    const config: Partial<KitJson> = JSON.parse(raw);
    const kitName = config.name ?? "unknown";
    for (const skill of config.skills ?? []) {
      for (const skillFile of REQUIRED_SKILL_FILES(kitName, skill)) {
        try {
          await fs.access(path.join(kitDir, skillFile));
        } catch {
          errors.push(`Declared skill "${skill}" is missing its file: ${skillFile}`);
        }
      }
    }
  } catch {
    // kit.json errors will be caught in step 2
  }

  return { name: "Structure check", passed: errors.length === 0, errors, warnings };
}

// ─── Step 2: kit.json schema validation ──────────────────────────────────────

async function validateKitJson(kitDir: string): Promise<StepResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const filePath = path.join(kitDir, "kit.json");

  let config: Partial<KitJson>;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    config = JSON.parse(raw);
  } catch {
    return {
      name: "kit.json validation",
      passed: false,
      errors: ["kit.json is missing or not valid JSON"],
      warnings,
    };
  }

  const required: (keyof KitJson)[] = [
    "name", "version", "maintainer", "description", "skills",
  ];

  for (const field of required) {
    if (config[field] === undefined || config[field] === null || config[field] === "") {
      errors.push(`kit.json missing required field: "${field}"`);
    }
  }

  if (!Array.isArray(config.skills) || config.skills.length === 0) {
    errors.push('kit.json "skills" must be a non-empty array');
  }

  const semverPattern = /^\d+\.\d+\.\d+$/;
  if (config.version && !semverPattern.test(config.version)) {
    errors.push(`"version" must be semver format (x.y.z), got: "${config.version}"`);
  }

  return {
    name: "kit.json validation",
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Step 3: smoke.json structure validation ─────────────────────────────────

async function validateSmokeStructure(kitDir: string): Promise<StepResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const filePath = path.join(kitDir, "smoke.json");

  let parsed: unknown;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    parsed = JSON.parse(raw);
  } catch {
    return {
      name: "smoke.json structure validation",
      passed: false,
      errors: ["smoke.json is missing or not valid JSON"],
      warnings,
    };
  }

  const tests = Array.isArray(parsed) ? parsed : [parsed];

  for (let i = 0; i < tests.length; i++) {
    const smoke = tests[i] as Record<string, unknown>;
    const prefix = tests.length > 1 ? `[test ${i + 1}] ` : "";

    if (!smoke.skill || typeof smoke.skill !== "string") {
      errors.push(`${prefix}smoke.json must have a "skill" field (string)`);
    }
    if (!smoke.input || typeof smoke.input !== "object") {
      errors.push(`${prefix}smoke.json must have an "input" field (object)`);
    }
    if (!smoke.outputSchema || typeof smoke.outputSchema !== "object") {
      errors.push(`${prefix}smoke.json must have an "outputSchema" field (object)`);
      continue;
    }

    const schema = smoke.outputSchema as Record<string, unknown>;

    if (schema.type !== "json" && schema.type !== "prose") {
      errors.push(`${prefix}outputSchema.type must be "json" or "prose"`);
    }

    if (schema.type === "prose") {
      for (const field of ["requiredPhrases", "requiredBehaviors", "forbiddenBehaviors"]) {
        if (!Array.isArray(schema[field])) {
          errors.push(`${prefix}Prose outputSchema must have "${field}" as an array`);
        }
      }
      if (!schema.validationNote) {
        warnings.push(
          `${prefix}Prose outputSchema should include a "validationNote" explaining what the test validates`
        );
      }
    }
  }

  return {
    name: "smoke.json structure validation",
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export async function validateKit(kitDir: string): Promise<boolean> {
  console.log(`\nValidating kit at: ${kitDir}\n`);
  console.log("─".repeat(60));

  const steps = [
    () => checkStructure(kitDir),
    () => validateKitJson(kitDir),
    () => validateSmokeStructure(kitDir),
  ];

  let allPassed = true;

  for (const step of steps) {
    const result = await step();
    const icon = result.passed ? "✓" : "✗";
    console.log(`\n${icon} ${result.name}`);

    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => console.log(`  ⚠  ${w}`));
    }
    if (!result.passed) {
      result.errors.forEach((e) => console.log(`  ✗  ${e}`));
      allPassed = false;
      break;
    }
  }

  console.log("\n" + "─".repeat(60));
  if (allPassed) {
    console.log("✓ All checks passed.");
  } else {
    console.log("✗ Validation failed. Fix errors above before opening a PR.");
  }

  return allPassed;
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────────

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const kitDir = process.argv[2];
  if (!kitDir) {
    console.error("Usage: validate-kit <kit-directory>");
    process.exit(1);
  }

  validateKit(kitDir).then((passed) => {
    process.exit(passed ? 0 : 1);
  });
}
