import React from 'react';

const Logo = ({ className = "h-12 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 450 100" 
        className="w-full h-full drop-shadow-sm" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradPrimary" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo 600 */}
            <stop offset="100%" stopColor="#EC4899" /> {/* Pink 500 */}
          </linearGradient>
          
          <linearGradient id="gradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" /> {/* Light Blue */}
            <stop offset="100%" stopColor="#6366F1" /> {/* Indigo 500 */}
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* COMPASS ICON */}
        <g transform="translate(15, 10)">
          {/* Outer dashed ring for technical/modern feel */}
          <circle cx="40" cy="40" r="34" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 6" opacity="0.4" />
          
          {/* Thick glowing arc representing the 'Path' */}
          <path 
            d="M 16 16 A 34 34 0 0 1 74 40" 
            stroke="url(#gradPrimary)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            filter="url(#glow)"
          />
          
          {/* Inner Solid Ring */}
          <circle cx="40" cy="40" r="24" stroke="url(#gradSecondary)" strokeWidth="4" opacity="0.2" />

          {/* Compass Needle - pointing top right (45 deg) */}
          <g transform="rotate(45, 40, 40)">
            {/* Left half of needle */}
            <path d="M 40 10 L 48 40 L 40 70 L 32 40 Z" fill="url(#gradPrimary)" />
            {/* Right half highlight to give 3D effect */}
            <path d="M 40 10 L 48 40 L 40 70 Z" fill="#ffffff" opacity="0.3" />
            {/* Center Pivot Dot */}
            <circle cx="40" cy="40" r="5" fill="#ffffff" className="drop-shadow-md" />
            <circle cx="40" cy="40" r="2" fill="#4F46E5" />
          </g>
        </g>

        {/* TEXT PART */}
        {showText && (
          <g transform="translate(115, 15)">
            <text 
              x="0" 
              y="48" 
              fontFamily="Outfit, Inter, sans-serif" 
              fontWeight="800" 
              fontSize="54" 
              fill="#0F172A" /* Slate 900 */
              letterSpacing="-1"
            >
              Neo<tspan fill="url(#gradPrimary)">Path</tspan>
            </text>
            <text 
              x="2" 
              y="72" 
              fontFamily="Outfit, Inter, sans-serif" 
              fontWeight="600" 
              fontSize="16" 
              fill="#64748B" /* Slate 500 */
              letterSpacing="1"
              className="uppercase"
            >
              Reinventing the Career Journey
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Logo;
