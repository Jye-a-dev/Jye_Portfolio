"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { DocumentMetadata } from "@/lib/markdown";
import { ProjectCinemaCard } from "./ProjectCinemaCard";

export interface ProjectFilmStripProps {
  stripIndex?: number;
  projects: DocumentMetadata[];
}

export function ProjectFilmStrip({
  stripIndex = 0,
  projects,
}: ProjectFilmStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, projects]);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -420, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: 420, behavior: "smooth" });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const startFrame = stripIndex * 10 + 1;

  return (
    <div
      className="animate-film-strip group/strip relative mb-12 w-full overflow-hidden rounded-xs border-y-4 border-[#141210] bg-[#0c0a09] shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-500 hover:border-[#2a241f] hover:shadow-[0_25px_60px_rgba(0,0,0,1)]"
      style={{
        animationDelay: `${stripIndex * 150}ms`,
      }}
    >
      {/* Nút tua lùi nổi bên trái */}
      <button
        type="button"
        onClick={handleScrollLeft}
        aria-label="Tua lùi dải phim"
        className={`absolute top-1/2 left-3 z-30 -translate-y-1/2 cursor-pointer rounded-xs border border-[#3d342d] bg-[#141210]/90 px-3 py-4 font-typewriter font-mono text-xs font-bold text-baocap-yellow shadow-[2px_2px_0px_#000] backdrop-blur-sm transition-all duration-300 ease-out will-change-transform transform-gpu hover:scale-105 hover:border-baocap-yellow hover:bg-baocap-sepia active:scale-95 ${
          canScrollLeft
            ? "opacity-80 group-hover/strip:opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        ◄
      </button>

      {/* Nút tua tới nổi bên phải */}
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Tua tới dải phim"
        className={`absolute top-1/2 right-3 z-30 -translate-y-1/2 cursor-pointer rounded-xs border border-[#3d342d] bg-[#141210]/90 px-3 py-4 font-typewriter font-mono text-xs font-bold text-baocap-yellow shadow-[2px_2px_0px_#000] backdrop-blur-sm transition-all duration-300 ease-out will-change-transform transform-gpu hover:scale-105 hover:border-baocap-yellow hover:bg-baocap-sepia active:scale-95 ${
          canScrollRight
            ? "opacity-80 group-hover/strip:opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        ►
      </button>

      {/* ========================================================
          MÉP LỖ RĂNG CƯA TRÊN (Tách biệt hoàn toàn lỗ đục và text)
         ======================================================== */}
      <div className="border-b border-[#1f1a16] bg-[#0c0a09]">
        {/* Dải lỗ đục răng cưa 35mm độc lập ở rìa ngoài cùng */}
        <div className="film-strip-sprockets h-4 w-full opacity-75" />

        {/* Dải biên chữ in thông số phim 35mm độc lập - Không chạm vào lỗ đục */}
        <div className="flex items-center justify-between px-6 py-1 font-typewriter font-mono text-[9px] font-bold tracking-widest text-baocap-yellow/70 select-none">
          <span>KODAK TX 5063</span>
          <span>▶ {startFrame}A</span>
          <span>SAFETY FILM</span>
          <span>▶ {startFrame + 1}A</span>
          <span>KODAK 35MM</span>
          <span>▶ {startFrame + 2}A</span>
        </div>
      </div>

      {/* ========================================================
          DẢI KHUNG HÌNH CUỘN PHIM (35mm Negative Frames Track)
         ======================================================== */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        className="no-scrollbar flex w-full gap-5 overflow-x-auto p-4 sm:p-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {projects.map((project, idx) => (
          <div
            key={project.slug}
            className="w-75 shrink-0 transition-transform duration-300 ease-out sm:w-90 md:w-100"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProjectCinemaCard project={project} frameIndex={startFrame + idx} />
          </div>
        ))}
      </div>

      {/* ========================================================
          MÉP LỖ RĂNG CƯA DƯỚI (Tách biệt hoàn toàn lỗ đục và text)
         ======================================================== */}
      <div className="border-t border-[#1f1a16] bg-[#0c0a09]">
        {/* Dải biên chữ in số khung hình độc lập bên trên */}
        <div className="flex items-center justify-between px-6 py-1 font-typewriter font-mono text-[9px] font-bold tracking-widest text-[#8c734e]/80 select-none">
          <span>{startFrame}</span>
          <span>▶ {startFrame}A</span>
          <span>{startFrame + 1}</span>
          <span>▶ {startFrame + 1}A</span>
          <span>{startFrame + 2}</span>
          <span>▶ {startFrame + 2}A</span>
        </div>

        {/* Dải lỗ đục răng cưa 35mm độc lập ở rìa ngoài cùng */}
        <div className="film-strip-sprockets h-4 w-full opacity-75" />
      </div>
    </div>
  );
}
