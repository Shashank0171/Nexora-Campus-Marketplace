import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
   "https://nexora-fullstack-1.onrender.com/api",
  withCredentials: true,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const url = error.config?.url;

    const path = window.location.pathname;

    const isPublicPath =
      path === "/" ||
      path === "/login" ||
      path === "/register" ||
      path.startsWith("/product/") ||
      path === "/products";

    const isAuthRequest = url?.includes("/auth/me");

    // =======================
    // 401 - Unauthorized
    // =======================
    if (status === 401) {
      console.log("Unauthorized");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!isAuthRequest && !isPublicPath && path !== "/login") {
        window.location.href = "/login";
      }
    }

    // =======================
    // 403 - Forbidden (ONLY backend messages)
    // =======================
    if (status === 403) {
      if (message === "Waiting for admin approval") {
        console.log("Account pending approval");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (path !== "/login") {
          window.location.href = "/login";
        }
      }

      if (message === "Access denied") {
        console.log("Access denied - role mismatch");
      }
    }

    return Promise.reject(error);
  }
);

export default api;