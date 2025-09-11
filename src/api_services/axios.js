import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-post-project-api.vercel.app",
  timeout: 10000,
});

export default api;