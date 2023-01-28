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

const MyResponsiveBar = ({ data /* see data tab */ }) => (
  <ResponsiveBar
    data={data}
    tooltip={({ id, value }) => {
      //console.log(id);
      return (
        <div className="flex, flex-col">
          <div className="flex">
            <span className="text-xs font-semibold">
              {id}: {value}
            </span>
          </div>
        </div>
      );
    }}
    keys={["신체", "예술", "독창", "규정", "의상"]}
    indexBy="player"
    margin={{ top: 10, right: 10, bottom: 50, left: 0 }}
    padding={0.2}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "blues" }}
    theme={{
      grid: {
        line: {
          stroke: "gray",
          strokeWidth: 1,
          strokeDasharray: "1 4",
        },
      },
    }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 50,
        itemsSpacing: 20,
        itemWidth: 50,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 10,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    motionConfig="wobbly"
  />
);
const AnalyzeBarType = () => {
  return (
    <div className="flex w-full h-full flex-col bg-white rounded-lg gap-y-3 ">
      <div className="flex h-64">
        <MyResponsiveBar data={data} />
      </div>
    </div>
  );
};

export default AnalyzeBarType;
