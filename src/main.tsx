import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import OrderDetails from "./pages/OrderDetails.tsx";
import Products from "./pages/Products.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "FUNCIONARIO"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pedidos/:orderId",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "FUNCIONARIO"]}>
        <OrderDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/produtos",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <Products />
      </ProtectedRoute>
    ),
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
