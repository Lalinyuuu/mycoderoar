export const AUTHORS = {
    thompson: {
      id: "thompson",
      name: "Thompson P.",
      avatar:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=240&h=240&fit=crop&auto=format",
      tagline: "Pet enthusiast & freelance writer",
      bios: [
        "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.",
        "When i’m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
      ],
    },
  };
  
  export const DEFAULT_AUTHOR = AUTHORS.thompson;
  
  export function getAuthorById(id) {
    return AUTHORS[id] || DEFAULT_AUTHOR;
  }