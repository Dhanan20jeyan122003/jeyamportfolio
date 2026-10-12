"use client";

import { useChatStore } from "@/store/chatStore";

export default function Nav() {
  const toggleChat = useChatStore((state) => state.toggleChat);

  return (
    <nav aria-label="Main navigation" className="flex items-center justify-between py-5 px-10 sticky top-0 z-30 bg-paper/70 backdrop-blur-md border-b border-line">
      <div className="font-grotesk font-bold text-xl">
        <a href="/" aria-label="Dhananjeyan M - Home">
          Dhananjeyan<span className="text-coral">.</span>
        </a>
      </div>
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <a href="#work" aria-label="Selected Work by Dhananjeyan M" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            Work
          </a>
        </li>
        <li>
          <a href="#about" aria-label="About Dhananjeyan M" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            About
          </a>
        </li>
        <li>
          <a href="#contact" aria-label="Contact Dhananjeyan M" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            Contact
          </a>
        </li>
      </ul>
      <button
        onClick={toggleChat}
        aria-label="Ask Studio Orb AI Assistant"
        className="bg-ink text-paper font-grotesk font-medium text-[13.5px] py-2.5 px-5 rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"></span> Ask the AI
      </button>
    </nav>
  );
}
