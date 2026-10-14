"use client";

import { useState, useMemo } from "react";
import type { DocumentMetadata } from "@/lib/markdown";
import { ProjectFilmStrip } from "./ProjectFilmStrip";

export interface ProjectCatalogClientProps {
  projects: DocumentMetadata[];
}

export function ProjectCatalogClient({ projects }: ProjectCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeSort, setTimeSort] = useState<"newest" | "oldest">("newest");
  const [selectedSeal, setSelectedSeal] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  // Thu thập danh sách các con dấu mộc (stamp_seal) duy nhất từ dữ liệu markdown
  const uniqueSeals = useMemo(() => {
    const seals = new Set<string>();
    projects.forEach((item) => {
      if (item.stamp_seal && typeof item.stamp_seal === "string") {
        seals.add(item.stamp_seal.trim());
      }
    });
    return Array.from(seals);
  }, [projects]);

  // Thu thập toàn bộ thẻ công nghệ (tags) duy nhất từ dữ liệu markdown
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((item) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          if (typeof tag === "string" && tag.trim()) {
            tags.add(tag.trim());
          }
        });
      }
    });
    return Array.from(tags);
  }, [projects]);

  // Lọc và sắp xếp kết quả kết hợp: tên + con dấu + thẻ tags + niên khóa
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = projects.filter((item) => {
      const titleMatch = (item.title || "").toLowerCase().includes(query);
      const slugMatch = (item.slug || "").toLowerCase().includes(query);
      const briefMatch = (
        (item.brief as string) ||
        (item.description as string) ||
        ""
      )
        .toLowerCase()
        .includes(query);
      const matchesSearch = !query || titleMatch || slugMatch || briefMatch;

      const matchesSeal =
        selectedSeal === "all" ||
        ((item.stamp_seal as string) || "").trim() === selectedSeal;

      const itemTags = Array.isArray(item.tags) ? item.tags : [];
      const matchesTag =
        selectedTag === "all" || itemTags.includes(selectedTag);

      return matchesSearch && matchesSeal && matchesTag;
    });

    return filtered.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeSort === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [projects, searchQuery, timeSort, selectedSeal, selectedTag]);

  // Chia danh sách dự án thành các cuộn phim 35mm xếp tầng (Contact Strip Negative Sleeves)
  const filmStrips = useMemo(() => {
    const framesPerStrip = 4;
    const strips: DocumentMetadata[][] = [];
    for (let i = 0; i < filteredProjects.length; i += framesPerStrip) {
      strips.push(filteredProjects.slice(i, i + framesPerStrip));
    }
    return strips;
  }, [filteredProjects]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedSeal !== "all" ||
    selectedTag !== "all" ||
    timeSort !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setTimeSort("newest");
    setSelectedSeal("all");
    setSelectedTag("all");
  };

  return (
    <div className="w-full">
      {/* ========================================================
          CỤM ĐIỀU KHIỂN TRA CỨU HỒ SƠ (Search & Filter Terminal)
         ======================================================== */}
      <div className="mb-10 space-y-4 rounded-xs border-2 border-[#3d342d] bg-[#141210]/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Hàng 1: Ô tìm kiếm tên dự án + Dropdown Thời gian + Dropdown Con dấu */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-typewriter font-mono text-xs text-[#8c734e]">
              ⌕
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="TRA CỨU TÊN DỰ ÁN / CUỘN PHIM NHỰA..."
              className="w-full rounded-xs border-2 border-[#44382c] bg-baocap-sepia py-2.5 pr-9 pl-9 font-typewriter font-mono text-xs text-[#f4ede2] placeholder-[#6e5d48] transition-colors focus:border-baocap-yellow focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center font-typewriter font-mono text-xs text-[#8c734e] hover:text-[#d94f3d]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="relative min-w-52.5">
            <select
              value={timeSort}
              onChange={(e) =>
                setTimeSort(e.target.value as "newest" | "oldest")
              }
              aria-label="Sắp xếp theo thời gian"
              className="w-full appearance-none rounded-xs border-2 border-[#44382c] bg-baocap-sepia px-3.5 py-2.5 pr-8 font-typewriter font-mono text-xs font-bold tracking-wider text-baocap-yellow uppercase transition-colors focus:border-baocap-yellow focus:outline-none"
            >
              <option value="newest">NIÊN KHÓA: MỚI NHẤT ↓</option>
              <option value="oldest">NIÊN KHÓA: CŨ NHẤT ↑</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-typewriter font-mono text-[10px] text-[#8c734e]">
              ▼
            </span>
          </div>

          <div className="relative min-w-52.5">
            <select
              value={selectedSeal}
              onChange={(e) => setSelectedSeal(e.target.value)}
              aria-label="Lọc theo con dấu mộc"
              className="w-full appearance-none rounded-xs border-2 border-[#44382c] bg-baocap-sepia px-3.5 py-2.5 pr-8 font-typewriter font-mono text-xs font-bold tracking-wider text-[#d94f3d] uppercase transition-colors focus:border-[#d94f3d] focus:outline-none"
            >
              <option value="all">CON DẤU: TẤT CẢ MỘC</option>
              {uniqueSeals.map((seal) => (
                <option key={seal} value={seal}>
                  DẤU MỘC: {seal.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-typewriter font-mono text-[10px] text-[#8c734e]">
              ▼
            </span>
          </div>
        </div>

        {/* Hàng 2: Thanh lọc nhanh theo Thẻ công nghệ (Tags) mô phỏng cuống vé */}
        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-[#2a241f] pt-4">
          <span className="font-typewriter font-mono text-[11px] font-bold tracking-wider text-[#8c734e] uppercase">
            [ CUỐNG VÉ THẺ ]:
          </span>

          <button
            type="button"
            onClick={() => setSelectedTag("all")}
            className={`cursor-pointer rounded-xs px-2.5 py-1 font-typewriter font-mono text-[11px] font-bold tracking-wide uppercase transition-[background-color,border-color,color] duration-150 ${
              selectedTag === "all"
                ? "border-2 border-baocap-yellow bg-baocap-yellow text-baocap-ink"
                : "border border-dashed border-[#44382c] bg-baocap-sepia text-[#a39274] hover:border-[#8c734e] hover:text-[#f4ede2]"
            }`}
          >
            #TẤT CẢ
          </button>

          {uniqueTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`cursor-pointer rounded-xs px-2.5 py-1 font-typewriter font-mono text-[11px] font-medium tracking-wide uppercase transition-[background-color,border-color,color] duration-150 ${
                  isSelected
                    ? "border-2 border-baocap-yellow bg-baocap-yellow text-baocap-ink"
                    : "border border-dashed border-[#44382c] bg-baocap-sepia text-[#a39274] hover:border-[#8c734e] hover:text-[#f4ede2]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Hàng 3: Chỉ số hồ sơ hiển thị và nút xóa bộ lọc */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#2a241f] pt-3 font-typewriter font-mono text-xs text-[#8c785b]">
          <div>
            <span>[ KẾT QUẢ TRA CỨU: </span>
            <span className="font-bold text-baocap-yellow">
              {filteredProjects.length.toString().padStart(2, "0")}
            </span>
            <span> KHUNG HÌNH CUỘN PHIM ]</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="cursor-pointer text-[11px] font-bold text-[#d94f3d] underline decoration-dashed underline-offset-4 hover:text-[#ff3b30]"
            >
              [ XOÁ BỘ LỌC ĐANG CHỌN ]
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          CÁC CUỘN PHIM 35MM XẾP TẦNG (Cinematic 35mm Film Strips)
         ======================================================== */}
      {filmStrips.length > 0 ? (
        <div className="space-y-8">
          {filmStrips.map((strip, index) => (
            <ProjectFilmStrip
              key={index}
              stripIndex={index}
              projects={strip}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xs border-2 border-dashed border-[#3d342d] bg-[#141210]/60 p-12 text-center">
          <p className="font-typewriter font-mono text-sm tracking-widest text-[#a39274] uppercase">
            [ KHÔNG TÌM THẤY BẢN GHI PHIM NHỰA NÀO PHÙ HỢP VỚI BỘ LỌC HIỆN TẠI ]
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-block cursor-pointer rounded-xs border border-dashed border-baocap-yellow px-4 py-2 font-typewriter font-mono text-xs font-bold text-baocap-yellow hover:bg-baocap-yellow hover:text-baocap-ink"
          >
            ĐẶT LẠI TẤT CẢ BỘ LỌC
          </button>
        </div>
      )}
    </div>
  );
}
