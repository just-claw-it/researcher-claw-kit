# Contributing to the Researcher Kit

## Before opening a PR

Every PR must pass CI before it can be merged. Run the validator locally first:

```bash
cd ci
npm install
npm test
npm run validate -- ..
```

This runs the same checks as CI:
1. Required files present
2. `kit.json` schema valid
3. `smoke.json` structure valid
4. Unit tests pass

Fix all errors locally before opening a PR. PRs that fail CI are not reviewed.

### Web app (`web/`)

From the repository root:

```bash
cd web
npm ci
npm run lint
npm run build
```

Docker image (from repo root):

```bash
docker build -t researcher-kit .
```

CI runs the same `docker build` on every pull request.

---

## Kit structure

A valid kit directory must contain:

```
my-kit/
├── kit.json                  # Kit metadata
├── smoke.json                # Behavioral smoke test
├── SOUL.md                   # Personality and defaults for the kit
├── AGENTS.md                 # Skill routing guide
├── setup                     # Install script (executable)
└── .claude/
    └── skills/
        └── [kit-name]/
            └── [skill-name]/
                └── [skill-name].md   # One file per declared skill
```

Every skill declared in `kit.json` must have a corresponding `.md` file.

---

## Writing smoke.json

The smoke test validates that your skill behaves correctly, not just that it runs.

### For conversational skills (most skills): use `"type": "prose"`

`smoke.json` can be a single test object or an array of test objects
(one per skill is recommended):

```json
[
  {
    "skill": "my-skill",
    "input": {
      "message": "A realistic input that exercises the skill's core behavior"
    },
    "outputSchema": {
      "type": "prose",
      "validationStrategy": "contains",
      "requiredPhrases": ["phrase that must appear in output"],
      "requiredBehaviors": ["presents_inferred_method", "requests_confirmation"],
      "forbiddenBehaviors": ["proceeds_to_evaluation_without_confirmation"],
      "validationNote": "Explain what this test is checking and why"
    }
  }
]
```

### Available behavior keys

| Key | What it checks |
|-----|---------------|
| `presents_inferred_method` | Response names one of the 18 accepted research methods |
| `requests_confirmation` | Response asks the user to confirm before proceeding |
| `proceeds_to_evaluation_without_confirmation` | **Forbidden** — evaluation without confirmation gate |
| `fabricates_citation` | **Forbidden** — citation-like pattern with no search context |
| `provides_verdict` | Response includes Accept / Minor revision / Major revision / Reject |
| `lists_essential_attribute_failures` | Response lists specific essential attribute failures |
| `presents_claim_evidence_alignment` | Response discusses claim-evidence relationship |
| `reflects_back_idea` | Response reflects back the researcher's stated idea |
| `presents_search_strategy` | Response presents search terms, venues, or databases |

### Adding a new behavior key

If your skill has behavioral requirements not covered above, add a detector
to `ci/src/validate-smoke.ts` in the `BEHAVIOR_DETECTORS` object:

```typescript
my_new_behavior: (output: string) => {
  return output.toLowerCase().includes("some marker");
},
```

Then reference it in your `smoke.json` as `"requiredBehaviors": ["my_new_behavior"]`
or `"forbiddenBehaviors": ["my_new_behavior"]`.

---

## Standards for fields outside software engineering

The current kit only contains validated standards for software engineering research
(sourced from ACM SIGSOFT Empirical Standards, CC0).

If you want to contribute a standard for a different field:

1. **Use `general.md` only** — note in your PR that reviews are PROVISIONAL.

2. **Contribute a new standard** — open a separate PR with your field's standard
   as a new file in `standards/`. The standard must be co-signed by a domain expert
   (include their GitHub handle and affiliation in the PR description).
   Until co-signed, the standard is marked `experimental`.

AI-drafted standards that have not been reviewed by a domain expert will not be
accepted regardless of how well-written they are.

---

## Maintainer responsibility

By merging a PR, you accept ongoing maintenance responsibility.

- Nightly failures open an issue that **@mentions** you via `kit.json` → `maintainer`. Create a **`nightly-failure`** label in the repo (Issues → Labels) so those issues can use it.
- Set **Settings → Actions → General → Workflow permissions** to **Read and write** so `GITHUB_TOKEN` can open issues (otherwise you get `Resource not accessible by integration` / 403).
- To transfer ownership, open a PR updating the `maintainer` field in `kit.json`
  and get the new maintainer to comment on the PR confirming they accept responsibility
