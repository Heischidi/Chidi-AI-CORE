"use client";

import React from 'react';

type ActivityState =
  | 'thinking'
  | 'searching'
  | 'retrieving'
  | 'recommending'
  | 'checking'
  | 'waiting'
  | 'idle';

const STATE_LABELS: Record<ActivityState, string> = {
  thinking:     'Thinking...',
  searching:    'Searching catalogue...',
  retrieving:   'Retrieving knowledge...',
  recommending: 'Preparing recommendations...',
  checking:     'Checking availability...',
  waiting:      'Waiting...',
  idle:         '',
};

interface ChidiActivityIndicatorProps {
  state?: ActivityState;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ChidiActivityIndicator({
  state = 'thinking',
  showLabel = true,
  size = 'md',
  className = '',
}: ChidiActivityIndicatorProps) {
  if (state === 'idle') return null;

  const dotSizes = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const iconSizes = { sm: 16, md: 20, lg: 24 };
  const dotSize = dotSizes[size];
  const textSize = textSizes[size];
  const iconSize = iconSizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite" aria-label={STATE_LABELS[state]}>
      {/* Mini neural icon */}
      <svg
        width={iconSize} height={iconSize}
        viewBox="0 0 40 40" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="act-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00A86B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#act-glow)" className="animate-neural-pulse" />
        {[[13,14],[20,11],[27,14],[20,20],[14,25],[26,25]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 3 ? 3 : 2.2} fill="#00E676"
            style={{ animation: `neural-pulse ${1.5 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.22}s` }}
          />
        ))}
        {[[13,14,20,11],[20,11,27,14],[13,14,20,20],[27,14,20,20],[20,20,14,25],[20,20,26,25]].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00A86B" strokeWidth="0.9" strokeOpacity="0.5" />
        ))}
      </svg>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dotSize} rounded-full bg-emerald-500 block`}
            style={{
              animation: 'dot-bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* State label */}
      {showLabel && (
        <span className={`${textSize} text-emerald-600 font-medium`}>
          {STATE_LABELS[state]}
        </span>
      )}
    </div>
  );
}
