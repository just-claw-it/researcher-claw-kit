import { convertToModelMessages, streamText } from "ai";
import { buildSystemPrompt, type SkillId } from "@/lib/skills";
import { getProvider } from "@/lib/providers";

const VALID_SKILLS: SkillId[] = [
  "research-intake",
  "lit-review",
  "draft-review",
];

export async function POST(req: Request) {
  const body = await req.json();
  const {
    messages: uiMessages,
    skill,
    apiKey,
    provider: providerId,
    model: modelId,
  } = body;

  if (!Array.isArray(uiMessages)) {
    return new Response(
      JSON.stringify({ error: "Request body must include a messages array." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const providerConfig = getProvider(providerId || "anthropic");
  if (!providerConfig) {
    return new Response(
      JSON.stringify({ error: `Unknown provider: ${providerId}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const resolvedKey = apiKey || process.env[providerConfig.envVar];
  if (!resolvedKey) {
    return new Response(
      JSON.stringify({
        error: `No API key for ${providerConfig.name}. Enter your key in settings, or set ${providerConfig.envVar} on the server.`,
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!skill || !VALID_SKILLS.includes(skill)) {
    return new Response(
      JSON.stringify({ error: `Invalid skill: ${skill}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const resolvedModel = modelId || providerConfig.models[0]?.id;
  if (!resolvedModel) {
    return new Response(
      JSON.stringify({
        error: `No model specified for ${providerConfig.name}.`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(uiMessages);
  } catch {
    return new Response(
      JSON.stringify({ error: "Could not convert messages for the model." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const model = providerConfig.createModel(resolvedKey, resolvedModel);
  const systemPrompt = buildSystemPrompt(skill);

  const result = streamText({
    model,
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
