import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { CustomerForm } from "@/components/ui/customer-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Customer, InsertCustomer } from "@shared/schema";

export default function AddCustomer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addCustomerMutation = useMutation({
    mutationFn: async (customerData: InsertCustomer) => {
      const res = await apiRequest("POST", "/api/customers", customerData);
      return res.json();
    },
    onSuccess: (newCustomer: Customer) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Customer added",
        description: `${newCustomer.name} has been added successfully.`,
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertCustomer) => {
    // 🔥 FIX: Capitalize the status to match enum
    if (data.status) {
      data.status = data.status.toLowerCase() === "active" ? "Active" : "Inactive";
    }

    addCustomerMutation.mutate(data);
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
        <main className="flex-1 p-5 md:p-8 mt-16 md:mt-0">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
          </header>

          <CustomerForm 
            onSubmit={handleSubmit} 
            isSubmitting={addCustomerMutation.isPending} 
          />
        </main>
      </div>
    </div>
  );
}
