import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import bgimg from "../assets/bg-gredient.avif"

export default function ScrollComponent() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.6], [60, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.7], [0, 300]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.9, 1.2]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.6]);
  const textScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.7]);
  const textTranslateY = useTransform(scrollYProgress, [0, 0.7], [0, -30]);
  const blur = useTransform(scrollYProgress, [0.4, 0.8], [0, 50]);


  const finalBlur = useMotionTemplate`blur(${blur}px)`;

  return (
    
    <div
      ref={containerRef}
      className="h-[150vh] w-full flex flex-col items-center py-70"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <motion.h1
        className="text-5xl font-extrabold text-center bg-gradient-to-t from-gray-500 to-white bg-clip-text text-transparent leading-[1.2] z-50"
        style={{
          scale: textScale,
          opacity: textOpacity,
          translateY: textTranslateY,
          filter: finalBlur,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Step into the future of <br /> Legal Efficiency: AI + Humans
      </motion.h1>
      <img src={bgimg} alt="bg-image" className="absolute w-[100vw] overflow-hidden"></img>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      <motion.div
        style={{

          rotateX: rotateX,
          translateY: translateY,
          scale: scale,
          translateZ: "100px",
        }}
        className="w-[40%] rounded-3xl -mt-20 shadow-2xl bg-white p-1 border border-neutral-100 h-[400px]"
      >
        <div className="bg-black w-full h-full rounded-[16px] shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center overflow-hidden relative">
          <img
            src="https://assets.aceternity.com/linear-demo.webp"
            className="w-full h-full rounded-[10px] "
            alt="Demo"
          />
      <div className="absolute bottom-[-25px] left-0 right-0 w-screen z-[100] h-3/4 bg-gradient-to-t from-black/95 to-transparent"></div>

        </div>

      </motion.div>

    </div>
  );
}
