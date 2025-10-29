import { FALLBACK_AVATAR } from "@/constants/images";

export function normalizeAuthor(author) {
  if (typeof author === "string") {
    return { name: author, avatar: FALLBACK_AVATAR };
  }
  
  // Check if avatar URL is actually a post image (should not be used as avatar)
  let avatarUrl = author?.avatar || FALLBACK_AVATAR;
  if (avatarUrl && avatarUrl.includes('article-photo/')) {
    avatarUrl = FALLBACK_AVATAR;
  }
  
  return {
    name: author?.name || "MVP Hunter",
    avatar: avatarUrl,
  };
}