import React from "react";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { User, Group } from "../../types";
import { useTheme } from "../theme-provider";

interface SidebarProps {
  users: User[];
  groups: Group[];
  selectedUser: User | null;
  selectedGroup: Group | null;
  onUserSelect: (user: User) => void;
  onGroupSelect: (group: Group) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  users,
  isOpen,
  groups,
  selectedUser,
  selectedGroup,
  onUserSelect,
  onGroupSelect,
}) => {
  const { theme } = useTheme();

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
          Messages
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
            placeholder="Search"
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
            ALL
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "text-gray-300 border-white/30 hover:bg-gray-700"
                : "text-gray-600 border-black/30 hover:bg-gray-100"
            }`}
          >
            PEOPLE
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark"
                ? "text-gray-300 border-white/30 hover:bg-gray-700"
                : "text-gray-600 border-black/30 hover:bg-gray-100"
            }`}
          >
            GROUPS
          </button>
        </div>
        {/* User & Group List */}
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
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
                onClick={() => onUserSelect(user)}
              >
                <div className="relative">
                  <img
                    src={user.pfp}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {user.name}
                  </div>
                  <div
                    className={`text-sm flex justify-between items-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>{user.online ? "Online" : "Offline"}</span>
                    <span
                      className={
                        theme === "dark" ? "text-blue-300" : "text-blue-500"
                      }
                    >
                      View Profile
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          {/* {groups.map((group) => {
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
                    {group.members.length} members
                  </div>
                </div>
              </button>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
