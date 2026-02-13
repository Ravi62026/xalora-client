import axios from "axios";

// Simple: Use environment variables, fallback to localhost in dev
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
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

// ── Token Helpers ──────────────────────────────────────────────────────
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ── Auth State Helpers ─────────────────────────────────────────────────
const clearAuthState = () => {
  clearTokens();
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
    currentPath.startsWith("/internships/") ||
    currentPath.startsWith("/org/join/") ||
    currentPath.startsWith("/org/setup/");

  if (!isPublicPath && currentPath !== "/login" && currentPath !== "/signup") {
    window.location.href = "/login";
  }
};

const notifyRefreshSuccess = (newAccessToken) => {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve(newAccessToken));
};

const notifyRefreshFailure = (error) => {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
};

// ── Axios Instance ─────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL,
  timeout: 120000,
});

// Request interceptor: Attach Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    config.headers.Accept = "application/json";

    // Attach access token from localStorage
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and auto-refresh
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
            resolve: (newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/users/refresh-token`,
          { refreshToken },
          { timeout: 120000 }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        setTokens(newAccessToken, newRefreshToken);

        notifyRefreshSuccess(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
