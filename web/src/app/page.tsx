import { SkillCard } from "@/components/skill-card";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6">
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Researcher Kit
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
          Three AI skills that cover the full arc of an empirical research
          paper: from problem framing to peer review.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Peer review based on{" "}
          <a
            href="https://acmsigsoft.github.io/EmpiricalStandards/"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            ACM SIGSOFT Empirical Standards
          </a>{" "}
          (CC0).
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 pb-12">
        <SkillCard
          step={1}
          title="Research Intake"
          description="Frame your research problem before you collect any data. Describe your idea at any level of vagueness and get a structured PROBLEM.md with three alternative framings."
          href="/research-intake"
        />
        <SkillCard
          step={2}
          title="Literature Review"
          description="Map the literature and find your research gap. Get a positioning statement that argues your contribution is non-redundant, with clustered references."
          href="/lit-review"
        />
        <SkillCard
          step={3}
          title="Draft Review"
          description="Peer review your draft against empirical standards. Get essential attribute pass/fail, claim-evidence alignment, contribution scoring, and a verdict."
          href="/draft-review"
        />
      </section>

      <section className="border-t border-gray-200 dark:border-gray-800 py-12">
        <h2 className="text-2xl font-semibold mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              1. Pick a provider, bring your key
            </h3>
            <p>
              Choose from 13 AI providers including OpenAI, Anthropic, Google
              Gemini, Groq, Mistral, xAI, DeepSeek, and more. Your key stays
              in your browser and is sent directly to the provider&apos;s API.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              2. Choose a skill
            </h3>
            <p>
              Start with Research Intake to frame your problem, then use Lit
              Review to map the gap, and Draft Review to evaluate your writing.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              3. Iterate
            </h3>
            <p>
              Each skill is conversational. Push back, refine your framing, and
              re-run Draft Review after revisions. The skills are designed to
              chain together.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 dark:border-gray-800 py-12">
        <h2 className="text-2xl font-semibold mb-4">
          13 supported AI providers
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Use any provider you already have an API key for. Switch providers
          and models freely between conversations.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          {[
            { name: "Anthropic", detail: "Claude Sonnet 4.6, Opus 4.6, Haiku 4.5" },
            { name: "OpenAI", detail: "GPT-5, GPT-5 Pro, GPT-4.1" },
            { name: "Google Gemini", detail: "Gemini 2.5 Pro & Flash" },
            { name: "Groq", detail: "Llama 4, Qwen 3, DeepSeek R1" },
            { name: "Mistral AI", detail: "Large, Magistral, Pixtral" },
            { name: "xAI (Grok)", detail: "Grok 4.1, Grok 4, Grok 3" },
            { name: "DeepSeek", detail: "V3, R1 Reasoner" },
            { name: "Cohere", detail: "Command A Reasoning, R+" },
            { name: "Perplexity", detail: "Deep Research, Sonar Pro" },
            { name: "Fireworks", detail: "Kimi K2.5, DeepSeek, Llama" },
            { name: "Together AI", detail: "Qwen 3.5, Kimi K2.5, Llama 4" },
            { name: "Cerebras", detail: "Qwen 3 235B, GPT-OSS 120B" },
            { name: "DeepInfra", detail: "Llama 4, DeepSeek R1 Turbo" },
          ].map((provider) => (
            <div
              key={provider.name}
              className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {provider.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {provider.detail}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 dark:border-gray-800 py-12">
        <h2 className="text-2xl font-semibold mb-4">
          18 research method standards
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Draft Review evaluates your paper against the method-specific ACM
          SIGSOFT Empirical Standard, plus the General Standard that applies to
          every empirical paper.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            "Action Research",
            "Benchmarking",
            "Case Study / Ethnography",
            "Case Survey",
            "Data Science",
            "Engineering Research",
            "Experiment",
            "Grounded Theory",
            "Longitudinal Study",
            "Meta-Science",
            "Mixed Methods",
            "Optimization Study",
            "Qualitative Survey",
            "Quantitative Simulation",
            "Questionnaire Survey",
            "Repository Mining",
            "Replication",
            "Systematic Review",
          ].map((method) => (
            <div
              key={method}
              className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
              {method}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>
          MIT License.{" "}
          <a
            href="https://github.com/just-claw-it/researcher-claw-kit"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
