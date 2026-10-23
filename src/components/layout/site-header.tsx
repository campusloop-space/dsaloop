"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CuteSparkle } from "@/components/ui/cute-illustrations";
import { PWAInstallButton } from "@/components/pwa-install-button";
import { CampusLoopUserButton } from "@/components/auth/campusloop-user-button";
import { cn } from "@/lib/utils";

// Minimal, essential navigation
const NAV_LINKS = [
  { href: "/problems", label: "Problems" },
  { href: "/online-compiler", label: "Compiler" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-2 z-50 px-3 sm:px-6 max-w-5xl mx-auto w-full select-none">
      <header className="flex h-12 items-center justify-between px-3 sm:px-4 rounded-full border border-border/80 bg-background/90 dark:bg-background/85 backdrop-blur-xl shadow-2xs transition-all">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 shrink-0"
          aria-label="DSALoop home"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all duration-300 group-hover:scale-105 shadow-2xs">
            <CuteSparkle className="size-3.5 text-primary" />
          </div>
          <span className="font-heading text-base font-black tracking-tight text-foreground">
            DSA<span className="text-primary font-black">Loop</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1 bg-muted/40 p-0.5 rounded-full border border-border/40"
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
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Link
            href="/search"
            aria-label="Search problems, topics, roadmaps"
            title="Search (Press /)"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Search className="size-4" />
          </Link>

          <ThemeToggle />

          <CampusLoopUserButton variant="header" />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground md:hidden transition-colors cursor-pointer ml-1"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="mt-2 p-3 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-md md:hidden space-y-2 animate-in fade-in-0 zoom-in-95">
          <nav className="flex flex-col gap-1">
            <div className="pb-2 border-b border-border/50 flex justify-center">
              <CampusLoopUserButton variant="header" />
            </div>
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
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center justify-between"
            >
              <span>Search Problems</span>
              <Search className="size-3.5" />
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
