import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createXai } from "@ai-sdk/xai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createCohere } from "@ai-sdk/cohere";
import { createPerplexity } from "@ai-sdk/perplexity";
import { createFireworks } from "@ai-sdk/fireworks";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { createCerebras } from "@ai-sdk/cerebras";
import { createDeepInfra } from "@ai-sdk/deepinfra";
import type { LanguageModel } from "ai";

export interface ModelInfo {
  id: string;
  label: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  keyPrefix: string;
  envVar: string;
  models: ModelInfo[];
  createModel: (apiKey: string, modelId: string) => LanguageModel;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    keyPrefix: "sk-ant-",
    envVar: "ANTHROPIC_API_KEY",
    models: [
      { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
      { id: "claude-opus-4-6", label: "Claude Opus 4.6" },
      { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
      { id: "claude-opus-4-0", label: "Claude Opus 4" },
    ],
    createModel: (apiKey, modelId) =>
      createAnthropic({ apiKey })(modelId),
  },
  {
    id: "openai",
    name: "OpenAI",
    keyPrefix: "sk-",
    envVar: "OPENAI_API_KEY",
    models: [
      { id: "gpt-5", label: "GPT-5" },
      { id: "gpt-5-mini", label: "GPT-5 Mini" },
      { id: "gpt-5-pro", label: "GPT-5 Pro" },
      { id: "gpt-4.1", label: "GPT-4.1" },
      { id: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
      { id: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    ],
    createModel: (apiKey, modelId) =>
      createOpenAI({ apiKey })(modelId),
  },
  {
    id: "google",
    name: "Google Gemini",
    keyPrefix: "AI",
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    ],
    createModel: (apiKey, modelId) =>
      createGoogleGenerativeAI({ apiKey })(modelId),
  },
  {
    id: "groq",
    name: "Groq",
    keyPrefix: "gsk_",
    envVar: "GROQ_API_KEY",
    models: [
      { id: "meta-llama/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick" },
      { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout" },
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
      { id: "qwen/qwen3-32b", label: "Qwen 3 32B" },
      { id: "deepseek-r1-distill-llama-70b", label: "DeepSeek R1 Distill 70B" },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B" },
      { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
      { id: "gemma2-9b-it", label: "Gemma 2 9B" },
    ],
    createModel: (apiKey, modelId) =>
      createGroq({ apiKey })(modelId),
  },
  {
    id: "mistral",
    name: "Mistral AI",
    keyPrefix: "",
    envVar: "MISTRAL_API_KEY",
    models: [
      { id: "mistral-large-latest", label: "Mistral Large" },
      { id: "mistral-medium-latest", label: "Mistral Medium" },
      { id: "mistral-small-latest", label: "Mistral Small" },
      { id: "magistral-medium-2507", label: "Magistral Medium" },
      { id: "magistral-small-2507", label: "Magistral Small" },
      { id: "pixtral-large-latest", label: "Pixtral Large" },
      { id: "ministral-8b-latest", label: "Ministral 8B" },
    ],
    createModel: (apiKey, modelId) =>
      createMistral({ apiKey })(modelId),
  },
  {
    id: "xai",
    name: "xAI (Grok)",
    keyPrefix: "xai-",
    envVar: "XAI_API_KEY",
    models: [
      { id: "grok-4-1", label: "Grok 4.1" },
      { id: "grok-4", label: "Grok 4" },
      { id: "grok-3", label: "Grok 3" },
      { id: "grok-3-mini", label: "Grok 3 Mini" },
    ],
    createModel: (apiKey, modelId) =>
      createXai({ apiKey })(modelId),
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    keyPrefix: "sk-",
    envVar: "DEEPSEEK_API_KEY",
    models: [
      { id: "deepseek-chat", label: "DeepSeek V3" },
      { id: "deepseek-reasoner", label: "DeepSeek R1" },
    ],
    createModel: (apiKey, modelId) =>
      createDeepSeek({ apiKey })(modelId),
  },
  {
    id: "cohere",
    name: "Cohere",
    keyPrefix: "",
    envVar: "COHERE_API_KEY",
    models: [
      { id: "command-a-reasoning-08-2025", label: "Command A Reasoning" },
      { id: "command-a-03-2025", label: "Command A" },
      { id: "command-r-plus", label: "Command R+" },
      { id: "command-r", label: "Command R" },
      { id: "command-r7b-12-2024", label: "Command R 7B" },
    ],
    createModel: (apiKey, modelId) =>
      createCohere({ apiKey })(modelId),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    keyPrefix: "pplx-",
    envVar: "PERPLEXITY_API_KEY",
    models: [
      { id: "sonar-deep-research", label: "Sonar Deep Research" },
      { id: "sonar-reasoning-pro", label: "Sonar Reasoning Pro" },
      { id: "sonar-reasoning", label: "Sonar Reasoning" },
      { id: "sonar-pro", label: "Sonar Pro" },
      { id: "sonar", label: "Sonar" },
    ],
    createModel: (apiKey, modelId) =>
      createPerplexity({ apiKey })(modelId),
  },
  {
    id: "fireworks",
    name: "Fireworks",
    keyPrefix: "fw_",
    envVar: "FIREWORKS_API_KEY",
    models: [
      {
        id: "accounts/fireworks/models/kimi-k2p5",
        label: "Kimi K2.5",
      },
      {
        id: "accounts/fireworks/models/deepseek-r1",
        label: "DeepSeek R1",
      },
      {
        id: "accounts/fireworks/models/deepseek-v3",
        label: "DeepSeek V3",
      },
      {
        id: "accounts/fireworks/models/llama-v3p3-70b-instruct",
        label: "Llama 3.3 70B",
      },
      {
        id: "accounts/fireworks/models/qwen2p5-72b-instruct",
        label: "Qwen 2.5 72B",
      },
      {
        id: "accounts/fireworks/models/minimax-m2",
        label: "MiniMax M2",
      },
    ],
    createModel: (apiKey, modelId) =>
      createFireworks({ apiKey })(modelId),
  },
  {
    id: "togetherai",
    name: "Together AI",
    keyPrefix: "",
    envVar: "TOGETHER_AI_API_KEY",
    models: [
      {
        id: "Qwen/Qwen3.5-397B-A17B",
        label: "Qwen 3.5 397B",
      },
      {
        id: "moonshotai/Kimi-K2.5",
        label: "Kimi K2.5",
      },
      {
        id: "deepseek-ai/DeepSeek-V3.1",
        label: "DeepSeek V3.1",
      },
      {
        id: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        label: "Llama 4 Maverick",
      },
      {
        id: "MiniMaxAI/MiniMax-M2.5",
        label: "MiniMax M2.5",
      },
    ],
    createModel: (apiKey, modelId) =>
      createTogetherAI({ apiKey })(modelId),
  },
  {
    id: "cerebras",
    name: "Cerebras",
    keyPrefix: "csk-",
    envVar: "CEREBRAS_API_KEY",
    models: [
      { id: "qwen-3-235b-a22b-instruct-2507", label: "Qwen 3 235B" },
      { id: "qwen-3-235b-a22b-thinking-2507", label: "Qwen 3 235B Thinking" },
      { id: "gpt-oss-120b", label: "GPT-OSS 120B" },
      { id: "qwen-3-32b", label: "Qwen 3 32B" },
      { id: "llama3.1-8b", label: "Llama 3.1 8B" },
    ],
    createModel: (apiKey, modelId) =>
      createCerebras({ apiKey })(modelId),
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    keyPrefix: "",
    envVar: "DEEPINFRA_API_KEY",
    models: [
      {
        id: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        label: "Llama 4 Maverick",
      },
      {
        id: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        label: "Llama 4 Scout",
      },
      {
        id: "deepseek-ai/DeepSeek-R1-Turbo",
        label: "DeepSeek R1 Turbo",
      },
      {
        id: "deepseek-ai/DeepSeek-V3",
        label: "DeepSeek V3",
      },
      {
        id: "Qwen/Qwen2.5-72B-Instruct",
        label: "Qwen 2.5 72B",
      },
      {
        id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        label: "Llama 3.3 70B Turbo",
      },
    ],
    createModel: (apiKey, modelId) =>
      createDeepInfra({ apiKey })(modelId),
  },
];

export function getProvider(providerId: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === providerId);
}

export type ProviderId = (typeof PROVIDERS)[number]["id"];

export const PROVIDER_LIST_CLIENT = PROVIDERS.map(
  ({ id, name, keyPrefix, models }) => ({
    id,
    name,
    keyPrefix,
    models,
  })
);
