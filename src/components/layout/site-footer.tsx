import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { CuteCatMascot, CuteSparkle } from "@/components/ui/cute-illustrations";
import { Separator } from "@/components/ui/separator";

const FOOTER_GROUPS = [
  {
    title: "Learning Tracks",
    links: [
      { label: "Problems Vault", href: "/problems" },
      { label: "Online Compilers", href: "/online-compiler" },
      { label: "Algorithm Patterns", href: "/patterns" },
      { label: "Structured Roadmaps", href: "/roadmaps" },
      { label: "Topic Explorer", href: "/topics" },
      { label: "Programming Languages", href: "/languages/python" },
    ],
  },
  {
    title: "Interview Sets",
    links: [
      { label: "Blind 75 Sheet", href: "/blind-75" },
      { label: "Grind 169 Sheet", href: "/grind-169" },
      { label: "Company Question Sets", href: "/companies" },
      { label: "System Design Concepts", href: "/system-design" },
      { label: "Interview Guides", href: "/guides" },
    ],
  },
  {
    title: "CampusLoop",
    links: [
      { label: "CampusLoop Space", href: "https://campusloop.space", external: true },
      { label: "Academic Notes Vault", href: "https://campusloop.space/academics", external: true },
      { label: "About DSALoop", href: "/about" },
      { label: "Technical Glossary", href: "/glossary" },
      { label: "Visual Sitemap", href: "/sitemap-html" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/50 text-foreground select-none">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand info */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="size-9 rounded-2xl bg-canvas/40 border border-border/70 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 shadow-2xs">
                <CuteCatMascot size={32} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-black tracking-tight text-foreground">
                  DSA<span className="text-primary font-black">Loop</span>
                </span>
                <span className="text-[10px] font-bold text-muted-foreground tracking-tight">
                  by{" "}
                  <a
                    href="https://campusloop.space/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                  >
                    https://campusloop.space/
                  </a>
                </span>
              </div>
            </Link>

            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
              <strong>DSALoop by https://campusloop.space/</strong> is a clean, minimal coding interview and system design platform built for students and engineers.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <GraduationCap className="size-3.5 text-primary" />
              <span>Free student DSA learning &amp; placement preparation tool</span>
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
              <a
                href="https://campusloop.space/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 font-bold"
              >
                campusloop.space <ArrowUpRight className="size-3" />
              </a>
              <span>•</span>
              <a
                href="https://github.com/campusloop-space/dsaloop"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Grouped Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-black uppercase tracking-wider text-foreground">
                  {group.title}
                </p>
                <ul className="mt-3.5 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        target={"external" in link && link.external ? "_blank" : undefined}
                        rel={"external" in link && link.external ? "noreferrer" : undefined}
                        className="group inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span>{link.label}</span>
                        {"external" in link && link.external ? (
                          <ArrowUpRight className="size-3 text-muted-foreground/60" />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} DSALoop by <a href="https://campusloop.space/" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary font-bold underline-offset-2 hover:underline">https://campusloop.space/</a>. Open-source placement preparation.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/about/attribution" className="hover:text-foreground transition-colors">
              Attribution
            </Link>
            <Link href="/sitemap-html" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
