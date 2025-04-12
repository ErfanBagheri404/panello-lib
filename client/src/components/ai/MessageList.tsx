import { useRef, useEffect } from "react";
import Message from "./Message";

type Message = {
  role: "user" | "ai";
  content: string;
};

type MessageListProps = {
  messages: Message[];
  theme: string;
};

const MessageList = ({ messages, theme }: MessageListProps) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full">
      {messages.map((msg, index) => (
        <Message key={index} content={msg.content} role={msg.role} theme={theme} />
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageList;