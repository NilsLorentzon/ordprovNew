import React from "react";

const cleanPercentage = (percentage: number) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle = ({
  colour,
  pct,
  width,
  height,
}: {
  colour: string;
  pct?: number;
  width: number;
  height: number;
}) => {
  const r = width / 2 - 6;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - (pct ?? 100)) * circ) / 100;
  return (
    <circle
      r={r}
      cx={width / 2}
      cy={height / 2}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={"12px"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      //   strokeLinecap="round"
    ></circle>
  );
};

const Text = ({
  currentAmount,
  totalAmount,
}: {
  currentAmount: number;
  totalAmount: number;
}) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.3em"}
      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
    >
      {currentAmount} / {totalAmount}
    </text>
  );
};

const CompletionCircle = ({
  currentAmount,
  totalAmount,
  colour,
}: {
  currentAmount: number;
  totalAmount: number;
  colour: string;
}) => {
  const minDisplayGreen = currentAmount > 0 ? Math.max(10, currentAmount) : 0;
  const pct = cleanPercentage((minDisplayGreen / totalAmount) * 100);
  const width = 160;
  const height = 160;
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#004d20" /> {/* Dark Green */}
          <stop offset="100%" stopColor="#87e887" /> {/* Light Green */}
        </linearGradient>
      </defs>
      <g transform={`rotate(-90 ${width / 2} ${height / 2})`}>
        <Circle colour="lightgray" width={width} height={height} />
        <Circle
          colour="url(#greenGradient)"
          pct={pct}
          width={width}
          height={height}
        />
      </g>
      <Text currentAmount={currentAmount} totalAmount={totalAmount} />
    </svg>
  );
};

export default CompletionCircle;
