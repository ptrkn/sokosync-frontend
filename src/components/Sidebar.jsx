import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, Store } from "lucide-react";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Navigation Config
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Record Sale", path: "/sales", icon: ShoppingCart },
  ];

  // Helper for Active Styles
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `
      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
      ${isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium" 
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }
    `;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      
      {/* 1. APP HEADER */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Store size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SokoSync</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">SME Manager</p>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Menu</p>
        
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={getLinkClass(item.path)}
          >
            <item.icon 
              size={20} 
              className={`transition-transform duration-200 ${location.pathname === item.path ? "" : "group-hover:scale-110"}`} 
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      {/* 3. USER PROFILE & LOGOUT */}
      <div className="p-4 mt-auto border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-inner">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-gray-100">
                {user.name || "Merchant"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-red-600 hover:text-white text-gray-300 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;