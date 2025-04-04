import { GrMoney } from "react-icons/gr";
import { HiDotsHorizontal } from "react-icons/hi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";

const HomeIncome = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 flex flex-col gap-4 sm:gap-6 border transition-all duration-300 ${
        theme === "dark" ? "border-white/30" : "border-black/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg sm:text-md font-semibold">
          {/* <RxDragHandleDots2 className="hidden sm:inline-block" /> */}
          <GrMoney className="text-green-600" />
          {translations[language].totalIncome}
        </div>
        <HiDotsHorizontal className="sm:hidden" />
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <span className="font-semibold text-3xl sm:text-2xl mb-2 lg:mb-0">
          $215,832.82
        </span>
        <span className="text-sm sm:text-md">
          {translations[language].increaseComparison}
        </span>
      </div>
    </div>
  );
};

export default HomeIncome;
