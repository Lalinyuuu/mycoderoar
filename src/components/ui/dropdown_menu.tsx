import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownMenu(props: any) { return <DropdownMenuPrimitive.Root {...props} />; }
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export function DropdownMenuContent({ className = "", ...props }: any) {
  return (
    <DropdownMenuPrimitive.Content
      sideOffset={4}
      className={
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md " + className
      }
      {...props}
    />
  );
}
export function DropdownMenuItem({ className = "", ...props }: any) {
  return (
    <DropdownMenuPrimitive.Item
      className={"cursor-pointer select-none rounded-sm px-3 py-2 text-sm outline-none hover:bg-gray-100 " + className}
      {...props}
    />
  );
}
export const DropdownMenuSeparator = (props: any) => (
  <DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200" {...props} />
);