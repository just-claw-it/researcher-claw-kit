# Researcher Kit — Agent Guide

This kit provides three chained research skills. They are designed to run
in sequence, with each skill's output feeding the next.

## Skills

### /research-intake
**When to use:** At the start of any research project, before any data collection.
**Input:** A research idea, question, or topic description — at any level of vagueness.
**Output:** A structured PROBLEM.md — problem statement, motivation, scope boundaries,
and three alternative framings.
**Do not skip this.** Papers that skip problem framing produce unfocused literature
reviews and weak contributions.

### /lit-review
**When to use:** After /research-intake produces PROBLEM.md, before writing begins.
**Input:** PROBLEM.md from /research-intake, or a direct problem statement.
**Output:** A structured LIT_REVIEW.md — key papers, research gap, and a positioning
statement for the contribution.
**Requires:** Web search access for arXiv and Semantic Scholar.

### /draft-review
**When to use:** After a draft exists — any stage, early drafts welcome.
**Input:** The paper draft (paste text or attach file).
**Output:** A structured peer review using ACM SIGSOFT Empirical Standards,
keyed to the paper's specific research method.
**Feeds back into:** /research-intake if the contribution framing is fundamentally broken.

## Recommended sequences

**New paper:**
  /research-intake → /lit-review → [write draft] → /draft-review → [revise] → /draft-review

**Reviewing an existing draft:**
  /draft-review → (if contribution is broken) → /research-intake

## Standards

Method-specific evaluation criteria live in standards/.
The /draft-review skill loads the appropriate standard automatically
based on the inferred research method.

## For fields outside software engineering

No validated standard exists beyond general.md.
Reviews are marked PROVISIONAL until a domain expert co-signs a field-specific standard.
AI-drafted standards for other fields are marked `experimental` in the registry
until co-signed by a domain expert.
