/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

type ImageCoverProps = {
  title: string;
  accentFrom: string;
  accentTo: string;
  heightClassName?: string;
  imageUrl?: string;
  previewLabel?: string;
  showPreviewBadge?: boolean;
};

export function ImageCover({
  title,
  accentFrom,
  accentTo,
  heightClassName = "h-52",
  imageUrl,
  previewLabel = "Preview",
  showPreviewBadge = true,
}: ImageCoverProps) {
  const [hasPreviewError, setHasPreviewError] = useState(false);
  const shouldShowImage = Boolean(imageUrl) && !hasPreviewError;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${heightClassName}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
      }}
    >
      {shouldShowImage ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => {
            setHasPreviewError(true);
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.25),transparent_32%)]" />
      {!shouldShowImage ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              {previewLabel}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">{title}</p>
          </div>
        </div>
      ) : null}
      {showPreviewBadge ? (
        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          {previewLabel}
        </div>
      ) : null}
    </div>
  );
}
