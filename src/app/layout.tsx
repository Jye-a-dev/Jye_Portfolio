import type { Metadata, Viewport } from "next";
import { Lora, Be_Vietnam_Pro, Roboto_Mono } from "next/font/google";
import { ReactLenis } from "lenis/react";
import { FilmGrainOverlay } from "@/components/cinematic/FilmGrainOverlay";
import { AudioProvider } from "@/context/AudioContext";
import { StickyCassettePlayer } from "@/components/cinematic/StickyCassettePlayer";
import { Navbar } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getLayoutData } from "@/lib/markdown";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";

// Font Serif cổ điển hỗ trợ 100% tiếng Việt chuẩn xác cho tiêu đề "Hòn Ngọc Viễn Đông" và chữ in báo xưa
const lora = Lora({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

// Font Sans chuyên biệt cho tiếng Việt (Be Vietnam Pro) chuẩn xác dấu thanh
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

// Font Monospace / Máy đánh chữ công văn hỗ trợ 100% tiếng Việt (Roboto Mono)
const robotoMono = Roboto_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a1614",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Jye's Portfolio",
    template: "%s | Jye's Portfolio",
  },
  description:
    "Jye's Portfolio – Hồi ký Tem Phiếu & Hòn Ngọc Viễn Đông. Không gian số lưu giữ ký ức ba miền và kiến trúc phần mềm cao cấp.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layoutData = await getLayoutData();

  return (
    <html
      lang="vi"
      className={`dark ${beVietnamPro.variable} ${lora.variable} ${robotoMono.variable}`}
    >
      <body className="relative min-h-screen bg-baocap-sepia font-sans text-baocap-paper antialiased selection:bg-baocap-brick/40 selection:text-baocap-paper">
        <ReactLenis
          root
          options={{
            lerp: 0.08,
            duration: 1.2,
            smoothWheel: true,
          }}
        >
          <AudioProvider
            initialTracks={layoutData?.cassette?.tracks}
            defaultVolume={layoutData?.cassette?.default_volume}
          >
            {/* Lớp phủ hạt nhiễu phim & vết ố báo cũ (60fps optimized) */}
            <FilmGrainOverlay />

            {/* Khung layout bao gồm Navbar, Main Content và Footer */}
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar items={layoutData?.navbar} />
              <main className="flex-1">{children}</main>
              <Footer data={layoutData?.footer} navItems={layoutData?.navbar} />
            </div>

            {/* Widget đài Cassette cố định góc màn hình */}
            <StickyCassettePlayer />
          </AudioProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
