import React from "react";
import { NeonLink } from "./NeonLink";
import { FramedImage } from "./FramedImage";
import { CinematicVideo } from "./CinematicVideo";
import { CassetteAudio } from "./CassetteAudio";

export const mdxComponents = {
  // Liên kết mang phong cách Neon Noir
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <NeonLink href={href || "#"} {...props}>
      {children}
    </NeonLink>
  ),

  // Hình ảnh khung âm bản 35mm
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <FramedImage
      src={typeof props.src === "string" ? props.src : ""}
      alt={props.alt}
      caption={props.title}
    />
  ),

  // Tiêu đề với typography Bao Cấp / Neon Noir
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mt-10 mb-5 font-stencil-sub font-serif text-3xl font-black tracking-tight text-white sm:text-4xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-8 mb-4 border-b border-dashed border-[#3d342d] pb-2 font-stencil-sub font-serif text-2xl font-bold tracking-tight text-[#f4ede2] sm:text-3xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-6 mb-3 font-stencil-sub font-serif text-xl font-bold text-baocap-yellow"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-4 mb-2 font-typewriter font-mono text-base font-bold text-baocap-paper"
      {...props}
    >
      {children}
    </h4>
  ),

  // Đoạn văn & trích dẫn công văn
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 font-serif text-sm leading-relaxed text-[#dcd1be] sm:text-base" {...props}>
      {children}
    </p>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-baocap-yellow bg-[#1c1815]/80 p-4 font-serif text-sm italic text-[#c7b299] shadow-[2px_2px_0px_#000]"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Danh sách gạch đầu dòng / số thứ tự
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 space-y-2 pl-6 list-disc marker:text-baocap-yellow font-serif text-sm text-[#dcd1be] sm:text-base" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 space-y-2 pl-6 list-decimal marker:text-baocap-yellow font-serif text-sm text-[#dcd1be] sm:text-base" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Đường phân cách răng cưa tem phiếu
  hr: () => (
    <hr className="my-8 border-t border-dashed border-[#44382c]" />
  ),

  // Khối mã nguồn máy đánh chữ / Terminal
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="my-6 overflow-x-auto rounded-xs border border-[#3d342d] bg-[#0c0a09] p-4 font-typewriter font-mono text-xs text-[#52d17c] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded-xs border border-[#44382c] bg-baocap-sepia px-1.5 py-0.5 font-typewriter font-mono text-xs text-baocap-yellow"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  // Bảng biểu hồ sơ cán bộ
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className="w-full border-collapse border border-[#3d342d] font-typewriter font-mono text-xs text-[#dcd1be]"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-[#3d342d] bg-baocap-sepia p-3 text-left font-bold tracking-wider text-baocap-yellow uppercase"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-[#2a241f] p-3" {...props}>
      {children}
    </td>
  ),

  // Hộp cảnh báo / Thông tri đặc biệt
  Callout: ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div className="my-6 rounded-xs border-2 border-baocap-yellow bg-[#1c1815] p-4 shadow-[4px_4px_0px_#181512]">
      {title && (
        <div className="mb-2 font-typewriter font-mono text-xs font-bold tracking-wider text-baocap-yellow uppercase">
          [ THÔNG BÁO QUAN TRỌNG ]: {title}
        </div>
      )}
      <div className="font-serif text-sm text-baocap-paper">{children}</div>
    </div>
  ),

  // Custom MDX components
  NeonLink,
  FramedImage,
  CinematicVideo,
  Video: CinematicVideo,
  Audio: CassetteAudio,
  CassetteAudio,
};

