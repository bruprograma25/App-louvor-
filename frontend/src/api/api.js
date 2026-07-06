import axios from "axios";

const raw = import.meta.env.VITE_API_URL || "/api";
const isAbsoluteUrl = raw.startsWith("http://") || raw.startsWith("https://");
const baseRoot = isAbsoluteUrl
  ? raw.endsWith("/api")
    ? raw.replace(/\/api$/, "")
    : raw.replace(/\/$/, "")
  : "";
const baseURL = isAbsoluteUrl ? (raw.endsWith("/api") ? raw : `${baseRoot}/api`) : raw;

const api = axios.create({
  baseURL,
});

export { baseRoot };
export default api;