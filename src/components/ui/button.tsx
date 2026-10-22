import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-2xs font-bold",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-2xs font-bold",
        secondary:
          "bg-secondary text-primary border border-primary-soft-border hover:bg-secondary/80 font-semibold shadow-2xs",
        outline:
          "border-border/80 bg-card text-foreground hover:bg-muted/60 font-medium shadow-2xs",
        ghost: "text-foreground hover:bg-muted/60 font-medium",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 font-semibold",
        pill: "rounded-full bg-secondary text-primary border border-primary-soft-border hover:bg-secondary/80 font-semibold shadow-2xs",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-9 gap-2 px-3.5 text-xs rounded-xl",
        sm: "h-8 gap-1.5 px-3 text-xs rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-7 gap-1 px-2.5 text-[11px] rounded-md [&_svg:not([class*='size-'])]:size-3",
        lg: "h-11 gap-2.5 px-5 text-sm font-bold rounded-2xl",
        icon: "size-9 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-7 rounded-md",
        "icon-lg": "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  children,
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement(child)) {
      throw new Error("Button with asChild requires a single React element child.");
    }

    const childClassName =
      typeof child.props === "object" &&
      child.props !== null &&
      "className" in child.props &&
      typeof child.props.className === "string"
        ? child.props.className
        : undefined;

    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      ...props,
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(classes, childClassName),
    });
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
