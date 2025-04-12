import { motion } from "framer-motion";
import {  formatTime } from "../components/Calendar/helpers";
import { CalendarEvent } from "../types";
import { useTheme } from "../components/theme-provider";
import { useLanguage } from "../components/language-provider";
import translations from "../data/translations";

const EventDetailsModal = ({
  event,
  onClose,
  onEdit,
  onDelete,
}: {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className={`rounded-lg p-6 max-w-md w-full mx-4 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{event.title}</h2>
        {event.description && (
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            {event.description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium">
              {translations[language].startLabel}:
            </p>
            <p className="text-sm">
              {formatTime(event.start, translations[language].locale)}
            </p>
            <p className="text-sm">
              {event.start.toLocaleDateString(translations[language].locale)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">
              {translations[language].endLabel}:
            </p>
            <p className="text-sm">
              {formatTime(event.end, translations[language].locale)}
            </p>
            <p className="text-sm">
              {event.end.toLocaleDateString(translations[language].locale)}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onEdit}
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {translations[language].editButton}
          </button>
          <button
            onClick={onDelete}
            className={`px-4 py-2 rounded text-white ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-red-500 hover:bg-red-400"
            }`}
          >
            {translations[language].deleteButton}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventDetailsModal;
