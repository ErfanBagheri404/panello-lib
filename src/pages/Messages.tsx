import { useState } from "react";
import grid from "../assets/Grid.svg";
import { FiSend, FiSearch, FiMessageSquare, FiFile } from "react-icons/fi";

// Define interfaces for User and Message
interface User {
  id: number;
  name: string;
  pfp: string;
  online: boolean;
}

interface Group {
  id: number;
  name: string;
  pfp: string;
  members: User[];
}

interface Message {
  sender: string;
  text?: string;
  file?: { name: string; size: string };
  timestamp: string;
  date: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Jason Binoffe",
    pfp: "https://source.unsplash.com/random/40x40?face1",
    online: true,
  },
  {
    id: 2,
    name: "Karthik Jeeva",
    pfp: "https://source.unsplash.com/random/40x40?face2",
    online: false,
  },
  {
    id: 3,
    name: "Samantha Lee",
    pfp: "https://source.unsplash.com/random/40x40?face3",
    online: true,
  },
];

const groups: Group[] = [
  {
    id: 1,
    name: "Design Team",
    pfp: "https://source.unsplash.com/random/40x40?group1",
    members: [users[0], users[2]],
  },
  {
    id: 2,
    name: "Development Team",
    pfp: "https://source.unsplash.com/random/40x40?group2",
    members: [users[1], users[2]],
  },
];

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Jason Binoffe",
      text: "Hi, Liki. Is there any update on the filing? I want to get this moving fast.",
      timestamp: "6:33 pm",
      date: "2023-12-10",
    },
    {
      sender: "You",
      text: "Hi Jasper. I will share the estimate today.\n\nWe need to display this while unwrapping the box",
      timestamp: "3:30 pm",
      date: "2023-12-10",
    },
    {
      sender: "Samantha Lee",
      text: "Hey, just checking in on the design progress. Any updates?",
      timestamp: "10:10 am",
      date: "2023-12-12",
    },
    {
      sender: "You",
      text: "Yes, I'll be sending the wireframes soon.",
      timestamp: "10:11 am",
      date: "2023-12-12",
    },
  ]);
  const [input, setInput] = useState<string>("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      sender: "You",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toISOString().split("T")[0],
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce(
    (acc: Record<string, Message[]>, msg: Message) => {
      const date = msg.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    },
    {}
  );

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex scrollbar-hide p-6 gap-5">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>
      {/* Sidebar */}
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

          {/* User List */}
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
            {users.map((user) => (
              <button
                key={user.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition ${
                  selectedUser.id === user.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedUser(user)}
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
            {/* Group List */}
            {groups.map((group) => (
              <button
                key={group.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition ${
                  selectedGroup?.id === group.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedGroup(group)}
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
      {/* Chat Window */}
      <div className="relative z-10 flex-1 border border-black/30 rounded-xl bg-white p-4 flex flex-col justify-between shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-3">
          <img
            src={selectedUser.pfp}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full border-2 border-blue-400"
          />
          <div>
            <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedUser.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Messages */}
        <div className="flex flex-col gap-4 overflow-y-auto h-[70vh] p-2 scrollbar-hide">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="space-y-4">
              <div className="text-center text-sm text-gray-500 my-4">
                {formatDate(date)}
              </div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-1 ${
                    msg.sender === "You" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xl ${
                      msg.sender === "You"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.text && (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                    {msg.file && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded">
                        <FiFile className="flex-shrink-0" />
                        <div>
                          <div className="text-sm">{msg.file.name}</div>
                          <div className="text-xs opacity-75">
                            {msg.file.size}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="text-xs mt-1 opacity-75">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Input Area */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Messages;
