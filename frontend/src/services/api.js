import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
      path === "/products" ||
      path.startsWith("/product/");

    const isAuthRequest = url?.includes("/auth/me");

    // 401 Unauthorized
    if (status === 401) {
      console.log("Unauthorized");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!isAuthRequest && !isPublicPath && path !== "/login") {
        window.location.href = "/login";
      }
    }

    // 403 Forbidden
    if (status === 403) {
      if (message === "Waiting for admin approval") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (path !== "/login") {
          window.location.href = "/login";
        }
      }

      if (message === "Access denied") {
        console.log("Access denied");
      }
    }

    return Promise.reject(error);
  }
);

export default api;