import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CustomerModal from "../components/CustomerModal";
import { User, Phone, Mail, Trash2, Plus, Search, UserPlus } from "lucide-react";

// --- UTILITIES ---

// Generate initials from name (e.g. "Jane Doe" -> "JD")
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// --- SUB-COMPONENTS ---

const CustomerSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Mobile View: Contact Card
const CustomerCard = ({ customer, onDelete }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
    {/* Avatar */}
    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
      {getInitials(customer.name)}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900 truncate">{customer.name}</h3>
        <button 
          onClick={() => onDelete(customer.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={14} className="text-gray-400" />
          <span>{customer.contact}</span>
        </div>
        {customer.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
            <Mail size={14} className="text-gray-400" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Desktop View: Table Row
const CustomerRow = ({ customer, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors group">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
          {getInitials(customer.name)}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={16} className="text-gray-400" />
        {customer.contact}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      {customer.email ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          {customer.email}
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic">No email</span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <button 
        onClick={() => onDelete(customer.id)}
        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

// --- MAIN COMPONENT ---

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Logic
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

  // Add Logic
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
        fetchCustomers();
        // Optional: Show toast success here
      } else {
        alert("Failed to add customer");
      }
    } catch (err) {
      alert("Error adding customer");
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

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

  // Filter Logic
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.includes(searchTerm)
  );

  return (
    <Layout title="Customers">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Customer Directory</h1>
            <p className="text-gray-500 text-sm">Manage your client contacts and details.</p>
          </div>
          
          <div className="flex gap-2">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md flex items-center gap-2 transition-transform active:scale-95 whitespace-nowrap"
            >
              <UserPlus size={18} />
              <span className="hidden md:inline">Add Customer</span>
              <span className="md:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <CustomerSkeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">{error}</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
            <p className="text-gray-500 mt-1">Get started by adding your first client.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Add New Customer
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Cards Stack */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredCustomers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} onDelete={handleDelete} />
              ))}
            </div>

            {/* DESKTOP VIEW: Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <CustomerRow key={customer.id} customer={customer} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddCustomer} 
      />
    </Layout>
  );
};

export default Customers;