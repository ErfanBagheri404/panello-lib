import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex lg:flex-row flex-col h-screen p-2.5">
      {/* Sidebar */}
      <div className="h-full hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-2.5 h-full">
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Content (Hides scrollbar) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
