import Link from "next/link";
import type { UiImage } from "@/lib/images";
import { ImageCover } from "@/components/image-cover";

type ImageCardProps = {
  image: UiImage;
};

export function ImageCard({ image }: ImageCardProps) {
  return (
    <Link
      href={`/imagens/${image.id}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.10)] transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)]"
    >
      <div className="p-4">
        <ImageCover
          title={image.title}
          accentFrom={image.accentFrom}
          accentTo={image.accentTo}
          imageUrl={image.imageUrl}
          previewLabel={image.previewLabel}
        />
      </div>

      <div className="space-y-4 px-5 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-950">{image.title}</p>
            {/* <p className="mt-1 text-sm text-slate-500">{image.subtitle}</p> */}
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
            {image.createdAtLabel}
          </span>
        </div>

        {/* <p className="text-sm leading-7 text-slate-600">{image.description}</p> */}

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
            {image.sizeLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
