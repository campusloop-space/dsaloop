"use client";

import { useMemo, useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { SolutionFile } from "@/lib/schema/types";

// Import Prism and languages
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";

function getPrismGrammar(langSlug: string) {
  const slug = langSlug.toLowerCase();
  if (slug === "cpp" || slug === "c++") return Prism.languages.cpp;
  if (slug === "python" || slug === "python3" || slug === "py") return Prism.languages.python;
  if (slug === "c") return Prism.languages.c;
  if (slug === "typescript" || slug === "ts") return Prism.languages.typescript;
  if (slug === "javascript" || slug === "js") return Prism.languages.javascript;
  return Prism.languages.clike;
}

export function CodeTabs({
  solutions,
  defaultLang,
}: {
  solutions: Record<string, SolutionFile>;
  defaultLang?: string;
}) {
  const langs = useMemo(() => Object.keys(solutions), [solutions]);
  const [active, setActive] = useState(
    defaultLang && solutions[defaultLang] ? defaultLang : langs[0] ?? ""
  );
  const [copied, setCopied] = useState(false);
  const [mounted] = useState(() => typeof window !== "undefined");

  const sol = solutions[active];

  const highlightedHtml = useMemo(() => {
    if (!sol) return "";
    if (!mounted) return sol.code;
    const grammar = getPrismGrammar(active);
    if (!grammar) return sol.code;
    return Prism.highlight(sol.code, grammar, active);
  }, [sol, active, mounted]);

  if (langs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No multi-language solutions loaded for this problem yet.
      </p>
    );
  }

  async function copy() {
    if (!sol) return;
    try {
      const commentPrefix = active.startsWith("py") ? "#" : "//";
      const codeWithWatermark = `${sol.code}\n\n${commentPrefix} Solved on DSALoop by https://campusloop.space/\n`;
      await navigator.clipboard.writeText(codeWithWatermark);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="w-full min-w-0 max-w-full rounded-2xl border border-border/80 overflow-hidden bg-code-bg text-slate-100 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-3 py-2">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Language">
          {langs.map((lang) => (
            <button
              key={lang}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                active === lang
                  ? "bg-white/20 text-white shadow-2xs"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setActive(lang)}
            >
              {solutions[lang].language}
            </button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-white/10 h-8 rounded-lg"
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain whitespace-pre p-4 text-[13px] leading-relaxed font-mono max-h-[32rem]">
        {mounted ? (
          <code
            className={`language-${active}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code>{sol?.code}</code>
        )}
      </pre>
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-black/40 border-t border-white/5 text-[10px] text-slate-400 select-none">
        <span className="font-mono text-slate-500">
          {solutions[active]?.language}
        </span>
        <a
          href="https://campusloop.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors text-slate-400 hover:underline inline-flex items-center gap-1"
        >
          <span>DSALoop by https://campusloop.space/</span>
        </a>
      </div>
    </div>
  );
}
