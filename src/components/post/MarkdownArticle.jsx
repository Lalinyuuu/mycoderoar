// src/components/post/MarkdownArticle.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

export default function MarkdownArticle({ children }) {
  return (
    <div
      className={[
        "prose max-w-none prose-neutral",
        // Headings
        "prose-h1:text-4xl prose-h1:font-extrabold prose-h1:leading-tight prose-h1:text-dark-1",
        "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-dark-2",
        "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-dark-3",
        // Paragraphs & text
        "prose-p:text-dark-2 prose-p:leading-relaxed prose-p:my-4",
        // Lists
        "prose-ul:my-4 prose-ul:ml-4 prose-li:my-1 prose-li:text-dark-2",
        "prose-ol:my-4 prose-ol:ml-4",
        // Links
        "prose-a:text-purple-6 prose-a:font-medium hover:prose-a:text-purple-7 prose-a:no-underline hover:prose-a:underline",
        // Inline code
        "prose-code:bg-light-2 prose-code:text-purple-7 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm",
        // Code blocks
        "prose-pre:bg-dark-1 prose-pre:text-light-1 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-md",
        "prose-pre:border prose-pre:border-dark-3",
        // Tables
        "prose-table:my-6 prose-table:w-full prose-table:border-collapse",
        "prose-thead:bg-light-2 prose-thead:border-b-2 prose-thead:border-light-3",
        "prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-dark-2",
        "prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-light-3",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-purple-4 prose-blockquote:bg-light-2/60 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic",
        // Images
        "prose-img:rounded-xl prose-img:shadow-md prose-img:my-6",
        // Horizontal rule
        "prose-hr:my-8 prose-hr:border-light-3",
      ].join(" ")}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}