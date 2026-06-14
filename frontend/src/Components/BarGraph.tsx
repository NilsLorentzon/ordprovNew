import React from "react";
import { letterFrequency } from "@visx/mock-data";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";

// We'll use some mock data from `@visx/mock-data` for this.
const data = letterFrequency;

console.log(data);

// Define the graph dimensions and margins
const width = 500;
const height = 500;
const margin = { top: 0, bottom: 0, left: 0, right: 0 };

// Then we'll create some bounds
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

// Accessors
const getLetter = (d: any) => d.letter;
const getFrequency = (d: any) => d.frequency * 100;

// And then scale the graph by our data
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

// Finally we'll embed it all in an SVG
function BarGraph() {
  return (
    <svg width={width} height={height}>
      {data.map((d) => {
        const letter = getLetter(d);
        const barHeight = yMax - (yScale(getFrequency(d)) ?? 0);
        return (
          <Group key={`bar-${letter}`}>
            <Bar
              x={xScale(letter)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill="green"
              
            />
          </Group>
        );
      })}
    </svg>
  );
}

export default BarGraph;
