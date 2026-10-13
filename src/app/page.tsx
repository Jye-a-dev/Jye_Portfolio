import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export const dynamic = "force-static";

interface HomeBackground {
  color?: string;
  background_color?: string;
  pattern?: string;
  overlay_vignette?: string;
  stains?: string;
  [key: string]: unknown;
}

interface HomeHeroButton {
  label: string;
  href: string;
  style?: string;
}

interface HomeHero {
  dispatch_code: string;
  tagline_green: string;
  headline_brick: string;
  badge_stencil: string;
  subtitle: string;
  cta_buttons: HomeHeroButton[];
  footnote: string;
}

interface HomeStation {
  code: string;
  title: string;
  stamp_seal: string;
  description: string;
  year: string;
  accent_color: string;
  href: string;
}

interface HomeDistributionStations {
  section_title: string;
  section_subtitle: string;
  stations: HomeStation[];
}

interface HomeCabinet {
  badge: string;
  title: string;
  serial_number: string;
  description: string;
  button_text: string;
  href: string;
}

interface HomeArchiveCabinets {
  section_title: string;
  cabinets: HomeCabinet[];
}

interface HomePageData {
  directed_to?: string;
  background?: HomeBackground;
  hero: HomeHero;
  distribution_stations: HomeDistributionStations;
  archive_cabinets: HomeArchiveCabinets;
}

/**
 * Đọc toàn bộ cấu hình trang chủ trực tiếp từ file Markdown qua gray-matter
 */
async function getHomeDocument(): Promise<{ data: HomePageData; content: string }> {
  const contentDir = path.join(process.cwd(), "content");
  const candidates = [
    path.join(contentDir, "home.md"),
    path.join(contentDir, "pages", "home.md"),
  ];

  let rawContent: string | null = null;
  for (const candidate of candidates) {
    try {
      rawContent = await fs.readFile(candidate, "utf-8");
      break;
    } catch {
      // Tiếp tục tìm trong danh sách fallback
    }
  }

  if (!rawContent) {
    throw new Error("Không thể định vị file nội dung home.md trong thư mục content/");
  }

  const { data, content } = matter(rawContent);
  return {
    data: data as HomePageData,
    content,
  };
}

