import { apiFetch } from "../../lib/http";

export const listPosts = async () =>
  (await apiFetch("/api/posts")).json();

export const createPost = async (payload: { title: string; content: string }) =>
  (await apiFetch("/api/posts", { method: "POST", body: JSON.stringify(payload) })).json();

export const getPost = async (id: string) =>
  (await apiFetch(`/api/posts/${id}`)).json();

export const updatePost = async (id: string, payload: { title?: string; content?: string }) =>
  (await apiFetch(`/api/posts/${id}`, { method: "PUT", body: JSON.stringify(payload) })).json();

export const deletePost = async (id: string) =>
  apiFetch(`/api/posts/${id}`, { method: "DELETE" });