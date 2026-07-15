"use client";

import Nav from "@/components/Nav";
import Orb from "@/components/Orb";
import Marquee from "@/components/Marquee";
import ChatPanel from "@/components/ChatPanel";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    let lenis: any;
    let animationFrameId: number;
    
    const loadLenis = async () => {
      const Lenis = (await import("@studio-freight/lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      function raf(time: number) {
        lenis.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      }
      animationFrameId = requestAnimationFrame(raf);
    };
    loadLenis();

    return () => {
      if (lenis) lenis.destroy();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative">
      <Nav />
      <ChatPanel />

      <section className="relative px-6 md:px-10 py-16 pt-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet/10 text-violet-dark font-mono text-[12.5px] mb-6 shadow-sm">
            ✦ full-stack engineer, occasionally caffeinated
          </div>
          <h1 className="font-grotesk font-bold text-[clamp(38px,5.4vw,68px)] leading-[1.04] tracking-[-0.02em]">
            I build products that <span className="text-coral">feel</span> as good as they <span className="text-violet">work</span>.
          </h1>
          <p className="text-[17px] text-ink-soft max-w-[440px] mt-6">
            Full-stack engineer specializing in fast, animated, AI-powered web products. Curious what I've shipped? Just ask the orb.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#work" className="font-grotesk font-medium text-[15px] px-6 py-3.5 rounded-full bg-coral text-white shadow-[0_10px_24px_-8px_rgba(255,77,109,0.5)] hover:-translate-y-1 hover:-rotate-1 transition-transform">
              See the work
            </a>
            <a href="#contact" className="font-grotesk font-medium text-[15px] px-6 py-3.5 rounded-full bg-paper-2 text-ink border-2 border-ink hover:-translate-y-1 hover:-rotate-1 transition-transform">
              Say hi
            </a>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          <Orb />
        </div>
      </section>

      <Marquee />

      <section id="work" className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <span className="inline-block px-3 py-1.5 rounded-full bg-coral/10 text-coral-dark font-mono text-[12.5px] mb-5">selected work</span>
        <h2 className="font-grotesk font-bold text-4xl max-w-[600px] tracking-[-0.01em]">A few things I'm proud of.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Work Card 1 */}
          <div className="bg-paper-2 border border-line rounded-[22px] p-5 hover:shadow-[0_24px_46px_-18px_rgba(27,16,48,0.22)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
            <div className="h-[180px] rounded-[18px] mb-5 bg-gradient-to-br from-violet to-[#9d7aff] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-[85%] h-[85%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500 flex items-center justify-center">
                <span className="font-mono text-[11.5px] text-white/90 drop-shadow-md">Heart Disease ML</span>
              </div>
            </div>
            <h3 className="font-grotesk text-[19px] font-bold mb-2 group-hover:text-violet transition-colors">Heart Disease Prediction</h3>
            <p className="text-[14px] text-ink-soft mb-5 leading-relaxed">Hybrid ML/DL models for improved diagnosis accuracy.</p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">Python</span>
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">ML/DL</span>
            </div>
          </div>

          {/* Work Card 2 (offset) */}
          <div className="bg-paper-2 border border-line rounded-[22px] p-5 hover:shadow-[0_24px_46px_-18px_rgba(27,16,48,0.22)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer md:translate-y-12">
            <div className="h-[180px] rounded-[18px] mb-5 bg-gradient-to-br from-coral to-[#ff7a93] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-[85%] h-[85%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500 flex items-center justify-center">
                <span className="font-mono text-[11.5px] text-white/90 drop-shadow-md">E-Commerce Eflyer</span>
              </div>
            </div>
            <h3 className="font-grotesk text-[19px] font-bold mb-2 group-hover:text-coral transition-colors">E-Commerce Eflyer</h3>
            <p className="text-[14px] text-ink-soft mb-5 leading-relaxed">Full-stack e-commerce with authentication and product management.</p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">React</span>
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">Express</span>
            </div>
          </div>

          {/* Work Card 3 */}
          <div className="bg-paper-2 border border-line rounded-[22px] p-5 hover:shadow-[0_24px_46px_-18px_rgba(27,16,48,0.22)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
            <div className="h-[180px] rounded-[18px] mb-5 bg-gradient-to-br from-ink to-[#2a1d45] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-[85%] h-[85%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500 flex items-center justify-center">
                <span className="font-mono text-[11.5px] text-white/90 drop-shadow-md">School Management</span>
              </div>
            </div>
            <h3 className="font-grotesk text-[19px] font-bold mb-2 group-hover:text-lime-dark transition-colors">School Management System</h3>
            <p className="text-[14px] text-ink-soft mb-5 leading-relaxed">User management, attendance, marks, assignments & notices.</p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">Spring Boot</span>
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">MySQL</span>
            </div>
          </div>

          {/* Work Card 4 */}
          <div className="bg-paper-2 border border-line rounded-[22px] p-5 hover:shadow-[0_24px_46px_-18px_rgba(27,16,48,0.22)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
            <div className="h-[180px] rounded-[18px] mb-5 bg-gradient-to-br from-[#FFD166] to-[#ffb703] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-[85%] h-[85%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500 flex items-center justify-center">
                <span className="font-mono text-[11.5px] text-white/90 drop-shadow-md">Furniture Website</span>
              </div>
            </div>
            <h3 className="font-grotesk text-[19px] font-bold mb-2 group-hover:text-[#ffb703] transition-colors">Furniture Website</h3>
            <p className="text-[14px] text-ink-soft mb-5 leading-relaxed">Responsive furniture e-commerce interface with filters and interactive forms.</p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">HTML/CSS</span>
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">JS</span>
            </div>
          </div>

          {/* Work Card 5 */}
          <div className="bg-paper-2 border border-line rounded-[22px] p-5 hover:shadow-[0_24px_46px_-18px_rgba(27,16,48,0.22)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer md:translate-y-12">
            <div className="h-[180px] rounded-[18px] mb-5 bg-gradient-to-br from-[#118AB2] to-[#073B4C] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="w-[85%] h-[85%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500 flex items-center justify-center">
                <span className="font-mono text-[11.5px] text-white/90 drop-shadow-md">E-Book System</span>
              </div>
            </div>
            <h3 className="font-grotesk text-[19px] font-bold mb-2 group-hover:text-[#118AB2] transition-colors">E-Book Management</h3>
            <p className="text-[14px] text-ink-soft mb-5 leading-relaxed">Full CRUD book management with authentication and session handling.</p>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">Java/JSP</span>
              <span className="font-mono text-[10.5px] bg-ink/5 border border-line px-3 py-1.5 rounded-full text-ink-soft">MySQL</span>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 md:px-10 py-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-14 items-start">
        <div className="relative w-full max-w-[320px] aspect-[4/5] mx-auto md:mx-0">
          <div className="absolute -top-4 -left-5 bg-lime text-ink font-grotesk font-medium text-[12.5px] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[0_12px_24px_-10px_rgba(27,16,48,0.4)] -rotate-6 z-10">
            ★ Available for hire
          </div>
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#E7E1F7] to-[#F3F0FA] border-2 border-dashed border-violet opacity-70 flex flex-col items-center justify-center gap-2 font-mono text-xs text-violet-dark text-center p-5">
            <span>your photo goes here<br/>4:5 portrait</span>
          </div>
          <div className="absolute -bottom-5 -right-6 bg-ink text-paper font-grotesk font-medium text-[12.5px] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[0_12px_24px_-10px_rgba(27,16,48,0.4)] rotate-6 z-10">
            📍 Remote — IST
          </div>
        </div>

        <div>
          <span className="inline-block px-3 py-1.5 rounded-full bg-coral/10 text-coral-dark font-mono text-[12.5px] mb-5">experience</span>
          <h2 className="font-grotesk font-bold text-4xl tracking-[-0.01em]">Where I've been building things.</h2>
          
          <div className="flex flex-col mt-12">
            <div className="grid grid-cols-[50px_1fr] md:grid-cols-[90px_1fr] gap-6 py-6 border-t border-line items-start">
              <div className="font-grotesk font-bold text-3xl text-coral opacity-50">01</div>
              <div>
                <div className="font-grotesk font-medium text-lg">AI/ML Engineer Intern — SetNext</div>
                <div className="font-mono text-[11.5px] text-ink-soft my-1.5">Dec 2025 — Feb 2026</div>
                <div className="text-sm text-ink-soft max-w-[600px]">Developed and trained machine learning models for prediction and data analysis. Assisted in data preprocessing, model evaluation, and AI feature integration.</div>
              </div>
            </div>
            
            <div className="grid grid-cols-[50px_1fr] md:grid-cols-[90px_1fr] gap-6 py-6 border-t border-line items-start">
              <div className="font-grotesk font-bold text-3xl text-coral opacity-50">02</div>
              <div>
                <div className="font-grotesk font-medium text-lg">Full Stack Intern — Accent Techno Soft</div>
                <div className="font-mono text-[11.5px] text-ink-soft my-1.5">Jul 2024 — Aug 2024</div>
                <div className="text-sm text-ink-soft max-w-[600px]">Developed mini full-stack apps using React.js, Node.js, MongoDB. API integration, deployment, and version control.</div>
              </div>
            </div>
            
            <div className="grid grid-cols-[50px_1fr] md:grid-cols-[90px_1fr] gap-6 py-6 border-t border-line items-start">
              <div className="font-grotesk font-bold text-3xl text-coral opacity-50">03</div>
              <div>
                <div className="font-grotesk font-medium text-lg">Android Intern — Phoenix Soft Tech</div>
                <div className="font-mono text-[11.5px] text-ink-soft my-1.5">Jun 2023 — Jul 2023</div>
                <div className="text-sm text-ink-soft max-w-[600px]">Built Android apps with Java, improving UI/UX. Integrated SQLite and Google Maps API for data storage and location services.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-6 md:mx-10 mb-16 p-10 md:p-20 bg-ink text-paper rounded-[32px] text-center relative overflow-hidden">
        <div className="absolute -top-[100px] -left-[60px] w-[300px] h-[300px] bg-violet blur-[100px] opacity-40 rounded-full"></div>
        <h2 className="font-grotesk font-bold text-[clamp(32px,4.6vw,52px)] tracking-[-0.01em] relative z-10">
          Got a project? <span className="text-lime">Let's talk.</span>
        </h2>
        <p className="text-paper/65 mt-4 text-[15.5px] relative z-10">Or just ask the orb up top — it's usually faster than email.</p>
        <button className="font-grotesk font-medium text-[15px] px-6 py-3.5 rounded-full bg-coral text-white shadow-[0_10px_24px_-8px_rgba(255,77,109,0.5)] hover:-translate-y-1 hover:-rotate-1 transition-transform mt-8 relative z-10">
          Get in touch
        </button>
        <div className="flex justify-center gap-6 mt-10 relative z-10">
          <a href="#" className="text-paper/70 text-[13px] hover:text-lime transition-colors">Email</a>
          <a href="#" className="text-paper/70 text-[13px] hover:text-lime transition-colors">GitHub</a>
          <a href="#" className="text-paper/70 text-[13px] hover:text-lime transition-colors">LinkedIn</a>
          <a href="#" className="text-paper/70 text-[13px] hover:text-lime transition-colors">Resume</a>
        </div>
      </section>
    </main>
  );
}
