"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ApiKeyDialog } from "./api-key-dialog";
import { ProviderSelector } from "./provider-selector";
import { PROVIDER_LIST_CLIENT } from "@/lib/providers";
import type { SkillId } from "@/lib/skills";

const DEFAULT_PROVIDER = PROVIDER_LIST_CLIENT[0];

export function Chat({
  skillId,
  title,
  description,
  placeholder,
}: {
  skillId: SkillId;
  title: string;
  description: string;
  placeholder: string;
}) {
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState("");
  const [providerId, setProviderId] = useState(DEFAULT_PROVIDER.id);
  const [modelId, setModelId] = useState(DEFAULT_PROVIDER.models[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ body, messages }) {
          return {
            body: {
              ...body,
              messages,
              skill: skillId,
              apiKey,
              provider: providerId,
              model: modelId,
            },
          };
        },
      }),
    [skillId, apiKey, providerId, modelId]
  );

  const { messages, sendMessage, status, error } = useChat({
    id: skillId,
    transport,
  });

  const onKeySet = useCallback((key: string) => setApiKey(key), []);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
            <ApiKeyDialog
              selectedProvider={providerId}
              onKeySet={onKeySet}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Model:
            </span>
            <ProviderSelector
              providerId={providerId}
              modelId={modelId}
              onProviderChange={setProviderId}
              onModelChange={setModelId}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20 text-gray-400 dark:text-gray-600">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">{placeholder}</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm">
                    {message.parts
                      ?.filter(
                        (p): p is { type: "text"; text: string } =>
                          p.type === "text"
                      )
                      .map((p) => p.text)
                      .join("") ?? ""}
                  </p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.parts
                        ?.filter(
                          (p): p is { type: "text"; text: string } =>
                            p.type === "text"
                        )
                        .map((p) => p.text)
                        .join("") ?? ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
              {error.message ||
                "Something went wrong. Please check your API key and try again."}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[200px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 200) + "px";
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
