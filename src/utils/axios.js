import axios from "axios";

const isVercel =
  window.location.hostname.includes("vercel") ||
  window.location.hostname.includes("xalora-client");
const isCustomDomain = window.location.hostname.includes("xalora.one");

let baseURL = import.meta.env.VITE_API_URL || "";

if (!baseURL && (isVercel || isCustomDomain || import.meta.env.MODE === "production")) {
  if (isCustomDomain) {
    baseURL = "https://hireveu-server-758139154845.asia-south1.run.app";
  } else {
    baseURL = "";
  }
} else if (!baseURL) {
  baseURL = "http://localhost:8000";
}

const compilerURL = import.meta.env.VITE_COMPILER_URL || "http://localhost:3001";

const AUTH_EXCLUDED_ENDPOINTS = [
  "/api/v1/users/login",
  "/api/v1/users/register",
  "/api/v1/users/google-login",
  "/api/v1/users/refresh-token",
];

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/problems",
  "/quiz",
  "/internships",
  "/about",
  "/careers",
  "/blog",
  "/help-center",
  "/contact",
  "/community",
  "/status",
  "/roadmap",
  "/pricing",
]);

let isRefreshing = false;
let refreshSubscribers = [];

const clearAuthState = () => {
  if (window.__REDUX_STORE__) {
    window.__REDUX_STORE__.dispatch({ type: "user/forceLogout" });
  }
};

const redirectToLoginIfNeeded = () => {
  const currentPath = window.location.pathname;
  const isPublicPath =
    PUBLIC_PATHS.has(currentPath) ||
    currentPath.startsWith("/problems/") ||
    currentPath.startsWith("/quiz/") ||
    currentPath.startsWith("/internships/");

  if (!isPublicPath && currentPath !== "/login" && currentPath !== "/signup") {
    window.location.href = "/login";
  }
};

const notifyRefreshSuccess = () => {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve());
};

const notifyRefreshFailure = (error) => {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
};

const axiosInstance = axios.create({
  baseURL,
  timeout: 120000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers.Accept = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";
    const isExcluded = AUTH_EXCLUDED_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    if (status === 401 && !isExcluded && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshClient = axios.create({
          baseURL,
          timeout: 120000,
          withCredentials: true,
        });

        await refreshClient.post(
          "/api/v1/users/refresh-token",
          {}
        );

        notifyRefreshSuccess();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        notifyRefreshFailure(refreshError);
        clearAuthState();
        redirectToLoginIfNeeded();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshSubscribers = [];
      }
    }

    if (status === 401 && requestUrl.includes("/api/v1/users/refresh-token")) {
      clearAuthState();
      redirectToLoginIfNeeded();
    }

    return Promise.reject(error);
  }
);

export const compilerAxios = axios.create({
  baseURL: compilerURL,
  timeout: 30000,
});

compilerAxios.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
