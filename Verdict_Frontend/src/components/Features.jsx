import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const data = [
    { title: "Scenario-solver", id: "1" },
    { title: "Find GRs", id: "2" },
    { title: "Cross-Questioning", id: "3" },
    { title: "Legal Drafting", id: "4" }
];

const images = [
    "https://assets.aceternity.com/linear-demo.webp",
    "https://clerk.com/_next/static/media/profile@2xrl.04d4e021.webp",
    "https://assets.aceternity.com/linear-demo.webp",
    "https://clerk.com/_next/static/media/profile@2xrl.04d4e021.webp"
];

function Features() {
    const [activeId, setActiveId] = useState("1");
    const refs = useRef(new Map());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.dataset.id);
                    }
                });
            },
            { rootMargin: "-50% 0px -50% 0px" }
        );

        data.forEach((feature) => {
            const element = refs.current.get(feature.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-4 h-auto">
            <h1 className="text-6xl flex justify-start items-center pl"><svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_116_153)"> <path d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z" fill="url(#paint0_linear_116_153)" /> </g> <defs> <linearGradient id="paint0_linear_116_153" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse"> <stop stop-color="#DF99F7" /> <stop offset="1" stop-color="#FFDBB0" /> </linearGradient> <clipPath id="clip0_116_153"> <rect width="200" height="200" fill="white" /> </clipPath> </defs> </svg>&nbsp;Our features</h1>
            <div className="flex w-full gap-10 items-start">

                <div className="w-full py-[25vh]">
                    <ul>
                        {data.map((feature) => (
                            <motion.li
                                key={feature.id}
                                ref={(el) => el && refs.current.set(feature.id, el)}
                                data-id={feature.id}
                                initial={{ x: 0, scale: 1 }}
                                animate={feature.id === activeId ? { x: 10, scale: 1.1 } : { x: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            >
                                <p className={`text-5xl py-48 transition-all duration-300 ${feature.id === activeId ? "text-green-400 shadow-2xl brightness-150" : "text-gray-300"
                                    }`}>
                                    {feature.title}
                                </p>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                <div className="w-full sticky top-0 h-screen flex items-center">
                    <div className="w-full h-[500px] bg-gray-200 rounded-4xl relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeId}
                                src={images[parseInt(activeId) - 1]}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.1, ease: "easeIn" }}
                                className="absolute h-full w-full object-cover"
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;
