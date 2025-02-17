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
  { icon: calendar, label: "Calendar" },
  { icon: messages, label: "Messages" },
  { icon: chart, label: "Analytics" },
  { icon: ai, label: "AI Tools" },
  { icon: members, label: "Members" },
  { icon: settings, label: "Settings" },
];

const Sidebar = () => {
  return (
    <aside className="text-black h-full p-4 flex flex-col items-center bg-white border border-black/30 rounded-2xl">
      {/* Logo */}
      <img src={logo} alt="Logo" className="my-4" />

      {/* Sidebar Navigation */}
      <nav className="flex flex-col items-center gap-4 w-full mt-5">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span className="text-sm font-medium hidden">{item.label}</span>
          </div>
        ))}
        <img src={sidebar} className="w-6 h-6 mt-2" alt="" />
      </nav>
    </aside>
  );
};

export default Sidebar;
