"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { UiImage } from "@/lib/images";
import { ImageCover } from "@/components/image-cover";

type ImageFormProps = {
  mode: "create" | "edit";
  image?: UiImage;
};

export function ImageForm({ mode, image }: ImageFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setErrorMessage(null);

    try {
      const endpoint = isEdit ? `/api/images/${image?.id}` : "/api/images";
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Nao foi possivel salvar a imagem.");
        return;
      }

      startTransition(() => {
        router.push(isEdit && image ? `/imagens/${image.id}` : "/dashboard");
        router.refresh();
      });
    } catch {
      setErrorMessage("Ocorreu um erro inesperado ao salvar a imagem.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
            {isEdit ? "Edicao" : "Nova imagem"}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {isEdit ? "Editar imagem" : "Cadastrar imagem"}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {isEdit
              ? "Esta tela representa o frontend da edicao. Na proxima etapa, conectamos este formulario ao backend."
              : "Esta tela representa o frontend do cadastro de imagem. O envio real sera ligado na etapa da API."}
          </p>
        </div>

        <form
          action={(formData) => {
            void handleSubmit(formData);
          }}
          className="mt-8 space-y-5"
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Titulo</span>
            <input
              name="title"
              defaultValue={image?.title ?? ""}
              placeholder="Ex.: Banner principal de campanha"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Descricao</span>
            <textarea
              name="description"
              defaultValue={image?.description ?? ""}
              placeholder="Descreva rapidamente a finalidade da imagem"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Arquivo</span>
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
              <input
                name="file"
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf,audio/*,video/*"
                className="w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-800"
                required={!isEdit}
              />
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Formatos permitidos: imagens, PDF, audios e videos com tamanho maximo de 50MB.
              </p>
            </div>
          </label>

          {errorMessage ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Salvando..."
                : isEdit
                  ? "Salvar alteracoes"
                  : "Salvar imagem"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Voltar
            </Link>
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            Preview visual
          </p>

          <div className="mt-5">
            <ImageCover
              title={image?.title ?? "Nova imagem"}
              accentFrom={image?.accentFrom ?? "#0284c7"}
              accentTo={image?.accentTo ?? "#a855f7"}
              heightClassName="h-72"
              imageUrl={image?.imageUrl}
              previewLabel={image?.previewLabel ?? "Arquivo"}
            />
          </div>
        </div>

        <div className="rounded-[1.8rem] bg-slate-950 p-6 text-slate-100">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Escopo desta etapa
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <li>1. Formulario conectado ao endpoint de imagens.</li>
            <li>2. Upload local autenticado.</li>
            <li>3. Redirecionamento apos salvar.</li>
            <li>4. Edicao preparada para a mesma API.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
