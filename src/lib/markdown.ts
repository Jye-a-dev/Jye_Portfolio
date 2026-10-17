import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface PageBackgroundConfig {
  color?: string;
  background_color?: string;
  image?: string;
  pattern?: "noise" | "kraft" | "dots" | "grid" | "none" | string;
  opacity?: number;
  overlay?: string;
}

export interface DocumentMetadata {
  title?: string;
  slug?: string;
  city?: "hue" | "saigon" | "hanoi" | string;
  neon_accent?: string;
  ambient_audio?: string;
  background?: string | PageBackgroundConfig;
  date?: string;
  tags?: string[];
  role?: string;
  period?: string;
  category?: string;
  email?: string;
  github?: string;
  banner?: string;
  description?: string;
  section?: string;
  poster?: string;
  Project?: 1 | 2 | number;
  project?: 1 | 2 | number;
  [key: string]: unknown;
}

export interface DocumentData {
  metadata: DocumentMetadata;
  content: string;
  slug: string;
  section: string;
}

const CONTENT_PATH = path.join(process.cwd(), "content");

/**
 * Lấy danh sách slug từ thư mục phân loại content/[section].
 */
export async function getSlugsBySection(section: string): Promise<string[]> {
  try {
    const sectionDir = path.join(CONTENT_PATH, section);
    const files = await fs.readdir(sectionDir);
    const mdFiles = files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx")
    );
    const slugSet = new Set<string>();

    await Promise.all(
      mdFiles.map(async (file) => {
        const fileSlug = file.replace(/\.(md|mdx)$/, "");
        slugSet.add(fileSlug);

        try {
          const filePath = path.join(sectionDir, file);
          const rawContent = await fs.readFile(filePath, "utf-8");
          const { data } = matter(rawContent);
          if (data.slug && typeof data.slug === "string") {
            slugSet.add(data.slug);
          }
        } catch {
          // ignore individual read/parse error
        }
      })
    );

    return Array.from(slugSet);
  } catch {
    return [];
  }
}

/**
 * Đọc toàn bộ danh sách tài liệu trong một thư mục content/[section].
 * Chỉ trích xuất Frontmatter metadata (slug, title, date, neon_accent, banner...),
 * sắp xếp theo ngày tháng mới nhất và loại bỏ content (body) nhằm tối ưu RAM máy chủ.
 */
