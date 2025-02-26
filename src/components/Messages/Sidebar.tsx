import React from "react";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { User, Group } from "../../types";

interface SidebarProps {
  users: User[];
  groups: Group[];
  selectedUser: User;
  selectedGroup: Group | null;
  onUserSelect: (user: User) => void;
  onGroupSelect: (group: Group) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  users,
  groups,
  selectedUser,
  selectedGroup,
  onUserSelect,
  onGroupSelect,
}) => {
  return (
    <div className="relative z-10 w-1/4 border border-black/30 rounded-xl p-4 flex flex-col gap-4 bg-white/40 backdrop-blur-lg">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <FiMessageSquare className="text-blue-500" />
        <span>Messages</span>
      </div>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
            ALL
          </button>
          <button className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-100 text-sm">
            PEOPLE
          </button>
          <button className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-100 text-sm">
            GROUPS
          </button>
        </div>

        {/* User & Group List */}
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {users.map((user) => (
            <button
              key={user.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                selectedUser.id === user.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
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
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500 flex justify-between items-center">
                  <span>{user.online ? "Online" : "Offline"}</span>
                  <span className="text-blue-500 text-xs">View Profile</span>
                </div>
              </div>
            </button>
          ))}
          {groups.map((group) => (
            <button
              key={group.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                selectedGroup?.id === group.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
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
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-gray-500">
                  {group.members.length} members
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
