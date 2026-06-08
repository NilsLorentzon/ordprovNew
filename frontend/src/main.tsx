import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "./lib/react-query.ts";
import AppRoutes from "./routes/index.tsx";
import { AuthProvider } from "./providers/AuthenticationProvider.tsx";
import { Helmet, HelmetProvider } from "react-helmet-async";
const helmetContext = {};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider context={helmetContext}>
      {/* <App /> */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
