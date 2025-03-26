import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme-provider"; 

interface ViewSwitcherProps {
  currentView: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  onChange: (view: "dayGridMonth" | "timeGridWeek" | "timeGridDay") => void;
}

export const ViewSwitcher = ({ currentView, onChange }: ViewSwitcherProps) => {
  const { theme } = useTheme();
  const [activeTabPosition, setActiveTabPosition] = useState({
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);


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


  const containerClass = `relative rounded-md border w-full lg:w-fit overflow-hidden text-center my-2 lg:my-0 ${
    theme === "dark"
      ? "bg-gray-800 border-white/30"
      : "bg-gray-200 border-black/30"
  }`;

  const indicatorClass = `absolute top-0 h-full rounded-md z-0 ${
    theme === "dark" ? "bg-gray-700" : "bg-white"
  }`;

  const activeTextColor = theme === "dark" ? "text-white" : "text-black";
  const inactiveTextColor =
    theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div ref={containerRef} className={containerClass}>
      <motion.div
        className={indicatorClass}
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
          currentView === "timeGridDay" ? activeTextColor : inactiveTextColor
        }`}
      >
        Day
      </button>
      <button
        data-view="timeGridWeek"
        onClick={(e) => handleClick("timeGridWeek", e)}
        className={`relative px-3 py-1 z-10 transition-colors ${
          currentView === "timeGridWeek" ? activeTextColor : inactiveTextColor
        }`}
      >
        Week
      </button>
      <button
        data-view="dayGridMonth"
        onClick={(e) => handleClick("dayGridMonth", e)}
        className={`relative px-3 py-1 z-10 transition-colors ${
          currentView === "dayGridMonth" ? activeTextColor : inactiveTextColor
        }`}
      >
        Month
      </button>
    </div>
  );
};
