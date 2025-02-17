import { GrMoney } from "react-icons/gr";
import { HiDotsHorizontal } from "react-icons/hi";

const HomeIncome = () => {
  return (
    <div className="border border-black/30 rounded-xl p-5 flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <GrMoney className="text-green-600"></GrMoney>
          Total Income
        </div>
        <HiDotsHorizontal></HiDotsHorizontal>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-4xl">$215,832.82</span>
        <span>24% increase comparing to last week</span>
      </div>
    </div>
  );
};

export default HomeIncome;
