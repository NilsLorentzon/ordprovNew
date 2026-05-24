import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import StartPage from "./StartPage.tsx";
import Header from "./Header.tsx";
// import AppProvider from "./providers/app";
// import AppRoutes from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "./lib/react-query.ts";
import AppRoutes from "./routes/index.tsx";
import { AuthProvider } from "./providers/AuthenticationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
