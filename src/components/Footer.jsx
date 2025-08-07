import React from "react";
import { Linkedin, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f4] text-gray-800 py-6 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Get in touch + Icons */}
        <div className="flex items-center gap-4">
          <span className="text-sm">Get in touch</span>
          <div className="flex gap-3 text-gray-700">
            <Linkedin className="w-5 h-5" />
            <Github className="w-5 h-5" />
            <Globe className="w-5 h-5" />
          </div>
        </div>

        {/* Right: Home page */}
        <a href="#" className="text-sm underline">
          Home page
        </a>
      </div>
    </footer>
  );
}