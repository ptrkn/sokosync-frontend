import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * ----------------
 * Acts as a security guard for your application routes.
 * Checks for a valid token before allowing access to sensitive pages.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // UX POLISH: 
    // Instead of just kicking them out, we pass the 'state' prop.
    // This tells the Login page: "Hey, they were trying to go to 'location', 
    // so send them back there after they log in!"
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected page
  return children;
};

export default ProtectedRoute;