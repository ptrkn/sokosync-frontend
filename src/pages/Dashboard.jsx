import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalUnits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Data from Backend
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/reports/summary/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        if (response.ok) {
          setStats(data);
        } else {
          setError("Failed to load stats");
        }
      } catch (err) {
        setError("Server connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Add the Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Revenue */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h2 className="text-gray-500 text-sm uppercase">Today's Revenue</h2>
              <p className="text-3xl font-bold text-gray-800">KES {stats.totalRevenue}</p>
            </div>

            {/* Card 2: Sales Count */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-gray-500 text-sm uppercase">Units Sold Today</h2>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUnits}</p>
            </div>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-100 rounded border border-yellow-200">
           <h3 className="font-bold text-yellow-800">🚀 Quick Actions</h3>
           <p className="text-sm text-yellow-700">Use the sidebar to manage inventory or record new sales.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;