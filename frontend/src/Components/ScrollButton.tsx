import { motion } from "motion/react";
import React from "react";
import ScrollArrowIcon from "../assets/SVG/ScrollArrowIcon";

interface Props {
  onClick: () => void;
  isAnimated: boolean;
}
export default function ScrollButton({ onClick, isAnimated }: Props) {
  return (
    <motion.div
      // make it bounce
      animate={isAnimated ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute bg-p-100 rounded-full bottom-4 right-4 w-12 h-12 flex justify-center items-center"
    >
      <button className="p-4 " aria-label="Scrolla ner" onClick={onClick}>
        <ScrollArrowIcon className="fill-white w-8 h-8" />
      </button>
    </motion.div>
  );
}
