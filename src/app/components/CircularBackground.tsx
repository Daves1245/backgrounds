import React, { useEffect, useRef } from 'react';

interface CircularBackgroundProps {
  settings: {
    circle1Dots: number;
    circle2Dots: number;
    circle3Dots: number;
    circle4Dots: number;
    circle5Dots: number;
    connectionDistance: number;
    baseRotationSpeed: number;
    rotationProportion: number;
  };
}

const CircularBackground: React.FC<CircularBackgroundProps> = ({ settings }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const circle1DotsRef = useRef([]);
  const circle2DotsRef = useRef([]);
  const circle3DotsRef = useRef([]);
  const circle4DotsRef = useRef([]);
  const circle5DotsRef = useRef([]);
  const circle1AngleRef = useRef(0);
  const circle2AngleRef = useRef(0);
  const circle3AngleRef = useRef(0);
  const circle4AngleRef = useRef(0);
  const circle5AngleRef = useRef(0);
  const colorTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const CIRCLE1_DOTS = settings.circle1Dots;
    const CIRCLE2_DOTS = settings.circle2Dots;
    const CIRCLE3_DOTS = settings.circle3Dots;
    const CIRCLE4_DOTS = settings.circle4Dots;
    const CIRCLE5_DOTS = settings.circle5Dots;

    const ROTATION_SPEED_PROPORTION = settings.rotationProportion;

    const BASE_CIRCLE_ROTATION_SPEED = settings.baseRotationSpeed;
    const CIRCLE1_ROTATION_SPEED = BASE_CIRCLE_ROTATION_SPEED * ROTATION_SPEED_PROPORTION;
    const CIRCLE2_ROTATION_SPEED = CIRCLE1_ROTATION_SPEED * ROTATION_SPEED_PROPORTION;
    const CIRCLE3_ROTATION_SPEED = CIRCLE2_ROTATION_SPEED * ROTATION_SPEED_PROPORTION;
    const CIRCLE4_ROTATION_SPEED = CIRCLE3_ROTATION_SPEED * ROTATION_SPEED_PROPORTION;
    const CIRCLE5_ROTATION_SPEED = CIRCLE4_ROTATION_SPEED * ROTATION_SPEED_PROPORTION;

    const CONNECTION_DISTANCE = settings.connectionDistance;
    const COLOR_CHANGE_SPEED = 0.005;
    const RADIUS_PROPORTION = 0.778;
    const DOT_SIZE = 5;

    const getColor = (time) => {
      const hue = (time * 30) % 360;
      return `hsl(${hue}, 80%, 60%)`;
    };

    const initializeDots = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const baseSize = Math.min(canvas.width, canvas.height);
      const circle1Radius = baseSize / 2;
      const circle2Radius = circle1Radius * RADIUS_PROPORTION;
      const circle3Radius = circle2Radius * RADIUS_PROPORTION;
      const circle4Radius = circle3Radius * RADIUS_PROPORTION;
      const circle5Radius = circle4Radius * RADIUS_PROPORTION;
      
      circle1DotsRef.current = Array.from({ length: CIRCLE1_DOTS }, (_, i) => {
        const angle = (i / CIRCLE1_DOTS) * Math.PI * 2;
        return { angle, radius: circle1Radius, dotSize: DOT_SIZE };
      });
      
      circle2DotsRef.current = Array.from({ length: CIRCLE2_DOTS }, (_, i) => {
        const angle = (i / CIRCLE2_DOTS) * Math.PI * 2;
        return { angle, radius: circle2Radius, dotSize: DOT_SIZE };
      });
      
      circle3DotsRef.current = Array.from({ length: CIRCLE3_DOTS }, (_, i) => {
        const angle = (i / CIRCLE3_DOTS) * Math.PI * 2;
        return { angle, radius: circle3Radius, dotSize: DOT_SIZE };
      });
      
      circle4DotsRef.current = Array.from({ length: CIRCLE4_DOTS }, (_, i) => {
        const angle = (i / CIRCLE4_DOTS) * Math.PI * 2;
        return { angle, radius: circle4Radius, dotSize: DOT_SIZE };
      });
      
      circle5DotsRef.current = Array.from({ length: CIRCLE5_DOTS }, (_, i) => {
        const angle = (i / CIRCLE5_DOTS) * Math.PI * 2;
        return { angle, radius: circle5Radius, dotSize: DOT_SIZE };
      });
    };

    const updateDots = () => {
      circle1AngleRef.current += CIRCLE1_ROTATION_SPEED;
      if (circle1AngleRef.current >= Math.PI * 2) {
        circle1AngleRef.current -= Math.PI * 2;
      }
      
      circle2AngleRef.current += CIRCLE2_ROTATION_SPEED;
      if (circle2AngleRef.current <= -Math.PI * 2) {
        circle2AngleRef.current += Math.PI * 2;
      }
      
      circle3AngleRef.current += CIRCLE3_ROTATION_SPEED;
      if (circle3AngleRef.current >= Math.PI * 2) {
        circle3AngleRef.current -= Math.PI * 2;
      }
      
      circle4AngleRef.current += CIRCLE4_ROTATION_SPEED;
      if (circle4AngleRef.current <= -Math.PI * 2) {
        circle4AngleRef.current += Math.PI * 2;
      }
      
      circle5AngleRef.current += CIRCLE5_ROTATION_SPEED;
      if (circle5AngleRef.current >= Math.PI * 2) {
        circle5AngleRef.current -= Math.PI * 2;
      }
      
      colorTimeRef.current += COLOR_CHANGE_SPEED;
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const currentColor = getColor(colorTimeRef.current);
      
      const allDotPositions = [];
      
      const calculatePositions = (dots, angleRef) => {
        return dots.map(dot => {
          const currentAngle = dot.angle + angleRef.current;
          const x = centerX + Math.cos(currentAngle) * dot.radius;
          const y = centerY + Math.sin(currentAngle) * dot.radius;
          return { x, y, dotSize: dot.dotSize };
        });
      };
      
      const circle1Positions = calculatePositions(circle1DotsRef.current, circle1AngleRef);
      const circle2Positions = calculatePositions(circle2DotsRef.current, circle2AngleRef);
      const circle3Positions = calculatePositions(circle3DotsRef.current, circle3AngleRef);
      const circle4Positions = calculatePositions(circle4DotsRef.current, circle4AngleRef);
      const circle5Positions = calculatePositions(circle5DotsRef.current, circle5AngleRef);
      
      allDotPositions.push(...circle1Positions, ...circle2Positions, 
                           ...circle3Positions, ...circle4Positions, ...circle5Positions);
      
      for (let i = 0; i < allDotPositions.length; i++) {
        for (let j = i + 1; j < allDotPositions.length; j++) {
          const dx = allDotPositions[i].x - allDotPositions[j].x;
          const dy = allDotPositions[i].y - allDotPositions[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(allDotPositions[i].x, allDotPositions[i].y);
            ctx.lineTo(allDotPositions[j].x, allDotPositions[j].y);
            const alpha = 1 - distance / CONNECTION_DISTANCE;
            const rgbColor = currentColor.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
            ctx.strokeStyle = rgbColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      allDotPositions.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.dotSize, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
      });
    };

    const animate = () => {
      updateDots();
      drawDots();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeDots();
    };

    initializeDots();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings]);

  return (
    <div className="fixed inset-0 bg-indigo-950">
      <canvas
        ref={canvasRef}
        className="block"
      />
    </div>
  );
};

export default CircularBackground;
