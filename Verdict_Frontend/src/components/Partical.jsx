import React, { useEffect, useRef, useState } from "react";

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  const hexInt = parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

const Particles = ({ className = "", quantity =100, ease = 0, color = "#ffffff" }) => {
  const canvasRef = useRef(null);
  const circles = useRef([]);
  const mousePosition = useMousePosition();
  const dpr = window.devicePixelRatio || 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      context.scale(dpr, dpr);
      createParticles();
    };

    const createParticles = () => {
      circles.current = Array.from({ length: quantity }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
      }));
    };

    const drawParticles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = hexToRgb(color);
      circles.current.forEach((circle) => {
        context.beginPath();
        context.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
        context.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`;
        context.fill();
        circle.x += circle.dx;
        circle.y += circle.dy;
      });
      requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    drawParticles();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [color, quantity]);

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className}`} />;
};

const Partical = () => {
  const [color, setColor] = useState("#FFFFFF ");

  return (
   
      <Particles className="absolute inset-0 h-screen w-full" quantity={140} ease={10} color={color} />
 
  );
};

export default Partical;
