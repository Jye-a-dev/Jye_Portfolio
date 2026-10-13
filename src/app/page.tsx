import React from "react";
import Link from "next/link";
import { Radio, FolderOpen, ArrowUpRight, Archive } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPageByDirectedTo, getMarkdownFile, PageBackgroundConfig } from "@/lib/markdown";
import { PageBackground } from "@/components/shared/PageBackground";

export const dynamic = "force-static";

interface HomeHeroData {
  dispatch_code: string;
  tagline_teal: string;
  headline_crimson: string;
  badge_stencil: string;
  subtitle: string;
  broadcast_lead: string;
  film_tape_meta: string;
  cta_buttons: Array<{
    label: string;
    href: string;
    icon: string;
    primary: boolean;
  }>;
}

interface HomeStation {
  code: string;
  title: string;
  quota: string;
  ration_category: string;
  description: string;
  stamp_seal: string;
  year: string;
  accent_color: string;
  href: string;
}

interface HomeDistributionData {
  section_title: string;
  section_subtitle: string;
  stamp_tag: string;
  stations: HomeStation[];
}

interface HomeCabinet {
  id: string;
  badge: string;
  title: string;
  serial_number: string;
  description: string;
  button_text: string;
  href: string;
}

interface HomeCabinetsData {
  section_title: string;
  section_subtitle: string;
  cabinets: HomeCabinet[];
}

interface HomePageFrontmatter {
  background?: string | PageBackgroundConfig;
  hero: HomeHeroData;
  distribution_stations: HomeDistributionData;
  archive_cabinets: HomeCabinetsData;
}

