import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Logo2.svg";
import logo2 from "../assets/Logo.svg";
import calendar from "../assets/Sidebar/Calendar.svg";
import messages from "../assets/Sidebar/chat_bubble.svg";
import home from "../assets/Sidebar/Home.svg";
import chart from "../assets/Sidebar/Pie chart.svg";
import settings from "../assets/Sidebar/Settings.svg";
import sidebar from "../assets/Sidebar/Sidebar.svg";
import ai from "../assets/Sidebar/Sparkling.svg";
import members from "../assets/Sidebar/Users.svg";

type MenuItem = {
  icon: string;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { icon: home, label: "Home", path: "/" },
  { icon: ai, label: "AI Tools", path: "/ai" },
  { icon: members, label: "Members", path: "/members" },
  { icon: chart, label: "Analytics", path: "/graphs" },
  { icon: calendar, label: "Calendar", path: "/calendar" },
  { icon: messages, label: "Messages", path: "/messages" },
  { icon: settings, label: "Settings", path: "/settings" },
];

const tasks = [
  { color: "bg-red-500", label: "Product Lunch" },
  { color: "bg-blue-500", label: "Team Brainstorm" },
  { color: "bg-yellow-400", label: "Branding Lunch" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  const handleMenuItemClick = (path: string) => {
    setSelectedItem(path);
    navigate(path);
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between items-center bg-white border border-black/30 rounded-2xl transition-all duration-300 overflow-y-auto scrollbar-hide ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center p-6 pb-0 gap-4 font-bold w-full ${
          isOpen ? "mb-2" : "mb-5"
        } p-2`}
      >
        <img src={logo} alt="Logo" className="min-w-[32px]" />
        <span
          className={`text-xl transition-all duration-300 ${
            isOpen
              ? "opacity-100 max-w-full"
              : "opacity-0 max-w-0 overflow-hidden"
          }`}
        >
          Panello
        </span>
      </div>

      {/* Sidebar Navigation */}
      <nav
        className={`flex flex-col p-4   ${
          isOpen
            ? "items-start gap-1 border-b border-black/30"
            : "items-center gap-4"
        } w-full flex-grow`}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMenuItemClick(item.path)}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full ${
              !isOpen && "justify-center"
            }`}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="min-w-[24px]"
              style={{
                filter:
                  selectedItem === item.path
                    ? "brightness(0) saturate(100%) invert(39%) sepia(87%) saturate(667%) hue-rotate(220deg) brightness(85%) contrast(91%)"
                    : "none",
              }}
            />
            <span
              className={`text-sm font-medium transition-all duration-300 ${
                isOpen
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 overflow-hidden hidden"
              }`}
              style={{
                color: selectedItem === item.path ? "#756CDF" : "black",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Tasks Section */}
      {isOpen && (
        <div className="w-full p-4">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium">Tasks</h3>
            <button className="text-xs text-[#756CDF] bg-[#766cdf4f] px-2 py-1 rounded-full">
              + Add
            </button>
          </div>
          <ul className="space-y-5 mb-4">
            {tasks.map((task, idx) => (
              <li key={idx} className="flex items-center gap-4 text-sm">
                <span className={`w-3 h-3 rounded-[4px] ${task.color}`}></span>
                {task.label}
              </li>
            ))}
          </ul>

          {/* Invite Members Card */}
          <div
            className="p-6  rounded-2xl text-white text-sm mt-[80px]"
            style={{
              background: "linear-gradient(138deg, #7D71E2 0%, #FFF 138.83%)",
            }}
          >
            <h4 className="font-semibold text-lg text-white flex  items-center gap-2">
              <img src={logo2} width={20} height={20}></img> Panello
            </h4>
            <p className="mt-3 mb-3 text-white font-light">
              New members will gain access to public Spaces, Docs, and
              Dashboards
            </p>
            <button
              onClick={() => navigate("/members")}
              className="px-3 py-1 bg-white text-black rounded-full text-md font-medium"
            >
              + Invite Members
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button */}

      <div className="self-start p-4 pt-0 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={` hover:bg-gray-100 rounded-md p-2 transition w-full flex items-center gap-2 justify-center ${
            isOpen ? "justify-start" : "items-center"
          }`}
        >
          <img src={sidebar} className="min-w-[24px]" alt="Toggle Sidebar" />
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              isOpen
                ? "opacity-100 max-w-full"
                : "opacity-0 max-w-0 overflow-hidden hidden"
            }`}
          >
            {isOpen ? "Close Sidebar" : ""}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
