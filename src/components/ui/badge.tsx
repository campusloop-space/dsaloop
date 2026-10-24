import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "easy" | "medium" | "hard" | "outline" | "muted" | "secondary";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-normal border transition-colors leading-normal",
        variant === "default" && "bg-primary/10 text-primary border-primary/20",
        variant === "secondary" && "bg-secondary text-primary border-primary-soft-border",
        variant === "easy" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
        variant === "medium" && "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
        variant === "hard" && "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
        variant === "outline" && "border-border/80 bg-card/60 text-muted-foreground",
        variant === "muted" && "bg-muted/80 text-muted-foreground border-border/40",
        className
      )}
      {...props}
    />
  );
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  const variant =
    difficulty === "Easy" ? "easy" : difficulty === "Medium" ? "medium" : "hard";
  return <Badge variant={variant}>{difficulty}</Badge>;
}
