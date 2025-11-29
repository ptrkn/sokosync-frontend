import { useState, useEffect } from "react";
import { X, Package, Hash, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

const ProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    threshold: "5", // Default low stock alert
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", quantity: "", price: "", threshold: "5" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Form reset handled by parent or useEffect
  };

  return (
    // Backdrop with Blur
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Product</h2>
              <p className="text-xs text-gray-500 mt-0.5">Add inventory details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Product Name Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Milk 500ml"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Grid for Quantity & Price */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Hash size={16} />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  Price (KES) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                Low Stock Alert At <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                  <AlertTriangle size={16} />
                </div>
                <input
                  type="number"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-amber-900 font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 pl-1">Get notified when stock falls below this number.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Save Product
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;