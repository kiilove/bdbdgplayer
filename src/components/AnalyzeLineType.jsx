import React from "react";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "순위",
    color: "#ffffff",
    data: [
      { x: 0, y: 1, z: "용인대회0" },
      { x: 1, y: 8, z: "용인대회1" },
      { x: 2, y: 3, z: "용인대회2" },
      { x: 3, y: 2, z: "용인대회3" },
      { x: 4, y: 8, z: "용인대회4" },
      { x: 5, y: 5, z: "용인대회5" },
      { x: 6, y: 9, z: "용인대회6" },
    ],
  },
];

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    tooltip={({ point }) => {
      return (
        <div className="bg-neutral-900 border border-neutral-700 text-white p-2 rounded-lg shadow-xl flex flex-col">
          <span className="text-xs font-black">
            {point.serieId}: {point.data.y}위
          </span>
          <span className="text-[11px] text-neutral-400">{point.data.z}</span>
        </div>
      );
    }}
    margin={{ top: 15, right: 15, bottom: 25, left: 15 }}
    xScale={{ type: "linear" }}
    yScale={{ type: "linear", stacked: true, min: 10, max: 1 }}
    yFormat=" >-.2f"
    curve="monotoneX"
    axisTop={null}
    axisBottom={null}
    axisLeft={null}
    enableGridX={false}
    theme={{
      grid: {
        line: {
          stroke: "#262626",
          strokeWidth: 1,
          strokeDasharray: "2 4",
        },
      },
    }}
    colors={["#ffffff"]}
    lineWidth={3}
    pointSize={8}
    pointColor="#0B0B0B"
    pointBorderWidth={3}
    pointBorderColor="#ffffff"
    pointLabelYOffset={-12}
    useMesh={true}
    gridXValues={[0, 1, 2, 3, 4, 5]}
    gridYValues={[5]}
  />
);

const AnalyzeLineType = () => {
  return (
    <div className="w-full h-full flex flex-col bg-[#141414] rounded-2xl">
      <div className="h-36 w-full">
        <MyResponsiveLine data={data} />
      </div>
    </div>
  );
};

export default AnalyzeLineType;
