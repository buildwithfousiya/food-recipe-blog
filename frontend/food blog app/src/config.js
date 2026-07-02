const getEnvUrl = (val, fallback) => {
  if (!val || val === "undefined" || val === "null" || val.trim() === "") {
    return fallback;
  }
  return val;
};

const localUrl = getEnvUrl(import.meta.env.VITE_API_URL, "http://localhost:5000");
const prodUrl = getEnvUrl(import.meta.env.VITE_API_URL_PROD, "https://food-recipe-blog-zeta.vercel.app");

export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? localUrl
    : prodUrl;

