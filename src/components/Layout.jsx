import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const Layout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* --- MOBILE OVERLAY (Backdrop Blur) --- */}
      {/* This only shows when the sidebar is open on mobile */}
      <div 
        className={`
          fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* --- SIDEBAR --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 shadow-2xl transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        md:relative md:translate-x-0 md:shadow-none md:w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
        
        {/* MOBILE HEADER (Sticky + Glassmorphism) */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-16 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">SokoSync</h1>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* SCROLLABLE PAGE AREA */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            
            {/* Mobile Page Title (Visible only on small screens) */}
            {title && (
              <div className="md:hidden mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              </div>
            )}
            
            {/* The Page Content */}
            <div className="animate-in fade-in zoom-in-95 duration-300">
              {children}
            </div>
            
          </div>
        </main>
      </div>

    </div>
  );
};

export default Layout;