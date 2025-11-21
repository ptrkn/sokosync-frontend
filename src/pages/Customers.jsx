import { useEffect, useState } from "react";
import { Users, Trash2, Plus, Phone, Mail, UserPlus, AlertCircle } from "lucide-react";

// Mock Layout component for demo
const Layout = ({ children, title }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  </div>
);

// Mock CustomerModal component for demo
const CustomerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: ""
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ name: "", contact: "", email: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Customer</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g., John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="0712345678"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="email@example.com"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate API call with mock data
  useEffect(() => {
    setTimeout(() => {
      setCustomers([
        { id: 1, name: "Wanjiku Kamau", contact: "0712345678", email: "wanjiku@email.com" },
        { id: 2, name: "Peter Odhiambo", contact: "0723456789", email: "peter@email.com" },
        { id: 3, name: "Fatuma Hassan", contact: "0734567890", email: null },
        { id: 4, name: "John Mwangi", contact: "0745678901", email: "john@email.com" },
        { id: 5, name: "Sarah Akinyi", contact: "0756789012", email: null },
        { id: 6, name: "David Kipchoge", contact: "0767890123", email: "david@email.com" }
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const handleAddCustomer = (newCustomer) => {
    const customer = {
      id: Date.now(),
      ...newCustomer
    };
    setCustomers([...customers, customer]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <>
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="animate-pulse border-b border-gray-100">
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
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
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
        <Users className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No customers yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start building your customer base by adding your first customer
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <UserPlus className="w-5 h-5" />
        Add Your First Customer
      </button>
    </div>
  );

  // Mobile Card View
  const MobileCard = ({ customer }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleDelete(customer.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete customer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
            <p className="font-medium text-gray-800">{customer.contact}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg">
            <Mail className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
            <p className="font-medium text-gray-800">
              {customer.email || <span className="text-gray-400 italic">Not provided</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Customers">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Card - Optional Enhancement */}
      {!loading && customers.length > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Customers</p>
              <p className="text-4xl font-bold">{customers.length}</p>
            </div>
            <div className="hidden sm:block">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : customers.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {customers.map((customer) => (
              <MobileCard key={customer.id} customer={customer} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-800">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800 font-medium">{customer.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">
                          {customer.email || <span className="text-gray-400 italic">N/A</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDelete(customer.id)}
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

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCustomer}
      />
    </Layout>
  );
};

export default Customers;