export async function getAllDocuments(section: string): Promise<DocumentMetadata[]> {
  try {
    const sectionDir = path.join(CONTENT_PATH, section);
    const files = await fs.readdir(sectionDir);
    const mdFiles = files.filter(
      (file) => file.endsWith(".md") || file.endsWith(".mdx")
    );

    const documents = await Promise.all(
      mdFiles.map(async (file) => {
        const defaultSlug = file.replace(/\.(md|mdx)$/, "");
        const filePath = path.join(sectionDir, file);
        const rawContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(rawContent);

        return {
          ...data,
          slug: (data.slug as string) || defaultSlug,
          section,
        } as DocumentMetadata;
      })
    );

    // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
    return documents.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch {
    return [];
  }
}

/**
 * Đọc file .md/.mdx theo section và slug, bóc tách frontmatter và markdown body.
 */
export async function getDocument(
  section: string,
  slug: string
): Promise<DocumentData | null> {
  try {
    const extensions = [".md", ".mdx"];
    let rawContent: string | null = null;
    let resolvedSlug = slug;

    // 1. Thử đọc trực tiếp từ tên file khớp chính xác với slug
    for (const ext of extensions) {
      const filePath = path.join(CONTENT_PATH, section, `${slug}${ext}`);
      try {
        rawContent = await fs.readFile(filePath, "utf-8");
        break;
      } catch {
        // Thử extension tiếp theo nếu không tìm thấy file
      }
    }

    // 2. Nếu không tìm thấy, quét thư mục section để tìm file có frontmatter slug khớp
    // hoặc tên file khớp không phân biệt chữ hoa/thường hay dấu gạch ngang
    if (rawContent === null) {
      const sectionDir = path.join(CONTENT_PATH, section);
      const files = await fs.readdir(sectionDir);
      const normalizedQuerySlug = slug.toLowerCase().replace(/[-_]/g, "");

      for (const file of files) {
        if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
        const filePath = path.join(sectionDir, file);
        try {
          const candidateContent = await fs.readFile(filePath, "utf-8");
          const { data } = matter(candidateContent);
          const metaSlug = typeof data.slug === "string" ? data.slug : null;
          const fileNameNoExt = file.replace(/\.(md|mdx)$/, "");

          if (
            metaSlug === slug ||
            metaSlug?.toLowerCase() === slug.toLowerCase() ||
            fileNameNoExt.toLowerCase() === slug.toLowerCase() ||
            fileNameNoExt.toLowerCase().replace(/[-_]/g, "") === normalizedQuerySlug
          ) {
            rawContent = candidateContent;
            resolvedSlug = metaSlug || fileNameNoExt;
            break;
          }
        } catch {
          // Bỏ qua lỗi đọc file cá nhân
        }
      }
    }

    if (rawContent === null) {
      return null;
    }

    const { data, content } = matter(rawContent);

    return {
      metadata: {
        ...data,
        slug: (data.slug as string) || resolvedSlug,
        section,
      } as DocumentMetadata,
      content,
      slug: (data.slug as string) || resolvedSlug,
      section,
    };
  } catch {
    return null;
  }
}

/**
 * Lấy danh sách toàn bộ các thư mục section con trong content/ (loại trừ thư mục quản lý trang "pages").
 */
export async function getAllSections(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_PATH, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name !== "pages")
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Lấy toàn bộ cặp { section, slug } để cung cấp cho generateStaticParams (SSG).
 */
export async function getAllSectionSlugs(): Promise<
  Array<{ section: string; slug: string }>
> {
  const sections = await getAllSections();
  const staticParams: Array<{ section: string; slug: string }> = [];

  for (const section of sections) {
    const slugs = await getSlugsBySection(section);
    for (const slug of slugs) {
      staticParams.push({ section, slug });
    }
  }

  return staticParams;
}

/**
 * Đọc trực tiếp một file markdown từ thư mục content/
 */
export async function getMarkdownFile<T = Record<string, unknown>>(
  relativeFilePath: string
): Promise<{ data: T; content: string } | null> {
  try {
    const filePath = path.join(CONTENT_PATH, relativeFilePath);
    const rawContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(rawContent);
    return { data: data as T, content };
  } catch {
    return null;
  }
}

export interface PageDocument<T = Record<string, unknown>> {
  slug: string;
  directed_to?: string;
  data: T;
  content: string;
}

/**
 * Đọc toàn bộ danh sách các trang trong content/pages/ phục vụ CRUD
 */
export async function getAllPages<T = Record<string, unknown>>(): Promise<PageDocument<T>[]> {
  try {
    const pagesDir = path.join(CONTENT_PATH, "pages");
    const files = await fs.readdir(pagesDir);
    const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    const pages = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.replace(/\.(md|mdx)$/, "");
        const filePath = path.join(pagesDir, file);
        const rawContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(rawContent);
        return {
          slug,
          directed_to: data.directed_to as string | undefined,
          data: data as T,
          content,
        };
      })
    );
    return pages;
  } catch {
    return [];
  }
}

/**
 * Tìm kiếm trang theo url đích (`directed_to: url page`)
 */
export async function getPageByDirectedTo<T = Record<string, unknown>>(
  directedUrl: string
): Promise<PageDocument<T> | null> {
  const pages = await getAllPages<T>();
  const matched = pages.find((p) => p.directed_to === directedUrl);
  return matched || null;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterSocial {
  label: string;
  href: string;
}

export interface FooterData {
  copyright: string;
  location: string;
  socials: FooterSocial[];
  description?: string;
  archive_badge?: string;
}

export interface SoundTrack {
  id: string;
  title: string;
  subtitle?: string;
  artist: string;
  src: string;
  stage?: "intro" | "body" | "outro" | string;
}

export interface CassetteConfig {
  default_volume?: number;
  tracks: SoundTrack[];
}

export interface LayoutData {
  directed_to?: string;
  navbar: NavItem[];
  footer: FooterData;
  cassette?: CassetteConfig;
}

/**
 * Đọc cấu hình layout (ưu tiên content/pages/layout.md, fallback content/layout.md)
 */
export async function getLayoutData(): Promise<LayoutData | null> {
  const fromPages = await getMarkdownFile<LayoutData>("pages/layout.md");
  if (fromPages) return fromPages.data;

  const fallback = await getMarkdownFile<LayoutData>("layout.md");
  return fallback ? fallback.data : null;
}
