import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    productId: "",
    customerId: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- 1. FETCH DATA (Products & Customers) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run both requests in parallel for speed
        const [prodRes, custRes] = await Promise.all([
          fetch("http://localhost:5000/api/inventory", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/customers", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (prodRes.ok && custRes.ok) {
          setProducts(await prodRes.json());
          setCustomers(await custRes.json());
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        setError("Server connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. CALCULATE TOTAL PRICE DYNAMICALLY ---
  const getSelectedProductPrice = () => {
    const product = products.find((p) => p.id === formData.productId);
    return product ? product.price : 0;
  };

  const totalAmount = getSelectedProductPrice() * formData.quantity;

  // --- 4. SUBMIT SALE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.customerId) {
      alert("Please select both a product and a customer.");
      return;
    }

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
        alert(`Sale Recorded! New Stock: ${data.newStock}`);
        navigate("/dashboard"); // Redirect to dashboard to see updated stats
      } else {
        alert(data.message || "Sale failed");
      }
    } catch (err) {
      alert("Error recording sale");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Record New Sale</h1>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Select Product */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">Select Product</label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">-- Choose a Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.quantity}) - KES {p.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Customer */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">Select Customer</label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">-- Choose a Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.contact})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Total Summary Box */}
              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-right">
                <p className="text-gray-600 text-sm">Total Sale Value:</p>
                <p className="text-2xl font-bold text-blue-600">KES {totalAmount.toFixed(2)}</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition duration-200"
              >
                Confirm Sale 💰
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;