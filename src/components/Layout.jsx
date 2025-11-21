import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react"; // Import Icons

const Layout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* MOBILE: Overlay (Dark background when menu is open) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR (Responsive) */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* MOBILE HEADER (Only shows on small screens) */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-blue-600">SokoSync</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-700">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* PAGE CONTENT (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {/* Pass the page title if needed */}
            <div className="md:hidden mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;