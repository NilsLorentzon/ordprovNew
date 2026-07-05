import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "./lib/react-query.ts";
import MainRoutes from "./routes/MainRoutes.tsx";
import { AuthProvider } from "./providers/AuthenticationProvider.tsx";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./providers/ErrorBoundary.tsx";
import { LocalStorageProvider } from "./providers/LocalStorageProvider.tsx";
const helmetContext = {};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocalStorageProvider>
            <Router>
              <MainRoutes />
            </Router>
            </LocalStorageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
