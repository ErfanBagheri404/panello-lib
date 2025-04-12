import {
  User,
  Message,
  ChatWindowProps,
  MessageGroupProps,
  MessageInputProps,
  MessageItemProps,
} from "../../types";
import { formatDate } from "../../lib/dateUtils";
import { FiSend } from "react-icons/fi";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";
import socket from "../../lib/socket";
import { useEffect, useState } from "react";
import axios from "axios";

const ChatHeader = ({ user, onBack }: { user: User; onBack?: () => void }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div
      className={`flex items-center gap-3 pb-3 ${
        theme === "dark" ? "border-gray-700" : "border-gray-300"
      } border-b`}
    >
      <img
        src={user.pfp}
        alt={user.name}
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-blue-400 object-cover"
      />
      <div className="flex items-center justify-between w-full">
        <div>
          <h2
            className={`text-md lg:text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {user.name}
          </h2>
          <p
            className={`text-xs lg:text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {user.online
              ? translations[language].online
              : translations[language].offline}
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className={`text-sm lg:hidden px-3 py-1 rounded-full ${
              theme === "dark"
                ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {translations[language].backButton}
          </button>
        )}
      </div>
    </div>
  );
};

const ChatWindow = ({
  selectedUser,
  messages,
  input,
  onInputChange,
  onBackClick,
  isSidebarOpen,
}: ChatWindowProps) => {
  const { theme } = useTheme();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          // Remove the full URL
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUserId(res.data._id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Update the socket effect
  useEffect(() => {
    if (
      !selectedUser ||
      !currentUserId ||
      selectedUser.id.startsWith("temp-id-")
    )
      return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/api/messages/conversation/${selectedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLocalMessages(
          res.data.map((msg: any) => formatMessage(msg, currentUserId))
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("join", currentUserId);

    // Update socket listener for newMessage event
    socket.on("newMessage", (msg) => {
      console.log("Received new message via socket:", msg);

      // Check if this message belongs to the current conversation
      if (
        (msg.sender._id === currentUserId &&
          msg.receiver === selectedUser.id) ||
        (msg.sender._id === selectedUser.id && msg.receiver === currentUserId)
      ) {
        console.log("Adding new message to conversation");
        setLocalMessages((prev) => [
          ...prev,
          formatMessage(msg, currentUserId),
        ]);
      } else {
        console.log("Message not for current conversation");
      }
    });

    // Also listen for the receiveMessage event (used in server.ts)
    socket.on("receiveMessage", (msg) => {
      console.log("Received message via receiveMessage event:", msg);

      if (
        (msg.sender._id === currentUserId &&
          msg.receiver === selectedUser.id) ||
        (msg.sender._id === selectedUser.id && msg.receiver === currentUserId)
      ) {
        console.log("Adding received message to conversation");
        setLocalMessages((prev) => [
          ...prev,
          formatMessage(msg, currentUserId),
        ]);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("receiveMessage");
    };
  }, [selectedUser, currentUserId]);

  const formatMessage = (msg: any, currentUserId: string): Message => {
    const isSentByCurrentUser = msg.sender._id === currentUserId;
    return {
      sender: isSentByCurrentUser ? "You" : msg.senderName || "Unknown",
      text: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(msg.createdAt).toISOString().split("T")[0],
    };
  };

  const handleSendMessage = async () => {


    if (!input.trim() || !selectedUser || !currentUserId) {
      console.log("Send message blocked - missing required data:", {
        hasInput: !!input.trim(),
        hasSelectedUser: !!selectedUser,
        hasCurrentUserId: !!currentUserId,
      });
      return;
    }

    // Check if the selected user is a demo account (has temp-id)
    if (selectedUser.id.startsWith("temp-id-")) {
      console.error("Cannot send to demo user:", {
        userId: selectedUser.id,
        userName: selectedUser.name,
      });
      alert(
        "Cannot send messages to demo users. Please select a real user with a valid account."
      );
      onInputChange(""); // Clear the input field
      return;
    }

    try {
      console.log("Preparing message for:", selectedUser.id);
      const newMessage = {
        sender: currentUserId,
        receiver: selectedUser.id,
        content: input,
      };

      console.log("Sending message to server...");
      const response = await axios.post("/api/messages", newMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Message sent successfully:", response.data);
      setLocalMessages((prev) => [
        ...prev,
        formatMessage(response.data, currentUserId),
      ]);
      onInputChange("");
    } catch (error) {
      console.error("Error sending message:", {
        error: error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response?.data : null,
      });

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Failed to send message");
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to send message");
      }
    }
  };

  // Update the return to use handleSendMessage
  return (
    <div
      className={`relative z-10 flex-1 border rounded-xl p-4 flex flex-col justify-between h-full w-full transition-all duration-300 ${
        theme === "dark"
          ? "bg-black border-white/30"
          : "bg-white border-black/30"
      } ${isSidebarOpen ? "hidden" : ""}`}
    >
      {selectedUser && (
        <ChatHeader
          user={selectedUser}
          onBack={!isSidebarOpen ? onBackClick : undefined}
        />
      )}
      <MessagesList messages={localMessages} />
      <MessageInput
        input={input}
        onInputChange={onInputChange}
        onSendMessage={handleSendMessage} // Make sure this is passed correctly
      />
    </div>
  );
};

export default ChatWindow;

// Update the MessageItem component
const MessageItem = ({ message }: MessageItemProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isCurrentUser = message.sender === "You";

  return (
    <div
      className={`w-full flex mb-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[80%]">
        <div
          className={`p-3 rounded-lg ${
            isCurrentUser
              ? `bg-blue-500 text-white rounded-tr-none`
              : `${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-white"
                } rounded-tl-none`
          }`}
        >
          {message.text && (
            <p
              className={`whitespace-pre-wrap text-sm lg:text-md ${
                language === "fa" ? "text-right" : ""
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Update the MessageInput component
const MessageInput = ({
  input,
  onInputChange,
  onSendMessage,
}: MessageInputProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "fa";

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="flex w-full mt-4 space-y-2">
      <div className="flex w-full justify-between items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className={`flex-1 p-2 lg:p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs lg:text-md ${
            isRTL ? "ml-2" : "mr-2"
          } ${
            theme === "dark"
              ? "bg-gray-900 text-white border-white/30 placeholder-gray-400"
              : "bg-white text-black border-black/30 placeholder-gray-500"
          }`}
          placeholder={translations[language].typeMessage}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button
          onClick={handleSend}
          className="p-2 lg:p-3 bg-blue-500 text-white rounded-md lg:rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
        >
          <FiSend className="w-[15px] h-[15px] lg:w-[20px] lg:h-[20px]" />
        </button>
      </div>
    </div>
  );
};

const MessageGroup = ({ date, messages }: MessageGroupProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <div
        className={`text-center text-xs lg:text-sm my-4 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {formatDate(date, language)}
      </div>
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
    </div>
  );
};

const MessagesList = ({ messages }: { messages: Message[] }) => {
  const groupedMessages = messages.reduce(
    (acc: Record<string, Message[]>, msg: Message) => {
      const date = msg.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    },
    {} as Record<string, Message[]>
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-[70vh] p-2 scrollbar-hide">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <MessageGroup key={date} date={date} messages={msgs} />
      ))}
    </div>
  );
};
