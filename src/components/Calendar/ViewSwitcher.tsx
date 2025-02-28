// ViewSwitcher.tsx
interface ViewSwitcherProps {
  currentView: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  onChange: (view: "dayGridMonth" | "timeGridWeek" | "timeGridDay") => void;
}

export const ViewSwitcher = ({ currentView, onChange }: ViewSwitcherProps) => (
  <div className="rounded-md border w-full lg:w-fit border-black/30 overflow-hidden bg-gray-200 text-center my-2 lg:my-0">
    <button
      onClick={() => onChange("timeGridDay")}
      className={`px-3 py-1 ${
        currentView === "timeGridDay" ? "bg-white rounded-md" : ""
      }`}
    >
      Day
    </button>
    <button
      onClick={() => onChange("timeGridWeek")}
      className={`px-3 py-1 ${
        currentView === "timeGridWeek" ? "bg-white rounded-md" : ""
      }`}
    >
      Week
    </button>
    <button
      onClick={() => onChange("dayGridMonth")}
      className={`px-3 py-1 ${
        currentView === "dayGridMonth" ? "bg-white rounded-md" : ""
      }`}
    >
      Month
    </button>
  </div>
);
