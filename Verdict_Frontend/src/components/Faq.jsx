import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2">
      <button
        className="w-full py-2 text-left text-zinc-950 dark:text-zinc-50 flex items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
        >
          <ChevronRight className="h-4 w-4 text-zinc-950 dark:text-zinc-50" />
        </motion.div>
        <div className="ml-2  dark:text-zinc-50 cursor-pointer">{title}</div>
      </button>

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)", height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.9,
          filter: isOpen ? "blur(0px)" : "blur(8px)",
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.5, 
            ease: isOpen ? [0.25, 1, 0.5, 1] : [0.3, 0, 0.3, 1],  }}
        className="overflow-hidden cursor-pointer"
      >
        <motion.div layout className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
          {children} 
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Faq() {
  return (
    <div className="w-full h-screen items-center justify-evenly flex flex-col">
      <h1 className="text-6xl flex justify-start self-start pl-[15%]">
        <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_116_153)">
            <path
              d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z"
              fill="url(#paint0_linear_116_153)"
            />
          </g>
          <defs>
            <linearGradient id="paint0_linear_116_153" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DF99F7" />
              <stop offset="1" stopColor="#FFDBB0" />
            </linearGradient>
            <clipPath id="clip0_116_153">
              <rect width="200" height="200" fill="white" />
            </clipPath>
          </defs>
        </svg>
        &nbsp;FAQ
      </h1>

      <div className="flex w-1/2 flex-col h-auto text-xl">
        <AccordionItem title="What is this AI-powered legal assistant?">
          This is an AI-driven tool designed to assist associate-level law students by providing insights into departmental law based on the Indian Constitution. It simplifies legal research, explains key legal concepts, and helps users navigate complex legal provisions effectively.
        </AccordionItem>

        <AccordionItem title="Does this AI provide legally binding advice?">
          No, the AI serves as an educational resource. While it offers legal explanations and case references, it does not replace professional legal counsel. Users should consult a qualified lawyer for official legal advice.
        </AccordionItem>

        <AccordionItem title="Can this AI help with legal document drafting?">
          Yes, it can provide templates and general drafting guidelines for common legal documents, such as contracts, affidavits, and petitions. However, these should be reviewed by a legal professional before submission.
        </AccordionItem>

        <AccordionItem title="Is this tool free to use?">
          The tool may offer a free version with basic legal assistance, while advanced features such as case law analysis, document drafting, and legal strategy insights could be available under a paid model.
        </AccordionItem>
      </div>
    </div>
  );
}
