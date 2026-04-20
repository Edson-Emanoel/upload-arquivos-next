"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

type DeleteFileButtonProps = {
  imageId: string;
  redirectTo?: string;
  className?: string;
};

export function DeleteFileButton({
  imageId,
  redirectTo,
  className = "",
}: DeleteFileButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este arquivo? Essa acao nao pode ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    setPending(true);

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setPending(false);
        return;
      }

      startTransition(() => {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      });
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleDelete();
      }}
      disabled={pending}
      className={`rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
