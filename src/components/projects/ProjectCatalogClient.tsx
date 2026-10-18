"use client";

import { useState, useMemo, useTransition, useDeferredValue } from "react";
import type { DocumentMetadata } from "@/lib/markdown";
import { ProjectFilmStrip } from "./ProjectFilmStrip";

export interface ProjectCatalogClientProps {
  projects: DocumentMetadata[];
}

const DEFAULT_VISIBLE_TAGS = 10;

export function ProjectCatalogClient({ projects }: ProjectCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isPending, startTransition] = useTransition();

  // Mặc định sắp xếp theo bảng chữ cái A-Z (abc) theo yêu cầu
  const [sortBy, setSortBy] = useState<"abc" | "newest" | "oldest">("abc");
  const [selectedSeal, setSelectedSeal] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [projectType, setProjectType] = useState<"all" | "1" | "2">("all");
  const [isExpandedTags, setIsExpandedTags] = useState(false);

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

  // Thống kê tần suất và sắp xếp các thẻ (tags) theo mức độ xuất hiện giảm dần
  const sortedTags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((item) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          if (typeof tag === "string" && tag.trim()) {
            const cleanTag = tag.trim();
            counts.set(cleanTag, (counts.get(cleanTag) || 0) + 1);
          }
        });
      }
    });
    return Array.from(counts.keys()).sort(
      (a, b) => (counts.get(b) || 0) - (counts.get(a) || 0)
    );
  }, [projects]);

  // Giới hạn số lượng thẻ hiển thị: mặc định chỉ lấy top tags, tự động giữ tag đang chọn nếu nằm ngoài top
  const visibleTags = useMemo(() => {
    if (isExpandedTags) return sortedTags;

    const top = sortedTags.slice(0, DEFAULT_VISIBLE_TAGS);
    if (selectedTag !== "all" && !top.includes(selectedTag)) {
      return [...top, selectedTag];
    }
    return top;
  }, [sortedTags, isExpandedTags, selectedTag]);

  const hiddenTagsCount = sortedTags.length - visibleTags.length;

  // Lọc và sắp xếp kết quả kết hợp: tên + con dấu + thẻ tags + phân loại (1/2) + tiêu chí sắp xếp (A-Z/Mới/Cũ)
  const filteredProjects = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

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

      const itemProjectType = String(item.Project ?? item.project ?? "1");
      const matchesProjectType =
        projectType === "all" || itemProjectType === projectType;

      return matchesSearch && matchesSeal && matchesTag && matchesProjectType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "abc") {
        const titleA = (a.title || a.slug || "").trim();
        const titleB = (b.title || b.slug || "").trim();
        return titleA.localeCompare(titleB, "vi", { sensitivity: "base" });
      }
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [
    projects,
    deferredSearchQuery,
    sortBy,
    selectedSeal,
    selectedTag,
    projectType,
  ]);

  // Chia danh sách dự án thành các cuộn phim 35mm xếp tầng (1 cuộn / 1 line = 5 khung hình)
  const filmStrips = useMemo(() => {
    const framesPerStrip = 5;
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
    projectType !== "all" ||
    sortBy !== "abc";

  const handleSelectTag = (tag: string) => {
    startTransition(() => {
      setSelectedTag(tag);
    });
  };

  const handleSelectSeal = (seal: string) => {
    startTransition(() => {
      setSelectedSeal(seal);
    });
  };

  const handleSortChange = (sort: "abc" | "newest" | "oldest") => {
    startTransition(() => {
      setSortBy(sort);
    });
  };

  const handleProjectType = (type: "all" | "1" | "2") => {
    startTransition(() => {
      setProjectType(type);
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    startTransition(() => {
      setSortBy("abc");
      setSelectedSeal("all");
      setSelectedTag("all");
      setProjectType("all");
      setIsExpandedTags(false);
    });
  };

  return (
    <div className="w-full">
      {/* ========================================================
          CỤM ĐIỀU KHIỂN TRA CỨU HỒ SƠ (Search & Filter Terminal)
         ======================================================== */}
      <div className="mb-10 space-y-4 rounded-xs border-2 border-[#3d342d] bg-[#141210]/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Hàng 1: Ô tìm kiếm tên dự án + Dropdown Sắp xếp ABC + Dropdown Con dấu + Phân loại */}
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
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as "abc" | "newest" | "oldest")
              }
              aria-label="Sắp xếp danh mục dự án"
              className="w-full appearance-none rounded-xs border-2 border-[#44382c] bg-baocap-sepia px-3.5 py-2.5 pr-8 font-typewriter font-mono text-xs font-bold tracking-wider text-baocap-yellow uppercase transition-colors focus:border-baocap-yellow focus:outline-none"
            >
              <option value="abc">SẮP XẾP: A → Z (ABC)</option>
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
              onChange={(e) => handleSelectSeal(e.target.value)}
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

          <div className="relative min-w-52.5">
            <select
              value={projectType}
              onChange={(e) =>
                handleProjectType(e.target.value as "all" | "1" | "2")
              }
              aria-label="Lọc theo phân loại dự án"
              className="w-full appearance-none rounded-xs border-2 border-[#44382c] bg-baocap-sepia px-3.5 py-2.5 pr-8 font-typewriter font-mono text-xs font-bold tracking-wider text-baocap-yellow uppercase transition-colors focus:border-baocap-yellow focus:outline-none"
            >
              <option value="all">PHÂN LOẠI: TẤT CẢ</option>
              <option value="1">LOẠI 1: DỰ ÁN TIÊU BIỂU</option>
              <option value="2">LOẠI 2: MINI PROJECT</option>
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
            onClick={() => handleSelectTag("all")}
            className={`cursor-pointer rounded-xs px-2.5 py-1 font-typewriter font-mono text-[11px] font-bold tracking-wide uppercase transition-[background-color,border-color,color] duration-150 ${
              selectedTag === "all"
                ? "border-2 border-baocap-yellow bg-baocap-yellow text-baocap-ink shadow-[0_0_10px_rgba(216,177,93,0.3)]"
                : "border border-dashed border-[#44382c] bg-baocap-sepia text-[#a39274] hover:border-[#8c734e] hover:text-[#f4ede2]"
            }`}
          >
            #TẤT CẢ
          </button>

          {visibleTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className={`cursor-pointer rounded-xs px-2.5 py-1 font-typewriter font-mono text-[11px] font-medium tracking-wide uppercase transition-[background-color,border-color,color] duration-150 ${
                  isSelected
                    ? "border-2 border-baocap-yellow bg-baocap-yellow font-bold text-baocap-ink shadow-[0_0_10px_rgba(216,177,93,0.3)]"
                    : "border border-dashed border-[#44382c] bg-baocap-sepia text-[#a39274] hover:border-[#8c734e] hover:text-[#f4ede2]"
                }`}
              >
                #{tag}
              </button>
            );
          })}

          {sortedTags.length > DEFAULT_VISIBLE_TAGS && (
            <button
              type="button"
              onClick={() => setIsExpandedTags((prev) => !prev)}
              aria-label={isExpandedTags ? "Thu gọn danh sách thẻ" : "Hiển thị thêm thẻ công nghệ"}
              className="cursor-pointer rounded-xs border border-dotted border-[#8c734e]/80 bg-[#1a1614] px-2.5 py-1 font-typewriter font-mono text-[10px] font-bold tracking-wide text-baocap-yellow transition-[border-color,background-color,color] duration-150 hover:border-baocap-yellow hover:bg-baocap-sepia hover:text-white"
            >
              {isExpandedTags
                ? "[ − THU GỌN ]"
                : `[ + ${hiddenTagsCount > 0 ? hiddenTagsCount : sortedTags.length - DEFAULT_VISIBLE_TAGS} THẺ ]`}
            </button>
          )}
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
          CÁC CUỘN PHIM 35MM XẾP TẦNG (1 LINE = 5 KHUNG HÌNH)
         ======================================================== */}
      {filmStrips.length > 0 ? (
        <div
          className={`space-y-8 transition-opacity duration-200 ${
            isPending ? "pointer-events-none opacity-60" : "opacity-100"
          }`}
        >
          {filmStrips.map((strip, index) => (
            <ProjectFilmStrip
              key={strip[0]?.slug ?? index}
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
