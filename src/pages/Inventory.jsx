import { useEffect, useState } from "react";
import { Package, Trash2, Plus, AlertCircle } from "lucide-react";

// Mock Layout component for demo
const Layout = ({ children, title }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  </div>
);

// Mock ProductModal component for demo
const ProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    threshold: ""
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ name: "", price: "", quantity: "", threshold: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
            <input
              type="number"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate API call with mock data
  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Maize Flour 2kg", price: 150, quantity: 45, threshold: 10 },
        { id: 2, name: "Cooking Oil 1L", price: 280, quantity: 8, threshold: 15 },
        { id: 3, name: "Rice 5kg", price: 520, quantity: 30, threshold: 10 },
        { id: 4, name: "Sugar 2kg", price: 220, quantity: 5, threshold: 10 },
        { id: 5, name: "Tea Leaves 500g", price: 180, quantity: 25, threshold: 8 }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      threshold: parseInt(newProduct.threshold)
    };
    setProducts([...products, product]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setProducts(products.filter((product) => product.id !== id));
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <>
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="animate-pulse border-b border-gray-100">
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                <td className="px-6 py-5"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                <td className="px-6 py-5 text-center"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
        <Package className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No products yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start building your inventory by adding your first product
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Plus className="w-5 h-5" />
        Add Your First Product
      </button>
    </div>
  );

  // Mobile Card View
  const MobileCard = ({ product }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600">KES {product.price}</p>
        </div>
        <button
          onClick={() => handleDelete(product.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete product"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Quantity in Stock</span>
          <span className="font-semibold text-gray-800">{product.quantity} units</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Status</span>
          {product.quantity <= product.threshold ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="w-3 h-3" />
              Low Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
              In Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Inventory">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Inventory</h1>
          <p className="text-gray-600">Manage your product stock</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <MobileCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-800">{product.name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-blue-600">KES {product.price}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-gray-800 font-medium">{product.quantity}</div>
                    </td>
                    <td className="px-6 py-5">
                      {product.quantity <= product.threshold ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
    </Layout>
  );
};

export default Inventory;