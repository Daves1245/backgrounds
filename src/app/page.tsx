"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Background from "./components/CircularBackground";
import BackgroundControls from "./components/BackgroundControls";

export default function Home() {
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const logoVelocityRef = useRef({ x: 0, y: 0 });
  const logoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const colorTimeRef = useRef(0);
  const spinnerAnimationRef = useRef(null);
  
  const [backgroundSettings, setBackgroundSettings] = useState({
    circle1Dots: 100,
    circle2Dots: 70,
    circle3Dots: 50,
    circle4Dots: 36,
    circle5Dots: 26,
    connectionDistance: 250,
    baseRotationSpeed: 0.001,
    rotationProportion: -2.5
  });

  const [modulatedSettings, setModulatedSettings] = useState({
    circle1Dots: false,
    circle2Dots: false,
    circle3Dots: false,
    circle4Dots: false,
    circle5Dots: false,
    connectionDistance: false,
    baseRotationSpeed: false,
    rotationProportion: false
  });

  const getColor = (time) => {
    const hue = (time * 30) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  useEffect(() => {
    if (isLoading) {
      const COLOR_CHANGE_SPEED = 0.005;
      
      const animateSpinner = () => {
        colorTimeRef.current += COLOR_CHANGE_SPEED;
        spinnerAnimationRef.current = requestAnimationFrame(animateSpinner);
      };
      
      animateSpinner();
      
      return () => {
        if (spinnerAnimationRef.current) {
          cancelAnimationFrame(spinnerAnimationRef.current);
        }
      };
    }
  }, [isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      setIsLoading(true);
      
      try {
        const hashSettings = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
        setBackgroundSettings(hashSettings);
        
        showNotification("Settings imported from URL!");
      } catch (error) {
        console.error("Failed to parse settings from hash:", error);
        showNotification("Failed to import settings from URL!");
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const areAllModulated = Object.values(modulatedSettings).every(val => val);

  const handleSettingChange = (setting, value) => {
    setBackgroundSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const toggleModulation = (setting) => {
    setModulatedSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleModulateAll = (active) => {
    setModulatedSettings({
      circle1Dots: active,
      circle2Dots: active,
      circle3Dots: active,
      circle4Dots: active,
      circle5Dots: active,
      connectionDistance: active,
      baseRotationSpeed: active,
      rotationProportion: active
    });
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  const exportSettings = () => {
    const settingsJson = JSON.stringify(backgroundSettings);
    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(settingsJson)}`;
    
    navigator.clipboard.writeText(url)
      .then(() => {
        showNotification("URL with settings copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy URL:", err);
        showNotification("Failed to copy URL. See console for details.");
      });
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  const handleScreenClick = (e) => {
    const isControlsClick = e.target.closest('.controls-panel');
    const isLogoClick = e.target.closest('.logo-container');
    const isToggleClick = e.target.closest('.controls-toggle');
    
    if (!isControlsClick && !isLogoClick && !isToggleClick) {
      handleModulateAll(!areAllModulated);
    }
  };

  useEffect(() => {
    logoVelocityRef.current = {
      x: (Math.random() * 2 - 1) * 3,
      y: (Math.random() * 2 - 1) * 3
    };

    const updateLogoPosition = () => {
      if (!logoRef.current || !containerRef.current) return;
      
      const logoWidth = 180;
      const logoHeight = 38;
      const containerRect = containerRef.current.getBoundingClientRect();
      
      setLogoPosition(prevPos => {
        let newX = prevPos.x + logoVelocityRef.current.x;
        let newY = prevPos.y + logoVelocityRef.current.y;
        
        if (newX < 0 || newX + logoWidth > containerRect.width) {
          logoVelocityRef.current.x = -logoVelocityRef.current.x;
          newX = newX < 0 ? 0 : containerRect.width - logoWidth;
        }
        
        if (newY < 0 || newY + logoHeight > containerRect.height) {
          logoVelocityRef.current.y = -logoVelocityRef.current.y;
          newY = newY < 0 ? 0 : containerRect.height - logoHeight;
        }
        
        return { x: newX, y: newY };
      });
      
      animationFrameRef.current = requestAnimationFrame(updateLogoPosition);
    };
    
    updateLogoPosition();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const ranges = {
      circle1Dots: { min: 50, max: 150, center: 100 },
      circle2Dots: { min: 30, max: 100, center: 70 },
      circle3Dots: { min: 20, max: 80, center: 50 },
      circle4Dots: { min: 15, max: 60, center: 36 },
      circle5Dots: { min: 10, max: 40, center: 26 },
      connectionDistance: { min: 150, max: 350, center: 250 },
      baseRotationSpeed: { min: 0.0005, max: 0.0015, center: 0.001 },
      rotationProportion: { min: -3.5, max: -1.5, center: -2.5 }
    };

    const isAnyModulated = Object.values(modulatedSettings).some(val => val);
    if (!isAnyModulated) return;

    let startTime = Date.now();
    const modulationInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      setBackgroundSettings(prev => {
        const newSettings = { ...prev };
        
        Object.entries(modulatedSettings).forEach(([setting, isModulated], index) => {
          if (isModulated) {
            const { min, max, center } = ranges[setting];
            const frequency = 0.1 + (index * 0.02);
            const phase = index * 0.5;
            const amplitude = (max - min) / 2;
            const value = center + amplitude * Math.sin((elapsed * frequency * Math.PI) + phase);
            newSettings[setting] = value;
          }
        });
        
        return newSettings;
      });
    }, 50);

    return () => clearInterval(modulationInterval);
  }, [modulatedSettings]);

  const currentColor = getColor(colorTimeRef.current);

  return (
    <div 
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative"
      onClick={handleScreenClick}
    >
      <Background settings={backgroundSettings} />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full animate-[spin_3s_linear_infinite]"
                style={{ 
                  background: `conic-gradient(${currentColor}, transparent)`,
                  maskImage: 'radial-gradient(transparent 55%, white 56%)',
                  WebkitMaskImage: 'radial-gradient(transparent 55%, white 56%)'
                }}
              ></div>
              <div 
                className="w-16 h-16 rounded-full absolute top-4 left-4 animate-[spin_2s_linear_infinite_reverse]"
                style={{ 
                  background: `conic-gradient(${currentColor}, transparent)`,
                  maskImage: 'radial-gradient(transparent 55%, white 56%)',
                  WebkitMaskImage: 'radial-gradient(transparent 55%, white 56%)'
                }}
              ></div>
              <div 
                className="w-8 h-8 rounded-full absolute top-8 left-8 animate-[spin_1.5s_linear_infinite]"
                style={{ 
                  background: `conic-gradient(${currentColor}, transparent)`,
                  maskImage: 'radial-gradient(transparent 40%, white 41%)',
                  WebkitMaskImage: 'radial-gradient(transparent 40%, white 41%)'
                }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full absolute top-[10.5px] left-[10.5px] animate-pulse"
                style={{ 
                  backgroundColor: currentColor,
                  top: 'calc(50% - 6px)',
                  left: 'calc(50% - 6px)'
                }}
              ></div>
            </div>
            <p className="text-white font-medium" style={{ color: currentColor }}>
              Loading settings...
            </p>
          </div>
        </div>
      )}
      
      {notification.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-4 py-2 rounded-full shadow-lg z-40 backdrop-blur-sm">
          <span>{notification.message}</span>
        </div>
      )}
      
      {areAllModulated && !showControls && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-purple-500/80 text-white px-4 py-2 rounded-full shadow-lg z-30 backdrop-blur-sm">
          <span>All modulation active - tap anywhere to stop</span>
        </div>
      )}
      
      <div className="fixed top-4 right-4 z-30 controls-toggle">
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-white text-sm">Controls</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={showControls}
              onChange={toggleControls}
            />
            <div className={`block w-10 h-6 rounded-full ${showControls ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showControls ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
      
      {showControls && (
        <div className="controls-panel">
          <BackgroundControls 
            settings={backgroundSettings} 
            onSettingChange={handleSettingChange}
            modulatedSettings={modulatedSettings}
            onModulationToggle={toggleModulation}
            onModulateAll={handleModulateAll}
            onExportSettings={exportSettings}
          />
        </div>
      )}
      
      <main ref={containerRef} className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative w-full h-full">
        <div 
          ref={logoRef}
          className="logo-container"
          style={{ 
            position: 'absolute',
            left: `${logoPosition.x}px`,
            top: `${logoPosition.y}px`,
            zIndex: 10
          }}
        >
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        
        <div className="mt-[50px] w-full">
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                src/app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
