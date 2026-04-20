"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

type Field = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
};

type AuthFormProps = {
  title: string;
  description: string;
  endpoint: string;
  submitLabel: string;
  fields: Field[];
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  successRedirect: string;
};

export function AuthForm({
  title,
  description,
  endpoint,
  submitLabel,
  fields,
  footerText,
  footerHref,
  footerLinkLabel,
  successRedirect,
}: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setErrorMessage(null);

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Nao foi possivel concluir a operacao.");
        return;
      }

      startTransition(() => {
        router.push(successRedirect);
        router.refresh();
      });
    } catch {
      setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-[1.2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
          Acesso
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <form
        action={(formData) => {
          void handleSubmit(formData);
        }}
        className="mt-8 space-y-5"
      >
        {fields.map((field) => (
          <label key={field.name} className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">{field.label}</span>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              autoComplete={field.name}
              required
            />
          </label>
        ))}

        {errorMessage ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Processando..." : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {footerText}{" "}
        <Link href={footerHref} className="font-semibold !text-sky-700 hover:!text-sky-800">
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  );
}
