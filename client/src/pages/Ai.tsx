import { useState, useRef, useEffect, FormEvent } from "react";
import grid from "../assets/Grid.svg";
import { fetchAIResponse } from "../api/openrouter";
import {
  IoSend,
  IoPause,
  IoHappyOutline,
  IoSunnyOutline,
  IoBookOutline,
} from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../components/theme-provider";
import { useLanguage } from "../components/language-provider"; // Added import
import translations from "../data/translations"; // Import translations

type Message = {
  role: "user" | "ai";
  content: string;
};

const FREE_MODELS = [
  "deepseek/deepseek-r1-distill-llama-70b:free",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "qwen/qwen2.5-vl-72b-instruct:free",
];

const Ai = () => {
  const { language } = useLanguage(); // Added useLanguage hook
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingAiContent, setPendingAiContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const currentModel = FREE_MODELS[currentModelIndex];
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isPaused]);

  useEffect(() => {
    if (!pendingAiContent || isPaused) return;
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
    setIntervalId(interval);
    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [pendingAiContent, isPaused]);

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && messages.length === 0) return;
    const userMessage: Message = {
      role: "user",
      content: input || messages[messages.length - 1].content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setIsPaused(false);
    try {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: translations[language].loadingResponse },
      ]);
      const aiResponse = await fetchAIResponse(
        currentModel,
        userMessage.content
      );
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "ai", content: "" };
        return newMessages;
      });
      setPendingAiContent(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const nextModelIndex = (currentModelIndex + 1) % FREE_MODELS.length;
      setCurrentModelIndex(nextModelIndex);
      const fallbackMessage: Message = {
        role: "ai",
        content: translations[language].modelSwitchError.replace(
          "%model%",
          FREE_MODELS[nextModelIndex]
        ),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  const handlePause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setPendingAiContent("");
      setIsTyping(false);
      setIsPaused(true);
    }
  };

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
              <code
                className={`px-1 py-0.5 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote
                className={`border-l-4 pl-3 italic ${
                  theme === "dark"
                    ? "border-gray-500 text-gray-300"
                    : "border-gray-500 text-gray-600"
                }`}
              >
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

  const handleBoxSelect = async (commands: readonly string[]) => {
    const selectedCommand =
      commands[Math.floor(Math.random() * commands.length)];
    const userMessage: Message = { role: "user", content: selectedCommand };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsPaused(false);
    try {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: translations[language].loadingResponse },
      ]);
      const aiResponse = await fetchAIResponse(currentModel, selectedCommand);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "ai", content: "" };
        return newMessages;
      });
      setPendingAiContent(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const nextModelIndex = (currentModelIndex + 1) % FREE_MODELS.length;
      setCurrentModelIndex(nextModelIndex);
      const fallbackMessage: Message = {
        role: "ai",
        content: translations[language].modelSwitchError.replace(
          "%model%",
          FREE_MODELS[nextModelIndex]
        ),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setIsTyping(false);
    }
  };

  const boxCommands = [
    translations[language].humorCommands,
    translations[language].weatherCommands,
    translations[language].bookCommands,
  ];

  const getMessageClasses = (role: "user" | "ai") => {
    const baseClasses =
      "mb-3 p-3 rounded-lg max-w-[90%] md:max-w-[70%] lg:max-w-[50%]";
    if (role === "user") {
      return `${baseClasses} bg-blue-500 text-white self-end rounded-tr-none md:rounded-tr-lg lg:rounded-tr-none`;
    } else {
      const bgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
      const textClass = theme === "dark" ? "text-white" : "text-black";
      return `${baseClasses} ${bgClass} ${textClass} self-start rounded-tl-none md:rounded-tl-lg lg:rounded-tl-none`;
    }
  };

  return (
    <main
      className={`transition-all duration-300 ${
        theme === "dark" ? "border-white/30" : "border-black/30"
      } relative border  h-[calc(100vh-5rem)] mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide`}
    >
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert" : ""
          }`}
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>
      <div className="flex-1 flex flex-col p-2 md:p-4 overflow-y-auto z-10 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center flex-1 px-2">
            <h2
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {translations[language].startConversation}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full max-w-3xl">
              {boxCommands.map((commands, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 rounded-lg border cursor-pointer transition duration-300 flex flex-col items-center justify-center ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      : "bg-white border-black/30 text-black hover:bg-gray-100"
                  }`}
                  onClick={() => handleBoxSelect(commands)}
                >
                  {index === 0 && (
                    <IoHappyOutline className="text-2xl md:text-3xl mb-2 text-blue-500" />
                  )}
                  {index === 1 && (
                    <IoSunnyOutline className="text-2xl md:text-3xl mb-2 text-yellow-500" />
                  )}
                  {index === 2 && (
                    <IoBookOutline className="text-2xl md:text-3xl mb-2 text-green-500" />
                  )}
                  <h3 className="text-sm md:text-md font-semibold">
                    {translations[language].categories[index]}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={getMessageClasses(msg.role)}>
                {renderMessage(msg)}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </>
        )}
      </div>
      <form
        onSubmit={handleSend}
        className={`p-2 md:p-4 border-t flex z-10 gap-2 ${
          theme === "dark"
            ? "bg-black border-gray-600"
            : "bg-white border-black/20"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 p-2 text-sm md:text-base border rounded-lg focus:outline-none ${
            theme === "dark"
              ? "bg-black text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-black border-black/30 placeholder-gray-600"
          }`}
          placeholder={translations[language].askPlaceholder}
          disabled={isTyping && !isPaused}
        />
        <button
          type="button"
          className={`p-2 md:px-4 md:py-2 rounded-lg ${
            isTyping
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white disabled:opacity-50 flex items-center`}
          onClick={isTyping ? handlePause : handleSend}
        >
          {isTyping ? (
            <IoPause className="text-sm md:text-base" />
          ) : (
            <>
              <span className="hidden md:inline">
                {translations[language].send}
              </span>
              <IoSend className="md:hidden text-sm" />
            </>
          )}
        </button>
      </form>
    </main>
  );
};

export default Ai;
