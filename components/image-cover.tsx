/* eslint-disable @next/next/no-img-element */

type ImageCoverProps = {
  title: string;
  accentFrom: string;
  accentTo: string;
  heightClassName?: string;
  imageUrl?: string;
};

export function ImageCover({
  title,
  accentFrom,
  accentTo,
  heightClassName = "h-52",
  imageUrl,
}: ImageCoverProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] ${heightClassName}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.25),transparent_32%)]" />
      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
        Preview
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="rounded-[1.2rem] border border-white/15 bg-slate-950/20 p-4 backdrop-blur">
          <p className="text-lg font-semibold text-white">{title}</p>
        </div>
      </div>
    </div>
  );
}
