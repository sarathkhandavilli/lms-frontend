import axios from "axios";

export const BASE_URL = "http://localhost:https://lms-backend-cr9o.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;