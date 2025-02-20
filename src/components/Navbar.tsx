import { useLocation } from "react-router-dom";
import calendar from "../assets/Sidebar/Calendar.svg";
import messages from "../assets/Sidebar/chat_bubble.svg";
import home from "../assets/Sidebar/Home.svg";
import chart from "../assets/Sidebar/Pie chart.svg";
import settings from "../assets/Sidebar/Settings.svg";
import ai from "../assets/Sidebar/Sparkling.svg";
import members from "../assets/Sidebar/Users.svg";

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: home, label: "Home", path: "/" },
    { icon: ai, label: "AI Tools", path: "/ai" },
    { icon: members, label: "Members", path: "/members" },
    { icon: chart, label: "Analytics", path: "/graphs" },
    { icon: calendar, label: "Calendar", path: "/calendar" },
    { icon: messages, label: "Messages", path: "/messages" },
    { icon: settings, label: "Settings", path: "/settings" },
  ];

  // Find the current page label
  const currentPage = menuItems.find(item => item.path === location.pathname)?.label || "Dashboard";

  return (
    <nav className="bg-white px-6 py-4 flex justify-between border border-black/30 rounded-2xl items-center">
      <h1 className="text-xl font-bold">{currentPage}</h1>
    </nav>
  );
};

export default Navbar;
