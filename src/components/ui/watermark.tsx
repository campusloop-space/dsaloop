import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { CuteSparkle } from "@/components/ui/cute-illustrations";
import { cn } from "@/lib/utils/cn";

interface WatermarkProps {
  className?: string;
  variant?: "pill" | "banner" | "card" | "inline";
  subtext?: string;
}

export function Watermark({
  className,
  variant = "pill",
  subtext = "Open student tech placement & interview workspace",
}: WatermarkProps) {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "w-full rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <CuteSparkle className="size-3.5 text-primary" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-medium text-foreground">
            <span className="font-heading font-black tracking-tight">
              DSA<span className="text-primary font-black">Loop</span>
            </span>
            <span className="text-muted-foreground">by</span>
            <a
              href="https://campusloop.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline inline-flex items-center gap-0.5"
            >
              https://campusloop.space/
              <ArrowUpRight className="size-3" />
            </a>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground hidden sm:inline">{subtext}</span>
          </div>
        </div>

        <a
          href="https://campusloop.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-hover transition-colors ml-auto sm:ml-0"
        >
          <span>Visit CampusLoop</span>
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border/80 bg-card/70 p-5 sm:p-6 shadow-2xs backdrop-blur-sm",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-black tracking-tight text-foreground">
                DSA<span className="text-primary font-black">Loop</span>
              </span>
              <span className="text-xs text-muted-foreground">by</span>
              <a
                href="https://campusloop.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-xs text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline inline-flex items-center gap-0.5"
              >
                https://campusloop.space/
                <ArrowUpRight className="size-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
              {subtext}. Pattern-first solutions, high-frequency company tracks, and comprehensive system design notes with zero fluff.
            </p>
          </div>

          <a
            href="https://campusloop.space/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3.5 text-xs font-bold transition-all shrink-0 active:scale-95"
          >
            <GraduationCap className="size-3.5" />
            <span>CampusLoop Network</span>
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", className)}>
        <span>DSALoop by</span>
        <a
          href="https://campusloop.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-foreground hover:text-primary underline-offset-4 hover:underline inline-flex items-center gap-0.5"
        >
          https://campusloop.space/
          <ArrowUpRight className="size-2.5" />
        </a>
      </span>
    );
  }

  // Default: pill
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-muted/40 hover:bg-muted/70 text-xs font-medium text-foreground transition-all shadow-2xs select-none",
        className
      )}
    >
      <CuteSparkle className="size-3 text-primary shrink-0" />
      <span className="font-heading font-black">
        DSA<span className="text-primary font-black">Loop</span>
      </span>
      <span className="text-muted-foreground text-[11px]">by</span>
      <a
        href="https://campusloop.space/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-[11px] text-foreground hover:text-primary transition-colors inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
      >
        https://campusloop.space/
        <ArrowUpRight className="size-2.5" />
      </a>
    </div>
  );
}
