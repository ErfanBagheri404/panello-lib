import grid from "../assets/Grid.svg";
import { BarChartComponent } from "../components/Charts/BarChart";
import BarChart2 from "../components/Charts/BarChart2";
import LineChartComponent from "../components/Charts/LineChart";
import Radial from "../components/Charts/Radial";
import { useTheme } from "../components/theme-provider";

const Graphs = () => {
  const { theme } = useTheme();
  return (
    <main
      className={`relative border h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5 ${
        theme === "dark"
          ? "bg-black border-white/30"
          : "bg-white border-black/30"
      }`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert" : ""
          }`}
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>

      {/* Responsive Charts Layout */}
      <div className="flex flex-col lg:flex-row gap-5 z-10">
        {/* First Column */}
        <div className="flex flex-col w-full lg:w-1/2 gap-5">
          <Radial
            chartData={[
              { month: "January", desktop: 1200, mobile: 800 },
              { month: "February", desktop: 1500, mobile: 600 },
            ]}
            title="Desktop vs Mobile"
            description="User activity breakdown"
            timeframe="Jan - Feb 2024"
            showLegend={true}
            percentageChange={4.5}
            highlightColor="#FF5733"
            animate={true}
            maxValue={2000}
            showLabels={true}
            customTooltip={false}
          />
          <BarChartComponent />
        </div>

        {/* Second Column */}
        <div className="flex flex-col w-full lg:w-1/2 gap-5">
          <LineChartComponent />
          <BarChart2 />
        </div>
      </div>
    </main>
  );
};

export default Graphs;
