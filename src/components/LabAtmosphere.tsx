import React, { useEffect, useRef } from 'react';
import { BoardThemeConfig, BOARD_THEMES } from '../types/theme';

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

interface LabAtmosphereProps {
  theme?: BoardThemeConfig;
}

export const LabAtmosphere: React.FC<LabAtmosphereProps> = ({
  theme = BOARD_THEMES['Cyber Green'],
}) => {
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

    const colors = theme.particleColors;
    const PARTICLE_COUNT = 12; // Subtle & clean
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      const maxLife = 200 + Math.random() * 260;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.25, // Gentle upward drift
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
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

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
  }, [theme]);

  const circuitLines: PulseLine[] = [
    {
      id: 1,
      d: 'M 10 30 H 110 L 130 50 V 140 L 160 170 H 220',
      duration: 4.8,
      delay: 0,
      color: theme.circuitLineColor1,
    },
    {
      id: 2,
      d: 'M 520 390 H 430 L 400 360 V 270 L 360 230',
      duration: 5.4,
      delay: 2.5,
      color: theme.circuitLineColor2,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-5">
      {/* 1. Dynamic SVG Circuit Traces & Animated Energy Pulses */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 540 420"
        preserveAspectRatio="none"
      >
        {/* Base Circuit Tracks */}
        {circuitLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={line.d}
            fill="none"
            stroke="currentColor"
            className="text-slate-800/80"
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

        {/* Decorative circuit solder pads */}
        <circle cx="10" cy="30" r="2.5" fill={theme.circuitLineColor1} opacity="0.6" />
        <circle cx="220" cy="170" r="2.5" fill={theme.circuitLineColor1} opacity="0.6" />
        <circle cx="520" cy="390" r="2.5" fill={theme.circuitLineColor2} opacity="0.6" />
        <circle cx="360" cy="230" r="2.5" fill={theme.circuitLineColor2} opacity="0.6" />
      </svg>

      {/* 2. Floating Digital Dust Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
