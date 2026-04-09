import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppShell from "../components/layout/AppShell";
import AdminDashboardPage, {
  loader as AdminDashboardPageLoader,
} from "../pages/Dashboard/AdminDashboardPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
        loader: AdminDashboardPageLoader,
      },
      {
        path: "/dashboard",
        element: <AdminDashboardPage />,
        loader: AdminDashboardPageLoader,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

function AppLayout() {
  return <RouterProvider router={router} />;
}

export default AppLayout;
