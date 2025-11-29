import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { DollarSign, ShoppingBag, TrendingUp, RefreshCw, Calendar, ArrowRight } from "lucide-react";

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

// --- SUB-COMPONENTS (For cleaner code) ---

const WelcomeBanner = ({ userName, onRefresh, isRefreshing, isLoading }) => (
  <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
    {/* Decorative Circle */}
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

const GrowthCard = () => (
  <div className="group bg-gray-900 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full blur-xl -mr-10 -mt-10"></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
         <p className="text-blue-300 text-xs font-bold uppercase tracking-wide">Growth Tip</p>
         <h3 className="text-lg font-bold mt-1 leading-tight">Record every sale <br/> to track profit.</h3>
      </div>
      <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700 transition-colors border border-gray-700">
        <TrendingUp size={20} className="text-yellow-400" />
      </div>
    </div>
    
    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition-colors">
       <span>View Analytics</span>
       <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </div>
  </div>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Safe User Name Extraction
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.name ? user.name.split(" ")[0] : "Merchant";

  const fetchStats = async () => {
    if (!isRefreshing) setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/reports/summary/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
        setError("");
      } else {
        setError("Failed to load stats");
      }
    } catch (err) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  return (
    <Layout title="Dashboard">
      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        
        {/* Welcome Section */}
        <WelcomeBanner 
          userName={firstName} 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing}
          isLoading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={fetchStats} className="text-sm font-bold underline hover:text-red-800">Retry</button>
          </div>
        )}

        {/* Main Content */}
        {loading && !isRefreshing ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={DollarSign}
              bgClass="bg-emerald-100"
              colorClass="text-emerald-600"
            />

            <StatCard 
              title="Units Sold" 
              value={stats.totalUnits} 
              subtext="items"
              icon={ShoppingBag}
              bgClass="bg-blue-100"
              colorClass="text-blue-600"
            />

            <GrowthCard />
            
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;