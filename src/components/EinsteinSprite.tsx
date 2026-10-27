import React from 'react';
import { Direction } from '../types/game';

interface EinsteinSpriteProps {
  direction: Direction;
  isPushing: boolean;
  isWalking: boolean;
  isVictory?: boolean;
  className?: string;
}

export const EinsteinSprite: React.FC<EinsteinSpriteProps> = ({
  direction,
  isPushing,
  isWalking,
  isVictory = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-100 ${
        isPushing ? 'scale-105' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        className={`w-full h-full filter drop-shadow-md select-none ${
          isWalking ? 'animate-bounce' : ''
        } ${isVictory ? 'animate-pulse' : ''}`}
        style={{ animationDuration: isWalking ? '0.35s' : '1.2s' }}
      >
        {/* Shadow */}
        <ellipse cx="24" cy="44" rx="14" ry="3.5" fill="rgba(0,0,0,0.4)" />

        {/* Victory Eureka Lightbulb above head */}
        {isVictory && (
          <g className="animate-bounce" style={{ animationDuration: '0.6s' }}>
            <circle cx="24" cy="4" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <path d="M22 8.5h4v1.5h-4z" fill="#94a3b8" />
            <line x1="24" y1="-1" x2="24" y2="-4" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="29" y1="1" x2="32" y2="-1" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19" y1="1" x2="16" y2="-1" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* Rendering based on direction */}
        {direction === 'DOWN' && (
          <g>
            {/* Trousers & Shoes */}
            <rect x="17" y="36" width="5" height="7" fill="#475569" rx="1" />
            <rect x="26" y="36" width="5" height="7" fill="#475569" rx="1" />
            <rect x="15" y="42" width="7" height="3" fill="#0f172a" rx="1.5" />
            <rect x="26" y="42" width="7" height="3" fill="#0f172a" rx="1.5" />

            {/* White Lab Coat Body */}
            <path d="M15 22 L33 22 L35 38 L13 38 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Inner shirt & Red Bowtie */}
            <path d="M21 22 L27 22 L24 28 Z" fill="#0284c7" />
            <circle cx="24" cy="24" r="2" fill="#ef4444" />

            {/* Lab Coat Lapels & Pocket */}
            <path d="M19 22 L23 32 L15 38" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <path d="M29 22 L25 32 L33 38" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="27" y="31" width="5" height="4" fill="#e2e8f0" rx="0.5" />

            {/* Arms */}
            {isPushing ? (
              // Hands pushing forward/downwards
              <g>
                <path d="M14 23 L10 32 L12 37" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 23 L38 32 L36 37" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="12" cy="38" r="2.5" fill="#fcd34d" />
                <circle cx="36" cy="38" r="2.5" fill="#fcd34d" />
              </g>
            ) : isVictory ? (
              // Hands up cheering!
              <g>
                <path d="M14 24 L7 16" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 24 L41 16" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="6" cy="15" r="2.5" fill="#fcd34d" />
                <circle cx="42" cy="15" r="2.5" fill="#fcd34d" />
              </g>
            ) : (
              // Normal resting arms
              <g>
                <path d="M14 23 L11 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 23 L37 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="11" cy="31" r="2" fill="#fcd34d" />
                <circle cx="37" cy="31" r="2" fill="#fcd34d" />
              </g>
            )}

            {/* Einstein Head */}
            {/* Bushy wild white hair background puffs */}
            <circle cx="14" cy="13" r="6" fill="#e2e8f0" />
            <circle cx="34" cy="13" r="6" fill="#e2e8f0" />
            <circle cx="12" cy="18" r="4.5" fill="#f1f5f9" />
            <circle cx="36" cy="18" r="4.5" fill="#f1f5f9" />
            <circle cx="24" cy="8" r="7" fill="#f8fafc" />
            <circle cx="18" cy="9" r="6" fill="#f8fafc" />
            <circle cx="30" cy="9" r="6" fill="#f8fafc" />

            {/* Face */}
            <ellipse cx="24" cy="16" rx="8" ry="7.5" fill="#fde68a" />

            {/* Glasses */}
            <circle cx="20.5" cy="14.5" r="3" fill="none" stroke="#334155" strokeWidth="1.2" />
            <circle cx="27.5" cy="14.5" r="3" fill="none" stroke="#334155" strokeWidth="1.2" />
            <line x1="23.5" y1="14.5" x2="24.5" y2="14.5" stroke="#334155" strokeWidth="1.2" />

            {/* Eyes */}
            <circle cx="20.5" cy="14.5" r="1.2" fill="#0f172a" />
            <circle cx="27.5" cy="14.5" r="1.2" fill="#0f172a" />

            {/* Bushy White Eyebrows */}
            <path d="M17.5 11 Q20.5 10 23 12" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M25 12 Q27.5 10 30.5 11" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Big bushy white mustache! */}
            <path
              d="M19 18.5 C20 17, 24 18, 24 19 C24 18, 28 17, 29 18.5 C31 21.5, 25 21.5, 24 20 C23 21.5, 17 21.5, 19 18.5 Z"
              fill="#ffffff"
            />
          </g>
        )}

        {direction === 'UP' && (
          <g>
            {/* Trousers & Shoes back */}
            <rect x="17" y="36" width="5" height="7" fill="#475569" rx="1" />
            <rect x="26" y="36" width="5" height="7" fill="#475569" rx="1" />
            <rect x="16" y="42" width="6" height="3" fill="#0f172a" rx="1.5" />
            <rect x="26" y="42" width="6" height="3" fill="#0f172a" rx="1.5" />

            {/* White Lab Coat Back */}
            <path d="M15 22 L33 22 L35 38 L13 38 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="24" y1="22" x2="24" y2="38" stroke="#e2e8f0" strokeWidth="1" />

            {/* Arms pushing up or resting */}
            {isPushing ? (
              <g>
                <path d="M14 23 L11 12" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 23 L37 12" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="11" cy="11" r="2.5" fill="#fcd34d" />
                <circle cx="37" cy="11" r="2.5" fill="#fcd34d" />
              </g>
            ) : (
              <g>
                <path d="M14 23 L11 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <path d="M34 23 L37 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="11" cy="31" r="2" fill="#fcd34d" />
                <circle cx="37" cy="31" r="2" fill="#fcd34d" />
              </g>
            )}

            {/* Full back of wild bushy white hair */}
            <circle cx="24" cy="14" r="10" fill="#f8fafc" />
            <circle cx="16" cy="12" r="7" fill="#e2e8f0" />
            <circle cx="32" cy="12" r="7" fill="#e2e8f0" />
            <circle cx="13" cy="18" r="6" fill="#f1f5f9" />
            <circle cx="35" cy="18" r="6" fill="#f1f5f9" />
            <circle cx="24" cy="7" r="7" fill="#ffffff" />
            <circle cx="20" cy="16" r="6" fill="#e2e8f0" />
            <circle cx="28" cy="16" r="6" fill="#e2e8f0" />
          </g>
        )}

        {direction === 'LEFT' && (
          <g>
            {/* Trousers & Shoes */}
            <rect x="20" y="36" width="6" height="7" fill="#475569" rx="1" />
            <rect x="18" y="42" width="8" height="3" fill="#0f172a" rx="1.5" />

            {/* White Coat Side */}
            <path d="M19 22 L31 22 L29 38 L16 38 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

            {/* Arms */}
            {isPushing ? (
              <g>
                <path d="M22 24 L10 24" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="8" cy="24" r="2.5" fill="#fcd34d" />
              </g>
            ) : (
              <g>
                <path d="M22 24 L17 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="17" cy="31" r="2" fill="#fcd34d" />
              </g>
            )}

            {/* Head Side Left */}
            {/* Hair puffs on right / back */}
            <circle cx="29" cy="12" r="7" fill="#e2e8f0" />
            <circle cx="31" cy="18" r="5" fill="#f1f5f9" />
            <circle cx="24" cy="8" r="6" fill="#f8fafc" />

            {/* Profile face */}
            <ellipse cx="20" cy="16" rx="6.5" ry="7" fill="#fde68a" />

            {/* Glasses rim */}
            <circle cx="17" cy="15" r="3" fill="none" stroke="#334155" strokeWidth="1.2" />
            <circle cx="17" cy="15" r="1.2" fill="#0f172a" />
            <line x1="20" y1="15" x2="24" y2="14" stroke="#334155" strokeWidth="1.2" />

            {/* White mustache poking left */}
            <path d="M14 18 C11 19, 11 21, 16 21 C18 21, 19 19, 17 18 Z" fill="#ffffff" />
          </g>
        )}

        {direction === 'RIGHT' && (
          <g>
            {/* Trousers & Shoes */}
            <rect x="22" y="36" width="6" height="7" fill="#475569" rx="1" />
            <rect x="22" y="42" width="8" height="3" fill="#0f172a" rx="1.5" />

            {/* White Coat Side */}
            <path d="M17 22 L29 22 L32 38 L19 38 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

            {/* Arms */}
            {isPushing ? (
              <g>
                <path d="M26 24 L38 24" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="40" cy="24" r="2.5" fill="#fcd34d" />
              </g>
            ) : (
              <g>
                <path d="M26 24 L31 30" fill="none" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                <circle cx="31" cy="31" r="2" fill="#fcd34d" />
              </g>
            )}

            {/* Head Side Right */}
            {/* Hair puffs on left / back */}
            <circle cx="19" cy="12" r="7" fill="#e2e8f0" />
            <circle cx="17" cy="18" r="5" fill="#f1f5f9" />
            <circle cx="24" cy="8" r="6" fill="#f8fafc" />

            {/* Profile face */}
            <ellipse cx="28" cy="16" rx="6.5" ry="7" fill="#fde68a" />

            {/* Glasses rim */}
            <circle cx="31" cy="15" r="3" fill="none" stroke="#334155" strokeWidth="1.2" />
            <circle cx="31" cy="15" r="1.2" fill="#0f172a" />
            <line x1="28" y1="15" x2="24" y2="14" stroke="#334155" strokeWidth="1.2" />

            {/* White mustache poking right */}
            <path d="M34 18 C37 19, 37 21, 32 21 C30 21, 29 19, 31 18 Z" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};
