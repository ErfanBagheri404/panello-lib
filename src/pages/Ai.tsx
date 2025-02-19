import { useState, useRef, useEffect, FormEvent } from "react";
import grid from "../assets/Grid.svg";
import { fetchAIResponse } from "../api/openrouter";
import { IoSend } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa"; // Copy icon
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Message = {
  role: "user" | "ai";
  content: string;
};

const FREE_MODELS = [
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
];

const Ai = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [pendingAiContent, setPendingAiContent] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const currentModel = FREE_MODELS[currentModelIndex];

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
    setIsTyping(true);

    try {
      setMessages((prev) => [...prev, { role: "ai", content: "..." }]); // Add typing animation
      const aiResponse = await fetchAIResponse(currentModel, input);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "ai", content: "" }; // Replace "..." with real message
        return newMessages;
      });
      setPendingAiContent(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const nextModelIndex = (currentModelIndex + 1) % FREE_MODELS.length;
      setCurrentModelIndex(nextModelIndex);
      const fallbackMessage: Message = {
        role: "ai",
        content: `Switched to ${FREE_MODELS[nextModelIndex]} due to an error. Please try again.`,
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  // Function to render formatted message with Markdown support
  const renderMessage = (msg: Message) => {
    return (
      <ReactMarkdown
        className="markdown"
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline ? (
              <div className="relative bg-gray-900 text-white p-3 rounded-lg mt-2">
                <button
                  className="absolute top-1 right-1 p-1 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() =>
                    navigator.clipboard.writeText(String(children).trim())
                  }
                >
                  <FaRegCopy className="text-white text-sm" />
                </button>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match ? match[1] : "plaintext"}
                  PreTag="div"
                  {...props}
                >
                  {String(children).trim()}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-200 text-black px-1 py-0.5 rounded">
                {children}
              </code>
            );
          },

          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-500 pl-3 italic text-gray-600">
                {children}
              </blockquote>
            );
          },
          a({ children, ...props }) {
            return (
              <a className="text-blue-500 underline" {...props}>
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="list-disc list-inside">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold">{children}</h3>;
          },
        }}
      >
        {msg.content}
      </ReactMarkdown>
    );
  };

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide">
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
            {renderMessage(msg)}
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
          disabled={isTyping} // Disable input while AI is responding
        />

        {/* Send Button - Disabled when AI is responding */}
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
