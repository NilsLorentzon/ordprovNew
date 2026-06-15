import { motion } from "framer-motion";

export default function CheckSmallAnimateIcon({ ...args }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      {...args}
    >
      <motion.path
        d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"
        // 1. Change the fill to none and give it a stroke so it looks like a line
        fill="none"
        stroke="currentColor" // Inherits the text color
        strokeWidth="40"      // Adjust thickness as needed
        strokeLinecap="round"
        strokeLinejoin="round"
        
        // 2. Define the animation states
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: "easeInOut" 
        }}
      />
    </svg>
  );
}