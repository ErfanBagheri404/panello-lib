import { useState, useRef, useEffect, FormEvent } from "react";
import grid from "../assets/Grid.svg";
import { fetchAIResponse } from "../api/openrouter";
import { IoSend } from "react-icons/io5";

type Message = {
  role: "user" | "ai";
  content: string;
};

const FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "deepseek-ai/deepseek-coder-33b-instruct:free",
];

const SELECTED_MODEL = FREE_MODELS[0];

const Ai = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [pendingAiContent, setPendingAiContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!pendingAiContent) return;

    setIsTyping(true);
    const lastMessageIndex = messages.length - 1;
    let i = 0;

    const interval = setInterval(() => {
      if (i < pendingAiContent.length) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[lastMessageIndex].content = pendingAiContent.substring(
            0,
            i + 1
          );
          return newMessages;
        });
        i++;
      } else {
        clearInterval(interval);
        setPendingAiContent("");
        setIsTyping(false);
      }
    }, 20);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [pendingAiContent]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiResponse = await fetchAIResponse(SELECTED_MODEL, input);
    const aiMessage: Message = { role: "ai", content: "" };

    setMessages((prev) => [...prev, aiMessage]);
    setPendingAiContent(aiResponse);
  };

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide">
      {/* Background Grid Wrapper */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt=""
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto z-10 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg w-fit ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end rounded-tr-none"
                : "bg-gray-200 text-black self-start rounded-tl-none"
            }`}
          >
            {msg.content}
            {msg.role === "ai" && index === messages.length - 1 && isTyping && (
              <span className="ml-1 inline-block align-middle w-2 h-4 bg-gray-400 animate-blink"></span>
            )}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-black/20 bg-white flex z-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Ask something..."
          disabled={isTyping}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          disabled={isTyping}
        >
          <IoSend />
        </button>
      </form>
    </main>
  );
};

export default Ai;
