import { useState } from "react";
import logo from "../assets/Logo2.svg";
import calendar from "../assets/Sidebar/Calendar.svg";
import messages from "../assets/Sidebar/chat_bubble.svg";
import home from "../assets/Sidebar/Home.svg";
import chart from "../assets/Sidebar/Pie chart.svg";
import settings from "../assets/Sidebar/Settings.svg";
import sidebar from "../assets/Sidebar/Sidebar.svg";
import ai from "../assets/Sidebar/Sparkling.svg";
import members from "../assets/Sidebar/Users.svg";

const menuItems = [
  { icon: home, label: "Home" },
  { icon: ai, label: "AI Tools" },
  { icon: members, label: "Members" },
  { icon: chart, label: "Analytics" },
  { icon: calendar, label: "Calendar" },
  { icon: messages, label: "Messages" },
  { icon: settings, label: "Settings" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`h-full p-4 flex flex-col justify-between items-center bg-white border border-black/30 rounded-2xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-4 font-bold w-full transition-all duration-300  mb-5 p-2 `}
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
        className={`flex flex-col ${
          isOpen ? "items-start" : "items-center"
        } gap-4 w-full flex-grow`}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer w-full ${
              !isOpen && "justify-center"
            }`}
          >
            <img src={item.icon} alt={item.label} className="min-w-[24px]" />
            <span
              className={`text-sm font-medium transition-all duration-300 ${
                isOpen
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 overflow-hidden hidden"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 hover:bg-gray-100 rounded-md transition w-full flex items-center gap-2 justify-center ${
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
    </aside>
  );
};

export default Sidebar;
