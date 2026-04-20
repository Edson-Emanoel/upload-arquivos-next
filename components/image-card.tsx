import Link from "next/link";
import { CopyPrivateLinkButton } from "@/components/copy-private-link-button";
import type { UiImage } from "@/lib/images";
import { ImageCover } from "@/components/image-cover";

type ImageCardProps = {
  image: UiImage;
};

export function ImageCard({ image }: ImageCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="p-4">
        <ImageCover
          title={image.title}
          accentFrom={image.accentFrom}
          accentTo={image.accentTo}
          imageUrl={image.imageUrl}
        />
      </div>

      <div className="space-y-4 px-5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-950">{image.title}</p>
            <p className="mt-1 text-sm text-slate-500">{image.subtitle}</p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            {image.createdAtLabel}
          </span>
        </div>

        <p className="text-sm leading-7 text-slate-600">{image.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
            {image.fileTypeLabel}
          </span>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
            {image.sizeLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/imagens/${image.id}`}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold !text-white transition hover:bg-slate-800"
          >
            Visualizar
          </Link>
          <Link
            href={`/imagens/${image.id}/editar`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold !text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Editar
          </Link>
          <CopyPrivateLinkButton path={image.imageUrl} />
        </div>
      </div>
    </article>
  );
}
