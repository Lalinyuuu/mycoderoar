export const AUTHORS = {
  thompson: {
    id: "thompson",
    name: "Thompson P.",
    avatar:
      "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg",
    bio1:
      "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.",
    bio2:
      "When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
  },
};

export const DEFAULT_AUTHOR = AUTHORS.thompson;

export function getAuthorById(id) {
  if (!id) return null;
  const key = String(id).toLowerCase();
  return AUTHORS[key] || null;
}