import React, { useEffect, useRef } from 'react';

const MovingDotsBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');    const connectionDistance = 125;
    const DOTS_DENSITY = 1.5; // Dots per 10,000 pixels of screen area

    const initializeDots = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      //
      // Calculate number of dots based on screen area and density
      const screenArea = canvas.width * canvas.height;
      const numDots = Math.round((screenArea / 10000) * DOTS_DENSITY);

      dotsRef.current = Array.from({ length: numDots }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 3
      }));
    };

    const updateDots = () => {
      dotsRef.current.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      });
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dotsRef.current.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#4ade80";
        ctx.fill();
      });

      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = i + 1; j < dotsRef.current.length; j++) {
          const dx = dotsRef.current[i].x - dotsRef.current[j].x;
          const dy = dotsRef.current[i].y - dotsRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(dotsRef.current[i].x, dotsRef.current[i].y);
            ctx.lineTo(dotsRef.current[j].x, dotsRef.current[j].y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      updateDots();
      drawDots();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    initializeDots();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-indigo-950">
      <canvas
        ref={canvasRef}
        className="block"
      />
    </div>
  );
};

export default MovingDotsBackground;
