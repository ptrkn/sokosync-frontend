import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CustomerModal from "../components/CustomerModal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // --- 1. FETCH CUSTOMERS ---
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setCustomers(data);
      else setError("Failed to load customers");
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- 2. ADD CUSTOMER ---
  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchCustomers(); // Refresh list
        alert("Customer added successfully!");
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      alert("Error adding customer");
    }
  };

  // --- 3. DELETE CUSTOMER ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      alert("Error deleting customer");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-md"
          >
            + Add Customer
          </button>
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{customer.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{customer.contact}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{customer.email || "N/A"}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div className="p-5 text-center text-gray-500">No customers found.</div>
            )}
          </div>
        )}
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddCustomer} 
      />
    </div>
  );
};

export default Customers;