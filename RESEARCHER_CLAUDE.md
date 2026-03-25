# Researcher Kit for Claude Code

This kit provides three research workflow skills.

## Available skills
- /research-intake — Frame a research problem before you collect data
- /lit-review — Map the literature and identify your contribution gap
- /draft-review — Peer review your draft against empirical standards

## How to invoke
Reference the skill name in your message. Examples:
- "Run /research-intake on this idea: [your idea]"
- "Run /lit-review using my PROBLEM.md"
- "Run /draft-review on this draft: [paste draft]"

## Context files
If a skill references PROBLEM.md or LIT_REVIEW.md, check the current
working directory for those files before asking the user to re-provide context.

## Standards
Method-specific evaluation criteria live in standards/.
The /draft-review skill loads the appropriate standard automatically.
All standards are sourced from ACM SIGSOFT Empirical Standards (CC0).

## Hard rules
- Never fabricate citations. If a paper cannot be found via search, say so.
- Never hallucinate statistics or findings.
- Flag when the researcher appears over-invested in a particular result.
- When no validated standard exists for a research field, mark the review PROVISIONAL.
