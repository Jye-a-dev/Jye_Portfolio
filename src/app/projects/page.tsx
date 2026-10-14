import type { Metadata } from "next";
import { getAllDocuments, getDocument } from "@/lib/markdown";
import { PageBackground } from "@/components/shared/PageBackground";
import { ProjectCatalogClient } from "@/components/projects/ProjectCatalogClient";

export const metadata: Metadata = {
  title: "Hồ Sơ Dự Án | Neon Noir Archive",
  description: "Kho phim nhựa và hồ sơ công trình kỹ thuật Huế – Sài Gòn – Hà Nội.",
};

export default async function ProjectsPage() {
  // Đọc dữ liệu cấu hình từ content/pages/projects.md
  const pageDoc = await getDocument("pages", "projects");
  // Đọc toàn bộ các dự án chi tiết từ content/projects/*.md
  const projects = await getAllDocuments("projects");

  const pageMeta = pageDoc?.metadata;
  const neonAccent = pageMeta?.neon_accent || "#00E5FF";

  return (
    <div
      className="relative min-h-screen w-full px-4 py-12 selection:bg-baocap-brick/40 selection:text-baocap-paper sm:px-6 lg:px-8"
      style={
        {
          "--neon-glow": neonAccent,
        } as React.CSSProperties
      }
    >
      <PageBackground background={pageMeta?.background} />

      <main className="mx-auto max-w-7xl">
        {/* ========================================================
            HEADER: BẢNG HIỆU HỘP ĐÈN RẠP CHIẾU BÓNG NEON NOIR
           ======================================================== */}
        <header className="mb-14 flex flex-col items-center text-center">
          {/* Dấu niêm phong / Mã số cuộn băng từ (Hàng riêng biệt trên cùng) */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-xs border border-dashed border-[#8c734e] bg-[#141210]/95 px-3.5 py-1.5 font-typewriter font-mono text-[11px] font-bold tracking-widest text-baocap-yellow uppercase shadow-[2px_2px_0px_#181512]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: neonAccent,
                boxShadow: `0 0 10px ${neonAccent}`,
              }}
            />
            <span>
              [LƯU TRỮ: CUỘN PHIM SỐ 03] • ĐỊNH DẠNG: 35MM / ANALOG • TCVN 1986
            </span>
          </div>

          {/* Hộp đèn rạp xi-nê / Bảng hiệu neon có cấu trúc hộp cơ học */}
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-xs border-4 border-[#3d342d] bg-[#141210]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_var(--neon-glow-dim)] sm:p-10"
            style={
              {
                "--neon-glow-dim": `${neonAccent}22`,
              } as React.CSSProperties
            }
          >
            {/* 4 ốc tán đồng cơ học ở 4 góc hộp đèn */}
            <span className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
            <span className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
            <span className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />

            {/* Khung viền chỉ kép bên trong hộp đèn */}
            <div className="relative flex flex-col items-center justify-center rounded-xs border border-dashed border-[#8c734e]/40 p-6 sm:p-8">
              {/* Lớp ánh sáng neon tỏa ra từ lõi bóng đèn */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-25 blur-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${neonAccent}, transparent 70%)`,
                }}
              />

              {/* Dải đề từ rạp hát */}
              <span className="mb-2 font-typewriter font-mono text-[10px] font-bold tracking-[0.3em] text-[#a39274] uppercase">
                — RẠP CHIẾU BÓNG KỸ THUẬT SỐ —
              </span>

              {/* Tiêu đề chính Neon Marquee */}
              <h1
                className="neon-marquee-title font-stencil-sub font-serif text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={{
                  color: "#ffffff",
                  textShadow: `0 0 4px #ffffff, 0 0 10px #ffffff, 0 0 20px ${neonAccent}, 0 0 40px ${neonAccent}, 0 0 70px ${neonAccent}`,
                }}
              >
                {pageMeta?.title || "HỒ SƠ DỰ ÁN"}
              </h1>

              {/* Lời tự sự tóm lược dưới tiêu đề */}
              <p className="mt-4 max-w-2xl font-serif text-xs leading-relaxed text-[#c7b299] sm:text-sm">
                {pageMeta?.description ||
                  "Tổng hợp các công trình kỹ thuật Fullstack, sản phẩm số và bản ghi phục chế tư liệu âm thanh ánh sáng ba miền Bắc – Trung – Nam."}
              </p>
            </div>
          </div>
        </header>

        {/* ========================================================
            DANH MỤC DỰ ÁN & BỘ LỌC TƯƠNG TÁC (Client Component)
           ======================================================== */}
        <section aria-label="Danh mục phim nhựa kỹ thuật số">
          <ProjectCatalogClient projects={projects} />
        </section>
      </main>
    </div>
  );
}
