import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductModal from "../components/ProductModal";
import { Package, Search, Plus, Trash2, AlertTriangle, CheckCircle, PackageOpen } from "lucide-react";

// --- UTILITIES ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

// --- SUB-COMPONENTS ---

const InventorySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
        <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
      </div>
    ))}
  </div>
);

const StockBadge = ({ quantity, threshold }) => {
  const isLowStock = quantity <= threshold;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
      isLowStock 
        ? "bg-red-50 text-red-700 border-red-100" 
        : "bg-emerald-50 text-emerald-700 border-emerald-100"
    }`}>
      {isLowStock ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
      {isLowStock ? "Low Stock" : "In Stock"}
    </span>
  );
};

// Mobile View: Product Card
const ProductCard = ({ product, onDelete }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow relative overflow-hidden">
    {/* Colored Stripe Indicator */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${product.quantity <= product.threshold ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

    <div className="flex justify-between items-start pl-3">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">{formatCurrency(product.price)}</p>
      </div>
      <button 
        onClick={() => onDelete(product.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>

    <div className="flex items-center justify-between pl-3 pt-2 border-t border-gray-50 mt-1">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-wide">Quantity</span>
        <span className="font-semibold text-gray-700">{product.quantity} units</span>
      </div>
      <StockBadge quantity={product.quantity} threshold={product.threshold} />
    </div>
  </div>
);

// Desktop View: Table Row
const ProductRow = ({ product, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors group">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Package size={20} />
        </div>
        <span className="font-bold text-gray-800">{product.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
      {formatCurrency(product.price)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="font-semibold text-gray-700">{product.quantity}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StockBadge quantity={product.quantity} threshold={product.threshold} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <button 
        onClick={() => onDelete(product.id)}
        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

// --- MAIN COMPONENT ---

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Logic
  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setProducts(data);
      else setError("Failed to load inventory");
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Add Logic
  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchInventory();
        // Optional: Add toast success here
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      alert("Error adding product");
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Inventory">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Product Inventory</h1>
            <p className="text-gray-500 text-sm">Manage your stock levels and pricing.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md flex items-center gap-2 transition-transform active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Product</span>
              <span className="md:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <InventorySkeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <PackageOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? "Try adjusting your search terms." : "Start by adding your first product."}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                Add New Product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Cards Stack */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onDelete={handleDelete} />
              ))}
            </div>

            {/* DESKTOP VIEW: Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <ProductRow key={product.id} product={product} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddProduct} 
      />
    </Layout>
  );
};

export default Inventory;