import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, Calendar, ArrowRight, AlertTriangle, CheckCircle, Package } from "lucide-react";

// --- UTILITIES ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

const getTodayDate = () => {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// --- SUB-COMPONENTS ---

const WelcomeBanner = ({ userName, onRefresh, isRefreshing, isLoading }) => (
  <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Habari, {userName}! 👋
        </h1>
        <div className="flex items-center gap-2 mt-2 text-blue-100 text-sm font-medium">
          <Calendar size={16} />
          <span>{getTodayDate()}</span>
        </div>
      </div>
      
      <button 
        onClick={onRefresh} 
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm transition-all active:scale-95 border border-white/10"
        disabled={isLoading || isRefreshing}
      >
        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
        <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
      </button>
    </div>
  </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }) => (
  <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${bgClass} ${colorClass}`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
          {value} <span className="text-sm text-gray-400 font-normal">{subtext}</span>
        </h3>
      </div>
    </div>
  </div>
);

const LowStockCard = ({ lowStockItems }) => (
  <Link to="/inventory" className="block h-full">
    <div className={`group p-6 rounded-2xl shadow-sm border h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden ${
      lowStockItems.length > 0 ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
    }`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
           <p className={`text-xs font-bold uppercase tracking-wide ${lowStockItems.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
             Inventory Status
           </p>
           
           {lowStockItems.length > 0 ? (
             <>
               <h3 className="text-lg font-bold mt-1 text-red-900">
                 {lowStockItems.length} items low on stock
               </h3>
               <p className="text-sm text-red-700 mt-1">Restock soon to avoid losing sales.</p>
             </>
           ) : (
             <>
               <h3 className="text-lg font-bold mt-1 text-emerald-900">
                 Everything looks good!
               </h3>
               <p className="text-sm text-emerald-700 mt-1">You are fully stocked.</p>
             </>
           )}
        </div>
        
        <div className={`p-2 rounded-lg ${lowStockItems.length > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
          {lowStockItems.length > 0 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
        </div>
      </div>
      
      {lowStockItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-red-200/60">
           <div className="flex items-center gap-2 text-sm font-medium text-red-800 group-hover:underline">
              <span>View Low Stock List</span>
              <ArrowRight size={16} />
           </div>
        </div>
      )}
    </div>
  </Link>
);

const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="h-14 w-14 bg-gray-200 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN COMPONENT ---

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalUnits: 0 });
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.name ? user.name.split(" ")[0] : "Merchant";

  const fetchDashboardData = async () => {
    if (!isRefreshing) setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Fetch Summary and Low Stock in parallel
      const [summaryRes, lowStockRes] = await Promise.all([
        fetch("http://localhost:5000/api/reports/summary/today", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/reports/low-stock", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (summaryRes.ok && lowStockRes.ok) {
        const summaryData = await summaryRes.json();
        const lowStockData = await lowStockRes.json();
        
        setStats(summaryData);
        setLowStock(lowStockData);
        setError("");
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  return (
    <Layout title="Dashboard">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        
        <WelcomeBanner 
          userName={firstName} 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing}
          isLoading={loading}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={fetchDashboardData} className="text-sm font-bold underline hover:text-red-800">Retry</button>
          </div>
        )}

        {loading && !isRefreshing ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            <StatCard 
              title="Today's Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={DollarSign}
              bgClass="bg-emerald-100"
              colorClass="text-emerald-600"
            />

            <StatCard 
              title="Units Sold Today" 
              value={stats.totalUnits} 
              subtext="items"
              icon={ShoppingBag}
              bgClass="bg-blue-100"
              colorClass="text-blue-600"
            />

            {/* Replaced generic Growth Tip with actual Low Stock Data */}
            <LowStockCard lowStockItems={lowStock} />
            
          </div>
        )}

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Link to="/sales" className="block group">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                       <ShoppingBag size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900">Record New Sale</h3>
                       <p className="text-sm text-gray-500">Process a transaction</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
           </Link>

           <Link to="/inventory" className="block group">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                       <Package size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900">Manage Inventory</h3>
                       <p className="text-sm text-gray-500">Update stock levels</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
              </div>
           </Link>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;