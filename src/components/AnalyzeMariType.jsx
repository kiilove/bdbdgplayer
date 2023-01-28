import React from "react";
import { ResponsiveMarimekko } from "@nivo/marimekko";

const data = [
  {
    statement: "prev",
    player: 0,
    type1: 19,
    type2: 24,
    type3: 17,
    type4: 13,
    type4: 15,
  },
  {
    statement: "me",
    player: 1,
    stronglyAgree: 25,
    agree: 17,
    disagree: 5,
    stronglyDisagree: 12,
  },
  {
    statement: "next",
    player: 2,
    stronglyAgree: 5,
    agree: 3,
    disagree: 7,
    stronglyDisagree: 21,
  },
];
const theme = {
  grid: {
    stroke: "#c73535",
    strokeWidth: 2,
  },
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveMarimekko = ({ data /* see data tab */ }) => (
  <ResponsiveMarimekko
    data={data}
    id="statement"
    value="player"
    dimensions={[
      {
        id: "신체",
        value: "type1",
      },
      {
        id: "예술",
        value: "type2",
      },
      {
        id: "독창",
        value: "type3",
      },
      {
        id: "규정",
        value: "type4",
      },
      {
        id: "의상",
        value: "type5",
      },
    ]}
    innerPadding={9}
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    axisLeft={null}
    margin={{ top: 10, right: 10, bottom: 80, left: 10 }}
    colors={{ scheme: "spectral" }}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.2]],
    }}
    defs={[
      {
        id: "lines",
        type: "patternLines",
        background: "rgba(0, 0, 0, 0)",
        color: "inherit",
        rotation: -55,
        lineWidth: 4,
        spacing: 8,
      },
    ]}
    fill={[
      {
        match: {
          id: "agree strongly",
        },
        id: "lines",
      },
      {
        match: {
          id: "disagree strongly",
        },
        id: "lines",
      },
    ]}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        justify: true,
        translateX: 0,
        translateY: 80,
        itemsSpacing: 0,
        itemWidth: 140,
        itemHeight: 18,
        itemTextColor: "#999",
        itemDirection: "right-to-left",
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000",
            },
          },
        ],
      },
    ]}
  />
);

const AnalyzeMariType = () => {
  return (
    <div className="flex w-full h-full flex-col bg-white rounded-lg gap-y-3 ">
      <div className="flex h-60">
        <MyResponsiveMarimekko data={data} />
      </div>
    </div>
  );
};

export default AnalyzeMariType;
