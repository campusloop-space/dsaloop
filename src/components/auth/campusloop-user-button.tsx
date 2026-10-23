"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  GraduationCap,
  LogOut,
  User,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CampusLoopUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  studentVerified?: boolean;
  college?: string | null;
}

export function CampusLoopUserButton({
  variant = "header",
}: {
  variant?: "header" | "workspace" | "compact";
}) {
  const [user, setUser] = useState<CampusLoopUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch session on client
  useEffect(() => {
    let mounted = true;
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const session = await res.json();
          if (mounted && session?.user) {
            setUser(session.user);
          }
        }
      } catch {
        // Not authenticated or network error
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSession();

    // Close menu when clicking outside
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      mounted = false;
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignIn = () => {
    // Direct POST to CampusLoop OIDC sign-in
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signin/campusloop";
    document.body.appendChild(form);
    form.submit();
  };

  const handleSignOut = async () => {
    try {
      // Fetch CSRF token for Auth.js signOut
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json().catch(() => ({ csrfToken: "" }));

      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken }),
      });
      setUser(null);
      setMenuOpen(false);
      window.location.reload();
    } catch {
      window.location.href = "/api/auth/signout";
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-20 rounded-full bg-muted/40 animate-pulse border border-border/40" />
    );
  }

  // Logged Out: Show official "Continue with CampusLoop" button
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer",
          variant === "compact"
            ? "h-7 px-2.5 text-[11px] bg-card hover:bg-muted text-foreground border border-border/60"
            : variant === "workspace"
            ? "h-7.5 px-3 text-xs bg-card hover:bg-muted text-foreground border border-border/70"
            : "h-8 px-3 text-xs bg-card hover:bg-muted/80 text-foreground border border-border/80"
        )}
        title="Sign in with verified student account on CampusLoop"
      >
        <Image
          src="https://campusloop.space/oauth/icon.svg"
          alt="CampusLoop"
          width={14}
          height={14}
          className="size-3.5 shrink-0"
          unoptimized
        />
        <span className="font-semibold whitespace-nowrap">
          {variant === "header" ? "Sign In" : "CampusLoop"}
        </span>
      </button>
    );
  }

  // Logged In: Show user avatar, student verification, and dropdown menu
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full transition-all border border-border/70 bg-card hover:bg-muted/70 cursor-pointer shadow-2xs",
          variant === "compact" ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs"
        )}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={20}
            height={20}
            className="size-5 rounded-full object-cover border border-border"
            unoptimized
          />
        ) : (
          <div className="size-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] border border-primary/20">
            {user.name ? user.name[0].toUpperCase() : <User className="size-3" />}
          </div>
        )}

        <span className="font-bold text-foreground max-w-[100px] truncate hidden sm:inline">
          {user.name || "Student"}
        </span>

        {user.studentVerified && (
          <span
            className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"
            title="Verified College Student via CampusLoop"
          >
            <CheckCircle2 className="size-3" />
          </span>
        )}

        <ChevronDown className="size-3 text-muted-foreground ml-0.5" />
      </button>

      {/* Profile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-3 shadow-xl z-50 text-xs">
          {/* User Info Header */}
          <div className="flex items-start gap-2.5 pb-3 border-b border-border/60">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={36}
                height={36}
                className="size-9 rounded-full object-cover border border-border"
                unoptimized
              />
            ) : (
              <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                {user.name ? user.name[0].toUpperCase() : <User className="size-4" />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground text-sm truncate">
                  {user.name || "CampusLoop User"}
                </span>
                {user.studentVerified && (
                  <span
                    className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    title="Verified Student"
                  >
                    <CheckCircle2 className="size-3.5 fill-emerald-500/10" />
                  </span>
                )}
              </div>
              {user.email && (
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              )}
              {user.college && (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-primary font-medium">
                  <GraduationCap className="size-3 shrink-0" />
                  <span className="truncate">{user.college}</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Status Badge */}
          <div className="my-2.5 p-2 rounded-xl bg-muted/50 border border-border/40 text-[11px]">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Student Status</span>
              {user.studentVerified ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Verified Student ✓
                </span>
              ) : (
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Unverified
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1">
            <a
              href="https://campusloop.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <span>CampusLoop Network</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <span>Sign Out</span>
              <LogOut className="size-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
