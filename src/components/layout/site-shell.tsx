"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Clean full-screen view for dedicated IDEs
  const isPractice = pathname?.includes("/practice");
  const isCompiler = pathname === "/online-compiler" || pathname?.startsWith("/online-compiler/");

  if (isPractice || isCompiler) {
    return (
      <main id="main" className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[75vh]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
