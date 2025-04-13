import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Initialize Telegram WebApp
const script = document.createElement("script");
script.src = "https://telegram.org/js/telegram-web-app.js";
script.async = true;
document.head.appendChild(script);

// Wrap the app with both providers
const Root = () => (
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </AppProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
