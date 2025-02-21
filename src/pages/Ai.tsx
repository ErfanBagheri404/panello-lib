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
import { FaRegCopy } from "react-icons/fa"; // Copy icon
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingAiContent, setPendingAiContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const currentModel = FREE_MODELS[currentModelIndex];
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

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
    if (e) {
      e.preventDefault();
    }
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
      setMessages((prev) => [...prev, { role: "ai", content: "..." }]); // Add typing animation
      const aiResponse = await fetchAIResponse(
        currentModel,
        userMessage.content
      );
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

  const handlePause = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setPendingAiContent(""); // Clear pending AI content
      setIsTyping(false);
      setIsPaused(true);
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

  // Function to handle box selection and start a conversation
  const handleBoxSelect = async (commands: string[]) => {
    const selectedCommand =
      commands[Math.floor(Math.random() * commands.length)];
    const userMessage: Message = { role: "user", content: selectedCommand };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsPaused(false);

    try {
      setMessages((prev) => [...prev, { role: "ai", content: "..." }]); // Typing animation
      const aiResponse = await fetchAIResponse(currentModel, selectedCommand);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: "ai", content: "" }; // Clear placeholder
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

  // Define commands for each box
  const boxCommands = [
    [
      "Tell me a joke!",
      "Why don't scientists trust atoms?",
      "What has keys but can't open locks?",
    ],
    [
      "What's the weather like today?",
      "Is it going to rain tomorrow?",
      "Can you describe the weather in New York?",
    ],
    [
      "Recommend a book for me.",
      "What's a good book to read?",
      "Can you suggest a science fiction book?",
    ],
  ];

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
        {messages.length === 0 ? (
          // Render boxes if no messages have been sent
          <div className="flex flex-col items-center justify-center text-center flex-1">
            <h2 className="text-lg font-semibold mb-4">Start a Conversation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              <div
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition duration-300 flex flex-col items-center justify-center"
                onClick={() => handleBoxSelect(boxCommands[0])}
              >
                <IoHappyOutline className="text-3xl mb-2 text-blue-500" />
                <h3 className="text-md font-semibold">Humor</h3>
              </div>
              <div
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition duration-300 flex flex-col items-center justify-center"
                onClick={() => handleBoxSelect(boxCommands[1])}
              >
                <IoSunnyOutline className="text-3xl mb-2 text-yellow-500" />
                <h3 className="text-md font-semibold">Weather</h3>
              </div>
              <div
                className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition duration-300 flex flex-col items-center justify-center"
                onClick={() => handleBoxSelect(boxCommands[2])}
              >
                <IoBookOutline className="text-3xl mb-2 text-green-500" />
                <h3 className="text-md font-semibold">Books</h3>
              </div>
            </div>
          </div>
        ) : (
          // Render messages if there are any
          <>
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
          </>
        )}
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
          className="flex-1 p-2 border border-black/30 rounded-lg focus:outline-none"
          placeholder="Ask something..."
          disabled={isTyping && !isPaused} // Disable input while AI is responding unless paused
        />
        {/* Send/Pause Button - Disabled when AI is responding */}
        <button
          type="button"
          className={`ml-2 px-4 py-2 rounded-lg ${
            isTyping
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }  text-white disabled:opacity-50`}
          onClick={isTyping ? handlePause : handleSend}
        >
          {isTyping ? (
            <IoPause className="text-white" />
          ) : (
            <IoSend className="text-white" />
          )}
        </button>
      </form>
    </main>
  );
};

export default Ai;
