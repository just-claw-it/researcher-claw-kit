# Quantitative Simulation Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- Clearly describes the simulation model and its assumptions
- Justifies the choice of simulation approach (e.g. discrete event, agent-based, Monte Carlo)
- Describes how the simulation was validated
  (does the model behave like the real system it represents?)
- Describes the simulation parameters and their ranges
- Justifies the number of simulation runs (e.g. via confidence interval analysis)
- Reports results with appropriate statistical analysis
- Discusses threats to validity, especially model validity
  (how well does the simulation represent the real phenomenon?)

## Desirable Attributes
- Provides the simulation model as supplementary material
- Conducts sensitivity analysis on key parameters
- Compares simulation results to empirical data where available
- Discusses limitations of the simulation model explicitly

## Invalid Criticisms
- The simulation does not use real-world data
  (simulation is used precisely when real-world data is unavailable or impractical)
- The model makes simplifying assumptions
  (all models do; the question is whether the assumptions are justified and disclosed)
