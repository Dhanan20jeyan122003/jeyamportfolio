"use client";

import { useChatStore } from "@/store/chatStore";

export default function Nav() {
  const toggleChat = useChatStore((state) => state.toggleChat);

  return (
    <nav className="flex items-center justify-between py-5 px-10 sticky top-0 z-30 bg-paper/70 backdrop-blur-md border-b border-line">
      <div className="font-grotesk font-bold text-xl">
        Dhananjeyan<span className="text-coral">.</span>
      </div>
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <a href="#work" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            Work
          </a>
        </li>
        <li>
          <a href="#about" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            About
          </a>
        </li>
        <li>
          <a href="#contact" className="text-ink text-sm font-medium hover:text-violet transition-colors">
            Contact
          </a>
        </li>
      </ul>
      <button
        onClick={toggleChat}
        className="bg-ink text-paper font-grotesk font-medium text-[13.5px] py-2.5 px-5 rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse"></span> Ask the AI
      </button>
    </nav>
  );
}
