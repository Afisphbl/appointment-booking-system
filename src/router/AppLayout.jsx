import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppShell from "../components/layout/AppShell";

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
        path: "/dashboard",
        element: (
          <div className="p-4">Welcome to the Clinic Booking Dashboard!</div>
        ),
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
