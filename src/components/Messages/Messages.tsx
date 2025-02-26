import { useState } from "react";
import grid from "../../assets/Grid.svg";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { User, Group, Message } from "../../types";
import { users, groups, initialMessages } from "../../data/mockData";

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
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

      <Sidebar
        users={users}
        groups={groups}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        onUserSelect={setSelectedUser}
        onGroupSelect={setSelectedGroup}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSendMessage={sendMessage}
      />
    </main>
  );
};

export default Messages;
