import { useQuery } from "@tanstack/react-query";
import { Customer } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { StatsGrid } from "@/components/ui/stats-grid";
import { CustomerTable } from "@/components/ui/customer-table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  // Fetch customers
  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Calculate stats
  const stats = {
    totalCustomers: customers?.length || 0,
    activeCustomers: customers?.filter((c) => c.status === "active").length || 0,
    inactiveCustomers:
      customers?.filter((c) => c.status === "inactive").length || 0,
    // For new customers, we could add a date filter here
    newCustomers: customers?.length ? Math.floor(customers.length * 0.1) : 0,
  };

  // Filter customers based on search term
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-5 md:p-8 mt-16 md:mt-0">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || user?.username}
        </p>
      </header>

      {/* Stats Section */}
      <StatsGrid stats={stats} />

      {/* Customers Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Customers
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search customers..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <Button onClick={() => navigate("/add-customer")}>
              <Plus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-500">Loading customers...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            <p>Error loading customers: {error?.message}</p>
          </div>
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          <CustomerTable customers={filteredCustomers} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            {customers && customers.length > 0 ? (
              <p>No customers match your search.</p>
            ) : (
              <div>
                <p>No customers found.</p>
                <Button
                  onClick={() => navigate("/add-customer")}
                  variant="outline"
                  className="mt-4"
                >
                  Add your first customer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
