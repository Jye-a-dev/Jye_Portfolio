import React from "react";
import Image from "next/image";

export interface FramedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  frameNumber?: string;
  priority?: boolean;
}

/**
 * Khung ảnh âm bản 35mm (Analog Negative Frame).
 * Mô phỏng dải phim nhựa với viền răng cưa (sprocket holes), mã số thước phim và chú thích quang học.
 * Tối ưu hóa tải trang thông qua next/image với lazy loading và sizes thích ứng.
 */
export function FramedImage({
  src,
  alt = "Cinematic 35mm Negative Still",
  width = 1200,
  height = 800,
  caption,
  frameNumber = "24A",
  priority = false,
}: FramedImageProps) {
  // Tạo mảng răng cưa sprocket holes cố định 14 lỗ
  const sprocketHoles = Array.from({ length: 14 });

  return (
    <figure className="my-10 mx-auto w-full max-w-4xl select-none">
      <div className="relative rounded-sm border border-zinc-800 bg-zinc-950 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Dải răng cưa trên của cuộn phim 35mm */}
        <div className="mb-2 flex items-center justify-between border-b border-zinc-900 pb-2 px-1">
          <div className="flex gap-3">
            {sprocketHoles.map((_, idx) => (
              <span
                key={`top-sprocket-${idx}`}
                className="h-3 w-2 rounded-[1px] bg-zinc-900 border border-zinc-800/80 shadow-inner"
              />
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
            <span>KODAK 5222</span>
            <span className="text-amber-500/70">▶ {frameNumber}</span>
          </div>
        </div>

        {/* Khung ảnh chính bọc next/image */}
        <div className="relative overflow-hidden bg-zinc-900">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? undefined : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
            className="h-auto w-full object-cover transition-opacity duration-300"
          />

          {/* Lớp bóng mờ quang học nhẹ tại biên âm bản */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-zinc-800/40 shadow-inner"
          />
        </div>

        {/* Dải răng cưa dưới của cuộn phim 35mm */}
        <div className="mt-2 flex items-center justify-between border-t border-zinc-900 pt-2 px-1">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
            <span>SAFETY FILM</span>
            <span className="text-zinc-500">ISO 400</span>
          </div>
          <div className="flex gap-3">
            {sprocketHoles.map((_, idx) => (
              <span
                key={`bottom-sprocket-${idx}`}
                className="h-3 w-2 rounded-[1px] bg-zinc-900 border border-zinc-800/80 shadow-inner"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chú thích ảnh phong cách kịch bản quang học */}
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs tracking-wider text-zinc-500">
          [ SCENE STAMP ]: {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default FramedImage;

