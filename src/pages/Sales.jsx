import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { Package, Users, Calculator, CheckCircle, Receipt, AlertCircle, Loader2 } from "lucide-react";

// --- UTILITIES ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

// --- SUB-COMPONENTS ---

const SalesSkeleton = () => (
  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-6">
      <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse hidden md:block"></div>
  </div>
);

// --- MAIN COMPONENT ---

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [formData, setFormData] = useState({
    productId: "",
    customerId: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          fetch("http://localhost:5000/api/inventory", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/customers", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (prodRes.ok && custRes.ok) {
          setProducts(await prodRes.json());
          setCustomers(await custRes.json());
        } else {
          setError("Failed to load inventory or customers.");
        }
      } catch (err) {
        setError("Server connection error. Please check your internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to get selected product details for preview
  const getSelectedProduct = () => {
    return products.find((p) => p.id === formData.productId);
  };

  const selectedProduct = getSelectedProduct();
  const unitPrice = selectedProduct ? selectedProduct.price : 0;
  const totalAmount = unitPrice * formData.quantity;

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.customerId) {
      alert("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success Animation/Feedback could go here
        alert(`Sale Recorded Successfully! \nNew Stock: ${data.newStock}`);
        navigate("/dashboard");
      } else {
        alert(data.message || "Sale failed");
      }
    } catch (err) {
      alert("Error recording sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Record Sale">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 hidden md:block">New Transaction</h1>
          <p className="text-gray-500 text-sm">Create a sales record and update inventory instantly.</p>
        </div>

        {loading ? (
          <SalesSkeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Input Form */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Product Select */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package size={16} className="text-blue-600" />
                    Select Product
                  </label>
                  <div className="relative">
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">-- Choose Item --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                          {p.name} {p.quantity === 0 ? "(Out of Stock)" : `(Stock: ${p.quantity})`}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Customer Select */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={16} className="text-purple-600" />
                    Select Customer
                  </label>
                  <div className="relative">
                    <select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">-- Choose Customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.contact})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calculator size={16} className="text-emerald-600" />
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={selectedProduct ? selectedProduct.quantity : 999}
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-lg"
                    required
                  />
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 text-right">
                      Max available: <span className="font-bold">{selectedProduct.quantity}</span>
                    </p>
                  )}
                </div>

                {/* Mobile-Only Summary (Visible only on small screens) */}
                <div className="lg:hidden bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 text-sm">Total Value</span>
                        <span className="text-2xl font-bold text-blue-700">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing Sale...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Confirm Transaction
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: Live Receipt Preview (Desktop Stickey) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Receipt size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800">Sale Preview</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Item</span>
                    <span className="font-medium text-gray-900 truncate max-w-[120px]">
                      {selectedProduct ? selectedProduct.name : "..."}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unit Price</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(unitPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-medium text-gray-900">x {formData.quantity}</span>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200 mt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-600 font-bold">Total</span>
                      <span className="text-3xl font-bold text-blue-600">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sales;