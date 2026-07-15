"use client";

import { useChatStore } from "@/store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel() {
  const { isOpen, toggleChat, messages, addMessage, updateLastMessage, isStreaming, setStreaming } = useChatStore();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const query = input.trim();
    setInput("");
    addMessage({ role: "user", content: query });
    addMessage({ role: "ai", content: "" });
    setStreaming(true);

    try {
      // In development, assume api-server is on port 4005
      const res = await fetch("http://localhost:4005/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, sessionId: "session_" + Date.now() })
      });

      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('event: done')) {
            break;
          }
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.content) {
                  updateLastMessage(data.content);
                }
              } catch(e) {}
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      updateLastMessage("Sorry, I'm having trouble connecting to my backend.");
    } finally {
      setStreaming(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => {
      document.getElementById('chat-submit-btn')?.click();
    }, 50);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-line flex flex-col z-50 overflow-hidden"
        >
          <div className="bg-ink text-white p-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-violet rounded-full blur-2xl opacity-40"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#C3B3FF,var(--violet)_45%,var(--coral)_100%)] animate-float"></div>
              <div>
                <h3 className="font-grotesk font-bold leading-tight">Studio Orb</h3>
                <p className="text-[11px] font-mono text-lime opacity-80">AI Assistant Online</p>
              </div>
            </div>
            <button onClick={toggleChat} className="relative z-10 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-paper/50 flex flex-col gap-5">
            {messages.length === 0 && (
              <div className="text-center mt-4">
                <p className="text-ink-soft text-sm mb-6">Hi, I'm Dhananjeyan's AI assistant. Ask me anything about his work, skills, or experience!</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => handleSuggestion("What are his top skills?")} className="bg-white shadow-sm border border-line rounded-full px-4 py-2 text-xs text-ink hover:border-violet transition-colors">What are his top skills?</button>
                  <button onClick={() => handleSuggestion("What did he do at SetNext?")} className="bg-white shadow-sm border border-line rounded-full px-4 py-2 text-xs text-ink hover:border-violet transition-colors">What did he do at SetNext?</button>
                  <button onClick={() => handleSuggestion("Tell me about the Heart Disease project.")} className="bg-white shadow-sm border border-line rounded-full px-4 py-2 text-xs text-ink hover:border-violet transition-colors">Tell me about the Heart Disease project.</button>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[20px] px-4.5 py-3 text-[14.5px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-violet to-coral text-white rounded-br-sm' : 'bg-white border border-line/60 text-ink rounded-bl-sm'}`}>
                  {msg.content || <span className="flex items-center gap-1.5 h-5"><span className="w-1.5 h-1.5 bg-violet rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-violet rounded-full animate-bounce [animation-delay:0.15s]"></span><span className="w-1.5 h-1.5 bg-violet rounded-full animate-bounce [animation-delay:0.3s]"></span></span>}
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="p-4 bg-white border-t border-line">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-paper border border-line rounded-full px-5 py-3 text-sm focus:outline-none focus:border-violet transition-colors placeholder:text-ink-soft/60"
                disabled={isStreaming}
              />
              <button
                id="chat-submit-btn"
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="w-11 h-11 flex-shrink-0 bg-coral text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} className="ml-[-2px] mt-[1px]" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
