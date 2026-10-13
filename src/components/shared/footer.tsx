import React from "react";
import Link from "next/link";
import { Stamp, Radio, Compass, Disc3 } from "lucide-react";
import type { FooterData, NavItem } from "@/lib/markdown";

interface FooterProps {
  data?: FooterData;
  navItems?: NavItem[];
}

export function Footer({ data, navItems = [] }: FooterProps) {
  const socials = data?.socials ?? [];

  return (
    <footer className="border-t-2 border-[#3d342d] bg-[#141210] text-[#a39274]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Cột 1: Thông tin lưu trữ */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xs border border-baocap-brick bg-baocap-brick/20 text-baocap-brick">
                <Stamp className="h-4 w-4" />
              </div>
              <h4 className="font-serif text-lg font-black text-baocap-yellow">
                Jye&apos;s Portfolio
              </h4>
            </div>
            <p className="max-w-md font-serif text-xs text-[#8c785b] leading-relaxed">
              {data?.description ||
                "Không gian số ghi chép hồi ký tem phiếu, mỹ học Hòn Ngọc Viễn Đông và các công trình kỹ thuật Fullstack hiện đại trên nền tảng Next.js App Router."}
            </p>
            <div className="inline-block rounded-xs border border-dashed border-baocap-brick/70 bg-baocap-brick/10 px-2.5 py-1 font-mono text-[10px] text-baocap-paper">
              {data?.archive_badge ||
                "HỒ SƠ BẢO TỒN • PHÒNG LƯU TRỮ TRUNG ƯƠNG SỐ 1986"}
            </div>
          </div>

          {/* Cột 2: Danh mục chính */}
          <div className="space-y-2">
            <h5 className="font-mono text-xs font-bold tracking-widest text-baocap-yellow uppercase">
              {"// MỤC LỤC HỒ SƠ"}
            </h5>
            <ul className="space-y-1.5 font-mono text-xs">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-baocap-paper transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Tần số phát thanh */}
          <div className="space-y-2">
            <h5 className="font-mono text-xs font-bold tracking-widest text-baocap-yellow uppercase">
              {"// TRUYỀN THANH"}
            </h5>
            <div className="space-y-2 font-mono text-[11px] text-[#8c785b]">
              {socials.map((social, idx) => {
                const Icon = idx === 0 ? Radio : idx === 1 ? Compass : Disc3;
                const iconColor =
                  idx === 0
                    ? "text-baocap-brick"
                    : idx === 1
                      ? "text-baocap-yellow"
                      : "text-cyan-500";
                return (
                  <div key={social.label} className="flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                    <Link
                      href={social.href}
                      className="hover:text-baocap-paper transition-colors"
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chân trang phân cách */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#3d342d] pt-6 font-mono text-[10px] text-[#8c785b] sm:flex-row">
          <p>{data?.copyright || "© 1986 – 2026 Jye's Portfolio. Giữ toàn quyền lưu trữ văn bản."}</p>
          <p className="text-[#5c4f3d]">{data?.location || "TCVN 1986 • HÒN NGỌC VIỄN ĐÔNG"}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
