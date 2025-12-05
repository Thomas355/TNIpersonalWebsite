import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';

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

export default function Info(){
  const [age, setAge] = useState(0);

  // State for the current numerical count
  const [count, setCount] = useState(51);

  // State to determine the direction of counting (true for up, false for down)
  const [countingUp, setCountingUp] = useState(true);

  // Calculate age on component mount
  useEffect(() => {
    // Set your birthdate here (year, month - 1, day)
    const birthDate = new Date(2001, 4, 21); // May 21, 2001 (months are 0-indexed)
    const today = new Date();
    
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    setAge(calculatedAge);
  }, []);

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

  // Setup the interval timer for counting
  useEffect(() => {
    // Start the timer
    const timer = setInterval(updateCount, INTERVAL_MS);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [updateCount]);

  // Calculate the dynamic gradient colors
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
        About Me
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        className="mt-6 text-xl md:text-2xl font-light text-gray-300 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <span className="relative inline-block">
          <span className="absolute inset-0 blur-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-30 animate-pulse"></span>
          <span className="relative">
            Hi my name is Thomas Nabil Issa. I am {age} years old. 
            
            I am a recent computer science graduate specializing in intelligent systems, with hands-on experience at Starbeam, a company specializing in benchmarking ML models. My background includes coursework and projects in machine learning, data analysis, and consumer-facing interactive software, using Python, C++, and Javascript.
            Beyond technology, I founded the Zabbaleen Project—a charitable initiative that delivers school supplies and clothing to an underserved community in Cairo. This has helped shape my leadership, cross-cultural communication, and project management skills.
            I'm driven to build meaningful, user-centered software and am actively seeking opportunities where I can grow as an engineer while creating impactful technology.
          </span>
        </span>
      </motion.h2>
    </div>
  );
}