import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
}

interface PulseLine {
  id: number;
  d: string;
  duration: number;
  delay: number;
  color: string;
}

export const LabAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette: Phosphor Emerald, Cyan logic, Amber voltage
    const colors = ['#34d399', '#38bdf8', '#fbbf24'];

    const PARTICLE_COUNT = 12; // Reduced by half for a much cleaner, subtle look
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      const maxLife = 200 + Math.random() * 260;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.25, // Very gentle upward drift
        size: 0.8 + Math.random() * 1.2,
        alpha: 0,
        maxAlpha: 0.12 + Math.random() * 0.18,
        life: 0,
        maxLife,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // Stagger lifecycle
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap or respawn
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Fade in and fade out curve
        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.maxAlpha;
        } else {
          p.alpha = ((p.maxLife - p.life) / halfLife) * p.maxAlpha;
        }

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
          continue;
        }

        // Draw particle with subtle soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Pre-defined geometric circuit bus paths along opposite corners (reduced to 2)
  const circuitLines: PulseLine[] = [
    {
      id: 1,
      d: 'M 10 30 H 110 L 130 50 V 140 L 160 170 H 220',
      duration: 4.8,
      delay: 0,
      color: '#34d399',
    },
    {
      id: 2,
      d: 'M 520 390 H 430 L 400 360 V 270 L 360 230',
      duration: 5.4,
      delay: 2.5,
      color: '#38bdf8',
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-5">
      {/* 1. Subtle SVG Circuit Traces & Animated Energy Pulses */}
      <svg
        className="absolute inset-0 w-full h-full opacity-18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 540 420"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Static Base Circuit Tracks */}
        {circuitLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={line.d}
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Animated Traveling Data Pulses */}
        {circuitLines.map((line) => (
          <path
            key={`pulse-${line.id}`}
            d={line.d}
            fill="none"
            stroke={line.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="16 140"
            className="circuit-pulse"
            style={{
              animation: `circuitFlow ${line.duration}s linear infinite`,
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}

        {/* Small decorative circuit solder pads */}
        <circle cx="10" cy="30" r="2.5" fill="#34d399" opacity="0.5" />
        <circle cx="220" cy="170" r="2.5" fill="#34d399" opacity="0.5" />
        <circle cx="520" cy="390" r="2.5" fill="#38bdf8" opacity="0.5" />
        <circle cx="360" cy="230" r="2.5" fill="#38bdf8" opacity="0.5" />
      </svg>

      {/* 2. Floating Digital Dust Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
