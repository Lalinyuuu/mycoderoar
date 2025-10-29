import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SparkleEffect from "@/components/ui/SparkleEffect";
import ShimmerEffect from "@/components/ui/ShimmerEffect";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Hero Images Carousel
  const heroImages = [
    {
      src: '/images/herosection/herosection-1.png',
      alt: 'Ragnarok Online Fantasy Adventure',
      title: 'Epic Adventures Await',
      gradient: 'from-purple-6 to-purple-7',
      borderColor: 'border-purple-4'
    },
    {
      src: '/images/herosection/herosection-2.png',
      alt: 'Ragnarok Online Character Building',
      title: 'Master Your Character',
      gradient: 'from-purple-3 to-light-1',
      borderColor: 'border-purple-3'
    },
    {
      src: '/images/herosection/herosection-3.png',
      alt: 'Ragnarok Online Epic Journey',
      title: 'Join the Adventure',
      gradient: 'from-pink-1 to-yellow-2',
      borderColor: 'border-pink-4'
    },
    {
      src: '/images/herosection/herosection-4.png',
      alt: 'Ragnarok Online Battle Arena',
      title: 'Unleash Your Power',
      gradient: 'from-purple-5 to-pink-5',
      borderColor: 'border-purple-4'
    },
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide carousel with progress
  useEffect(() => {
    setProgress(0); // Reset progress when slide changes
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 3.34; // เพิ่มทีละ 3.34% ทุก 100ms = 3 วินาที
      });
    }, 100);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000); // เปลี่ยนทุก 3 วินาที

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideTimer);
    };
  }, [currentSlide, heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative w-full mx-auto px-6 md:px-8 py-10 md:py-16 bg-gradient-to-br from-light-1 via-purple-1 to-light-2 overflow-hidden">
      {/* Background Shimmer Effects - Parallax Layer (slowest) */}
      <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.15}px)` }}>
        <ShimmerEffect 
          size="medium" 
          color="purple" 
          opacity={0.1} 
          animation="float"
          className="absolute -top-16 -left-16"
        />
      </div>
      <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.2}px)` }}>
        <ShimmerEffect 
          size="small" 
          color="pink" 
          opacity={0.15} 
          animation="ping"
          className="absolute top-1/4 -right-8"
        />
      </div>
      <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.25}px)` }}>
        <ShimmerEffect 
          size="medium" 
          color="blue" 
          opacity={0.2} 
          animation="rotate"
          className="absolute bottom-1/4 -left-4"
        />
      </div>

      <div className="relative z-10 grid grid-cols-12 items-center gap-8 md:gap-12">

        {/* Left - Heading */}
        <div className="relative col-span-12 md:col-span-3 text-center md:text-left">
          {/* Sparkle Effects around heading - Parallax */}
          <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.1}px)` }}>
            <SparkleEffect 
              size="medium" 
              color="purple" 
              position="top-right" 
              animation="sparkle"
            />
          </div>
          <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.18}px)` }} className="absolute -top-8 left-0 md:left-2">
            <SparkleEffect 
              size="xlarge" 
              color="pink" 
              position="top-center" 
              animation="sparkle"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-dark-1">
            <span className="block bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent animate-gradient-wave">
              Explore
            </span>
            <span className="block bg-gradient-to-r from-purple-6 via-pink-5 to-success bg-clip-text text-transparent animate-gradient-wave" style={{animationDelay: '0.3s'}}>
              Midgard,
            </span>
            <span className="block bg-gradient-to-r from-purple-5 via-success to-emerald-4 bg-clip-text text-transparent animate-gradient-wave" style={{animationDelay: '0.6s'}}>
              It All Starts in Prontera
            </span>
          </h1>
          <p className="mt-5 text-dark-3 md:text-base">
            Discover the Ultimate Ragnarok Online Guide.
            <br className="hidden md:block" />
            Your Daily Source for Builds, Quests & Strategies.
          </p>
        </div>

        {/* Center - Image - Parallax Layer (medium speed) */}
        <div 
          className="relative col-span-12 md:col-span-6 z-10"
          style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.3}px)` }}
        >
          {/* Sparkle Effects around image - Parallax */}
          <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.12}px)` }}>
            <SparkleEffect 
              size="medium" 
              color="purple" 
              position="top-right" 
              animation="sparkle"
            />
          </div>
          <div style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.22}px)` }}>
            <SparkleEffect 
              size="small" 
              color="pink" 
              position="bottom-left" 
              animation="shimmer"
            />
          </div>
          
          {/* Carousel Container */}
          <div className={`relative rounded-3xl w-full aspect-[16/9] shadow-xl border-4 ${heroImages[currentSlide].borderColor} overflow-hidden bg-gradient-to-br ${heroImages[currentSlide].gradient} p-1 transition-all duration-1000 hover:shadow-2xl hover:scale-[1.02] group`}>
            
            {/* Images */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-110'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/herosection/herosection-1.png';
                    }}
                  />
                  {/* Overlay Title */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg bg-gradient-to-r from-white via-purple-2 to-white bg-clip-text text-transparent animate-gradient-wave">
                      {image.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons - Show on Hover */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicators with Progress */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative overflow-hidden transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2'
                      : 'w-2 h-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 ${
                    index === currentSlide ? 'bg-white/30' : 'bg-white/50 hover:bg-white/75'
                  }`} />
                  
                  {/* Progress Bar (only for current slide) */}
                  {index === currentSlide && (
                    <div 
                      className="absolute inset-0 bg-white transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Author */}
        <div className="relative col-span-12 md:col-span-3 text-center md:text-left bg-gradient-to-br from-light-3 to-light-1 p-6 rounded-xl shadow-lg border-2 border-purple-3 transition-all duration-300 hover:shadow-xl hover:border-purple-4 hover:-translate-y-1 z-20 mt-8 md:mt-0">
          {/* Sparkle Effects around author card */}
          <SparkleEffect 
            size="small" 
            color="purple" 
            position="top-right" 
            animation="sparkle"
          />
          
          <p className="text-sm text-purple-7 font-semibold mb-1 animate-gradient-pulse">– Guide Master</p>
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-6 via-purple-5 to-emerald-4 bg-clip-text text-transparent">
            Midgard Explorer
          </h3>
          <p className="text-dark-3 mb-4">
            A seasoned adventurer with over a decade exploring the mystical world of 
            Midgard. Specializing in MVP hunting strategies, War of Emperium tactics, 
            and comprehensive job class guides for all paths.
          </p>
          <p className="text-dark-3">
            When not conquering dungeons, I dedicate time to helping novice adventurers 
            master game mechanics and forge their legendary characters in Rune-Midgarts Kingdom.
          </p>
        </div>

      </div>
    </section>
  );
}
