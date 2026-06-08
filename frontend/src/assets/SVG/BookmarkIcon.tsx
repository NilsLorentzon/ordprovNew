import clsx from "clsx";

interface Props {
  isSelected?: boolean;
  className?: string;
}
export default function BookmarkIcon({ isSelected, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
    >
      <path
        fill={clsx(isSelected ? "black" : "none")}
        // fill={clsx(isSelected ? "black" : "var(--color-p-300)")}
        d="M260-820h400q33 0 56.5 23.5T760-760v620L480-280 200-120v-540q0-33 23.5-56.5T280-840Z"
      />
      <path
        fill="black"
        d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"
      />
    </svg>
  );
}
