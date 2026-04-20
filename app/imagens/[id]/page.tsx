import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CopyPrivateLinkButton } from "@/components/copy-private-link-button";
import { DeleteFileButton } from "@/components/delete-file-button";
import { DashboardShell } from "@/components/dashboard-shell";
import { ImageCover } from "@/components/image-cover";
import { toUiImage } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type ImageDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ImageDetailsPage({ params }: ImageDetailsPageProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const image = await prisma.image.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!image) {
    notFound();
  }

  const uiImage = toUiImage(image);

  return (
    <DashboardShell
      activePath="/dashboard"
      title={uiImage.title}
      description="Tela de visualizacao detalhada conectada aos dados reais da imagem salva."
      userName={session.user.name}
      showFileCount={false}
      showSidebar={false}
      showLogout={false}
    >
      <div className="grid items-start gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="self-start">
          

          <div className="relative rounded-[1.8rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <Link
              href="/dashboard"
              aria-label="Voltar"
              className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-xl font-semibold !text-white backdrop-blur transition hover:bg-slate-950/85"
            >
              &larr;
            </Link>

            <div className="relative rounded-[1.8rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
              <ImageCover
                title={uiImage.title}
                accentFrom={uiImage.accentFrom}
                accentTo={uiImage.accentTo}
                heightClassName="h-[420px]"
                imageUrl={uiImage.imageUrl}
                previewLabel={uiImage.previewLabel}
                showPreviewBadge={false}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Detalhes</p>

            <dl className="mt-5 space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Arquivo</dt>
                <dd className="mt-1 font-semibold text-slate-950">{uiImage.subtitle}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Criada em</dt>
                <dd className="mt-1 font-semibold text-slate-950">{uiImage.createdAtLabel}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Formato</dt>
                <dd className="mt-1 font-semibold text-slate-950">{uiImage.fileTypeLabel}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Tamanho</dt>
                <dd className="mt-1 font-semibold text-slate-950">{uiImage.sizeLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.8rem] bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/imagens/${uiImage.id}/editar`}
                className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
              >
                Editar imagem
              </Link>
              <CopyPrivateLinkButton path={uiImage.imageUrl} className="px-4 py-3" />
              <DeleteFileButton
                imageId={uiImage.id}
                redirectTo="/dashboard"
                className="px-4 py-3"
              />
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
