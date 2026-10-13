import React from "react";
import Link from "next/link";

export interface NeonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "crimson" | "moss";
  children: React.ReactNode;
}

/**
 * Thẻ liên kết mang phong cách Neon Noir thay thế <a> mặc định trong MDX.
 * Sở hữu hiệu ứng nhấp nháy đèn neon (flicker) khi hover và gạch chân màu Đỏ Son hoặc Xanh Rêu.
 */
export function NeonLink({
  href,
  children,
  className = "",
  variant = "crimson",
  ...props
}: NeonLinkProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  // Đỏ son (Crimson vermilion) vs Xanh rêu (Moss green)
  const variantStyles =
    variant === "moss"
      ? "text-emerald-400 decoration-emerald-600/80 hover:text-emerald-300 hover:decoration-emerald-400 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]"
      : "text-rose-400 decoration-rose-600/80 hover:text-rose-300 hover:decoration-rose-400 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]";

  const baseStyles =
    "group inline-flex items-center gap-0.5 font-medium underline underline-offset-4 decoration-2 transition-all duration-150 hover:animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]";

  const combinedClassName = `${baseStyles} ${variantStyles} ${className}`.trim();

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block text-[10px] opacity-70 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
}

export default NeonLink;