export default async function HomePage() {
  const { data, content } = await getHomeDocument();
  const { hero, distribution_stations, archive_cabinets, background = {} } = data;

  const pageBg = background.background_color || "#e2d8c3";
  const pageText = background.color || "#1a1614";

  return (
    <div
      className="relative min-h-screen w-full selection:bg-baocap-brick/40 selection:text-baocap-paper transition-colors duration-300"
      style={{
        backgroundColor: pageBg,
        color: pageText,
      }}
    >
      {/* ========================================================
          HERO SECTION: KÍ SỰ CỦA JYE (Bao Cấp / Tây Bồi Sài Gòn Xưa)
         ======================================================== */}
      <section className="relative mx-auto my-8 w-full max-w-350 px-4 sm:px-6 lg:px-8">
        <div
          className="paper-kraft-texture relative w-full overflow-hidden rounded-xs border-4 border-[#3d342d] p-6 text-baocap-ink shadow-[0_20px_70px_rgba(0,0,0,0.95)] sm:p-10 lg:p-16 will-change-transform transform-gpu"
          style={{
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {/* Lớp phủ loang lổ vết ố thời gian từ Frontmatter */}
          {background.stains && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply"
              style={{ background: background.stains }}
            />
          )}

          {/* Lớp cháy mép Vignette tùy chỉnh từ Markdown */}
          {background.overlay_vignette && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-60"
              style={{ background: background.overlay_vignette }}
            />
          )}

          {/* Nội dung trung tâm: Hoàn toàn phi hardcode từ Frontmatter */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Dòng công văn & chỉ mục */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 font-typewriter font-mono text-[11px] font-bold tracking-widest text-[#5c4a32] uppercase sm:text-xs">
              <span className="rounded-xs border border-dashed border-[#8c734e] bg-[#e6d8bc]/90 px-2.5 py-1 shadow-[1px_1px_0px_#5c4a32]">
                {hero.dispatch_code}
              </span>
            </div>

            {/* Dòng Tagline xanh ngọc: Font Serif xẻ góc */}
            <h2 className="font-stencil-sub font-serif text-4xl font-bold italic tracking-wide text-baocap-teal sm:text-6xl lg:text-7xl drop-shadow-[1px_1px_0px_rgba(255,255,255,0.5)]">
              {hero.tagline_green}
            </h2>

            {/* Dòng Tiêu đề chính đỏ gạch: Chữ in Sans-serif dày gồ ghề */}
            <h1 className="font-hand-title my-1 text-6xl font-black italic tracking-widest text-baocap-crimson sm:text-8xl lg:text-9xl drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
              {hero.headline_brick}
            </h1>

            {/* Dấu đề can stencil đục lỗ */}
            <div className="mt-2 flex items-center justify-center gap-2 font-typewriter font-mono text-xs font-black tracking-widest text-baocap-crimson uppercase sm:text-sm">
              <span>{hero.badge_stencil}</span>
            </div>

            {/* Lời tự sự Tây bồi Nam Bộ */}
            <p className="mt-6 max-w-2xl font-serif text-xs text-[#3d3224] leading-relaxed text-pretty sm:text-sm">
              {hero.subtitle}
            </p>

            {/* Cụm nút CTA: Phím máy đánh chữ viền nét đứt */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {hero.cta_buttons?.map((btn, index) => (
                <Link
                  key={index}
                  href={btn.href}
                  className="typewriter-btn inline-flex items-center gap-2 px-6 py-3 font-typewriter font-mono text-xs font-bold uppercase tracking-widest"
                >
                  <span>{btn.label}</span>
                </Link>
              ))}
            </div>

            {/* Chân thẻ: Metadata phân vùng ba miền */}
            <div className="mt-10 border-t border-dashed border-[#8c734e] pt-3 font-typewriter font-mono text-[10px] tracking-widest text-[#6b563b] uppercase">
              {hero.footnote}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: TRẠM PHÂN PHỐI DỮ LIỆU (Tem Phiếu Viền Răng Cưa)
         ======================================================== */}
      <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between border-b-2 border-[#3d342d] pb-4">
          <div>
            <span className="font-typewriter font-mono text-xs font-bold tracking-widest text-baocap-brick uppercase">
              {distribution_stations.section_title}
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-baocap-yellow sm:text-3xl">
              {distribution_stations.section_subtitle}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {distribution_stations.stations?.map((station, index) => (
            <Link
              key={index}
              href={station.href}
              className="group ration-stamp-border relative block p-6 transition-all duration-300 hover:border-baocap-brick hover:shadow-[6px_6px_0px_#a83c27] will-change-transform transform-gpu hover:-translate-y-1.5"
              style={{
                borderLeftColor: station.accent_color,
                borderLeftWidth: "4px",
              }}
            >
              {/* Dấu mực mộc đỏ rực dán đè nghiêng 15 độ hiện ra khi hover */}
              <div className="pointer-events-none absolute top-4 right-4 z-20 max-w-[70%] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="stamp-seal text-[9px] leading-tight text-center">
                  {station.stamp_seal}
                </span>
              </div>

              {/* Mã trạm & niên khóa */}
              <div className="mb-3 flex items-center justify-between border-b border-dashed border-[#a39274] pb-2 font-typewriter font-mono text-[11px] font-bold text-[#8c785b]">
                <span>{station.code}</span>
                <span>{station.year}</span>
              </div>

              {/* Tiêu đề trạm */}
              <h3 className="font-serif text-lg font-bold text-baocap-ink transition-colors group-hover:text-baocap-brick">
                {station.title}
              </h3>

              {/* Mô tả chi tiết trạm */}
              <p className="mt-3 font-serif text-xs text-[#3d342d] leading-relaxed">
                {station.description}
              </p>

              {/* Dải chân tem hướng dẫn mở */}
              <div className="mt-6 flex items-center justify-between border-t border-dashed border-[#a39274] pt-2 font-typewriter font-mono text-[10px] text-[#8c785b]">
                <span>{station.href}</span>
                <span className="text-baocap-brick transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 3: GÁC XÉP CHẤT ĐỒ SỜN (Tủ Ngăn Kéo Cơ Học)
         ======================================================== */}
      <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-[#3d342d] pb-3">
          <h2 className="font-serif text-2xl font-bold text-baocap-paper sm:text-3xl">
            {archive_cabinets.section_title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {archive_cabinets.cabinets?.map((cabinet, index) => (
            <Link
              key={index}
              href={cabinet.href}
              className="cabinet-drawer group relative block rounded-xs p-7 will-change-transform transform-gpu"
            >
              {/* Khối huy hiệu & mã vô kho */}
              <div className="mb-4 flex items-center justify-between border-b border-[#3d342d] pb-3 font-typewriter font-mono text-xs">
                <span className="font-bold text-[#a39274]">{cabinet.badge}</span>
                <span className="text-[11px] text-baocap-brick">{cabinet.serial_number}</span>
              </div>

              {/* Tiêu đề ngăn kéo */}
              <h3 className="font-serif text-xl font-bold text-baocap-paper transition-colors group-hover:text-baocap-yellow">
                {cabinet.title}
              </h3>

              {/* Lời trích dẫn hồ sơ */}
              <p className="mt-2 font-serif text-xs text-[#a39274] leading-relaxed">
                {cabinet.description}
              </p>

              {/* Nút kéo ngăn kéo */}
              <div className="mt-6 flex items-center justify-end border-t border-[#3d342d] pt-3">
                <span className="font-typewriter font-mono text-xs font-bold text-baocap-yellow transition-transform duration-200 group-hover:translate-x-1">
                  {cabinet.button_text}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          MARKDOWN BODY: Thông Điệp Lưu Chiểu Từ Content
         ======================================================== */}
      {content.trim() && (
        <div className="border-t-2 border-[#3d342d] bg-[#141210] py-8 text-center font-typewriter font-mono text-xs text-[#8c785b]">
          <div className="mx-auto max-w-4xl px-4">
            <article className="prose prose-invert max-w-none text-xs text-[#8c785b] leading-relaxed prose-p:my-0">
              <MDXRemote source={content} />
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
