import { useForm } from "react-hook-form";
import { InsertCustomer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerFormProps {
  onSubmit: (data: InsertCustomer) => void;
  isSubmitting: boolean;
  initialData?: InsertCustomer;
}

export function CustomerForm({ onSubmit, isSubmitting, initialData }: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InsertCustomer>({
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active", // ✅ Correct default
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block font-semibold">Name</label>
        <Input type="text" {...register("name", { required: "Name is required" })} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block font-semibold">Email</label>
        <Input type="email" {...register("email", { required: "Email is required" })} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block font-semibold">Phone</label>
        <Input type="text" {...register("phone")} />
      </div>

      {/* Address */}
      <div>
        <label className="block font-semibold">Address</label>
        <Input type="text" {...register("address")} />
      </div>

      {/* Status */}
      <div>
        <label className="block font-semibold">Status</label>
        <select
          {...register("status", { required: true })}
          className="border rounded-md w-full px-3 py-2"
          defaultValue="Active"
        >
          <option value="Active">Active</option>     {/* ✅ Capitalized correctly */}
          <option value="Inactive">Inactive</option> {/* ✅ Capitalized correctly */}
        </select>
        {errors.status && <p className="text-red-500 text-sm">Status is required</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block font-semibold">Notes</label>
        <Input type="text" {...register("notes")} />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Customer"}
      </Button>
    </form>
  );
}
