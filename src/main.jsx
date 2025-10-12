import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";

// Set the document title
document.title = "Xalora - One Stop Platform For Engineer";

// Make store globally available for axios interceptors
window.__REDUX_STORE__ = store;

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);