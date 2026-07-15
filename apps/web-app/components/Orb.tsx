"use client";

import { useChatStore } from "@/store/chatStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Orb() {
  const toggleChat = useChatStore((state) => state.toggleChat);
  const isOpen = useChatStore((state) => state.isOpen);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Show preview bubble periodically
    const interval = setInterval(() => {
      if (!isOpen) {
        setShowPreview(true);
        setTimeout(() => setShowPreview(false), 5000);
      }
    }, 12000);

    // Show it once shortly after load
    const timeout = setTimeout(() => {
      if (!isOpen) setShowPreview(true);
      setTimeout(() => setShowPreview(false), 5000);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <div className="relative w-[210px] h-[210px] mx-auto z-10 cursor-pointer" onClick={toggleChat}>
      <AnimatePresence>
        {showPreview && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute -top-[86px] left-1/2 -translate-x-1/2 w-[210px] bg-white rounded-2xl p-3 shadow-[0_14px_30px_-10px_rgba(27,16,48,0.25)] text-xs pointer-events-auto"
          >
            <div className="absolute -bottom-[7px] left-1/2 -ml-[7px] w-[14px] h-[14px] bg-white rotate-45"></div>
            <div className="font-mono text-[10.5px] text-violet-dark mb-1.5">"where did he intern?"</div>
            <div className="text-ink-soft leading-relaxed">He interned at SetNext, Accent Techno Soft, and Phoenix Soft Tech.</div>
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
