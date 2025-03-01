// CalendarControls.tsx
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CalendarControlsProps {
  onNavigate: (direction: "prev" | "next" | "today") => void;
}

export const CalendarControls = ({ onNavigate }: CalendarControlsProps) => (
  <div className="absolute top-0 lg:top-0 lg:left-0 flex gap-2 z-10">
    <button onClick={() => onNavigate("prev")} className="py-1.5 px-0.75">
      <IoChevronBack />
    </button>
    <button onClick={() => onNavigate("next")} className="py-1.5 px-0.75">
      <IoChevronForward />
    </button>
  </div>
);
