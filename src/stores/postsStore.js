import { create } from 'zustand';

export const usePostsStore = create((set) => ({
  posts: [],
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (id, updatedPost) => set((state) => {
    const updatedPosts = state.posts.map(p => p.id === id ? { ...p, ...updatedPost } : p);
    return { posts: updatedPosts };
  }),
  
  removePost: (id) => set((state) => ({ 
    posts: state.posts.filter(p => p.id !== id) 
  })),
}));