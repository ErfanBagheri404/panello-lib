// ViewSwitcher.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ViewSwitcherProps {
  currentView: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  onChange: (view: "dayGridMonth" | "timeGridWeek" | "timeGridDay") => void;
}

export const ViewSwitcher = ({ currentView, onChange }: ViewSwitcherProps) => {
  const [activeTabPosition, setActiveTabPosition] = useState({
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update position when view changes
  useEffect(() => {
    if (containerRef.current) {
      const activeButton = containerRef.current.querySelector(
        `[data-view="${currentView}"]`
      ) as HTMLElement;
      if (activeButton) {
        setActiveTabPosition({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    }
  }, [currentView]);

  const handleClick = (view: typeof currentView, e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    setActiveTabPosition({
      left: target.offsetLeft,
      width: target.offsetWidth,
    });
    onChange(view);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-md border w-full lg:w-fit border-black/30 overflow-hidden bg-gray-200 text-center my-2 lg:my-0"
    >
      <motion.div
        className="absolute top-0 h-full bg-white rounded-md z-0"
        initial={activeTabPosition}
        animate={{
          left: activeTabPosition.left,
          width: activeTabPosition.width,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 40 }}
      />

      <button
        data-view="timeGridDay"
        onClick={(e) => handleClick("timeGridDay", e)}
        className={`relative px-3 py-1 z-10 transition-colors ${
          currentView === "timeGridDay" ? "text-black" : "text-gray-600"
        }`}
      >
        Day
      </button>
      <button
        data-view="timeGridWeek"
        onClick={(e) => handleClick("timeGridWeek", e)}
        className={`relative px-3 py-1 z-10 transition-colors ${
          currentView === "timeGridWeek" ? "text-black" : "text-gray-600"
        }`}
      >
        Week
      </button>
      <button
        data-view="dayGridMonth"
        onClick={(e) => handleClick("dayGridMonth", e)}
        className={`relative px-3 py-1 z-10 transition-colors ${
          currentView === "dayGridMonth" ? "text-black" : "text-gray-600"
        }`}
      >
        Month
      </button>
    </div>
  );
};
