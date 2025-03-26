import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import calendar from "../assets/Sidebar/Calendar.svg";
import messages from "../assets/Sidebar/chat_bubble.svg";
import home from "../assets/Sidebar/Home.svg";
import chart from "../assets/Sidebar/Pie chart.svg";
import settings from "../assets/Sidebar/Settings.svg";
import ai from "../assets/Sidebar/Sparkling.svg";
import members from "../assets/Sidebar/Users.svg";
import axios from "axios";

const Navbar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role: string;
  } | null>(null);

  const menuItems = [
    { icon: home, label: "Home", path: "/" },
    { icon: ai, label: "AI Tools", path: "/ai" },
    { icon: members, label: "Members", path: "/members" },
    { icon: chart, label: "Graphs & Charts", path: "/graphs" },
    { icon: calendar, label: "Calendar", path: "/calendar" },
    { icon: messages, label: "Messages", path: "/messages" },
    { icon: settings, label: "Settings", path: "/settings" },
  ];

  const currentPage =
    menuItems.find((item) => item.path === location.pathname)?.label ||
    "Dashboard";


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const useClickOutside = (ref: any, callback: () => void) => {
    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, callback]);
  };
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserProfile(response.data); 
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchProfile();
    }
  }, []);

  return (
    <nav
      className={`px-6 py-3 flex justify-between border rounded-2xl items-center transition-all duration-300 ${
        theme === "dark"
          ? "bg-black text-white border-white/30"
          : "bg-white text-black border-black/30"
      }`}
    >
      <h1
        className={`text-xl font-bold ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {currentPage}
      </h1>


      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen((prev) => !prev);
          }}
          className={`flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 ${
            theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          <div className="flex w-fit">
            <img
              src={userProfile?.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bg-green-500 rounded-full w-3 h-3 left-9 bottom-2"></div>
          </div>
          <div className="flex flex-col items-start">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {userProfile?.firstName} {userProfile?.lastName}
            </span>
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {userProfile?.role}
            </span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            } ${theme === "dark" ? "text-white" : "text-black"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>


        {isDropdownOpen && (
          <div
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-100 ${
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
            ref={dropdownRef}
          >
            <div
              className={`flex items-center px-4 py-2 gap-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              <img
                src={userProfile?.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span>
                  {userProfile?.firstName} {userProfile?.lastName}
                </span>
                <span
                  className={`text-gray-400 text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {userProfile?.role || "User"}
                </span>
              </div>
            </div>
            <a
              href="#"
              className={`block px-4 py-2 text-sm ${
                theme === "dark"
                  ? "text-white hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => navigate("/settings")}
            >
              Settings
            </a>
            <button
              onClick={handleLogout}
              className={`w-full text-left px-4 py-2 text-sm ${
                theme === "dark"
                  ? "text-white hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
