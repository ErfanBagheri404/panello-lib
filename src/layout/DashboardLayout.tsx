import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen p-2.5">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-2.5">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <div className=" flex-1 overflow-none">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
