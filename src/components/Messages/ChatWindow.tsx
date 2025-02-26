import { User, Message } from "../../types";
import { formatDate } from "../../lib/dateUtils";
import { FiSend, FiFile } from "react-icons/fi";

interface ChatWindowProps {
  selectedUser: User;
  messages: Message[];
  input: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
}

const ChatHeader = ({ user }: { user: User }) => (
  <div className="flex items-center gap-3 border-b pb-3">
    <img
      src={user.pfp}
      alt={user.name}
      className="w-12 h-12 rounded-full border-2 border-blue-400"
    />
    <div>
      <h2 className="text-lg font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-500">
        {user.online ? "Online" : "Offline"}
      </p>
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
        message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-100"
      }`}
    >
      {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
      {message.file && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded">
          <FiFile className="flex-shrink-0" />
          <div>
            <div className="text-sm">{message.file.name}</div>
            <div className="text-xs opacity-75">{message.file.size}</div>
          </div>
        </div>
      )}
      <div className="text-xs mt-1 opacity-75">{message.timestamp}</div>
    </div>
  </div>
);

interface MessageGroupProps {
  date: string;
  messages: Message[];
}
const MessageGroup = ({ date, messages }: MessageGroupProps) => (
  <div className="space-y-4">
    <div className="text-center text-sm text-gray-500 my-4">
      {formatDate(date)}
    </div>
    {messages.map((msg, index) => (
      <MessageItem key={index} message={msg} />
    ))}
  </div>
);

const MessagesList = ({ messages }: { messages: Message[] }) => {
  // Group messages by date
  const groupedMessages = messages.reduce((acc: Record<string, Message[]>, msg: Message) => {
    const date = msg.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

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
  <div className="mt-4 space-y-2">
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
      />
      <button
        onClick={onSendMessage}
        className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
      >
        <FiSend size={20} />
      </button>
    </div>
  </div>
);

const ChatWindow = ({
  selectedUser,
  messages,
  input,
  onInputChange,
  onSendMessage,
}: ChatWindowProps) => {
  return (
    <div className="relative z-10 flex-1 border border-black/30 rounded-xl bg-white p-4 flex flex-col justify-between shadow-lg">
      <ChatHeader user={selectedUser} />
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
