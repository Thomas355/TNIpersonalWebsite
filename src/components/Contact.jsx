import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from 'react';

// Emerald (Hue: 150) sets basic palate range
const hue1 = 150; 
// Indigo (Hue: 260) sets basic palate range
const hue2 = 260;

const MIN_COUNT = 51;
const MAX_COUNT_COLOR = 900;

const MAX_COUNT = 900;
const INTERVAL_MS = 10;

const getDynamicGradientColors = (currentCount) => {
  // Clamp the count between MIN_COUNT and MAX_COUNT_COLOR as a percentage 
  const normalizedCount = Math.min(
    Math.max(currentCount, MIN_COUNT),
    MAX_COUNT_COLOR
  );

  // Calculate the ratio (0.0 when count is MIN, 1.0 when count is MAX)
  const ratio = (normalizedCount - MIN_COUNT) / (MAX_COUNT_COLOR - MIN_COUNT);
  
  // Calculate the hue based on the count. This allows the color to cycle through
  const hue = Math.round(hue1 + (hue2 - hue1) * ratio);
  
  // Color 1 (Start/From): High Lightness (Light Color)
  const color1 = `hsl(${hue}, 80%, 70%)`; 
  
  // Color 2 (Middle/Via): Medium Saturation & Lightness (Vibrant Color)
  // Shift the hue slightly for a complementary middle color
  const color2Hue = (hue + 120) % 360; 
  const color2 = `hsl(${color2Hue}, 70%, 50%)`; 
  
  // Color 3 (End/To): Low Lightness (Dark Color)
  // Shift the hue again and use very low lightness for a dark, rich end
  const color3Hue = (hue + 240) % 360; 
  const color3 = `hsl(${color3Hue}, 50%, 15%)`; 
  
  return { color1, color2, color3 };
};

export default function Contact() {
  // State for the current numerical count
  const [count, setCount] = useState(51);
  
  // State to determine the direction of counting (true for up, false for down)
  const [countingUp, setCountingUp] = useState(true);
  
  const updateCount = useCallback(() => {
    setCount(prevCount => {
      let newCount;
      let newCountingUp = countingUp;

      if (countingUp) {
        // Counting up
        newCount = prevCount + 1;
        if (newCount > MAX_COUNT) {
          // Reached 900, switch direction to down
          newCountingUp = false;
          newCount = MAX_COUNT - 1; 
        }
      } else {
        // Counting down
        newCount = prevCount - 1;
        if (newCount < 50) {
          // Reached 50 (lower bound), switch direction to up
          newCountingUp = true;
          newCount = 51; 
        }
      }
      
      // Update the counting direction state only if it changed
      if (newCountingUp !== countingUp) {
        setCountingUp(newCountingUp);
      }

      return newCount;
    });
  }, [countingUp]); 

  // Setup the interval timer
  useEffect(() => {
    // Start the timer
    const timer = setInterval(updateCount, INTERVAL_MS);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [updateCount]);

  // Calculate the dynamic gray color for the gradient start
  const { color1, color2, color3 } = getDynamicGradientColors(count);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-center text-white p-8 transition-all duration-100 ease-linear"
      // Apply the dynamic background gradient using inline style
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2}, ${color3})`,
        // Set a smooth transition for the background (optional, but looks better)
        transition: 'background-image 0.1s linear'
      }}
    >
      {/* Title */}
      <motion.h1
        className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-neutral-100 to-stone-100 drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Get In Touch
      </motion.h1>

      {/* Contact Details */}
      <motion.div
        className="mt-8 text-lg md:text-xl font-light text-gray-300 space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p className="flex items-center justify-center gap-2">
          <span className="text-purple-400">📍</span>
          Dubai, UAE | +971 50 307 5647
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <a 
            href="mailto:Thomas9Issa@gmail.com" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            Thomas9Issa@gmail.com
          </a>
          <span className="hidden md:inline text-gray-500">|</span>
          <a 
            href="https://www.linkedin.com/in/thomas-n-issa/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            LinkedIn Profile
          </a>
        </div>
        
        <p>
          <a 
            href="https://github.com/Thomas355" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            Github Profile
          </a>
        </p>
      </motion.div>
    </div>
  );
}