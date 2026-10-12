import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Dhananjeyan M | AI-Powered Portfolio & Software Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #120d1c 0%, #1f1435 60%, #2e1a47 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-60px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 77, 109, 0.35) 0%, rgba(138, 92, 246, 0.15) 50%, transparent 70%)',
          }}
        />

        {/* Top Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              background: 'rgba(255, 77, 109, 0.15)',
              border: '1px solid rgba(255, 77, 109, 0.4)',
              color: '#ff7a93',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            ✦ OFFICIAL PORTFOLIO
          </div>
          <div
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            STUDIO ORB AI ASSISTANT
          </div>
        </div>

        {/* Center Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '66px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <span>Dhananjeyan M</span>
            <span style={{ color: '#ff4d6d' }}>.</span>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#d4c7f0',
              lineHeight: 1.25,
            }}
          >
            Junior Software Engineer & AI Engineer
          </div>
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.65)',
              marginTop: '6px',
              maxWidth: '900px',
            }}
          >
            Generative AI (LLMs, RAG) • Full-Stack Web Dev (React, Next.js) • Spring Boot • Java
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '28px',
            fontSize: '19px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', gap: '28px' }}>
            <span>GitHub: Dhanan20jeyan122003</span>
            <span>•</span>
            <span>WBC Software Lab</span>
          </div>
          <div style={{ color: '#c8ff00', fontWeight: 600 }}>
            ★ Available for Hire • Remote & On-site
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
