import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSectionSlugs, getDocument } from "@/lib/markdown";
import { NeonLink } from "@/components/mdx/NeonLink";
import { FramedImage } from "@/components/mdx/FramedImage";
import { CinematicVideo } from "@/components/mdx/CinematicVideo";
import { PageBackground } from "@/components/shared/PageBackground";

type PageProps = {
  params: Promise<{
    section: string;
    slug: string;
  }>;
};

/**
 * Static Site Generation (SSG) với Dynamic Routes trong App Router.
 * Quét toàn bộ nội dung từ thư mục content/ để render trước tại build-time.
 */
export async function generateStaticParams() {
  return await getAllSectionSlugs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const doc = await getDocument(section, slug);

  if (!doc) {
    return {
      title: "Tài liệu không tồn tại | Neon Noir",
    };
  }

  return {
    title: `${doc.metadata.title ?? slug} | Neon Noir`,
    description: `Khám phá tư liệu ${doc.metadata.title ?? slug} trong chương mục ${section}.`,
  };
}

/**
 * Bảng ánh xạ linh kiện MDX tích hợp các thành phần điện ảnh Neon Noir.
 * Thay thế trực tiếp các thẻ HTML chuẩn bằng các component đồ họa cao cấp.
 */
const mdxComponents = {
  // Thay thế thẻ <a> mặc định
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <NeonLink href={href || "#"} {...props}>
      {children}
    </NeonLink>
  ),
  // Thay thế thẻ <img> mặc định
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <FramedImage
      src={typeof props.src === "string" ? props.src : ""}
      alt={props.alt}
      caption={props.title}
    />
  ),
  // Các thẻ custom trực tiếp trong file .md/.mdx
  NeonLink,
  FramedImage,
  CinematicVideo,
  Video: CinematicVideo,
  Audio: (props: { src?: string; title?: string }) => (
    <div className="my-6 flex items-center justify-between rounded border border-zinc-800/80 bg-zinc-950/70 p-4 font-mono text-xs text-zinc-300">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
        </span>
        <span className="font-semibold text-zinc-200">{props.title || "Cassette Track"}</span>
      </div>
      <span className="text-zinc-500">{props.src}</span>
    </div>
  ),
};

export default async function DocumentDetailPage({ params }: PageProps) {
  const { section, slug } = await params;
  const doc = await getDocument(section, slug);

  if (!doc) {
    notFound();
  }

  const { metadata, content } = doc;
  const neonAccent = metadata.neon_accent || "#00E5FF";

  const cityLabelMap: Record<string, string> = {
    hue: "Huế – Cố Đô Trầm Tích",
    saigon: "Sài Gòn – Phố Dạ Vũ",
    hanoi: "Hà Nội – Đêm Phố Cổ",
  };

  const cityLabel = metadata.city
    ? cityLabelMap[metadata.city.toLowerCase()] || metadata.city
    : null;

  const bgConfig =
    typeof metadata.background === "string"
      ? { background_color: metadata.background }
      : metadata.background;
  const pageBgColor =
    bgConfig?.background_color ||
    (bgConfig?.color && !bgConfig?.background_color ? bgConfig.color : undefined);
  const pageTextColor =
    bgConfig?.background_color && bgConfig?.color ? bgConfig.color : undefined;

  return (
    <article
      className="relative mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{
        backgroundColor: pageBgColor,
        color: pageTextColor,
      }} 
    >
      {/* Background tùy chỉnh từ Markdown frontmatter */}
      <PageBackground background={metadata.background} />

      {/* Vầng sáng Ambient Neon tương ứng với neon_accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-72 w-full max-w-2xl -translate-x-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ backgroundColor: neonAccent }}
      />

      {/* Header tài liệu hiển thị metadata */}
      <header className="mb-12 border-b border-gold-800/60 pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider uppercase">
          <span
            className="rounded px-2 py-0.5 font-medium transition-colors"
            style={{
              backgroundColor: `${neonAccent}1a`,
              color: neonAccent,
              boxShadow: `0 0 12px ${neonAccent}33`,
            }}
          >
            {section}
          </span>

          {cityLabel && <span className="text-zinc-400">/ {cityLabel}</span>}

          {metadata.date && <time className="text-zinc-500">/ {metadata.date}</time>}

          {metadata.period && <span className="text-zinc-500">/ {metadata.period}</span>}
        </div>

        <h1
          className="font-serif text-3xl font-bold tracking-tight text-zinc-100 sm:text-5xl"
          style={{
            textShadow: `0 0 24px ${neonAccent}40`,
          }}
        >
          {metadata.title ?? slug}
        </h1>

        {metadata.role && (
          <p className="mt-3 font-mono text-sm tracking-wide text-zinc-400">
            Vai trò: <span className="text-zinc-200">{metadata.role}</span>
          </p>
        )}

        {metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Body hiển thị MDX với bộ components điện ảnh */}
      <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  );
}
