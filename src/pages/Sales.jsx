import { useEffect, useState } from "react";
import { ShoppingCart, Package, User, AlertCircle, Receipt, TrendingUp } from "lucide-react";

// Mock Layout component for demo
const Layout = ({ children, title }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  </div>
);

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

  // Mock data for demo
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Maize Flour 2kg", price: 150, quantity: 45 },
        { id: 2, name: "Cooking Oil 1L", price: 280, quantity: 8 },
        { id: 3, name: "Rice 5kg", price: 520, quantity: 30 },
        { id: 4, name: "Sugar 2kg", price: 220, quantity: 15 },
        { id: 5, name: "Tea Leaves 500g", price: 180, quantity: 25 }
      ]);
      setCustomers([
        { id: 1, name: "Wanjiku Kamau", contact: "0712345678" },
        { id: 2, name: "Peter Odhiambo", contact: "0723456789" },
        { id: 3, name: "Fatuma Hassan", contact: "0734567890" },
        { id: 4, name: "John Mwangi", contact: "0745678901" }
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate total price
  const getSelectedProductPrice = () => {
    const product = products.find((p) => p.id === parseInt(formData.productId));
    return product ? product.price : 0;
  };

  const getSelectedProduct = () => {
    return products.find((p) => p.id === parseInt(formData.productId));
  };

  const getSelectedCustomer = () => {
    return customers.find((c) => c.id === parseInt(formData.customerId));
  };

  const totalAmount = getSelectedProductPrice() * formData.quantity;

  // Submit sale
  const handleSubmit = () => {
    if (!formData.productId || !formData.customerId) {
      alert("Please select both a product and a customer.");
      return;
    }

    const selectedProduct = getSelectedProduct();
    if (selectedProduct && formData.quantity > selectedProduct.quantity) {
      alert(`Insufficient stock! Only ${selectedProduct.quantity} units available.`);
      return;
    }

    alert(`Sale Recorded Successfully! Total: KES ${totalAmount.toFixed(2)}`);
    
    // Reset form
    setFormData({
      productId: "",
      customerId: "",
      quantity: 1,
    });
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 max-w-2xl mx-auto animate-pulse">
      <div className="space-y-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  // Empty State
  const EmptyState = ({ type }) => (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-md mx-auto">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6">
        {type === 'products' ? (
          <Package className="w-10 h-10 text-orange-500" />
        ) : (
          <User className="w-10 h-10 text-orange-500" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No {type} available
      </h3>
      <p className="text-gray-500">
        Please add some {type} before recording sales
      </p>
    </div>
  );

  return (
    <Layout title="Record Sale">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Record New Sale</h1>
        </div>
        <p className="text-gray-600 ml-14">Process a new transaction quickly and easily</p>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState type="products" />
      ) : customers.length === 0 ? (
        <EmptyState type="customers" />
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Main Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Sale Details
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Select Product */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  Select Product
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 appearance-none cursor-pointer hover:border-gray-400"
                  required
                >
                  <option value="">-- Choose a Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} • Stock: {p.quantity} • KES {p.price}
                    </option>
                  ))}
                </select>
                {formData.productId && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Selected:</span> {getSelectedProduct()?.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Available stock: {getSelectedProduct()?.quantity} units
                    </p>
                  </div>
                )}
              </div>

              {/* Select Customer */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Select Customer
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 appearance-none cursor-pointer hover:border-gray-400"
                  required
                >
                  <option value="">-- Choose a Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.contact}
                    </option>
                  ))}
                </select>
                {formData.customerId && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Customer:</span> {getSelectedCustomer()?.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Contact: {getSelectedCustomer()?.contact}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  max={getSelectedProduct()?.quantity || 999}
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 hover:border-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the number of units to sell
                </p>
              </div>
            </div>
          </div>

          {/* Total Summary Card */}
          {formData.productId && formData.quantity > 0 && (
            <div className="mt-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform transition-all hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Sale Value</p>
                  <p className="text-4xl font-bold">KES {totalAmount.toFixed(2)}</p>
                  <p className="text-blue-100 text-xs mt-2">
                    {formData.quantity} × KES {getSelectedProductPrice().toFixed(2)}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Receipt className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!formData.productId || !formData.customerId}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Confirm Sale & Update Stock
          </button>

          {/* Info Notice */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Important</p>
                <p className="text-xs text-amber-700 mt-1">
                  Stock will be automatically deducted after confirming this sale
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Sales;