import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getSlugsBySection, getDocument } from "@/lib/markdown";
import { mdxComponents } from "@/components/mdx/MdxRenderer";
import { PageBackground } from "@/components/shared/PageBackground";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getSlugsBySection("projects");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocument("projects", slug);

  if (!doc) {
    return {
      title: "Hồ Sơ Không Tồn Tại | Neon Noir",
    };
  }

  const title = doc.metadata.title ?? slug;
  const description =
    (doc.metadata.brief as string) ||
    (doc.metadata.detail as string) ||
    `Tư liệu cuộn phim công trình ${title} trong kho lưu trữ 35mm.`;

  return {
    title: `${title} | Hồ Sơ Dự Án • Neon Noir`,
    description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocument("projects", slug);

  if (!doc) {
    notFound();
  }

  const { metadata, content } = doc;
  const neonAccent = metadata.neon_accent || "#00E5FF";
  const posterSrc = metadata.poster as string | undefined;
  const dispatchCode =
    (metadata.dispatch_code as string) ||
    `HỒ SƠ: ${(metadata.city || "VN").toUpperCase()}/ARCHIVE`;
  const stampSeal = (metadata.stamp_seal as string) || "ĐÃ LƯU TRỮ";
  const briefText =
    (metadata.brief as string) ||
    (metadata.detail as string) ||
    (metadata.description as string);

  const cityLabelMap: Record<string, string> = {
    hue: "Huế – Cố Đô Trầm Tích",
    saigon: "Sài Gòn – Phố Dạ Vũ",
    hanoi: "Hà Nội – Đêm Phố Cổ",
  };

  const cityLabel = metadata.city
    ? cityLabelMap[metadata.city.toLowerCase()] || metadata.city
    : null;

  return (
    <article
      className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300"
      style={
        {
          "--neon-glow": neonAccent,
        } as React.CSSProperties
      }
    >
      <PageBackground background={metadata.background} />

      {/* Vầng hào quang neon khuếch tán */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-96 w-full max-w-3xl -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ backgroundColor: neonAccent }}
      />

      {/* ========================================================
          THANH ĐIỀU HƯỚNG PHIM NHỰA & CUỐNG VÉ QUAY LẠI
         ======================================================== */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#2a241f] pb-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-xs border border-dashed border-[#44382c] bg-baocap-sepia px-3 py-1.5 font-typewriter font-mono text-xs font-bold text-baocap-yellow uppercase transition-all duration-200 hover:border-baocap-yellow hover:bg-[#211c19] hover:text-[#f4ede2]"
        >
          <span>◄</span>
          <span>QUAY LẠI RẠP CHIẾU BÓNG / DANH MỤC DỰ ÁN</span>
        </Link>

        <div className="font-typewriter font-mono text-[10px] tracking-widest text-[#8c734e] uppercase select-none">
          <span>TX 5063 • 35MM SAFETY FILM • TCVN 1986</span>
        </div>
      </div>

      {/* ========================================================
          HEADER: HỘP ĐÈN RẠP XI-NÊ & CON DẤU MỘC NIÊM PHONG
         ======================================================== */}
      <header className="relative mb-10 overflow-hidden rounded-xs border-4 border-[#3d342d] bg-[#141210]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_var(--neon-glow-dim)] sm:p-8">
        {/* 4 ốc tán đồng cơ học ở 4 góc hộp đèn */}
        <span className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
        <span className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />
        <span className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full border border-[#8c734e] bg-[#3d342d]" />

        {/* Khung viền chỉ kép bên trong */}
        <div className="relative rounded-xs border border-dashed border-[#8c734e]/40 p-5 sm:p-7">
          {/* Huy hiệu mã lưu trữ & Con dấu mộc đỏ */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-xs border border-[#3d342d] bg-baocap-sepia px-2.5 py-1 font-typewriter font-mono text-[11px] font-bold tracking-widest text-[#a39274] uppercase">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: neonAccent,
                  boxShadow: `0 0 8px ${neonAccent}`,
                }}
              />
              <span>{dispatchCode}</span>
            </div>

            <span className="inline-flex -rotate-6 items-center justify-center rounded-xs border-2 border-[#d94f3d] bg-baocap-sepia/90 px-3 py-1 font-typewriter font-mono text-xs font-black tracking-widest text-[#ff3b30] shadow-[0_0_12px_rgba(217,79,61,0.4)]">
              {stampSeal}
            </span>
          </div>

          {/* Tiêu đề dự án Neon Marquee */}
          <h1
            className="font-stencil-sub font-serif text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{
              textShadow: `0 0 6px #ffffff, 0 0 15px ${neonAccent}, 0 0 35px ${neonAccent}`,
            }}
          >
            {metadata.title ?? slug}
          </h1>

          {/* Dòng tóm lược hồ sơ */}
          {briefText && (
            <p className="mt-4 font-serif text-sm leading-relaxed text-[#c7b299] sm:text-base">
              {briefText}
            </p>
          )}

          {/* Metadata chips: Thành phố, Ngày, Vai trò */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-dashed border-[#2a241f] pt-4 font-typewriter font-mono text-xs text-[#a39274]">
            {cityLabel && (
              <span className="rounded-xs border border-[#3d342d] bg-baocap-sepia px-2 py-0.5 text-baocap-yellow">
                {cityLabel}
              </span>
            )}
            {metadata.date && (
              <span className="text-[#8c785b]">/ Niên khóa: {metadata.date}</span>
            )}
            {metadata.role && (
              <span className="text-[#8c785b]">
                / Đảm nhiệm: <strong className="text-[#f4ede2]">{metadata.role}</strong>
              </span>
            )}
          </div>

          {/* Thẻ công nghệ (Tags) */}
          {metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs border border-dashed border-[#44382c] bg-baocap-sepia px-2.5 py-0.5 font-typewriter font-mono text-[11px] font-medium text-baocap-yellow"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ========================================================
          POSTER ĐIỆN ẢNH KHUNG HÌNH 35MM (Cinematic Film Frame)
         ======================================================== */}
      {posterSrc && (
        <section aria-label="Poster tư liệu phim" className="mb-12">
          <div className="overflow-hidden rounded-xs border-y-4 border-[#141210] bg-[#0c0a09] shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
            {/* Sprocket holes trên */}
            <div className="border-b border-[#1f1a16] bg-[#0c0a09]">
              <div className="film-strip-sprockets h-4 w-full opacity-75" />
              <div className="flex items-center justify-between px-6 py-1 font-typewriter font-mono text-[9px] font-bold tracking-widest text-baocap-yellow/70 select-none">
                <span>KODAK TX 5063</span>
                <span>▶ SAFETY FILM</span>
                <span>POSTER MASTER STILL</span>
              </div>
            </div>

            {/* Khung ảnh trung tâm với hiệu ứng CRT Scanlines */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#0d0c0b]">
              <Image
                src={posterSrc}
                alt={metadata.title || "Project Still"}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover contrast-110 brightness-95"
              />
              <div
                aria-hidden="true"
                className="crt-scanlines pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-25 mix-blend-multiply"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#141210] via-transparent to-transparent"
              />
            </div>

            {/* Sprocket holes dưới */}
            <div className="border-t border-[#1f1a16] bg-[#0c0a09]">
              <div className="flex items-center justify-between px-6 py-1 font-typewriter font-mono text-[9px] font-bold tracking-widest text-[#8c734e]/80 select-none">
                <span>TCVN 1986</span>
                <span>▶ 35MM NEGATIVE ARCHIVE</span>
                <span>HÒN NGỌC VIỄN ĐÔNG</span>
              </div>
              <div className="film-strip-sprockets h-4 w-full opacity-75" />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          THÂN BÀI TƯ LIỆU DỰ ÁN (MDX Remote Body)
         ======================================================== */}
      <section className="rounded-xs border-2 border-[#3d342d] bg-[#141210]/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] sm:p-10">
        <div className="prose prose-invert max-w-none font-serif text-baocap-paper leading-relaxed prose-headings:font-stencil-sub prose-headings:text-baocap-paper prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-strong:text-baocap-yellow prose-a:text-cyan-400 prose-hr:border-dashed prose-hr:border-[#44382c] prose-li:marker:text-baocap-yellow">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </section>

      {/* ========================================================
          CHÂN TRANG ĐIỀU HƯỚNG DỰ ÁN (Footer Navigation)
         ======================================================== */}
      <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2a241f] pt-6 sm:flex-row">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-xs border-2 border-baocap-yellow bg-baocap-yellow px-5 py-2.5 font-typewriter font-mono text-xs font-bold text-baocap-ink uppercase transition-all duration-200 hover:bg-baocap-paper"
        >
          <span>◄</span>
          <span>QUAY LẠI DANH MỤC DỰ ÁN</span>
        </Link>

        <span className="font-typewriter font-mono text-xs text-[#8c785b]">
          [ MÃ HỒ SƠ: {dispatchCode} ]
        </span>
      </footer>
    </article>
  );
}

