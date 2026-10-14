"use client";

import Link from "next/link";
import Image from "next/image";
import type { DocumentMetadata } from "@/lib/markdown";

export interface ProjectCinemaCardProps {
  project: DocumentMetadata;
  frameIndex?: number;
}

export function ProjectCinemaCard({ project, frameIndex }: ProjectCinemaCardProps) {
  const neonColor = project.neon_accent || "#00E5FF";
  const posterSrc = (project.poster as string) || "/media/images/poster-test.webp";
  const dispatchCode = (project.dispatch_code as string) || `CUỘN PHIM: ${(project.city || "VN").toUpperCase()}-ARCHIVE`;
  const stampSeal = (project.stamp_seal as string) || "ĐÃ LƯU TRỮ";
  const briefText = (project.brief as string) || (project.description as string) || "";
  const cityCode = ((project.city as string) || "vn").toLowerCase();

  const cityLabelMap: Record<string, string> = {
    hanoi: "Hà Nội",
    hue: "Huế",
    saigon: "Sài Gòn",
  };

  const frameNumber = typeof frameIndex === "number" ? frameIndex : 1;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xs border-2 border-[#232720] bg-[#141210] transition-[border-color,box-shadow,transform] duration-500 ease-out will-change-transform transform-gpu hover:-translate-y-1.5"
      style={
        {
          "--card-neon": neonColor,
          "--card-neon-glow": `${neonColor}33`,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = neonColor;
        e.currentTarget.style.boxShadow = `0 12px 36px ${neonColor}33, 0 0 0 1px ${neonColor}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#232720";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Chỉ số frame phim 35mm trên đỉnh card */}
      <div className="flex items-center justify-between border-b border-[#2a241f] bg-[#0d0c0b] px-3 py-1 font-typewriter font-mono text-[9px] font-bold tracking-widest text-[#8c734e]/90 select-none">
        <span>TX 5063</span>
        <span>FRAME #{frameNumber.toString().padStart(2, "0")} • ▶ {frameNumber}A</span>
      </div>

      {/* Poster khung hình điện ảnh 16:9 với hiệu ứng CRT và Film Grain */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0d0c0b]">
        <Image
          src={posterSrc}
          alt={project.title || "Project Poster"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover grayscale sepia-[.60] contrast-125 brightness-75 scale-100 transition-[filter,transform] duration-700 ease-out will-change-[filter,transform] transform-gpu group-hover:scale-103 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9IiMxYTE2MTQiLz48L3N2Zz4="
        />

        <div
          aria-hidden="true"
          className="crt-scanlines pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent"
        />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-xs border border-[#3d342d] bg-[#141210]/85 px-2 py-0.5 font-typewriter font-mono text-[10px] font-bold tracking-wider text-[#a39274] backdrop-blur-xs">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: neonColor }}
          />
          <span>{dispatchCode}</span>
        </div>

        <div className="pointer-events-none absolute top-3 right-3 z-10 select-none">
          <span className="inline-flex -rotate-12 items-center justify-center rounded-xs border-2 border-[#d94f3d]/60 bg-[#1a1614]/80 px-2 py-0.5 font-typewriter font-mono text-[10px] font-black tracking-widest text-[#d94f3d]/75 backdrop-blur-xs transition-[transform,border-color,color,opacity] duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:border-[#ff3b30] group-hover:text-[#ff3b30] group-hover:opacity-100">
            {stampSeal}
          </span>
        </div>
      </div>

      {/* Thông tin tư liệu dự án */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 flex items-center justify-between font-typewriter font-mono text-[11px] text-[#8c785b]">
            <span className="tracking-widest uppercase">
              {cityLabelMap[cityCode] || project.city || "Toàn Quốc"}
            </span>
            {project.date && <span>{project.date}</span>}
          </div>

          <h3 className="font-stencil-sub font-serif text-xl font-bold tracking-wide text-[#f4ede2] transition-colors duration-300 group-hover:text-white">
            {project.title || project.slug}
          </h3>

          {briefText && (
            <p className="mt-2 line-clamp-2 font-serif text-xs leading-relaxed text-[#a39274]">
              {briefText}
            </p>
          )}
        </div>

        {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-[#2a241f] pt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-xs border border-dashed border-[#44382c] bg-baocap-sepia px-2 py-0.5 font-typewriter font-mono text-[10px] font-medium tracking-wide text-[#a39274] transition-[border-color,color] duration-300 group-hover:border-[var(--card-neon)] group-hover:text-[#e2d8c3]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
