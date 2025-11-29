import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

// --- PAGES ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import ProtectedRoute from "./components/ProtectedRoute";

// --- UTILITIES ---

/**
 * ScrollToTop
 * -----------
 * Critical for Mobile-First apps. 
 * Ensures that when a user navigates to a new page, 
 * the view resets to the top of the screen immediately.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * NotFound (404)
 * --------------
 * A polished fallback UI when a user visits a link that doesn't exist.
 */
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6 animate-in fade-in duration-500">
    <div className="bg-red-100 p-4 rounded-full mb-6 text-red-500 shadow-sm">
      <AlertTriangle size={48} />
    </div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
    <p className="text-gray-500 mb-8 max-w-xs mx-auto">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <Link 
      to="/dashboard" 
      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
    >
      <Home size={20} />
      Back to Dashboard
    </Link>
  </div>
);

// --- MAIN APP COMPONENT ---

function App() {
  return (
    <Router>
      {/* 1. Global Utilities */}
      <ScrollToTop />

      {/* 2. Routes Configuration */}
      <Routes>
        
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes (Require Login) --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        {/* --- Catch-All 404 Route --- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;