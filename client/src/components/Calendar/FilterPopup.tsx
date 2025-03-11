import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../theme-provider"; // Adjust path as needed

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

  useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`absolute right-0 mt-2 rounded-lg shadow-lg p-4 z-[100] border ${
        theme === "dark"
          ? "bg-gray-800 text-white border-white/30"
          : "bg-white text-black border-black/30"
      }`}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Start Date:
          <input
            type="date"
            value={localDateRange.start.toISOString().split("T")[0]}
            onChange={(e) =>
              setLocalDateRange((prev) => ({
                ...prev,
                start: new Date(e.target.value),
              }))
            }
            className={`ml-2 border rounded p-1 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-white/30"
                : "bg-white text-black border-black/30"
            }`}
          />
        </label>
        <label className="text-sm font-medium">
          End Date:
          <input
            type="date"
            value={localDateRange.end.toISOString().split("T")[0]}
            onChange={(e) =>
              setLocalDateRange((prev) => ({
                ...prev,
                end: new Date(e.target.value),
              }))
            }
            className={`ml-2 border rounded p-1 ${
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
            Apply
          </button>
          <button
            onClick={onClose}
            className={`mt-2 px-3 py-1 rounded ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};
