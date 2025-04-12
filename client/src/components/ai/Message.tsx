import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegCopy } from "react-icons/fa";

type MessageProps = {
  content: string;
  role: "user" | "ai";
  theme: string;
};

const Message = ({ content, role, theme }: MessageProps) => {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={getMessageClasses(role)} dir="auto">
      <ReactMarkdown
        className="markdown break-words"
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <div className="relative bg-gray-900 text-white p-3 rounded-lg mt-2 overflow-x-auto">
                <button
                  className="absolute top-1 right-1 p-1 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => copyToClipboard(String(children).trim())}
                  aria-label="Copy code"
                  title="Copy code"
                >
                  <FaRegCopy className="text-white text-sm" />
                </button>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match ? match[1] : "plaintext"}
                  PreTag="div"
                  wrapLines={true}
                  wrapLongLines={true}
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
              <a
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="list-disc list-inside pl-2">{children}</ul>;
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside pl-2">{children}</ol>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold my-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold my-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold my-1">{children}</h3>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full border-collapse border border-gray-500">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-700 text-white">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="border-b border-gray-500">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-4 py-2 text-left">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2">{children}</td>;
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded my-2"
                {...props}
              />
            );
          },
          pre({ children }) {
            return <pre className="overflow-x-auto">{children}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Message;
