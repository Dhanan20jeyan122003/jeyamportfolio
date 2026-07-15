"use client";

export default function Marquee() {
  const items = [
    "TypeScript",
    "Node.js",
    "React",
    "Supabase",
    "Ollama",
    "PostgreSQL",
    "Framer Motion",
    "Next.js",
    "Spring Boot",
    "MongoDB",
    "Python",
    "Java"
  ];

  const duplicatedItems = [...items, ...items];

  return (
    <div className="bg-ink py-4 mt-11 overflow-hidden -rotate-[1.1deg] relative z-10 w-[110%] -ml-[5%]">
      <div className="flex gap-9 w-max animate-scroll">
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="font-grotesk font-medium text-[15px] text-paper flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lime text-[12px]">✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
