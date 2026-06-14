import React from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";

interface Props {
  correct: number;
  wrong: number;
  size?: number;
  thickness?: number;
}
export default function CircleGraph({
  correct = 75,
  wrong = 25,
  size = 200,
  thickness = 20,
}: Props) {
  // 1. Structure the binary data
  const data = [
    { label: "correct", amount: correct, color: "#10B981" }, // Green
    { label: "wrong", amount: wrong, color: "#EF4444" }, // Red
  ];

  // 2. Calculate dimensions
  const total = correct + wrong;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const radius = size / 2;
  const innerRadius = radius - thickness;

  // Accessor function for visx to know what values to chart
  const getAmount = (d: any) => d.amount;

  return (
    <svg width={size} height={size}>
      {/* Move the origin (0,0) to the center of the SVG */}
      <Group top={radius} left={radius}>
        <Pie
          data={data}
          pieValue={getAmount}
          outerRadius={radius}
          innerRadius={innerRadius}
          padAngle={0.02} // Slight spacing between slices
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              return (
                <path
                  key={`arc-${index}`}
                  d={pie.path(arc) || undefined}
                  fill={arc.data.color}
                />
              );
            });
          }}
        </Pie>

        {/* 3. Central Percentage Text */}
        <text
          textAnchor="middle"
          dy="0.33em" // Perfectly vertically centers text on the baseline
          fontSize={size * 0.18} // Dynamically scale font size based on chart size
          fontWeight="bold"
          fill="#374151"
        >
          {`${percentage}%`}
        </text>
      </Group>
    </svg>
  );
}
