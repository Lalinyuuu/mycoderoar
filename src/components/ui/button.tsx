import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 shadow-md hover:from-purple-7 hover:to-purple-6 hover:shadow-lg",
        destructive:
          "bg-gradient-to-r from-error to-error text-white shadow-md hover:from-error hover:to-error hover:shadow-lg",
        outline:
          "border-2 border-purple-3 bg-light-1 text-purple-7 shadow-sm hover:bg-purple-1 hover:border-purple-5 hover:text-purple-8",
        secondary:
          "bg-gradient-to-r from-gray-6 to-gray-7 text-light-1 shadow-md hover:from-gray-7 hover:to-gray-8 hover:shadow-lg",
        ghost:
          "text-purple-7 hover:bg-purple-1 hover:text-purple-8",
        link: 
          "text-purple-7 underline-offset-4 hover:underline hover:text-purple-8",
        success:
          "bg-gradient-to-r from-emerald-5 to-emerald-6 text-white shadow-md hover:from-emerald-6 hover:to-emerald-7 hover:shadow-lg",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 px-3 gap-1.5 text-xs has-[>svg]:px-2.5",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // Build props object conditionally
  const buttonProps: any = {
    "data-slot": "button",
    className: cn(buttonVariants({ variant, size, className })),
    ...props
  };

  // Only add disabled if it's true
  if (disabled) {
    buttonProps.disabled = true;
  }

  return <Comp {...buttonProps} />
}

export { Button, buttonVariants }