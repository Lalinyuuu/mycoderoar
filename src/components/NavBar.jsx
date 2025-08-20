import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-900">
        hh<span className="text-green-500">.</span>
      </div>

     
      <div className="hidden md:flex space-x-4">
        <button className="px-4 py-2 rounded-full border border-black text-black">
          Log in
        </button>
        <button className="px-4 py-2 rounded-full bg-black text-white">
          Sign up
        </button>
      </div>

     
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 border rounded-md">
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Home</DropdownMenuItem>
            <DropdownMenuItem>Articles</DropdownMenuItem>
            <DropdownMenuItem>About</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log in</DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Sign up</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}