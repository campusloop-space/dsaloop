"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import { cn } from "@/lib/utils";

export function MarkdownBody({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  return (
    <div
      className={cn("prose max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

