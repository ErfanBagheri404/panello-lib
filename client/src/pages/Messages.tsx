import { useState, useEffect } from "react";
import Sidebar from "../components/Messages/Sidebar";
import ChatWindow from "../components/Messages/ChatWindow";
import { User, Message } from "../types";
import { useTheme } from "../components/theme-provider";
import axios from "axios";
import socket from "../lib/socket";

const Messages = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCurrentUserId(res.data._id);
        socket.emit("join", res.data._id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Only fetch messages when we have valid IDs
  useEffect(() => {
    if (!selectedUser || !currentUserId || selectedUser.id.startsWith('temp-id-')) return;
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/conversation/${selectedUser.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const formattedMessages = res.data.map((msg: any) => formatMessage(msg, currentUserId));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUserId]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/users/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const fetchedUsers = response.data.map((member: any, index: number) => ({
          id: member._id || `temp-id-${index}`,
          name: member.name || `${member.firstName || ""} ${member.lastName || ""}` || member.email || "Unknown User",
          pfp: member.avatar || "/default-avatar.png",
          online: member.status === "Online" || member.isOnline || false,
        }));
        setUsers(fetchedUsers);
        if (fetchedUsers.length > 0 && !selectedUser) {
          setSelectedUser(fetchedUsers[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    if (!currentUserId) return;
    socket.on("receiveMessage", (msg) => {
      const formattedMessage = formatMessage(msg, currentUserId);
      setMessages((prev) => [...prev, formattedMessage]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUserId]);

  const formatMessage = (msg: any, currentUserId: string): Message => ({
    sender: msg.sender._id.toString() === currentUserId ? "You" : msg.sender.name,
    text: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: new Date(msg.createdAt).toISOString().split("T")[0],
  });

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser || !currentUserId) return;

    const newMessage = {
      senderId: currentUserId,
      receiverId: selectedUser.id,
      content: input,
      type: "text",
    };

    // Optimistic update
    const tempMessage: Message = {
      sender: "You",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString().split("T")[0],
    };
    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    try {
      // Send via socket
      socket.emit("sendMessage", newMessage);

      // Save to database
      await axios.post("/api/messages", newMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((m) => m !== tempMessage)); // Rollback on failure
    }
  };

  const handleBackClick = () => {
    setIsSidebarOpen(true);
    setSelectedUser(null);
    setInput("");
    setMessages([]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`relative border ${theme === "dark" ? "border-white/30" : "border-black/30"} h-screen mt-2.5 w-full rounded-2xl overflow-hidden flex scrollbar-hide p-4 lg:p-6 gap-5 items-center`}>
      {/* Background and other JSX */}
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        isOpen={isSidebarOpen}
        onUserSelect={(user) => {
          setSelectedUser(user);
          setIsSidebarOpen(false);
        }}
      />
      <ChatWindow
        selectedUser={selectedUser}
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