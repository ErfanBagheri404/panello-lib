import Radial from "./Charts/Radial";

const HomeGraph = () => {
  return (
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
  );
};

export default HomeGraph;
