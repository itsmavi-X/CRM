import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useLocation, useParams } from "wouter";
import { CustomerForm } from "@/components/ui/customer-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Customer, InsertCustomer } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function EditCustomer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, navigate] = useLocation();
  const params = useParams();
  const customerId = params.id;
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch customer data
  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useQuery<Customer>({
    queryKey: [`/api/customers/${customerId}`],
    enabled: !!customerId,
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (customerData: InsertCustomer) => {
      const res = await apiRequest(
        "PUT", 
        `/api/customers/${customerId}`, 
        customerData
      );
      return res.json();
    },
    onSuccess: (updatedCustomer: Customer) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/customers/${customerId}`] 
      });
      toast({
        title: "Customer updated",
        description: `${updatedCustomer.name} has been updated successfully.`,
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertCustomer) => {
    updateCustomerMutation.mutate(data);
  };

  // If customer not found, show error
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: `Could not find customer: ${error?.message}`,
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isError, error, navigate, toast]);

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
            <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : customer ? (
            <CustomerForm 
              initialData={customer}
              onSubmit={handleSubmit} 
              isSubmitting={updateCustomerMutation.isPending} 
            />
          ) : (
            <div className="text-center text-red-500">
              Customer not found
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
