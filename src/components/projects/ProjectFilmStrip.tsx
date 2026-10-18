"use client";

import { useRef, useState, useEffect, memo } from "react";
import type { DocumentMetadata } from "@/lib/markdown";
import { ProjectCinemaCard } from "./ProjectCinemaCard";

export interface ProjectFilmStripProps {
  stripIndex?: number;
  projects: DocumentMetadata[];
}

export const ProjectFilmStrip = memo(function ProjectFilmStrip({
  stripIndex = 0,
  projects,
}: ProjectFilmStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  // Tính toán khoảng trượt theo kích thước thực tế của thẻ card
  const getStep = () => {
    if (!containerRef.current) return 270;
    const firstCard = containerRef.current.querySelector<HTMLElement>("[data-film-card]");
    return firstCard ? firstCard.offsetWidth : 270;
  };

  // Tua lùi: trượt về trước, vòng lặp mượt mà về cuối nếu đang ở đầu
  const handleScrollLeft = () => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const maxOffset = Math.max(0, trackWidth - containerWidth);
    const step = getStep();

    setOffset((prev) => {
      if (prev <= 5) {
        return maxOffset;
      }
      return Math.max(0, prev - step);
    });
  };

  // Tua tới: trượt tới, vòng lặp mượt mà về đầu nếu đang ở cuối
  const handleScrollRight = () => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const maxOffset = Math.max(0, trackWidth - containerWidth);
    const step = getStep();

    setOffset((prev) => {
      if (prev >= maxOffset - 5) {
        return 0;
      }
      return Math.min(maxOffset, prev + step);
    });
  };

  // Đồng bộ offset khi resize màn hình, tránh lệch khung
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxOffset = Math.max(0, trackWidth - containerWidth);
      setOffset((prev) => Math.min(prev, maxOffset));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [projects]);

  const startFrame = stripIndex * 10 + 1;

  return (
    <div className="group/strip-wrapper relative mb-12 flex w-full items-center gap-2 sm:gap-4">
      {/* Nút tua lùi điện ảnh: phong cách cơ học rạp xi-nê cổ điển */}
      <button
        type="button"
        onClick={handleScrollLeft}
        aria-label="Tua lùi dải phim"
        className="group/btn relative z-30 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[#3d342d] bg-[#141210] text-[#a39274] shadow-[0_4px_14px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hover:scale-110 hover:border-baocap-yellow hover:text-baocap-yellow hover:shadow-[0_0_20px_rgba(216,177,93,0.4),0_4px_16px_rgba(0,0,0,0.9)] active:scale-95"
      >
        <span className="pointer-events-none absolute inset-0.5 rounded-full border border-dashed border-[#3d342d] transition-colors duration-300 group-hover/btn:border-baocap-yellow/50" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-4 w-4 sm:h-5 sm:w-5 -translate-x-0.5 transition-transform duration-200 group-hover/btn:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Khung dải phim 35mm: Khóa hoàn toàn scroll tự do, kéo hết chiều ngang và điều khiển chuyển động bằng nút */}
      <div
        ref={containerRef}
        className="animate-film-strip min-w-0 flex-1 overflow-hidden rounded-xs border-y-4 border-[#141210] bg-[#0c0a09] shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-500 hover:border-[#2a241f] hover:shadow-[0_25px_60px_rgba(0,0,0,1)] select-none"
        style={{
          animationDelay: `${stripIndex * 150}ms`,
        }}
      >
        <div
          ref={trackRef}
          className="inline-flex min-w-full flex-col transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translate3d(-${offset}px, 0, 0)`,
          }}
        >
          {/* ========================================================
              MÉP LỖ RĂNG CƯA TRÊN (Kéo hết toàn dải + vạch chia)
             ======================================================== */}
          <div className="border-b border-[#1f1a16] bg-[#0c0a09] px-2 py-1.5 sm:px-3">
            <div className="film-strip-sprockets h-3.5 w-full opacity-75" />
            <div className="flex divide-x divide-[#2a241f] border-x border-[#2a241f] pt-1">
              {projects.map((project, idx) => {
                const frameNum = startFrame + idx;
                return (
                  <div
                    key={`top-frame-${project.slug}`}
                    className="w-50 shrink-0 sm:w-60 md:w-66.5 px-2.5 sm:px-3.5"
                  >
                    <div className="flex items-center justify-between font-typewriter font-mono text-[9px] font-bold tracking-widest text-baocap-yellow/70 select-none">
                      <span>KODAK TX</span>
                      <span>▶ {frameNum.toString().padStart(2, "0")}A</span>
                      <span>SAFETY</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              DẢI CÁC KHUNG HÌNH (Line mỏng 1px ngăn cách giữa các card)
             ======================================================== */}
          <div className="flex divide-x divide-[#2a241f] border-x border-[#2a241f] bg-[#0c0a09] py-3.5 px-2 sm:px-3">
            {projects.map((project, idx) => (
              <div
                key={project.slug}
                data-film-card
                className="w-50 shrink-0 sm:w-60 md:w-66.5 px-2 sm:px-2.5 transition-transform duration-300 ease-out transform-gpu [content-visibility:auto] [contain-intrinsic-size:0_400px]"
              >
                <ProjectCinemaCard project={project} frameIndex={startFrame + idx} />
              </div>
            ))}
          </div>

          {/* ========================================================
              MÉP LỖ RĂNG CƯA DƯỚI (Kéo hết toàn dải + vạch chia)
             ======================================================== */}
          <div className="border-t border-[#1f1a16] bg-[#0c0a09] px-2 py-1.5 sm:px-3">
            <div className="flex divide-x divide-[#2a241f] border-x border-[#2a241f] pb-1">
              {projects.map((project, idx) => {
                const frameNum = startFrame + idx;
                return (
                  <div
                    key={`bottom-frame-${project.slug}`}
                    className="w-50 shrink-0 sm:w-60 md:w-66.5 px-2.5 sm:px-3.5"
                  >
                    <div className="flex items-center justify-between font-typewriter font-mono text-[9px] font-bold tracking-widest text-[#8c734e]/80 select-none">
                      <span>FRAME #{frameNum.toString().padStart(2, "0")}</span>
                      <span>▶ {frameNum.toString().padStart(2, "0")}A</span>
                      <span>35MM</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="film-strip-sprockets h-3.5 w-full opacity-75" />
          </div>
        </div>
      </div>

      {/* Nút tua tới điện ảnh: phong cách cơ học rạp xi-nê cổ điển */}
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Tua tới dải phim"
        className="group/btn relative z-30 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[#3d342d] bg-[#141210] text-[#a39274] shadow-[0_4px_14px_rgba(0,0,0,0.8)] transition-all duration-300 ease-out hover:scale-110 hover:border-baocap-yellow hover:text-baocap-yellow hover:shadow-[0_0_20px_rgba(216,177,93,0.4),0_4px_16px_rgba(0,0,0,0.9)] active:scale-95"
      >
        <span className="pointer-events-none absolute inset-0.5 rounded-full border border-dashed border-[#3d342d] transition-colors duration-300 group-hover/btn:border-baocap-yellow/50" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-4 w-4 sm:h-5 sm:w-5 translate-x-0.5 transition-transform duration-200 group-hover/btn:translate-x-1"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
});
