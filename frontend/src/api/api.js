import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL,
});

export default api;