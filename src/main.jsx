import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";

// Set the document title
document.title = "Xalora - One Stop Platform For Engineer";

// Log active environment URLs on app load
console.log(
    `%c[Xalora ENV] ${import.meta.env.MODE}`,
    "color: #7c3aed; font-weight: bold; font-size: 12px"
);
console.log("  VITE_API_URL       =", import.meta.env.VITE_API_URL);
console.log("  VITE_COMPILER_URL  =", import.meta.env.VITE_COMPILER_URL);
console.log("  VITE_XALORA_AI_URL =", import.meta.env.VITE_XALORA_AI_URL);

// Make store globally available for axios interceptors
window.__REDUX_STORE__ = store;

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
            <Provider store={store}>
                <App />
            </Provider>
        </GoogleOAuthProvider>
    </StrictMode>
);