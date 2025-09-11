import api from "./axios.js";
import { getAuthorById, DEFAULT_AUTHOR } from "@/data/authors";

export async function getPosts(params = {}) {
  const res = await api.get("/posts", { params });
  const data = res.data || {};

  const posts = (data.posts || []).map((p) => {
    const authorFromId = p.authorId ? getAuthorById(p.authorId) : null;
    const authorFromObj =
      p.author && p.author.name ? p.author : null;

    const author = authorFromObj || authorFromId || DEFAULT_AUTHOR;

    const displayDate = p.date
      ? new Date(p.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";

    return { ...p, author, displayDate };
  });

  return { ...data, posts };
}