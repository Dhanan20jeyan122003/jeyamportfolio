"use client";

import { useChatStore } from "@/store/chatStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREVIEWS = [
  { q: "where does he work?", a: "He is a Junior Software Engineer at WBC Software Lab." },
  { q: "where did he intern?", a: "He interned at SetNext, Accent Techno Soft, and Phoenix Soft Tech." },
  { q: "what are his top skills?", a: "He's highly proficient in HTML, CSS, React, Java, and Node.js." },
  { q: "has he built AI projects?", a: "Yes, he built a Heart Disease Prediction system using Hybrid ML." },
  { q: "what's his degree?", a: "He holds a B.E. in Electronics and Communication Engineering." },
  { q: "what databases does he use?", a: "He has experience working with MySQL, MongoDB, and SQLite." }
];

function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Orb() {
  const toggleChat = useChatStore((state) => state.toggleChat);
  const isOpen = useChatStore((state) => state.isOpen);
  const [showPreview, setShowPreview] = useState(false);
  const [messages, setMessages] = useState(PREVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMessages(shuffleArray(PREVIEWS));
  }, []);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    
    const triggerPreview = () => {
      if (!isOpen) {
        setShowPreview(true);
        hideTimeout = setTimeout(() => {
          setShowPreview(false);
          setTimeout(() => setCurrentIndex((prev) => (prev + 1) % PREVIEWS.length), 500); 
        }, 5000);
      }
    };

    const interval = setInterval(triggerPreview, 12000);
    const timeout = setTimeout(triggerPreview, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, [isOpen]);

  const currentMessage = messages[currentIndex] || PREVIEWS[0];

  return (
    <div className="relative w-[210px] h-[210px] mx-auto z-10 cursor-pointer" onClick={toggleChat}>
      <AnimatePresence>
        {showPreview && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[210px] bg-white rounded-2xl p-3 shadow-[0_14px_30px_-10px_rgba(27,16,48,0.25)] text-xs pointer-events-auto"
          >
            <div className="absolute -bottom-[7px] left-1/2 -ml-[7px] w-[14px] h-[14px] bg-white rotate-45"></div>
            <div className="font-mono text-[10.5px] text-violet-dark mb-1.5">"{currentMessage.q}"</div>
            <div className="text-ink-soft leading-relaxed">{currentMessage.a}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layoutId="orb"
        className="absolute inset-0 bg-[radial-gradient(circle_at_32%_30%,#C3B3FF,var(--violet)_45%,var(--coral)_100%)] shadow-[0_30px_60px_-20px_rgba(124,92,255,0.55)] rounded-full hover:scale-105 transition-transform duration-300"
        style={{
          animation: "float 6s ease-in-out infinite, morph 9s ease-in-out infinite"
        }}
      ></motion.div>
    </div>
  );
}
