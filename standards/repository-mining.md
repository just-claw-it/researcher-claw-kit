# Repository Mining Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- Describes and justifies the data sources (which repositories, why these)
- Describes the data collection process in sufficient detail for replication
- Describes and justifies the filtering and inclusion/exclusion criteria
- Identifies and mitigates known biases in the data source
  (e.g. survivorship bias in GitHub, bot commits, project selection bias)
- Describes data pre-processing and cleaning steps
- Validates a sample of the data manually to check for noise
- Discusses threats to construct validity
  (do the proxies actually measure what they claim to?)
- Discusses threats to external validity
  (which types of projects or developers do the findings apply to?)

## Desirable Attributes
- Provides replication package (scripts, data, or pointers to archived snapshots)
- Triangulates findings with qualitative evidence (e.g. interviews, issue comments)
- Discusses temporal threats (data collected at a specific point in time)
- Discusses ethical considerations around use of public repository data
- Checks for and handles duplicate or tangled commits
- Reports on data quality issues encountered and how they were resolved

## General Quality Criteria
Construct validity, external validity, reliability, reproducibility.

## Antipatterns to flag
- Using GitHub stars or forks as direct proxies for quality or popularity
  without acknowledging the limitations
- Ignoring bots in commit/issue data
- Treating all projects in a dataset as equally representative

## Invalid Criticisms
- Dataset is not exhaustive (completeness is rarely achievable; what matters is justification)
- Results may not generalize to all projects (acknowledge and scope the claim)
