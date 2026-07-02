const localUrl = import.meta.env.VITE_API_URL;
const prodUrl = import.meta.env.VITE_API_URL_PROD;

export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? localUrl
    : prodUrl;
