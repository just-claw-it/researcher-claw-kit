"use client";

import { useState, useEffect, startTransition } from "react";
import { PROVIDER_LIST_CLIENT } from "@/lib/providers";

type ClientProvider = (typeof PROVIDER_LIST_CLIENT)[number];

const STORAGE_PREFIX = "rk-api-key-";

function storageKey(providerId: string) {
  return `${STORAGE_PREFIX}${providerId}`;
}

export function ApiKeyDialog({
  selectedProvider,
  onKeySet,
}: {
  selectedProvider: string;
  onKeySet: (key: string) => void;
}) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [editProvider, setEditProvider] = useState<string>("");

  useEffect(() => {
    const loaded: Record<string, string> = {};
    for (const p of PROVIDER_LIST_CLIENT) {
      const stored = localStorage.getItem(storageKey(p.id));
      if (stored) loaded[p.id] = stored;
    }
    startTransition(() => { setKeys(loaded); });
  }, []);

  useEffect(() => {
    onKeySet(keys[selectedProvider] || "");
  }, [selectedProvider, keys, onKeySet]);

  const currentKey = keys[selectedProvider];

  function openFor(providerId: string) {
    setEditProvider(providerId);
    setEditKey("");
    setIsOpen(true);
  }

  function handleSave() {
    if (!editKey.trim() || !editProvider) return;
    const trimmed = editKey.trim();
    localStorage.setItem(storageKey(editProvider), trimmed);
    setKeys((prev) => ({ ...prev, [editProvider]: trimmed }));
    setEditKey("");
    setIsOpen(false);
  }

  function handleClear(providerId: string) {
    localStorage.removeItem(storageKey(providerId));
    setKeys((prev) => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });
  }

  const editProviderObj = PROVIDER_LIST_CLIENT.find(
    (p) => p.id === editProvider
  );

  return (
    <>
      <button
        onClick={() => openFor(selectedProvider)}
        className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
          currentKey
            ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:bg-emerald-950"
            : "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:bg-amber-950"
        }`}
      >
        {currentKey ? "Key Set" : "Set API Key"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-1">API Keys</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Keys are stored in your browser only and sent directly to each
              provider&apos;s API. Never saved on any server.
            </p>

            {editProviderObj && (
              <div className="mb-5 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  {editProviderObj.name} API Key
                </label>
                <input
                  type="password"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  placeholder={
                    editProviderObj.keyPrefix
                      ? `${editProviderObj.keyPrefix}...`
                      : "Paste your API key"
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!editKey.trim()}
                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                All Providers
              </p>
              {PROVIDER_LIST_CLIENT.map((p) => (
                <ProviderKeyRow
                  key={p.id}
                  provider={p}
                  hasKey={!!keys[p.id]}
                  isActive={p.id === selectedProvider}
                  onSet={() => openFor(p.id)}
                  onClear={() => handleClear(p.id)}
                />
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProviderKeyRow({
  provider,
  hasKey,
  isActive,
  onSet,
  onClear,
}: {
  provider: ClientProvider;
  hasKey: boolean;
  isActive: boolean;
  onSet: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
        isActive
          ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
          : "bg-gray-50 dark:bg-gray-800/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            hasKey ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
        <span className="font-medium">{provider.name}</span>
        {isActive && (
          <span className="text-xs text-blue-600 dark:text-blue-400">
            active
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {hasKey && (
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            Clear
          </button>
        )}
        <button
          onClick={onSet}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {hasKey ? "Update" : "Set Key"}
        </button>
      </div>
    </div>
  );
}
