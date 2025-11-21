import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from "lucide-react"; // Import Icons

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active link
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper to style active links
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 py-3 px-4 rounded transition ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
    }`;
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Title */}
      <div className="mb-8 text-center hidden md:block">
        <h1 className="text-2xl font-bold text-blue-400">SokoSync</h1>
        <p className="text-xs text-gray-500 mt-1">SME Inventory Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className={getLinkClass("/dashboard")} onClick={onClose}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/inventory" className={getLinkClass("/inventory")} onClick={onClose}>
          <Package size={20} />
          Inventory
        </Link>
        <Link to="/customers" className={getLinkClass("/customers")} onClick={onClose}>
          <Users size={20} />
          Customers
        </Link>
        <Link to="/sales" className={getLinkClass("/sales")} onClick={onClose}>
          <ShoppingCart size={20} />
          Record Sale
        </Link>
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="mb-4 px-2">
            <p className="text-xs text-gray-500 uppercase">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;