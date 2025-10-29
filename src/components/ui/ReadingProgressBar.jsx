import { useEffect, useState } from 'react';

const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get scroll position
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate progress percentage
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // Update state (clamp between 0-100)
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress);
    
    // Initial update
    updateProgress();

    // Cleanup
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-purple-5 via-purple-6 to-pink-5 transition-all duration-150 ease-out shadow-lg"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing effect */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default ReadingProgressBar;

