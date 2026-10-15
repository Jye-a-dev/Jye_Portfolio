import React from "react";
import type { PageBackgroundConfig } from "@/lib/markdown";

interface PageBackgroundProps {
  background?: string | PageBackgroundConfig;
}

/**
 * PageBackground:
 * Thiết lập nền toàn trang (canvas background, texture pattern, noise, và ambient overlay)
 * đồng bộ từ cấu hình Frontmatter Markdown của Page.
 */
export function PageBackground({ background }: PageBackgroundProps) {
  if (!background) return null;

  const config: PageBackgroundConfig =
    typeof background === "string" ? { background_color: background } : background;

  // Ưu tiên background_color cho màu nền, fallback về color nếu không khai báo background_color
  const bgColor = config.background_color || config.color;
  const { image, pattern = "none", opacity = 0.2, overlay } = config;

  const patternStyles: Record<string, React.CSSProperties> = {
    noise: {
      backgroundImage: "url('/noise.png')",
      backgroundRepeat: "repeat",
    },
    kraft: {
      backgroundImage:
        "radial-gradient(#261d15 1.5px, transparent 1.5px), radial-gradient(#181512 1px, transparent 1px)",
      backgroundSize: "28px 28px, 14px 14px",
      backgroundPosition: "0 0, 7px 7px",
    },
    dots: {
      backgroundImage: "radial-gradient(rgba(0,0,0,0.15) 1.5px, transparent 1.5px)",
      backgroundSize: "22px 22px",
    },
    grid: {
      backgroundImage:
        "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
    },
    scanlines: {
      backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.06) 50%)",
      backgroundSize: "100% 4px",
    }, 
    ruled: {
      backgroundImage: "linear-gradient(transparent 95%, rgba(168, 60, 39, 0.15) 95%)",
      backgroundSize: "100% 28px", // Khoảng cách giữa các dòng kẻ
    }
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 h-screen w-screen overflow-hidden select-none gpu-layer"
      style={{
        backgroundColor: bgColor && !bgColor.startsWith("bg-") ? bgColor : undefined,
        contain: "strict",
        transform: "translate3d(0, 0, 0)",
      }}
    >
      {/* Lớp hiển thị ảnh nền toàn trang */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{
            backgroundImage: `url('${image}')`,
            opacity: opacity ?? 0.2,
          }}
        />
      )}

      {/* Lớp hiển thị pattern texture toàn trang (noise, kraft, dots, grid) */}
      {pattern !== "none" && patternStyles[pattern] && (
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={patternStyles[pattern]}
        />
      )}

      {/* Lớp phủ ánh sáng / overlay gradient toàn trang */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: overlay,
          }}
        />
      )}
    </div>
  );
}

export default PageBackground;
