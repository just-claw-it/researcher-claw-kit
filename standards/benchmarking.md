# Benchmarking Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- EITHER justifies selection of an existing, publicly available benchmark
  OR defines a new benchmark including:
    (i)   the quality to be benchmarked (performance, availability, security, etc.)
    (ii)  the metric(s) to quantify it
    (iii) the measurement method(s)
    (iv)  the workload or usage profile the system is subject to
  AND justifies the benchmark design
  AND reuses existing benchmark components or justifies new ones
- Describes the experimental setup in sufficient detail for independent replication
- Specifies the workload or usage profile in sufficient detail for replication
- Allows different configurations to compete without artificial limitations
- Assesses stability/reliability using sufficient experiment repetitions and duration
- Discusses construct validity of the benchmark
  (does the benchmark measure what it is supposed to measure?)

## Desirable Attributes
- Provides supplementary materials (datasets, scripts, extended documentation)
- Provides benchmark in a usable form facilitating independent replication
- Reports on independent replication of results
- Uses or creates open source benchmarks
- Transparently reports on problems with benchmark runs

## Invalid Criticisms
- The benchmark is not widely used
  (a proto-benchmark with a small group is a valid starting point)
- No independent replication of results is reported
- No independent organization maintains the benchmark
