# Optimization Study Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- Clearly defines the optimization problem (objective function, constraints, search space)
- Justifies the choice of optimization algorithm(s) used
- Describes the experimental setup in sufficient detail for replication
- Compares against at least one baseline or state-of-the-art alternative
- Uses multiple independent runs to account for stochasticity
- Reports results with appropriate statistical tests and effect sizes
- Discusses threats to validity (construct, internal, external)

## Desirable Attributes
- Provides replication package (source code, configurations, datasets)
- Conducts sensitivity analysis on key parameters
- Discusses scalability of the approach
- Discusses the computational cost of the optimization
- Clearly distinguishes the optimization problem from the evaluation problem

## Invalid Criticisms
- The algorithm is not novel if it solves the optimization problem well
- The approach does not scale to all problem sizes
  (scope the claim rather than reject)
