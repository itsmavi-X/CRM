interface StatsGridProps {
  stats: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    newCustomers: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <i className="fas fa-users text-blue-500"></i>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500 font-medium flex items-center">
            <i className="fas fa-arrow-up mr-1 text-xs"></i>
            12%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      {/* Active Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <i className="fas fa-user-check text-green-500"></i>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Active Customers</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.activeCustomers}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500 font-medium flex items-center">
            <i className="fas fa-arrow-up mr-1 text-xs"></i>
            8%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      {/* Inactive Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <i className="fas fa-user-xmark text-red-500"></i>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Inactive Customers</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.inactiveCustomers}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-red-500 font-medium flex items-center">
            <i className="fas fa-arrow-up mr-1 text-xs"></i>
            5%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      {/* New Customers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <i className="fas fa-user-plus text-purple-500"></i>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium">New Customers</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.newCustomers}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500 font-medium flex items-center">
            <i className="fas fa-arrow-up mr-1 text-xs"></i>
            24%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
}
