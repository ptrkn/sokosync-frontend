import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col fixed md:relative hidden md:flex">
      {/* App Title */}
      <h1 className="text-2xl font-bold mb-8 text-center text-blue-400">SokoSync</h1>

      {/* User Info */}
      <div className="mb-8 text-sm text-gray-400 text-center">
        Logged in as: <br />
        <span className="text-white font-semibold">{user?.email}</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
          📊 Dashboard
        </Link>
        <Link to="/inventory" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
          📦 Inventory
        </Link>
        <Link to="/customers" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
          👥 Customers  {/* <-- Fixed typo here */}
        </Link>
        <Link to="/sales" className="block py-2.5 px-4 rounded hover:bg-gray-700 transition">
          💰 Record Sale
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-white w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;