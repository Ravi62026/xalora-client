import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { clearTokens, getAccessToken, getRefreshToken } from "../../utils/axios";

let lastAuthCheck = 0;
let authBootstrapPromise = null;
const AUTH_CHECK_INTERVAL = 5000;
const PUBLIC_BOOTSTRAP_PATHS = new Set([
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

const isPublicBootstrapPath = (pathname = "/") => {
  return (
    PUBLIC_BOOTSTRAP_PATHS.has(pathname) ||
    pathname.startsWith("/problems/") ||
    pathname.startsWith("/quiz/") ||
    pathname.startsWith("/internships/") ||
    pathname.startsWith("/org/join/") ||
    pathname.startsWith("/org/setup/")
  );
};

export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, { getState }) => {
    if (authBootstrapPromise) {
      return authBootstrapPromise;
    }

    const now = Date.now();
    const { user } = getState().user;
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const pathname = window?.location?.pathname || "/";

    authBootstrapPromise = (async () => {
      try {
        // Fast path: unauthenticated visitors on public routes should not block app startup.
        if (!accessToken && !refreshToken && isPublicBootstrapPath(pathname)) {
          return null;
        }

        // If user is already loaded and we checked recently, skip
        if (user?.email && now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
          return user;
        }

        lastAuthCheck = now;

        try {
          const response = await authService.getUser();
          if (response.success && response.data) {
            return response.data;
          }
        } catch (error) {
          if (error.response?.status === 401) {
            try {
              // Cookie-based sessions may exist even when localStorage tokens are absent.
              const refreshResponse = await authService.refreshToken();
              if (refreshResponse.success) {
                const retryResponse = await authService.getUser();
                if (retryResponse.success && retryResponse.data) {
                  return retryResponse.data;
                }
              }
            } catch (refreshError) {
              // Ignore and fall through to unauthenticated state.
            }
          } else if (!accessToken) {
            // If there is no local token and server rejected auth, treat as logged out quietly.
            return null;
          }
        }

        clearTokens();
        return null;
      } finally {
        authBootstrapPromise = null;
      }
    })();

    return authBootstrapPromise;
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      if (response.success) {
        return response.data;
      }

      return rejectWithValue(response.message || "Login failed");
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.data?.requiresVerification) {
        return rejectWithValue({
          ...error.response.data.data,
          message: error.response.data?.message || "Email verification required",
        });
      }

      if (error.response?.status === 403 && error.response?.data?.data?.requiresOrgSetup) {
        return rejectWithValue({
          ...error.response.data.data,
          message: error.response.data?.data?.message || "Organization setup required. Check your email for the setup link.",
        });
      }

      if (error.response?.status === 400) {
        return rejectWithValue(
          error.response.data?.message || "Invalid email or password. Please try again."
        );
      }

      if (error.response?.status === 401) {
        return rejectWithValue(
          error.response.data?.message || "Authentication failed. Please try again."
        );
      }

      if (error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Network error. Please check your connection and try again."
        );
      }

      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "user/googleLoginUser",
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(tokenId);

      if (response.success) {
        return response.data;
      }

      return rejectWithValue(response.message || "Google Login failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google Login failed. Please try again."
      );
    }
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  try {
    await authService.logout();
  } catch (error) {
    // authService.logout() already clears tokens in its finally block
  }
  return null;
});

export const switchWorkspace = createAsyncThunk(
  "user/switchWorkspace",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await authService.switchWorkspace(workspaceId);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.message || "Failed to switch workspace");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to switch workspace"
      );
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  isInitializing: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.isInitializing = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.isInitializing = false;
      clearTokens();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      clearTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    initializeComplete: (state) => {
      state.isInitializing = false;
    },
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.isInitializing = false;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitializing = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isInitializing = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        if (action.payload?.requiresVerification || action.payload?.requiresOrgSetup) {
          state.error = null;
        } else {
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : action.payload?.message || "Login failed. Please try again.";
        }
        state.isInitializing = false;
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        state.isInitializing = false;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.isInitializing = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(switchWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(switchWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to switch workspace";
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser,
  initializeComplete,
  forceLogout,
} = userSlice.actions;

export default userSlice.reducer;
