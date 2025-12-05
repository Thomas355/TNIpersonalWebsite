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

export default function Projects(){

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
  
    // Setup the interval timer for counting
    useEffect(() => {
      // Start the timer
      const timer = setInterval(updateCount, INTERVAL_MS);
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(timer);
    }, [updateCount]);
  
    // Calculate the dynamic gradient colors
    const { color1, color2, color3 } = getDynamicGradientColors(count);


  const projects = [
    {
      title: "Personal Website Template",
      url: "https://github.com/Thomas355/personalWebsiteExample",
    },
    {
      title: "Training Code Generator, specifically for Turtle Code",
      url: "https://github.com/Thomas355/turtleCodeGenerator",
    },
    {
      title: "ML that Makes Python Code from Images",
      url: "https://github.com/Thomas355/turtleCodeLearner",
    },
  ];

  // Function to generate GitHub social preview image URL
  const getGitHubPreview = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length >= 2) {
        // For repository URLs: username/repo
        return `https://opengraph.githubassets.com/1/${pathParts[0]}/${pathParts[1]}`;
      } else if (pathParts.length === 1) {
        // For user profile URLs
        return `https://github.com/${pathParts[0]}.png?size=400`;
      }
    } catch (e) {
      console.error('Invalid URL:', url);
    }
    return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  };

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
      <motion.h1
          className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-neutral-100 to-stone-100 drop-shadow-lg **mt-[-40]**" 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
      >
          Projects
      </motion.h1>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative">
              <img
                src={getGitHubPreview(project.url)}
                alt={project.title}
                className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {project.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}