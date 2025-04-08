import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const NavItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: string;
    label: string;
  }) => {
    const isActive = location === to;
    return (
      <li
        className={cn(
          "px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors rounded-md mx-2 flex items-center cursor-pointer",
          isActive && "bg-blue-600 text-white"
        )}
        onClick={() => {
          navigate(to);
          if (window.innerWidth < 768) {
            toggleSidebar();
          }
        }}
      >
        <i className={`${icon} fa-fw mr-3`}></i>
        <span>{label}</span>
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "bg-neutral-dark text-white w-64 flex-shrink-0 md:block",
        isOpen
          ? "fixed z-20 top-16 bottom-0 left-0 w-64"
          : "hidden"
      )}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <i className="fas fa-users-gear mr-2"></i>
          <span>CRM System</span>
        </h1>
      </div>
      <nav className="mt-8 flex flex-col h-[calc(100%-5rem)]">
        <ul className="flex-1">
          <NavItem to="/" icon="fas fa-chart-line" label="Dashboard" />
          <NavItem to="/" icon="fas fa-users" label="Customers" />
          <NavItem to="/add-customer" icon="fas fa-user-plus" label="Add Customer" />
        </ul>
        <ul>
          <li
            className="px-4 py-3 mt-auto text-gray-300 hover:bg-blue-700 hover:text-white transition-colors rounded-md mx-2 flex items-center cursor-pointer"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt fa-fw mr-3"></i>
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
