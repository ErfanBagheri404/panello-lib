import { useState } from "react";
import grid from "../assets/Grid.svg";
import Sidebar from "../components/Messages/Sidebar";
import ChatWindow from "../components/Messages/ChatWindow";
import { User, Group, Message } from "../types";
import { users, groups, initialMessages } from "../data/mockData";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleBackClick = () => {
    setIsSidebarOpen(true);
    setSelectedUser(null);
    setSelectedGroup(null);
    setInput("");
    setMessages(initialMessages);
  };

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 w-full rounded-2xl overflow-hidden flex scrollbar-hide p-4 lg:p-6  gap-5 items-center">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable={false}
          src={grid}
          alt="grid background"
        />
      </div>
      <Sidebar
        users={users}
        groups={groups}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        isOpen={isSidebarOpen}
        onUserSelect={(user) => {
          setSelectedUser(user);
          setSelectedGroup(null);
          setIsSidebarOpen(false);
        }}
        onGroupSelect={(group) => {
          setSelectedGroup(group);
          setSelectedUser(null);
          setIsSidebarOpen(false);
        }}
      />

      <ChatWindow
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        onBackClick={handleBackClick}
        isSidebarOpen={isSidebarOpen}
      />
    </main>
  );
};

export default Messages;
