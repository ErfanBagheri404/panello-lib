import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../theme-provider";
import translations from "../../data/translations";
import { useLanguage } from "../language-provider";

interface FilterPopupProps {
  dateRange: { start: Date; end: Date };
  onApply: (start: Date, end: Date) => void;
  onClose: () => void;
}

export const FilterPopup = ({
  dateRange,
  onApply,
  onClose,
}: FilterPopupProps) => {
  const { theme } = useTheme();
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const { language } = useLanguage();

  useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute ${
        language === "fa" ? "left-0" : "right-0"
      } mt-2 rounded-lg shadow-lg p-4 z-[100] border ${
        theme === "dark"
          ? "bg-gray-800 text-white border-white/30"
          : "bg-white text-black border-black/30"
      }`}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {translations[language].startDate}
          <input
            type="date"
            value={localDateRange.start.toISOString().split("T")[0]}
            onChange={(e) =>
              setLocalDateRange((prev) => ({
                ...prev,
                start: new Date(e.target.value),
              }))
            }
            className={`ms-2 border rounded p-1 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-white/30"
                : "bg-white text-black border-black/30"
            }`}
          />
        </label>
        <label className="text-sm font-medium">
          {translations[language].endDate}
          <input
            type="date"
            value={localDateRange.end.toISOString().split("T")[0]}
            onChange={(e) =>
              setLocalDateRange((prev) => ({
                ...prev,
                end: new Date(e.target.value),
              }))
            }
            className={`ms-2 border rounded p-1 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-white/30"
                : "bg-white text-black border-black/30"
            }`}
          />
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onApply(localDateRange.start, localDateRange.end)}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {translations[language].applyAction}
          </button>
          <button
            onClick={onClose}
            className={`mt-2 px-3 py-1 rounded ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {translations[language].cancelButton}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
