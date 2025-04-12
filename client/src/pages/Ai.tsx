import { useState, useRef, useEffect, FormEvent } from "react";
import grid from "../assets/Grid.svg";
import { fetchAIResponse } from "../api/openrouter";
import { FaRegCopy } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../components/theme-provider";
import { useLanguage } from "../components/language-provider";
import translations from "../data/translations";
import MessageList from "../components/ai/MessageList";
import InputForm from "../components/ai/InputForm";
import SuggestionBoxes from "../components/ai/SuggestionBoxes";

type Message = {
  role: "user" | "ai";
  content: string;
};

const FREE_MODELS = [
  "anthropic/claude-3-haiku:free",
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3-8b-instruct:free",
  "google/gemma-7b-it:free",
  "deepseek/deepseek-chat:free",
];

const Ai = () => {
  const { language } = useLanguage();
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

  const handleSend = async (inputOrEvent: string | FormEvent) => {
    // If it's an event, prevent default behavior
    if (typeof inputOrEvent !== 'string' && inputOrEvent?.preventDefault) {
      inputOrEvent.preventDefault();
    }
    
    // Determine the message content
    const messageContent = typeof inputOrEvent === 'string' 
      ? inputOrEvent 
      : input;
      
    if (!messageContent.trim() && messages.length === 0) return;
    
    const userMessage: Message = {
      role: "user",
      content: messageContent || messages[messages.length - 1].content,
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

   (msg: Message) => {
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

   async (commands: readonly string[]) => {
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

   (role: "user" | "ai") => {
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
          <SuggestionBoxes
            boxCommands={boxCommands}
            onSelect={handleSend}
            theme={theme}
            startText={translations[language].startConversation}
            categories={translations[language].categories}
          />
        ) : (
          <MessageList messages={messages} theme={theme} />
        )}
      </div>
      <InputForm
        onSend={handleSend}
        onPause={handlePause}
        isTyping={isTyping}
        isPaused={isPaused}
        theme={theme}
        placeholder={translations[language].askPlaceholder}
        sendText={translations[language].send}
      />
    </main>
  );
};

export default Ai;
