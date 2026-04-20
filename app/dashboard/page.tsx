import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { ImageCard } from "@/components/image-card";
import { toUiImage } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const images = await prisma.image.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const uiImages = images.map(toUiImage);

  return (
    <DashboardShell
      activePath="/dashboard"
      title={`Galeria de ${session.user.name}`}
      description="Frontend completo do CRUD de imagens com listagem, visualizacao, criacao e edicao usando dados mockados."
      userName={session.user.name}
    >
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.8rem] bg-slate-950 p-7 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Resumo visual</p>
          <p className="mt-4 max-w-xl text-3xl font-semibold tracking-tight">
            O frontend do CRUD ja esta pronto para percorrer todo o fluxo de imagens.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
            Nesta fase trabalhamos apenas a interface. A API de imagens e o upload real
            entram na proxima etapa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/imagens/nova"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold !text-slate-950 transition hover:bg-slate-100"
            >
              Nova imagem
            </Link>
            <Link
              href="#galeria"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-white/10"
            >
              Ver galeria
            </Link>
          </div>
        </article>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Imagens mockadas</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {uiImages.length}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Cards e paginas dinamicas agora refletem as imagens salvas pela API.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-dashed border-slate-300 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Escopo</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
              Apenas frontend
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Cadastro de imagem e listagem principal ja estao conectados ao banco.
            </p>
          </article>
        </div>
      </section>

      <section id="galeria" className="mt-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Galeria</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Lista de imagens
            </h2>
          </div>

          <Link
            href="/imagens/nova"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cadastrar nova imagem
          </Link>
        </div>

        {uiImages.length ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {uiImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-semibold text-slate-950">Nenhuma imagem cadastrada ainda</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Crie sua primeira imagem usando o formulario conectado com a API.
            </p>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
