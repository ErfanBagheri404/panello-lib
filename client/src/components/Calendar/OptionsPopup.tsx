import { motion } from "framer-motion";
import { useTheme } from "../theme-provider"; // Adjust path as needed

interface OptionsPopupProps {
  onAddEvent: () => void;
  onDeleteEvent: () => void;
}

export const OptionsPopup = ({ onAddEvent, onDeleteEvent }: OptionsPopupProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute right-0 mt-2 rounded-lg shadow-lg p-2 z-[100] border ${
        theme === "dark" ? "bg-gray-800 text-white border-white/30" : "bg-white text-black border-black/30"
      }`}
    >
      <div className="flex flex-col gap-2">
        <button
          onClick={onAddEvent}
          className={`px-4 py-2 text-sm rounded text-left text-nowrap ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          Add Event
        </button>
        <button
          onClick={onDeleteEvent}
          className={`px-4 py-2 text-sm rounded text-left text-nowrap ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          Remove Event
        </button>
      </div>
    </motion.div>
  );
};