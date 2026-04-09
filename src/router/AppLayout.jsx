import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
]);

function AppLayout() {
  return <RouterProvider router={router} />;
}

export default AppLayout;
