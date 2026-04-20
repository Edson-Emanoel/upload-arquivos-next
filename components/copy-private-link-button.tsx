"use client";

import { useState } from "react";

type CopyPrivateLinkButtonProps = {
  path: string;
  className?: string;
};

export function CopyPrivateLinkButton({
  path,
  className = "",
}: CopyPrivateLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const absoluteUrl = new URL(path, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleCopy();
      }}
      className={`rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 ${className}`}
    >
      {copied ? "Link copiado" : "Copiar link privado"}
    </button>
  );
}
