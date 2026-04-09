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
import ServicesDashboardPage from "../pages/Services/ServicesDashboardPage";
import BookingAppointmentPage from "../pages/BookingAppoinment/BookingAppointmentPage";
import AppointmentHistoryPage from "../pages/HistoryAppoinment/AppointmentHistoryPage";
import ManageAvailabilityPage from "../pages/ManageAvailebility/ManageAvailabilityPage";
import AllBookingsPage from "../pages/AllBooking/AllBookingsPage";

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
      {
        path: "/services",
        element: <ServicesDashboardPage />,
      },
      {
        path: "booking/new",
        element: <BookingAppointmentPage />,
      },
      {
        path: "history",
        element: <AppointmentHistoryPage />,
      },
      {
        path: "availability",
        element: <ManageAvailabilityPage />,
      },
      {
        path: "bookings",
        element: <AllBookingsPage />,
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
