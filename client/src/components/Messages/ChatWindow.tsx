import { User, Group, Message } from "../../types";
import { formatDate } from "../../lib/dateUtils";
import { FiSend, FiFile } from "react-icons/fi";
import { useTheme } from "../theme-provider";

interface ChatWindowProps {
  selectedUser: User | null;
  selectedGroup?: Group | null;
  messages: Message[];
  input: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onBackClick?: () => void;
  isSidebarOpen: boolean;
}

const ChatHeader = ({ user, onBack }: { user: User; onBack?: () => void }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex items-center gap-3 pb-3 ${
        theme === "dark" ? "border-gray-700" : "border-gray-300"
      } border-b`}
    >
      <img
        src={user.pfp}
        alt={user.name}
        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-blue-400"
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
            {user.online ? "Online" : "Offline"}
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
            Back
          </button>
        )}
      </div>
    </div>
  );
};

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col gap-1 ${
        message.sender === "You" ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`p-3 rounded-lg max-w-xl ${
          message.sender === "You"
            ? "bg-blue-500 text-white rounded-tr-none"
            : theme === "dark"
            ? "bg-gray-800 text-white rounded-tl-none"
            : "bg-gray-100 text-black rounded-tl-none"
        }`}
      >
        {message.text && (
          <p className="whitespace-pre-wrap text-sm lg:text-md">
            {message.text}
          </p>
        )}
        {message.file && (
          <div
            className={`flex items-center gap-2 mt-2 p-2 rounded ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <FiFile
              className={`flex-shrink-0 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            />
            <div>
              <div
                className={`text-sm lg:text-sm ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {message.file.name}
              </div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {message.file.size}
              </div>
            </div>
          </div>
        )}
        <div
          className={`text-sm mt-1 ${
            message.sender === "You"
              ? "text-white opacity-75"
              : theme === "dark"
              ? "text-gray-300"
              : "text-gray-600"
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

interface MessageGroupProps {
  date: string;
  messages: Message[];
}

const MessageGroup = ({ date, messages }: MessageGroupProps) => {
  const { theme } = useTheme();
  return (
    <div className="space-y-4">
      <div
        className={`text-center text-xs lg:text-sm my-4 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {formatDate(date)}
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

interface MessageInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
}

const MessageInput = ({
  input,
  onInputChange,
  onSendMessage,
}: MessageInputProps) => {
  const { theme } = useTheme();
  return (
    <div className="flex w-full mt-4 space-y-2">
      <div className="flex w-full justify-between items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className={`flex-1 p-2 lg:p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs lg:text-md mr-2 ${
            theme === "dark"
              ? "bg-gray-900 text-white border-white/30 placeholder-gray-400"
              : "bg-white text-black border-black/30 placeholder-gray-500"
          }`}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
        />
        <button
          onClick={onSendMessage}
          className="p-2 lg:p-4 bg-blue-500 text-white rounded-md lg:rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
        >
          <FiSend className="w-[15px] h-[15px] lg:w-[20] lg:h-[20]" />
        </button>
      </div>
    </div>
  );
};

const ChatWindow = ({
  selectedUser,
  selectedGroup,
  messages,
  input,
  onInputChange,
  onSendMessage,
  onBackClick,
  isSidebarOpen,
}: ChatWindowProps) => {
  const { theme } = useTheme();
  if (!selectedUser) return null;

  return (
    <div
      className={`relative z-10 flex-1 border rounded-xl p-4 flex flex-col justify-between h-full w-full transition-all duration-300 ${
        theme === "dark"
          ? "bg-black border-white/30"
          : "bg-white border-black/30"
      } ${isSidebarOpen ? "hidden" : ""}`}
    >
      <ChatHeader
        user={selectedUser}
        onBack={selectedGroup || !isSidebarOpen ? onBackClick : undefined}
      />
      <MessagesList messages={messages} />
      <MessageInput
        input={input}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatWindow;
