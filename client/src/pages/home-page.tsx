import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import Dashboard from "@/pages/dashboard";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile header */}
      <div className="md:hidden bg-neutral-dark text-white p-4 fixed top-0 left-0 right-0 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold tracking-tight flex items-center">
          <i className="fas fa-users-gear mr-2"></i>
          <span>CRM System</span>
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:ml-0">
        <Dashboard />
      </div>
    </div>
  );
}
