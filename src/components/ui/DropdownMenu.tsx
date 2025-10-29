import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownMenu(props: any) { return <DropdownMenuPrimitive.Root {...props} />; }
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export function DropdownMenuContent({ className = "", ...props }: any) {
  return (
    <DropdownMenuPrimitive.Content
      sideOffset={4}
      className={
        "z-50 min-w-[8rem] overflow-hidden rounded-2xl border bg-white p-2 shadow-lg " + className
      }
      {...props}
    />
  );
}
export function DropdownMenuItem({ className = "", ...props }: any) {
  return (
    <DropdownMenuPrimitive.Item
      className={"cursor-pointer select-none rounded-xl px-3 py-2 text-sm outline-none text-gray-9 hover:bg-purple-1 hover:text-purple-6 focus:bg-purple-1 focus:text-purple-6 transition-colors " + className}
      {...props}
    />
  );
}
export const DropdownMenuSeparator = (props: any) => (
  <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-2" {...props} />
);