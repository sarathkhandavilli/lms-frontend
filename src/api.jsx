import axios from "axios";

export const BASE_URL = "https://lms-backend-cr9o.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;