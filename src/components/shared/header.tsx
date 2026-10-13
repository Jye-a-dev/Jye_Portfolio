"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Stamp, Menu, X, FileText, FolderGit2, User, Send } from "lucide-react";
import type { NavItem } from "@/lib/markdown";

interface NavbarProps {
  items?: NavItem[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Radio,
  "/projects": FolderGit2,
  "/experiences": FileText,
  "/about": User,
  "/about/index": User,
  "/contact": Send,
  "/contact/index": Send,
};

function getNavIcon(href: string) {
  return ICON_MAP[href] || Radio;
}

/**
 * Bubble Navbar (Thanh điều hướng dạng bong bóng nổi - Floating Pill)
 * Thiết kế bo tròn retro viền gạch bao cấp, hiệu ứng backdrop-blur và neon indicator.
 */
export function Navbar({ items = [] }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 flex w-full justify-center px-4 pointer-events-none">
      {/* Floating Bubble Pill Container */}
      <div className="relative pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 rounded-full border border-baocap-brick/40 bg-baocap-sepia/90 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 hover:border-baocap-brick">
        {/* Brand / Logo Bubble */}
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full border border-baocap-brick/30 bg-baocap-brick/15 px-2.5 py-1 text-baocap-brick transition-all duration-200 hover:scale-105 hover:bg-baocap-brick/25"
        >
          <Stamp className="h-4 w-4 text-baocap-brick" />
          <span className="font-serif text-xs font-black tracking-wider text-baocap-yellow">
            JYE
          </span>
        </Link>

        {/* Desktop Navigation Bubble Pills */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "border border-baocap-brick bg-baocap-brick text-baocap-yellow shadow-[0_0_16px_rgba(168,60,39,0.5)]"
                    : "text-[#a39274] hover:bg-[#2b241e]/70 hover:text-baocap-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Trạng thái công văn / Số hiệu */}
        <div className="hidden items-center sm:flex">
          <span className="rounded-full border border-[#3d342d] bg-baocap-sepia/80 px-2.5 py-1 font-mono text-[10px] font-bold text-[#8c785b]">
            1986/VN
          </span>
        </div>

        {/* Mobile menu trigger button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Mở danh mục điều hướng"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3d342d] bg-[#211c19] text-baocap-paper transition-colors hover:border-baocap-brick md:hidden"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Mobile Floating Bubble Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-baocap-brick/40 bg-baocap-sepia/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl md:hidden">
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const Icon = getNavIcon(item.href);
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-full px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "border border-baocap-brick bg-baocap-brick text-baocap-yellow shadow-[0_0_12px_rgba(168,60,39,0.4)]"
                        : "text-[#a39274] hover:bg-[#2b241e]/70 hover:text-baocap-paper"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-baocap-yellow" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export const Header = Navbar;
export default Navbar;
