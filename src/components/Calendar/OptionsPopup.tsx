// OptionsPopup.tsx
import { motion } from "framer-motion";

interface OptionsPopupProps {
  onAddEvent: () => void;
  onDeleteEvent: () => void;
}

export const OptionsPopup = ({ onAddEvent, onDeleteEvent }: OptionsPopupProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-[100] border"
  >
    <div className="flex flex-col gap-2">
      <button
        onClick={onAddEvent}
        className="px-4 py-2 text-sm hover:bg-gray-100 rounded text-left text-nowrap"
      >
        Add Event
      </button>
      <button
        onClick={onDeleteEvent}
        className="px-4 py-2 text-sm hover:bg-gray-100 rounded text-left text-nowrap"
      >
        Remove Event
      </button>
    </div>
  </motion.div>
);