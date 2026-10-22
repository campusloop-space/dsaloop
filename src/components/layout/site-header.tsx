"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass, Layers3, Menu, Route, Search, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CuteSparkle } from "@/components/ui/cute-illustrations";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/problems", label: "Problems" },
  { href: "/online-compiler", label: "Compilers" },
  { href: "/companies", label: "Companies" },
  { href: "/system-design", label: "System Design" },
  { href: "/patterns", label: "Patterns" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/blind-75", label: "Blind 75" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-2 sm:top-2.5 z-50 px-3 sm:px-6 max-w-6xl mx-auto w-full select-none">
      {/* Top watermark banner */}
      <div className="hidden sm:flex items-center justify-between px-3 py-1 mb-1 rounded-full bg-card/60 backdrop-blur-md border border-border/40 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CuteSparkle className="size-3 text-primary shrink-0" />
          <span className="font-heading font-black text-foreground">
            DSA<span className="text-primary font-black">Loop</span>
          </span>
          <span>by</span>
          <a
            href="https://campusloop.space/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline inline-flex items-center gap-0.5"
          >
            https://campusloop.space/
            <ArrowUpRight className="size-2.5" />
          </a>
          <span className="text-muted-foreground/60">•</span>
          <span className="hidden md:inline">Open-source DSA problem bank &amp; 28-chapter system design primer</span>
        </div>
        <a
          href="https://campusloop.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
        >
          <span>Visit CampusLoop</span>
          <ArrowUpRight className="size-2.5" />
        </a>
      </div>

      <header className="flex h-13 sm:h-14 items-center justify-between px-3 sm:px-5 rounded-full border border-border/80 bg-background/90 dark:bg-background/85 backdrop-blur-xl shadow-2xs transition-all">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 shrink-0"
          aria-label="DSALoop home"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex size-8 sm:size-8.5 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 shadow-2xs">
            <CuteSparkle className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-base sm:text-lg font-black tracking-tight text-foreground">
              DSA<span className="text-primary font-black">Loop</span>
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-tight px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/40">
              by campusloop.space
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/40"
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
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
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
            className="hidden sm:inline-flex items-center gap-2 h-8 px-3 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/40 transition-colors"
          >
            <Search className="size-3.5 text-muted-foreground" />
            <span>Search</span>
            <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-card border border-border text-muted-foreground">
              /
            </kbd>
          </Link>

          <Link
            href="/dashboard"
            aria-label="View learning progress"
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <Sparkles className="size-3.5 text-coral" />
            <span>Progress</span>
          </Link>

          <ThemeToggle />

          <Link
            href="/roadmaps/dsa-fundamentals"
            className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-3 sm:px-4 text-xs font-bold text-primary-foreground whitespace-nowrap active:scale-95 transition-all shadow-2xs"
          >
            <span>Start Route</span>
            <ArrowUpRight className="size-3 sm:size-3.5 shrink-0" />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="relative flex size-8 sm:size-8.5 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground lg:hidden transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="mt-2 p-3 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-md lg:hidden space-y-2.5 animate-in fade-in-0 zoom-in-95">
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-2.5 min-h-[42px] rounded-xl bg-muted/40 hover:bg-muted/80 text-xs font-bold text-foreground transition-all cursor-pointer"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-border/40">
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 p-2 min-h-[40px] rounded-xl bg-muted/30 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Search className="size-3.5" />
              <span>Search</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 p-2 min-h-[40px] rounded-xl bg-muted/30 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="size-3.5 text-coral" />
              <span>Progress</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
