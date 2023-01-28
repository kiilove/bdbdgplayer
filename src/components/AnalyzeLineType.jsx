import React from "react";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "순위",
    color: "hsl(235, 70%, 50%)",
    data: [
      {
        x: 0,
        y: 1,
        z: "용인대회0",
      },
      {
        x: 1,
        y: 8,
        z: "용인대회1",
      },
      {
        x: 2,
        y: 3,
        z: "용인대회2",
      },
      {
        x: 3,
        y: 2,
        z: "용인대회3",
      },
      {
        x: 4,
        y: 8,
        z: "용인대회4",
      },
      {
        x: 5,
        y: 5,
        z: "용인대회5",
      },
      {
        x: 6,
        y: 9,
        z: "용인대회6",
      },
    ],
  },
];

const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data}
    tooltip={({ point }) => {
      return (
        <div className="flex, flex-col">
          <div className="flex">
            <span className="text-xs font-semibold">
              {point.serieId}: {point.data.y}
            </span>
          </div>
          <div className="flex">
            <span className="text-xs font-semibold">{point.data.z}</span>
          </div>
        </div>
      );
    }}
    margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
    xScale={{ type: "linear" }}
    yScale={{ type: "linear", stacked: true, min: 10, max: 1 }}
    yFormat=" >-.2f"
    curve="monotoneX"
    axisTop={null}
    axisBottom={null}
    // axisBottom={{
    //   tickValues: [1, 2, 3, 4, 5],
    //   tickSize: 3,
    //   tickPadding: 3,
    //   tickRotation: 0,
    //   format: ".0",

    //   legendOffset: 36,
    //   legendPosition: "middle",
    // }}
    axisLeft={null}
    enableGridX={false}
    theme={{
      grid: {
        line: {
          stroke: "gray",
          strokeWidth: 1,
          strokeDasharray: "1 4",
        },
      },
    }}
    colors={["#ec8a51"]}
    lineWidth={2}
    pointSize={8}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    gridXValues={[0, 1, 2, 3, 4, 5]}
    gridYValues={[5]}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",

        justify: false,
        translateX: 140,
        translateY: 0,
        itemsSpacing: 2,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 12,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "click",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

const AnalyzeLineType = () => {
  return (
    <div className="flex w-full h-full flex-col bg-white rounded-lg gap-y-3 ">
      <div className="flex h-32">
        <MyResponsiveLine data={data} />
      </div>
    </div>
  );
};

export default AnalyzeLineType;
