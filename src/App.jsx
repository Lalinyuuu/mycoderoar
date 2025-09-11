import { Routes, Route } from "react-router-dom";
import NavBar from "@/components/main_layouts/nav_bar.jsx";
import HeroSection from "@/components/main_layouts/hero_section.jsx";
import ArticleSection from "@/feature/posts/containers/article_section.jsx";
import ViewPostPage from "@/pages/post/view_post.jsx";
import NotFound from "@/pages/not_found.jsx";
import Footer from "@/components/main_layouts/footer.jsx";
import { Toaster } from "sonner";

function Home() {
  return (
    <>
      <HeroSection />
      <ArticleSection />
    </>
  );
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster richColors closeButton />
    </>
  );
}