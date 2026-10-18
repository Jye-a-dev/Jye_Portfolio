"use client";

import React, { useState, useMemo, memo, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DocumentMetadata } from "@/lib/markdown";

export interface ProjectCinemaCardProps {
  project: DocumentMetadata;
  frameIndex?: number;
}

export const ProjectCinemaCard = memo(
  function ProjectCinemaCard({
    project,
  }: ProjectCinemaCardProps) {
    const posterSrc =
      (project.poster as string) || "/media/images/poster-test.webp";
    const stampSeal = (project.stamp_seal as string) || "ĐÃ LƯU TRỮ";
    const briefText =
      (project.brief as string) || (project.description as string) || "";
    const cityCode = ((project.city as string) || "vn").toLowerCase();

    const cityLabelMap: Record<string, string> = {
      hanoi: "HÀ NỘI",
      hue: "HUẾ",
      saigon: "SÀI GÒN",
    };

    const projectTags = Array.isArray(project.tags) ? project.tags : [];
    const MAX_DISPLAY_TAGS = 3;
    const displayedTags = projectTags.slice(0, MAX_DISPLAY_TAGS);
    const extraTagsCount = projectTags.length - MAX_DISPLAY_TAGS;

    // Trích xuất toàn bộ slide ảnh của dự án
    const slides = useMemo(() => {
      const raw =
        (project.gallery as string[]) ||
        (project.images as string[]) ||
        (project.slides as string[]) ||
        [];
      const list = raw.filter(
        (s) => typeof s === "string" && s.trim().length > 0
      );
      return list.length > 0 ? list : [posterSrc];
    }, [project.gallery, project.images, project.slides, posterSrc]);

    const totalSlides = slides.length;
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (totalSlides <= 1) return;
      startTransition(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      });
    };

    const handlePrev = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (totalSlides <= 1) return;
      startTransition(() => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      });
    };

    return (
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-xs border border-[#2a2d26] bg-[#141613] transition-[border-color,box-shadow,transform] duration-300 ease-out will-change-transform transform-gpu hover:-translate-y-1 hover:border-[#8c785b]/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
      >
        {/* ========================================================
            A. KHUNG ẢNH BUỒNG TỐI (Tỷ lệ 16:10 + Mép rọi ảnh mỏng)
           ======================================================== */}
        <div className="p-1 pb-0 bg-[#161311]">
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#e2d8c3]/15 bg-[#0d0c0b]">
            {/* Slides container với GPU translate3d */}
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform transform-gpu"
              style={{
                transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
              }}
            >
              {slides.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="relative h-full w-full shrink-0"
                  aria-hidden={idx !== currentSlide}
                >
                  <Image
                    src={src}
                    alt={`${project.title || "Project"} - Slide ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={idx === 0}
                    className={`object-cover sepia-[.15] contrast-110 brightness-85 scale-100 transition-[filter,transform] duration-700 ease-out will-change-[filter,transform] transform-gpu group-hover:scale-102 group-hover:sepia-0 group-hover:brightness-100 ${
                      idx !== currentSlide ? "pointer-events-none" : ""
                    }`}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9IiMxYTE2MTQiLz48L3N2Zz4="
                  />
                </div>
              ))}
            </div>

            {/* Lớp hạt grain phim và CRT nhẹ */}
            <div
              aria-hidden="true"
              className="crt-scanlines pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-25 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141613] via-transparent to-transparent opacity-80"
            />

            {/* Nút chuyển slide ảnh nhỏ gọn, tinh tế */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  title="Khung trước"
                  aria-label="Khung hình trước"
                  className="absolute top-1/2 left-1.5 z-20 -translate-y-1/2 cursor-pointer flex h-5 w-5 items-center justify-center rounded-xs border border-[#44382c] bg-[#141210]/85 font-typewriter font-mono text-[10px] text-[#8c785b] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:border-baocap-yellow hover:text-baocap-yellow active:scale-95"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  title="Khung sau"
                  aria-label="Khung hình tiếp theo"
                  className="absolute top-1/2 right-1.5 z-20 -translate-y-1/2 cursor-pointer flex h-5 w-5 items-center justify-center rounded-xs border border-[#44382c] bg-[#141210]/85 font-typewriter font-mono text-[10px] text-[#8c785b] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-105 hover:border-baocap-yellow hover:text-baocap-yellow active:scale-95"
                >
                  ›
                </button>
                <div className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 rounded-2xs bg-[#141210]/80 px-1 py-0.2 font-typewriter font-mono text-[8px] font-bold text-[#8e9686]">
                  {currentSlide + 1}/{totalSlides}
                </div>
              </>
            )}

            {/* Con dấu mộc đỏ biên bản thu nhỏ ở góc mép (-6°), không che nội dung ảnh */}
            <div className="pointer-events-none absolute top-1.5 right-1.5 z-10 select-none">
              <span className="inline-flex -rotate-6 items-center justify-center rounded-2xs border border-[#d94f3d]/60 bg-[#161311]/85 px-1.5 py-0.5 font-typewriter font-mono text-[8px] sm:text-[9px] font-black tracking-wider text-[#d94f3d]/80 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff3b30] group-hover:text-[#ff3b30] group-hover:opacity-100">
                {stampSeal}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            B. PHÂN CẤP TYPOGRAPHY (Visual Hierarchy Thập niên 80s)
           ======================================================== */}
        <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
          <div>
            {/* Dòng Địa danh & Ngày tháng: Monospace thanh mảnh */}
            <div className="mb-2 flex items-center font-typewriter font-mono text-[10px] tracking-wider text-[#8e9686] select-none">
              <span>{cityLabelMap[cityCode] || project.city || "TOÀN QUỐC"}</span>
              <span className="mx-1.5 text-[#44382c]">//</span>
              <span>{project.date || "TCVN"}</span>
            </div>

            {/* Tiêu đề chính: Font hoài cổ, cố định 2 dòng trọn vẹn */}
            <h3 className="line-clamp-2 min-h-[2.5rem] font-stencil-sub font-serif text-sm sm:text-base font-bold leading-snug tracking-wide text-[#f4ede2] transition-colors duration-300 group-hover:text-baocap-yellow">
              {project.title || project.slug}
            </h3>

            {/* Đoạn tóm tắt: 2 dòng cô đọng, màu mực in báo ngà phai */}
            {briefText && (
              <p className="mt-1.5 line-clamp-2 font-serif text-[11px] leading-relaxed text-[#948b7d]">
                {briefText}
              </p>
            )}
          </div>

          {/* ========================================================
              C. THẺ CÔNG NGHỆ (Tem phiếu sắc cạnh, loại bỏ hoàn toàn dấu #)
             ======================================================== */}
          {displayedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-dashed border-[#2a2d26] pt-2.5">
              {displayedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs border border-dashed border-[#3d342d] bg-[#1a1614]/70 px-1.5 py-0.5 font-typewriter font-mono text-[9px] font-medium tracking-wide text-[#b8a994] uppercase transition-colors duration-200 group-hover:border-[#8c785b] group-hover:text-[#f4ede2]"
                >
                  {tag}
                </span>
              ))}
              {extraTagsCount > 0 && (
                <span className="rounded-xs border border-dotted border-[#3d342d] bg-[#141210] px-1 py-0.5 font-typewriter font-mono text-[8px] font-bold text-[#8e9686]">
                  +{extraTagsCount}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  },
  // Custom comparison cô lập re-render
  (prev, next) => {
    return (
      prev.project.slug === next.project.slug &&
      prev.project.date === next.project.date &&
      prev.project.title === next.project.title &&
      prev.project.poster === next.project.poster &&
      JSON.stringify(prev.project.tags) === JSON.stringify(next.project.tags) &&
      JSON.stringify(prev.project.gallery) === JSON.stringify(next.project.gallery)
    );
  }
);
