import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import AddCategory from "./pages/AddCategory.tsx";
import AddEditProduct from "./pages/AddEditProduct.tsx";
import AddTable from "./pages/AddTable.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import History from "./pages/History.tsx";
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
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <Products />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories/add",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AddCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/add",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AddEditProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tables/add",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AddTable />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/edit/:id",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AddEditProduct />
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
