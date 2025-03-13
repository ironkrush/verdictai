"use client";

import { useState, useRef } from "react";

export default function Bento() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const items = [
    { title: "Constitutional Law", description: "Understanding the supreme law of the land", size: "col-span-2 row-span-2" },
    { title: "Criminal Law", description: "Defining offenses and legal consequences", size: "col-span-1 row-span-1" },
    { title: "Contract Law", description: "Ensuring legal agreements are binding", size: "col-span-1 row-span-1" },
    { title: "Intellectual Property", description: "Protecting creative and innovative rights", size: "col-span-1 row-span-2" },
    { title: "Human Rights Law", description: "Safeguarding fundamental freedoms", size: "col-span-2 row-span-2" },
  ];


  return (
    <div className="w-full min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4 max-w-5xl w-full relative">
        {items.map((item, index) => (
          <BentoItem
            key={index}
            item={item}
            isHovered={hoveredItem === index}
            onHover={() => setHoveredItem(index)}
            onLeave={() => setHoveredItem(null)}
          />
        ))}
      </div>
    </div>
  );
}

function BentoItem({ item, isHovered, onHover, onLeave }) {
  const itemRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <div
      ref={itemRef}
      className={`${item.size} relative overflow-hidden rounded-xl bg-zinc-900 p-6 group transition-all duration-300`}
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: isHovered ? "0 0 25px rgba(255,255,255,0.15)" : "none",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.15), transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div
        className={`absolute inset-0 pointer-events-none rounded-xl transition-all duration-500`}
      />

      <div className="relative z-10 h-full flex flex-col justify-between cursor-pointer">
        <div>
          <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
          <p className="text-zinc-400 text-sm">{item.description}</p>
        </div>

        <div className="mt-4">
          <span className="text-xs text-zinc-500 uppercase tracking-wider group-hover:text-white transition-colors duration-300">
            Learn More →
          </span>
        </div>
      </div>
    </div>
  );
}
