import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, kick them out to Login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;