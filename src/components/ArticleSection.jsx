import React, { useState } from "react";
import { BlogCard } from "./blogcard";
import { blogPosts } from "../data/blogPosts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const categories = ["Highlight", "Cat", "Inspiration", "General"];

export default function ArticleSection() {
  
  const [category, setCategory] = useState("Highlight");

  
  const filteredPosts =
    category === "Highlight"
      ? blogPosts
      : blogPosts.filter((p) => p.category === category);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest articles</h1>

      
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 w-full">
       
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-3 pr-10 rounded-lg border text-muted-foreground"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        
        <div className="hidden md:flex space-x-2">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                disabled={isActive}
                onClick={() => setCategory(cat)}
                className={[
                  "px-4 py-3 rounded-sm text-sm font-medium transition-colors",
                  "text-muted-foreground",
                  isActive
                    ? "bg-[#DAD6D1] cursor-not-allowed"
                    : "bg-muted hover:bg-muted/70",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        
        <div className="md:hidden w-full">
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>
    </section>
  );
}