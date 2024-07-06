import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const titleVariants = cva("font-extrabold", {
  variants: {
    variant: {
      default: "text-white",
      dark: "text-black",
    },
    size: {
      default: "text-5xl",
      sm: "text-xl",
      lg: "text-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Link href="/">
        <h1
          className={cn(titleVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          TrackFinder
          <strong className="font-extrabold text-purple-800 text-6xl">.</strong>
        </h1>
      </Link>
    );
  }
);
Title.displayName = "Title";

export { Title, titleVariants };
