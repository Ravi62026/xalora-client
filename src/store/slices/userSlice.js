import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// Async thunks
export const initializeAuth = createAsyncThunk(
    "user/initializeAuth",
    async () => {
        try {
            console.log("🔄 REDUX: Initializing authentication...");
            const response = await authService.getUser();
            if (response.success && response.data) {
                console.log("✅ REDUX: User authenticated via cookies:", response.data.email);
                // Update localStorage
                localStorage.setItem('hireveu_user', JSON.stringify(response.data));
                return response.data;
            }
            console.log("❌ REDUX: No user data in response");
            // Clear localStorage if server auth failed
            localStorage.removeItem('hireveu_user');
            return null;
        } catch (error) {
            console.log("❌ REDUX: Cookie auth failed, checking localStorage...", error.response?.status);
            
            // If it's a 401 error, clear localStorage and logout
            if (error.response?.status === 401) {
                console.log("🚪 REDUX: 401 error - clearing localStorage and logging out");
                localStorage.removeItem('hireveu_user');
                return null;
            }
            
            // For other errors, try localStorage as fallback
            try {
                const storedUser = localStorage.getItem('hireveu_user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    console.log("✅ REDUX: User restored from localStorage:", userData.email);
                    // Verify with server that the user is still valid
                    try {
                        const verifyResponse = await authService.getUser();
                        if (verifyResponse.success && verifyResponse.data) {
                            console.log("✅ REDUX: User verified with server:", verifyResponse.data.email);
                            return verifyResponse.data;
                        }
                    } catch (verifyError) {
                        console.log("❌ REDUX: User verification failed:", verifyError.response?.status);
                        // If verification fails, clear localStorage
                        localStorage.removeItem('hireveu_user');
                    }
                    return userData;
                }
            } catch (localStorageError) {
                console.log("❌ REDUX: localStorage also failed");
            }
            
            // Clear localStorage if no valid data found
            localStorage.removeItem('hireveu_user');
            return null; // Not an error, just not authenticated
        }
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
            console.log("Login error:", error);
            // Provide more specific error messages
            if (error.response?.status === 400) {
                return rejectWithValue(
                    error.response.data?.message || "Invalid email or password. Please try again."
                );
            } else if (error.response?.status === 401) {
                return rejectWithValue(
                    error.response.data?.message || "Authentication failed. Please try again."
                );
            } else if (error.code === 'ERR_NETWORK') {
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

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
    try {
        await authService.logout();
        return null;
    } catch (error) {
        // Even if API call fails, we still want to clear local state
        return null;
    }
});

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    isInitializing: true, // Track initial auth check
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
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            console.log("🔄 REDUX: Setting user data:", action.payload);
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
            // Clear localStorage
            localStorage.removeItem('hireveu_user');
        },
    },
    extraReducers: (builder) => {
        builder
            // Initialize auth
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
            // Login user
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
                state.isInitializing = false;
                // Store user data in localStorage as backup
                localStorage.setItem('hireveu_user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
                state.isInitializing = false;
            })
            // Logout user
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                // Clear localStorage
                localStorage.removeItem('hireveu_user');
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                // Clear localStorage even if API call fails
                localStorage.removeItem('hireveu_user');
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