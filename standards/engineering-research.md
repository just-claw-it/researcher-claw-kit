# Engineering Research Standard
Source: ACM SIGSOFT Empirical Standards, CC0.

## Essential Attributes
- Describes the artifact (tool, framework, language, protocol) clearly
- Justifies the need for a new artifact rather than extending an existing one
- Describes the design and implementation in sufficient detail for replication
- Evaluates the artifact using an appropriate empirical method
  (and the standard for that method also applies)
- Clearly separates the engineering contribution (the artifact)
  from the empirical contribution (the evaluation)
- Discusses limitations of both the artifact and the evaluation

## Desirable Attributes
- Provides the artifact as open-source or supplementary material
- Evaluates on realistic, non-trivial benchmarks or use cases
- Compares against existing tools or approaches
- Includes a user study or field deployment, not just synthetic benchmarks
- Discusses threats to validity for both the artifact design and the evaluation
- Reports on scalability, performance, or usability as appropriate

## Invalid Criticisms
- The artifact is not theoretically novel
  (engineering contributions are valid even when the theory is known;
  the contribution is making it work in practice)
- The evaluation only uses one method
  (a single well-executed evaluation is sufficient if the method is appropriate)
- The tool is not production-ready
  (research prototypes are valid contributions)
