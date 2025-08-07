import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function ArticleSection() {
  return (
    <section className="bg-[#f5f5f4] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Latest articles</h2>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between bg-[#f0efec] rounded-xl px-4 py-3">
          {/* Category tabs */}
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <button className="bg-gray-300 text-black px-4 py-2 rounded-lg">
              Highlight
            </button>
            <button className="hover:text-black">Cat</button>
            <button className="hover:text-black">Inspiration</button>
            <button className="hover:text-black">General</button>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Input placeholder="Search" className="pr-10" />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden bg-[#f0efec] rounded-xl p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Input placeholder="Search" className="pr-10" />
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Select */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highlight">Highlight</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="inspiration">Inspiration</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}