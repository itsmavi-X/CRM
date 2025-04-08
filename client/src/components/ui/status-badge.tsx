import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status.toLowerCase() === "active";
  
  return (
    <span 
      className={cn(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        isActive 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
