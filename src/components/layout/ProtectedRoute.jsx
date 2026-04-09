import { useSelector } from "react-redux";
import { getUser } from "../../features/auth/authSelector";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = useSelector(getUser);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
