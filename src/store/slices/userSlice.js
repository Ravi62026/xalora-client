import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { debugCookies } from "../../utils/cookieDebug";

let lastAuthCheck = 0;
const AUTH_CHECK_INTERVAL = 5000;

const persistUser = () => {};
const clearPersistedUser = () => {};

export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, { getState }) => {
    const now = Date.now();
    const { user } = getState().user;

    if (user?.email && now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
      return user;
    }

    lastAuthCheck = now;
    debugCookies();

    try {
      const response = await authService.getUser();
      if (response.success && response.data) {
        persistUser(response.data);
        return response.data;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await authService.refreshToken();
          if (refreshResponse.success) {
            const retryResponse = await authService.getUser();
            if (retryResponse.success && retryResponse.data) {
              persistUser(retryResponse.data);
              return retryResponse.data;
            }
          }
        } catch (refreshError) {
          // Ignore and fall through to unauthenticated state.
        }
      }
    }

    clearPersistedUser();
    return null;
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);

      if (response.success) {
        persistUser(response.data?.user);
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
        persistUser(response.data?.user);
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
    // Local state is cleared regardless of API errors.
  }
  return null;
});

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
      persistUser(action.payload);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.isInitializing = false;
      clearPersistedUser();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      clearPersistedUser();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
      persistUser(action.payload);
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
      clearPersistedUser();
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
        if (action.payload?.requiresVerification) {
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
        clearPersistedUser();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        clearPersistedUser();
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
