import { Linkedin, Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-1 text-light-1 py-6 border-t border-dark-3">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-light-3">Get in touch</span>
          <div className="flex gap-3 text-light-3 hover:text-purple-2 transition-colors">
            <Linkedin className="w-5 h-5" />
            <Github className="w-5 h-5" />
            <Globe className="w-5 h-5" />
          </div>
        </div>
        <a href="/" className="text-sm underline text-purple-2 hover:text-purple-1 transition-colors">Home page</a>
      </div>
    </footer>
  );
}