export default async function HomePage() {
  // Tìm kiếm tài liệu cấu hình theo field `directed_to: "/"` trong content/pages/
  const pageDoc =
    (await getPageByDirectedTo<HomePageFrontmatter>("/")) ||
    (await getMarkdownFile<HomePageFrontmatter>("pages/home.md")) ||
    (await getMarkdownFile<HomePageFrontmatter>("home.md"));

  if (!pageDoc) {
    throw new Error("Không tìm thấy dữ liệu trang chủ trong content/pages/home.md");
  }

  const { hero, distribution_stations, archive_cabinets, background } = pageDoc.data;
  const content = pageDoc.content;

  // Lấy màu nền và màu chữ toàn trang từ Frontmatter background
  const bgConfig =
    typeof background === "string" ? { background_color: background } : background;
  const pageBgColor =
    bgConfig?.background_color ||
    (bgConfig?.color && !bgConfig?.background_color ? bgConfig.color : undefined);
  const pageTextColor =
    bgConfig?.background_color && bgConfig?.color ? bgConfig.color : undefined;

  return (
    <div
      className="relative min-h-screen w-full selection:bg-baocap-brick/40 selection:text-baocap-paper transition-colors duration-300"
      style={{
        backgroundColor: pageBgColor,
        color: pageTextColor,
      }}
    >
      {/* Background toàn trang từ Markdown Frontmatter */}
      <PageBackground background={background} />
      {/* ========================================================
          HERO SECTION: HÒN NGỌC VIỄN ĐÔNG & HỒI KÝ TEM PHIẾU
         ======================================================== */}
      <section className="relative mx-auto my-8 w-full max-w-350 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-xs border-4 border-[#3d342d] bg-[#d5c4a1] p-6 text-baocap-ink shadow-[0_20px_70px_rgba(0,0,0,0.95)] sm:p-10 lg:p-16">
          {/* Lớp texture giấy kraft ố vàng loang lổ và hạt mực văng */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(#261d15 1.5px, transparent 1.5px), radial-gradient(#181512 1px, transparent 1px)",
              backgroundSize: "28px 28px, 14px 14px",
              backgroundPosition: "0 0, 7px 7px",
            }}
          />

          {/* Vết ố góc và bụi mực loang của giấy bồi cũ */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#c4b18c]/40 to-[#9e8760]/70"
          />

          {/* Nội dung trung tâm: Trình bày chuẩn mỹ học 'Hòn Ngọc Viễn Đông' */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Dòng mã số công văn & Tiêu ngữ */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] font-bold tracking-widest text-[#5c4a32] uppercase sm:text-xs">
              <span className="rounded-xs border border-[#8c734e] bg-[#e6d8bc]/80 px-2 py-0.5 shadow-[1px_1px_0px_#5c4a32]">
                {hero.dispatch_code}
              </span>
              <span>•</span>
              <span className="italic">{hero.subtitle}</span>
            </div>

            {/* Dòng chữ "Hòn Ngọc": Font Serif nghiêng, màu xanh ngọc teal */}
            <h2 className="font-serif text-3xl font-bold italic tracking-wide text-baocap-teal sm:text-5xl lg:text-6xl drop-shadow-[1px_1px_0px_rgba(255,255,255,0.4)]">
              {hero.tagline_teal}
            </h2>

            {/* Dòng chữ "VIỄN ĐÔNG": Chữ in hoa bản lớn, màu đỏ bầm, nghiêng nhẹ */}
            <h1 className="my-1 font-serif text-5xl font-bold italic tracking-widest text-baocap-crimson sm:text-7xl lg:text-8xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
              {hero.headline_crimson}
            </h1>

            {/* Dòng tagline chân đề can kiểu chữ đục lỗ / retro stencil */}
            <div className="mt-2 flex items-center justify-center gap-2 font-mono text-xs font-black tracking-widest text-baocap-crimson uppercase sm:text-sm">
              <span className="text-sm">✦</span>
              <span>{hero.badge_stencil}</span>
              <span className="text-sm">✦</span>
            </div>

            {/* Lời dẫn truyền thanh */}
            <p className="mt-6 max-w-2xl font-serif text-xs text-[#3d3224] leading-relaxed text-pretty sm:text-sm">
              {hero.broadcast_lead}
            </p>

            {/* Cụm nút CTA: Phím máy đánh chữ cơ học (Typewriter brutalist button) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {hero.cta_buttons?.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={`typewriter-btn inline-flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest ${
                    btn.primary
                      ? "border-baocap-crimson text-baocap-crimson hover:border-baocap-teal hover:text-baocap-teal"
                      : "border-baocap-ink text-baocap-ink"
                  }`}
                >
                  {btn.icon === "radio" ? (
                    <Radio className="h-4 w-4" />
                  ) : (
                    <FolderOpen className="h-4 w-4" />
                  )}
                  <span>{btn.label}</span>
                  <span className="text-[10px]">▶</span>
                </Link>
              ))}
            </div>

            {/* Footer chân thẻ: Metadata chuẩn kỹ thuật */}
            <div className="mt-10 border-t border-dashed border-[#8c734e] pt-3 font-mono text-[10px] tracking-widest text-[#6b563b] uppercase">
              {hero.film_tape_meta}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: // CỬA HÀNG MẬU DỊCH - Ba Trạm Phân Phối (Ration Stamp Card)
         ======================================================== */}
      <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between border-b-2 border-[#3d342d] pb-4">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest text-baocap-brick uppercase">
              {distribution_stations.section_title}
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-baocap-yellow sm:text-3xl">
              {distribution_stations.section_subtitle}
            </h2>
          </div>
          <div className="font-mono text-xs tracking-wider text-[#a39274]">
            [ {distribution_stations.stamp_tag} ]
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {distribution_stations.stations?.map((station) => (
            <Link
              key={station.code}
              href={station.href}
              className="group ration-stamp-border relative block p-6 transition-all duration-200 hover:-translate-y-1 hover:border-baocap-brick hover:shadow-[6px_6px_0px_#a83c27]"
            >
              {/* Dấu mộc đỏ cao su hành chính xuất hiện chéo góc khi hover */}
              <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="stamp-seal">{station.stamp_seal}</span>
              </div>

              {/* Thông tin tem phiếu */}
              <div className="mb-3 flex items-center justify-between border-b border-dashed border-[#a39274] pb-2 font-mono text-[11px] font-bold text-[#8c785b]">
                <span>{station.code}</span>
                <span>NIÊN KHÓA {station.year}</span>
              </div>

              <h3 className="font-serif text-lg font-bold text-baocap-ink transition-colors group-hover:text-baocap-brick">
                {station.title}
              </h3>

              {/* Khối định mức phân phối lương thực */}
              <div className="my-3 rounded-xs border border-[#3d342d]/30 bg-baocap-yellow/20 p-2 font-mono text-xs font-semibold text-baocap-ink">
                <div className="text-baocap-brick">{station.quota}</div>
                <div className="mt-0.5 text-[10px] text-[#5c4f3d]">
                  {station.ration_category}
                </div>
              </div>

              <p className="font-serif text-xs text-[#3d342d] leading-relaxed">
                {station.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#a39274] pt-2 font-mono text-[10px] text-[#8c785b]">
                <span>XÉ THEO ĐƯỜNG CHỈ NÀY</span>
                <span className="text-baocap-brick transition-transform group-hover:translate-x-1">
                  CHI TIẾT →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 3: WIDGET LIÊN KẾT (Tủ Cán Bộ & Trạm Giao Liên)
         ======================================================== */}
      <section className="mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-[#3d342d] pb-3">
          <span className="font-mono text-xs font-bold tracking-widest text-baocap-yellow uppercase">
            {archive_cabinets.section_title}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-baocap-paper sm:text-3xl">
            {archive_cabinets.section_subtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {archive_cabinets.cabinets?.map((cabinet) => (
            <Link
              key={cabinet.id}
              href={cabinet.href}
              className="cabinet-drawer group relative block rounded-xs p-7"
            >
              {/* Tay nắm ngăn kéo tủ gỗ */}
              <div className="mb-4 flex items-center justify-between border-b border-[#3d342d] pb-3">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-baocap-yellow" />
                  <span className="font-mono text-xs font-bold text-[#a39274]">
                    {cabinet.badge}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-baocap-brick">
                  {cabinet.serial_number}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-baocap-paper transition-colors group-hover:text-baocap-yellow">
                {cabinet.title}
              </h3>

              <p className="mt-2 font-serif text-xs text-[#a39274] leading-relaxed">
                {cabinet.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-[#3d342d] pt-3">
                <span className="font-mono text-[10px] text-[#8c785b]">
                  LƯU CHIỂU: PHÒNG QUẢN LÝ DỰ ÁN
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-baocap-yellow transition-transform group-hover:translate-x-1">
                  <span>{cabinet.button_text}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          THÔNG ĐIỆP CHỈ THỊ CHÂN TRANG (Markdown Body với MDXRemote)
         ======================================================== */}
      {content.trim() && (
        <div className="border-t-2 border-[#3d342d] bg-[#141210] py-8 text-center font-mono text-xs text-[#8c785b]">
          <div className="mx-auto max-w-4xl px-4">
            <article className="prose prose-invert max-w-none text-xs text-[#8c785b] leading-relaxed prose-p:my-0">
              <MDXRemote source={content} />
            </article>
            <p className="mt-3 text-[10px] text-[#5c4f3d]">
              UBND BA MIỀN • CỤC LƯU TRỮ VĂN HÓA VÀ CÔNG NGHỆ BẢO CẤP • NĂM 1986
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
