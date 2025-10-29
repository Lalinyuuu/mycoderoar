export const AUTHORS = {
    mvphunter: {
      id: "mvphunter",
      name: "MVP Hunter",
      avatar: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=240&h=240&fit=crop",
      tagline: "Ragnarok Veteran & Guide Writer",
      bios: [
        "A seasoned adventurer with over a decade of experience exploring Midgard. Specializing in MVP hunting strategies, War of Emperium tactics, and comprehensive job class guides.",
        "When not conquering dungeons, I help new players master game mechanics and build their legendary characters in the Rune-Midgarts Kingdom.",
      ],
    },
    gamemaster: {
      id: "gamemaster",
      name: "Game Master",
      avatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=240&h=240&fit=crop",
      tagline: "Ragnarok Online Expert",
      bios: [
        "Veteran player and community guide creator focused on helping adventurers navigate the world of Ragnarok Online.",
        "Passionate about sharing knowledge on builds, quests, and strategies for all skill levels.",
      ],
    },
  };
  
  export const DEFAULT_AUTHOR = AUTHORS.mvphunter;
  
  export function getAuthorById(id) {
    return AUTHORS[id] || DEFAULT_AUTHOR;
  }