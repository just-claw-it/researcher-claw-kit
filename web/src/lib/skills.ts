import fs from "fs";
import path from "path";

export type SkillId = "research-intake" | "lit-review" | "draft-review";

/** Repo root containing `.claude/` and `standards/`. Required for Docker / standalone (see Dockerfile). */
function getRepoRoot(): string {
  if (process.env.RESEARCHER_KIT_ROOT) {
    return path.resolve(process.env.RESEARCHER_KIT_ROOT);
  }
  return path.resolve(process.cwd(), "..");
}

const REPO_ROOT = getRepoRoot();

function readFile(filePath: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, filePath), "utf-8");
}

export function getSkillPrompt(skillId: SkillId): string {
  const filePath = `.claude/skills/researcher/${skillId}/${skillId}.md`;
  return readFile(filePath);
}

export function getStandard(filename: string): string {
  return readFile(`standards/${filename}`);
}

export function getAllStandardFilenames(): string[] {
  const standardsDir = path.join(REPO_ROOT, "standards");
  return fs
    .readdirSync(standardsDir)
    .filter((f) => f.endsWith(".md") && f !== "_index.md")
    .sort();
}

export function getStandardsIndex(): string {
  return readFile("standards/_index.md");
}

export function buildSystemPrompt(skillId: SkillId): string {
  const skillPrompt = getSkillPrompt(skillId);

  if (skillId === "draft-review") {
    const generalStandard = getStandard("general.md");
    const allStandards = getAllStandardFilenames();
    const standardsSummary = allStandards
      .map((f) => `- ${f}`)
      .join("\n");

    return [
      skillPrompt,
      "",
      "---",
      "",
      "## Available standards files",
      "",
      standardsSummary,
      "",
      "## General Standard (always applied)",
      "",
      generalStandard,
    ].join("\n");
  }

  return skillPrompt;
}

export const SKILL_META: Record<
  SkillId,
  { title: string; description: string; placeholder: string }
> = {
  "research-intake": {
    title: "Research Intake",
    description:
      "Frame your research problem before you collect any data. Describe your idea at any level of vagueness.",
    placeholder:
      "Describe your research idea... e.g. 'I want to study how developers use LLMs for code review in open-source projects.'",
  },
  "lit-review": {
    title: "Literature Review",
    description:
      "Map the literature and find your research gap. Works best when you have a clear research question from /research-intake.",
    placeholder:
      "Paste your research question and contribution claim, or paste your PROBLEM.md content here...",
  },
  "draft-review": {
    title: "Draft Review",
    description:
      "Peer review your draft against ACM SIGSOFT Empirical Standards. Paste your paper draft or abstract.",
    placeholder:
      "Paste your paper draft, abstract, or methodology section here...",
  },
};
