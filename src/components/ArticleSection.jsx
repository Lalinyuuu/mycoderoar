import React from "react";
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
  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest articles</h1>

      
      <div className="flex justify-between items-center mb-6 w-full">
        {/* Desktop */}
        <div className="hidden md:flex space-x-2">
          {categories.map((cat, index) => (
            <button
              key={cat}
              className={`px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium ${
                index === 0 ? "bg-[#DAD6D1]" : "bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        
        <div className="md:hidden w-full">
          <Select defaultValue="Highlight">
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
        {blogPosts.map((post) => (
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