import React, { useEffect, useState } from "react";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { SidebarProps, User } from "../../types";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";
import axios from "axios";

const Sidebar: React.FC<SidebarProps> = ({
  users: initialUsers,
  isOpen,
  // groups, // Commented out groups prop
  selectedUser,
  // selectedGroup, // Commented out selectedGroup prop
  onUserSelect,
  // onGroupSelect, // Commented out onGroupSelect prop
}) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Get current user ID with fallback to API
        let currentUserId = localStorage.getItem("userId");

        if (!currentUserId) {
          const userResponse = await axios.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          currentUserId = userResponse.data._id;
          if (currentUserId) {
            localStorage.setItem("userId", currentUserId);
          }
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/members",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const filteredMembers = response.data.filter((member: any) => {
          const memberId = member.id || member._id;
          return memberId && String(memberId) !== String(currentUserId);
        });

        const fetchedMembers = filteredMembers.map((member: any) => ({
          id: member.id || member._id,
          name:
            member.name ||
            (member.firstName && member.lastName
              ? `${member.firstName} ${member.lastName}`
              : member.email || "Unknown User"),
          pfp: member.avatar || "/default-avatar.png",
          online: member.status === "Online" || member.isOnline || false,
        }));

        setUsers(fetchedMembers);
        setError(undefined);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        setError("Failed to load members. Check console for details.");
      }
    };

    fetchMembers();
  }, [initialUsers]);

  const handleUserSelect = (user: User) => {
    try {
      onUserSelect(user);
    } catch (error) {
      console.error("Failed to select user:", {
        userId: user.id,
        userName: user.name,
        error: error instanceof Error ? error.message : String(error),
      });
      setError("Failed to start conversation. Check console for details.");
    }
  };

  return (
    <div
      className={`relative z-10 w-full lg:w-1/4 h-full border ${
        theme === "dark"
          ? "bg-black border-white/30"
          : "bg-white border-black/30"
      } rounded-xl p-4 flex flex-col ${isOpen ? "block" : "hidden lg:block"}`}
    >
      <div className="flex items-center gap-2 text-lg font-semibold mb-4">
        <FiMessageSquare className="text-blue-500" />
        <span className={theme === "dark" ? "text-white" : "text-black"}>
          {translations[language].messages}
        </span>
      </div>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch
            className={`absolute top-3 left-3 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder={translations[language].searchPlaceholder}
            className={`w-full p-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              theme === "dark"
                ? "bg-gray-900 text-white border-white/30 placeholder-gray-400"
                : "bg-white text-black border-black/30 placeholder-gray-500"
            }`}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "bg-blue-900 text-white border-white/30"
                : "bg-blue-100 text-blue-600 border-black/30"
            }`}
          >
            {translations[language].filterAll} {/* ALL */}
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "text-gray-300 border-white/30 hover:bg-gray-700"
                : "text-gray-600 border-black/30 hover:bg-gray-100"
            }`}
          >
            {translations[language].filterPeople} {/* PEOPLE */}
          </button>
          {/* Commented out Groups filter button
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "text-gray-300 border-white/30 hover:bg-gray-700"
                : "text-gray-600 border-black/30 hover:bg-gray-100"
            }`}
          >
            {translations[language].filterGroups}
          </button>
          */}
        </div>

        {/* User List */}
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {error && (
            <div className={`text-center py-2 text-red-500`}>{error}</div>
          )}

          {users.map((user) => {
            const userButtonClass = `flex items-center gap-3 p-2 rounded-lg transition ${
              selectedUser?.id === user.id
                ? theme === "dark"
                  ? "bg-blue-900"
                  : "bg-blue-100"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }`;
            return (
              <button
                key={user.id}
                className={userButtonClass}
                onClick={() => handleUserSelect(user)}
              >
                <div className="relative">
                  <img
                    src={user.pfp}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                  />
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      language === "fa" ? "text-right" : "text-left"
                    } ${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    {user.name}
                  </div>
                  <div
                    className={`text-sm flex justify-between items-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>
                      {user.online
                        ? translations[language].online
                        : translations[language].offline}
                    </span>
                    <span
                      className={
                        theme === "dark" ? "text-blue-300" : "text-blue-500"
                      }
                    >
                      {translations[language].viewProfile}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Commented out Groups section
          {groups.map((group) => {
            const groupButtonClass = `flex items-center gap-3 p-2 rounded-lg transition ${
              selectedGroup?.id === group.id
                ? theme === "dark"
                  ? "bg-blue-900"
                  : "bg-blue-100"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
            }`;
            return (
              <button
                key={group.id}
                className={groupButtonClass}
                onClick={() => onGroupSelect(group)}
              >
                <div className="relative">
                  <img
                    src={group.pfp}
                    alt={group.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {group.name}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {group.members.length} {translations[language].members}
                  </div>
                </div>
              </button>
            );
          })}
          */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
