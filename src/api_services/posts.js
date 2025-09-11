import api from "./axios.js";

export async function getPosts(params) {
  const res = await api.get("/posts", { params });
  return res.data;
}