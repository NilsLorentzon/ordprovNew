import React from "react";
import { letterFrequency } from "@visx/mock-data";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom } from "@visx/axis"; // 1. Import the axis

const data = letterFrequency.slice(0, 10); // Slicing just to make it readable for example

const width = 500;
const height = 500;
const margin = { top: 20, bottom: 50, left: 20, right: 20 }; // Adjusted margins

const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

const getLetter = (d: any) => d.letter;
const getFrequency = (d: any) => d.frequency * 100;

const xScale = scaleBand({
  range: [0, xMax],
  round: true,
  domain: data.map(getLetter),
  padding: 0.4,
});

const yScale = scaleLinear({
  range: [yMax, 0],
  round: true,
  domain: [0, Math.max(...data.map(getFrequency))],
});

function BarGraphCopy() {
  return (
    <svg width={width} height={height}>
      {/* Wrap everything in a top-level Group to respect your margins */}
      <Group top={margin.top} left={margin.left}>
        {/* Render Bars */}
        {data.map((d) => {
          const letter = getLetter(d);
          const barHeight = yMax - (yScale(getFrequency(d)) ?? 0);
          return (
            <Bar
              key={`bar-${letter}`}
              x={xScale(letter)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill="green"
            />
          );
        })}

        {/* 2. Add the X-Axis component */}
        <AxisBottom
          top={yMax} // Pushes the axis to the bottom of the bars
          scale={xScale} // Pass your band scale
          stroke="#333" // Axis line color
          tickStroke="#333" // Tick mark color
          tickLabelProps={() => ({
            fill: "#333",
            fontSize: 11,
            textAnchor: "middle", // Centers text perfectly under the bar
          })}
        />
      </Group>
    </svg>
  );
}

export default BarGraphCopy;
