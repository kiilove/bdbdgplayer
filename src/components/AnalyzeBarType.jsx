import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const data = [
  {
    player: "나",
    신체: 12,
    예술: 15,
    독창: 11,
    규정: 14,
    의상: 11,
  },
  {
    player: "A",
    신체: 14,
    예술: 15,
    독창: 13,
    규정: 14,
    의상: 16,
  },
  {
    player: "B",
    신체: 13,
    예술: 12,
    독창: 14,
    규정: 15,
    의상: 16,
  },
  {
    player: "C",
    신체: 16,
    예술: 10,
    독창: 9,
    규정: 18,
    의상: 10,
  },
];

const MyResponsiveBar = ({ data }) => (
  <ResponsiveBar
    data={data}
    tooltip={({ id, value }) => (
      <div className="bg-neutral-900 border border-neutral-700 text-white px-2.5 py-1.5 rounded-lg shadow-xl text-xs font-black">
        {id}: {value}점
      </div>
    )}
    keys={["신체", "예술", "독창", "규정", "의상"]}
    indexBy="player"
    margin={{ top: 10, right: 10, bottom: 50, left: 30 }}
    padding={0.25}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={["#FFFFFF", "#D4D4D4", "#A3A3A3", "#737373", "#525252"]}
    theme={{
      text: {
        fill: "#A3A3A3",
        fontSize: 11,
      },
      axis: {
        ticks: {
          text: {
            fill: "#A3A3A3",
            fontSize: 11,
          },
        },
      },
      grid: {
        line: {
          stroke: "#262626",
          strokeWidth: 1,
          strokeDasharray: "2 4",
        },
      },
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 4,
      tickPadding: 6,
      tickRotation: 0,
    }}
    axisLeft={{
      tickSize: 4,
      tickPadding: 6,
      tickRotation: 0,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor="#000000"
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 45,
        itemsSpacing: 10,
        itemWidth: 50,
        itemHeight: 18,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 8,
        itemTextColor: "#A3A3A3",
      },
    ]}
    motionConfig="gentle"
  />
);

const AnalyzeBarType = () => {
  return (
    <div className="w-full h-full flex flex-col bg-[#141414] rounded-2xl">
      <div className="h-64 w-full">
        <MyResponsiveBar data={data} />
      </div>
    </div>
  );
};

export default AnalyzeBarType;
