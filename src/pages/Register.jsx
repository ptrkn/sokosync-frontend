import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Store, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success!
      // Optional: You could show a sleek "Success" modal here instead of alert
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600 to-blue-500 transform -skew-y-3 origin-top-left z-0"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl z-0"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Store size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join SokoSync and start tracking your business
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;