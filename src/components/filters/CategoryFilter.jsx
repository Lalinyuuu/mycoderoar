import { useEffect, useState } from "react";
import { PostService } from '@/services';

export default function CategoryFilter({ category, setCategory }) {
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Use public categories endpoint (no auth required)
        const res = await PostService.getCategories({ limit: 100 });
        const validCategories = (res?.categories || [])
          .filter(cat => cat && cat.name)
          .map(cat => cat.name);
        
        // Always include "All" as first option
        setCategories(["All", ...validCategories]);
      } catch (error) {
        // Fallback to default categories if API fails
        setCategories([
          "All",
          "Guides",
          "Lore",
          "Beginner",
          "Crafting",
          "Builds",
          "PvP",
          "MVP",
          "Events",
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 w-full">
        <div className="px-3 py-2 rounded-lg text-sm font-semibold bg-light-1 border-2 border-purple-3 text-purple-7 whitespace-nowrap animate-pulse flex-shrink-0">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {categories.map((c) => {
        const active = c === category;
        return (
          <button
            key={c}
            disabled={active}
            onClick={() => setCategory(c)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap flex items-center",
              active
                ? "bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 shadow-lg cursor-not-allowed border-2 border-purple-6"
                : "bg-light-1 text-purple-7 border-2 border-purple-3 hover:bg-gradient-to-r hover:from-purple-2 hover:to-emerald-1 hover:text-purple-8 hover:border-purple-5 hover:shadow-md hover:scale-105",
            ].join(" ")}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}