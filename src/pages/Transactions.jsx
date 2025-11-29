import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Receipt, Calendar, User, Package, AlertCircle } from "lucide-react";

// --- UTILITIES ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// --- SUB-COMPONENTS ---

const TransactionSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
  </div>
);

const TransactionCard = ({ sale, getProductName, getCustomerName }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start border-b border-gray-50 pb-3">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Calendar size={14} />
        <span>{formatDate(sale.date)}</span>
      </div>
      <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg text-sm">
        {formatCurrency(sale.totalSale)}
      </span>
    </div>

    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Package size={18} />
        </div>
        <div>
           <span className="font-bold text-gray-900 block">{getProductName(sale.productId)}</span>
           <span className="text-xs text-gray-500">Qty: {sale.quantity}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <User size={18} />
        </div>
        <span className="text-sm font-medium text-gray-700">{getCustomerName(sale.customerId)}</span>
      </div>
    </div>
  </div>
);

const TransactionRow = ({ sale, getProductName, getCustomerName }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {formatDate(sale.date)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800">{getProductName(sale.productId)}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
      {getCustomerName(sale.customerId)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
      {sale.quantity}
    </td>
    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600 text-right">
      {formatCurrency(sale.totalSale)}
    </td>
  </tr>
);

// --- MAIN COMPONENT ---

const Transactions = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch History, Products, AND Customers in parallel
        // We need Products and Customers to look up the names from the IDs
        const [historyRes, productsRes, customersRes] = await Promise.all([
          fetch("http://localhost:5000/api/reports/transactions", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/inventory", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/customers", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (historyRes.ok && productsRes.ok && customersRes.ok) {
          const salesData = await historyRes.json();
          const productsData = await productsRes.json();
          const customersData = await customersRes.json();

          setSales(salesData);
          setProducts(productsData);
          setCustomers(customersData);
        } else {
          setError("Failed to load full transaction data");
        }
      } catch (err) {
        setError("Server connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOOKUP HELPERS ---
  const getProductName = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : "Unknown Product";
  };

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.name : "Unknown Customer";
  };

  return (
    <Layout title="Sales History">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Transaction History</h1>
            <p className="text-gray-500 text-sm">A complete record of all sales made.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 self-start">
            Total Records: {sales.length}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <TransactionSkeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Receipt size={32} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No sales recorded yet</h3>
            <p className="text-gray-500 mt-1">Record a sale to see it appear here.</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {sales.map((sale) => (
                <TransactionCard 
                  key={sale.id} 
                  sale={sale} 
                  getProductName={getProductName}
                  getCustomerName={getCustomerName}
                />
              ))}
            </div>

            {/* DESKTOP VIEW: Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {sales.map((sale) => (
                    <TransactionRow 
                      key={sale.id} 
                      sale={sale} 
                      getProductName={getProductName}
                      getCustomerName={getCustomerName}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;