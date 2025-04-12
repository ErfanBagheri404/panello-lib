import { FormEvent, useState, useRef, useEffect } from "react";
import { IoSend, IoPause } from "react-icons/io5";

type InputFormProps = {
  onSend: (inputOrEvent: string | FormEvent) => void;
  onPause: () => void;
  isTyping: boolean;
  isPaused: boolean;
  theme: string;
  placeholder: string;
  sendText: string;
};

const InputForm = ({
  onSend,
  onPause,
  isTyping,
  isPaused,
  theme,
  placeholder,
  sendText,
}: InputFormProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-2 md:p-4 border-t flex z-10 gap-2 ${
        theme === "dark"
          ? "bg-black border-gray-600"
          : "bg-white border-black/20"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`flex-1 p-2 text-sm md:text-base border rounded-lg focus:outline-none resize-none min-h-[40px] max-h-[200px] ${
          theme === "dark"
            ? "bg-black text-white border-gray-600 placeholder-gray-400"
            : "bg-white text-black border-black/30 placeholder-gray-600"
        }`}
        placeholder={placeholder}
        disabled={isTyping && !isPaused}
        dir="auto"
        rows={1}
      />
      <button
        type="button"
        className={`p-2 md:px-4 md:py-2 rounded-lg ${
          isTyping
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white disabled:opacity-50 flex items-center justify-center min-w-[40px]`}
        onClick={isTyping ? onPause : () => onSend(input)}
      >
        {isTyping ? (
          <IoPause className="text-sm md:text-base" />
        ) : (
          <>
            <span className="hidden md:inline">
              {sendText}
            </span>
            <IoSend className="md:hidden text-sm" />
          </>
        )}
      </button>
    </form>
  );
};

export default InputForm;