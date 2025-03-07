import { Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex lg:flex-row flex-col h-screen lg:p-2.5 p-3 py-1">
      {/* Sidebar */}
      <div className="h-full hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col lg:ml-2.5 h-full">
        {/* Navbar */}
        <div className="hidden lg:block">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                <span className="animate-pulse text-xl font-medium">Loading...</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>

        {/* Mobile Sidebar */}
        <div className="block lg:hidden mt-2.5">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
