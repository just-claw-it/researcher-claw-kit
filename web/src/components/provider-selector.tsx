"use client";

import { PROVIDER_LIST_CLIENT } from "@/lib/providers";

type ClientProvider = (typeof PROVIDER_LIST_CLIENT)[number];

export function ProviderSelector({
  providerId,
  modelId,
  onProviderChange,
  onModelChange,
}: {
  providerId: string;
  modelId: string;
  onProviderChange: (id: string) => void;
  onModelChange: (id: string) => void;
}) {
  const provider = PROVIDER_LIST_CLIENT.find(
    (p) => p.id === providerId
  ) as ClientProvider;

  return (
    <div className="flex items-center gap-2">
      <select
        value={providerId}
        onChange={(e) => {
          const newProvider = PROVIDER_LIST_CLIENT.find(
            (p) => p.id === e.target.value
          );
          onProviderChange(e.target.value);
          if (newProvider) onModelChange(newProvider.models[0].id);
        }}
        className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[140px] truncate"
      >
        {PROVIDER_LIST_CLIENT.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        value={modelId}
        onChange={(e) => onModelChange(e.target.value)}
        className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[180px] truncate"
      >
        {provider?.models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
