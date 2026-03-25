# Data Science Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- Explains why it is timely to investigate this problem using this method
- Explains how and why the data was selected
- Presents the experimental setup (e.g. using a dataflow diagram)
- Describes feature engineering approaches and transformations applied
- Explains how data was pre-processed, filtered, and categorized
- EITHER discusses state-of-the-art baselines (strengths, weaknesses, limitations)
  OR explains why no state-of-the-art baselines exist
  OR provides compelling argument that direct comparisons are impractical
- Defines the modeling approach(es) used, typically using pseudocode
- Discusses hardware and software infrastructure used
  (GPU/CPU models, memory, OS, library versions)
- Justifies all statistics and heuristics used
- Describes and justifies evaluation metrics used
- Goes beyond single-dimensional performance summaries —
  includes measures of variation, confidence intervals, or distributional information
- Discusses technical assumptions and threats to validity specific to data science

## Desirable Attributes
- Provides replication package (source code, datasets, or synthetic data if data cannot be shared)
- Data processed by multiple learners of different types
  (e.g. regression, decision tree, random forest, SVM)
- Data processed multiple times with different training/test splits;
  results compared via significance and effect size tests
- Carefully selects hyperparameters (via related work analysis or grid search)
- Manually inspects a non-trivial portion of the data (data sanity checks)
- Clearly distinguishes evidence-based results from interpretations and speculation

## Invalid Criticisms
- "You should have analyzed data ABC"
  (question is whether claims are supported by the data actually analyzed)
- No reproduction package (desirable, not essential)
- Findings are not actionable
- "Needs more data" without a clear justified reason
- Study does not use qualitative data
- Study does not make causal claims when it structurally cannot
