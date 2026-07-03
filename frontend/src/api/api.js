import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
// ensure baseRoot is the server root (no trailing /api)
const baseRoot = raw.endsWith("/api") ? raw.replace(/\/api$/, "") : raw.replace(/\/$/, "");
// ensure baseURL includes /api suffix
const baseURL = raw.endsWith("/api") ? raw : `${baseRoot}/api`;

const api = axios.create({
  baseURL,
});

export { baseRoot };
export default api;