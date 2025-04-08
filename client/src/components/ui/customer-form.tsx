import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, InsertCustomer, insertCustomerSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (data: InsertCustomer) => void;
  isSubmitting: boolean;
}

export function CustomerForm({
  initialData,
  onSubmit,
  isSubmitting,
}: CustomerFormProps) {
  const [, navigate] = useLocation();
  
  const formSchema = insertCustomerSchema.extend({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(0).optional().transform(val => val || undefined),
    company: z.string().min(0).optional().transform(val => val || undefined),
    notes: z.string().min(0).optional().transform(val => val || undefined),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      status: initialData?.status || "active",
      notes: initialData?.notes || "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Customer Information</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter customer's full name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter company name" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email address" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
                      type="tel" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this customer" 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Customer" : "Save Customer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
