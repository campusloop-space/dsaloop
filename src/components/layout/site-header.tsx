"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Code2, Menu, Search, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CuteSparkle } from "@/components/ui/cute-illustrations";
import { PWAInstallButton } from "@/components/pwa-install-button";
import { cn } from "@/lib/utils";

// Minimal, focused navigation
const NAV_LINKS = [
  { href: "/problems", label: "Problems" },
  { href: "/companies", label: "Companies" },
  { href: "/system-design", label: "System Design" },
  { href: "/online-compiler", label: "Compiler" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-2 z-50 px-3 sm:px-6 max-w-6xl mx-auto w-full select-none">
      <header className="flex h-12 sm:h-13 items-center justify-between px-3 sm:px-5 rounded-full border border-border/80 bg-background/90 dark:bg-background/85 backdrop-blur-xl shadow-2xs transition-all">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 shrink-0"
          aria-label="DSALoop home"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex size-7 sm:size-7.5 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:scale-105 shadow-2xs">
            <CuteSparkle className="size-3.5 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-base sm:text-lg font-black tracking-tight text-foreground">
              DSA<span className="text-primary font-black">Loop</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-tight px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/40 hidden sm:inline-block">
              by campusloop.space
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/40"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/search"
            aria-label="Search problems, patterns, roadmaps"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/40 transition-colors"
          >
            <Search className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline font-mono text-[9px] px-1 py-0.5 rounded bg-card border border-border text-muted-foreground">
              /
            </kbd>
          </Link>

          <ThemeToggle />

          <Link
            href="/problems/two-sum/practice"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-3 text-xs font-bold text-primary-foreground whitespace-nowrap active:scale-95 transition-all shadow-2xs"
          >
            <Code2 className="size-3.5" />
            <span>Practice</span>
            <span className="px-1 py-0.2 rounded-full text-[9px] bg-white/20 uppercase tracking-wider font-extrabold hidden sm:inline">
              Beta
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground md:hidden transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="mt-2 p-3 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-md md:hidden space-y-2.5 animate-in fade-in-0 zoom-in-95">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/problems/two-sum/practice"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center justify-between"
            >
              <span>Practice Workspace</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/20 font-bold uppercase">
                Beta
              </span>
            </Link>

            <div className="pt-2 border-t border-border/50 flex items-center justify-between px-1">
              <PWAInstallButton variant="footer" className="w-full justify-center" />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
