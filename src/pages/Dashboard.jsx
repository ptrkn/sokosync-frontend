import { useEffect, useState } from "react";
import Layout from "../components/Layout"; // Import Layout
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react"; // Icons

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalUnits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/reports/summary/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setStats(data);
        else setError("Failed to load stats");
      } catch (err) {
        setError("Server connection error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard"> {/* Wrap in Layout */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 hidden md:block">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what's happening in your store today.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading stats...</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-full text-green-600">
              <DollarSign size={32} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">KES {stats.totalRevenue}</h3>
            </div>
          </div>

          {/* Card 2: Sales Count */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600">
              <ShoppingBag size={32} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Units Sold</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalUnits}</h3>
            </div>
          </div>

           {/* Card 3: Quick Action */}
           <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
             <div>
                <p className="font-medium opacity-90">Business Growing?</p>
                <h3 className="text-lg font-bold mt-1">Keep Tracking!</h3>
             </div>
             <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
                <TrendingUp size={18} />
                <span>Sales recorded today</span>
             </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;