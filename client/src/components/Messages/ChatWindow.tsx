import { User, Group, Message } from "../../types";
import { formatDate } from "../../lib/dateUtils";
import { FiSend, FiFile } from "react-icons/fi";

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

const ChatHeader = ({ user, onBack }: { user: User; onBack?: () => void }) => (
  <div className="flex items-center gap-3 border-b pb-3">
    <img
      src={user.pfp}
      alt={user.name}
      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-blue-400"
    />
    <div className="flex items-center justify-between w-full">
      <div>
        <h2 className="text-md lg:text-lg font-semibold">{user.name}</h2>
        <p className="text-xs lg:text-sm text-gray-500">
          {user.online ? "Online" : "Offline"}
        </p>
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm lg:hidden text-gray-600 hover:text-gray-800 bg-gray-200 px-3 py-1 rounded-full"
        >
          Back
        </button>
      )}
    </div>
  </div>
);

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => (
  <div
    className={`flex flex-col gap-1 ${
      message.sender === "You" ? "items-end" : "items-start"
    }`}
  >
    <div
      className={`p-3 rounded-lg max-w-xl ${
        message.sender === "You"
          ? "bg-blue-500 text-white rounded-tr-none"
          : "bg-gray-100 rounded-tl-none"
      }`}
    >
      {message.text && (
        <p className="whitespace-pre-wrap text-sm lg:text-md">{message.text}</p>
      )}
      {message.file && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded">
          <FiFile className="flex-shrink-0" />
          <div>
            <div className="text-sm lg:text-sm">{message.file.name}</div>
            <div className="text-sm opacity-75">{message.file.size}</div>
          </div>
        </div>
      )}
      <div className="text-sm mt-1 opacity-75">{message.timestamp}</div>
    </div>
  </div>
);

interface MessageGroupProps {
  date: string;
  messages: Message[];
}

const MessageGroup = ({ date, messages }: MessageGroupProps) => (
  <div className="space-y-4">
    <div className="text-center text-xs lg:text-sm text-gray-500 my-4">
      {formatDate(date)}
    </div>
    {messages.map((msg, index) => (
      <MessageItem key={index} message={msg} />
    ))}
  </div>
);

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
}: MessageInputProps) => (
  <div className="flex w-full mt-4 space-y-2">
    <div className="flex w-full justify-between items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="flex-1 p-2 lg:p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs lg:text-md mr-2"
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
  if (!selectedUser) return null; // Return null if no user is selected

  return (
    <div
      className={`relative z-10 flex-1 border border-black/30 rounded-xl bg-white p-4 flex flex-col justify-between h-full w-full
        ${isSidebarOpen ? "hidden" : ""}`}
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
