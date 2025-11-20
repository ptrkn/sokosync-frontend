import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ProductModal from "../components/ProductModal"; // Import the Modal

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control Modal

  const token = localStorage.getItem("token");

  // --- 1. FETCH PRODUCTS ---
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

  // --- 2. ADD PRODUCT ---
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
        setIsModalOpen(false); // Close modal
        fetchInventory(); // Refresh list to show new item
        alert("Product added successfully!");
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      alert("Error adding product");
    }
  };

  // --- 3. DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id)); // Remove from UI immediately
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
          <button 
            onClick={() => setIsModalOpen(true)} // Open Modal
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{product.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{product.price}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">{product.quantity}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      {product.quantity <= product.threshold ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Low Stock</span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="p-5 text-center text-gray-500">No products found. Click "Add Product" to start.</div>
            )}
          </div>
        )}
      </div>

      {/* Render the Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddProduct} 
      />
    </div>
  );
};

export default Inventory;