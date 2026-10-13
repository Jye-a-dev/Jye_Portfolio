import React from "react";

export interface CinematicVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  caption?: string;
}

/**
 * Trình phát video màn ảnh rộng điện ảnh chuẩn Anamorphic tỉ lệ 21:9.
 * Tích hợp lớp phủ viền tối góc (vignette) quang học thuần Tailwind CSS.
 */
export function CinematicVideo({
  src,
  poster,
  caption,
  className = "",
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true,
  ...props
}: CinematicVideoProps) {
  return (
    <figure className="my-10 mx-auto w-full max-w-5xl select-none">
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm border border-zinc-800/80 bg-black shadow-[0_25px_50px_rgba(0,0,0,0.95)]">
        {/* Phần tử Video native tối ưu phát mượt */}
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          className={`h-full w-full object-cover ${className}`}
          {...props}
        />

        {/* Lớp phủ quang học Vignette làm tối 4 góc màn ảnh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)] shadow-inner"
        />

        {/* Thước kẻ vạch chia khung hình điện ảnh 2.39:1 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-4 font-mono text-[9px] tracking-widest text-zinc-500/80 uppercase"
        >
          ANAMORPHIC 21:9
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs tracking-wider text-zinc-500">
          [ TAKE / REEL ]: {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default CinematicVideo;

