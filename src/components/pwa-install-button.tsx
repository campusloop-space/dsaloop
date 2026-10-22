"use client";

import { useEffect, useState } from "react";
import { Download, Check, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton({
  className,
  variant = "button",
}: {
  className?: string;
  variant?: "button" | "minimal" | "footer";
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Check if already running standalone
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show fallback guide for iOS / browser where prompt is not programmatically triggered
      setShowGuideModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 text-[11px] text-muted-foreground", className)}>
        <Check className="size-3.5 text-emerald-500" />
        <span>DSALoop Installed</span>
      </div>
    );
  }

  return (
    <>
      {variant === "footer" ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-foreground bg-muted/50 hover:bg-muted border border-border/60 hover:border-primary/40 transition-all cursor-pointer shadow-2xs group",
            className
          )}
          title="Install DSALoop as a desktop or mobile application"
        >
          <Smartphone className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
          <span>Install App</span>
        </button>
      ) : variant === "minimal" ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className={cn(
            "p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer",
            className
          )}
          title="Install App"
        >
          <Download className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-foreground bg-card hover:bg-muted/70 border border-border shadow-2xs transition-all cursor-pointer",
            className
          )}
        >
          <Download className="size-3.5 text-primary" />
          <span>Install DSALoop</span>
        </button>
      )}

      {/* Instructional modal for iOS / manual browsers */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold">Install DSALoop</h3>
                <p className="text-[11px] text-muted-foreground">Add to Home Screen or Desktop</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed my-4">
              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground mb-1">On iOS (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Tap the <strong>Share</strong> button at bottom</li>
                  <li>Scroll and tap <strong>Add to Home Screen</strong></li>
                </ol>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground mb-1">On Chrome / Edge / Android:</p>
                <p className="text-[11px]">
                  Click the <strong>Install</strong> icon on the right side of the URL bar, or open the browser menu (⋮) and tap <strong>Install App</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
