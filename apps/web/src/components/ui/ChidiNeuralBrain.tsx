"use client";

import React, { useRef } from "react";

interface ChidiNeuralBrainProps {
  size?: number;
  variant?: "hero" | "small" | "icon";
  className?: string;
  animated?: boolean;
}

/**
 * ChidiNeuralBrain
 * Signature animated neural brain SVG for CHIDI AI.
 * Uses only SVG + CSS animations without external runtime dependencies.
 */
export default function ChidiNeuralBrain({
  size = 420,
  variant = "hero",
  className = "",
  animated = true,
}: ChidiNeuralBrainProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const sparks = [
    { id: 1,  cx: 155, cy: 85,  delay: "0s",   dur: "2.4s" },
    { id: 2,  cx: 240, cy: 65,  delay: "0.7s", dur: "2.1s" },
    { id: 3,  cx: 295, cy: 100, delay: "1.4s", dur: "2.7s" },
    { id: 4,  cx: 130, cy: 140, delay: "0.3s", dur: "2.0s" },
    { id: 5,  cx: 280, cy: 175, delay: "1.8s", dur: "2.3s" },
    { id: 6,  cx: 200, cy: 200, delay: "0.9s", dur: "2.5s" },
    { id: 7,  cx: 160, cy: 230, delay: "2.1s", dur: "2.2s" },
    { id: 8,  cx: 260, cy: 240, delay: "0.5s", dur: "2.8s" },
    { id: 9,  cx: 320, cy: 150, delay: "1.2s", dur: "2.0s" },
    { id: 10, cx: 100, cy: 180, delay: "1.6s", dur: "2.6s" },
  ];

  const pathways = [
    { id: "p1",  d: "M 155 85 Q 195 70 240 65",   delay: "0s",   dur: "3s" },
    { id: "p2",  d: "M 240 65 Q 275 80 295 100",  delay: "0.8s", dur: "2.5s" },
    { id: "p3",  d: "M 155 85 Q 140 115 130 140", delay: "0.4s", dur: "3.2s" },
    { id: "p4",  d: "M 130 140 Q 155 185 160 230",delay: "1.2s", dur: "2.8s" },
    { id: "p5",  d: "M 295 100 Q 310 128 320 150",delay: "0.6s", dur: "3.0s" },
    { id: "p6",  d: "M 320 150 Q 295 210 260 240",delay: "1.5s", dur: "2.6s" },
    { id: "p7",  d: "M 200 200 Q 225 215 260 240",delay: "0.2s", dur: "2.9s" },
    { id: "p8",  d: "M 200 200 Q 175 215 160 230",delay: "1.0s", dur: "2.7s" },
    { id: "p9",  d: "M 130 140 Q 165 165 200 200",delay: "0.7s", dur: "3.1s" },
    { id: "p10", d: "M 295 100 Q 250 150 200 200",delay: "1.8s", dur: "2.4s" },
    { id: "p11", d: "M 100 180 Q 115 210 160 230",delay: "0.9s", dur: "3.3s" },
    { id: "p12", d: "M 240 65 Q 220 130 200 200", delay: "1.3s", dur: "2.2s" },
    { id: "p13", d: "M 280 175 Q 270 205 260 240",delay: "0.5s", dur: "2.8s" },
    { id: "p14", d: "M 155 85 Q 178 142 200 200", delay: "1.6s", dur: "3.0s" },
  ];

  const nodes = [
    { cx: 155, cy: 85,  r: 5, delay: "0s",   glow: true  },
    { cx: 240, cy: 65,  r: 4, delay: "0.5s", glow: true  },
    { cx: 295, cy: 100, r: 4, delay: "1.0s", glow: false },
    { cx: 130, cy: 140, r: 3, delay: "0.3s", glow: false },
    { cx: 280, cy: 175, r: 3, delay: "1.5s", glow: true  },
    { cx: 160, cy: 230, r: 3, delay: "1.2s", glow: false },
    { cx: 260, cy: 240, r: 4, delay: "0.6s", glow: false },
    { cx: 320, cy: 150, r: 3, delay: "1.8s", glow: true  },
    { cx: 100, cy: 180, r: 3, delay: "0.9s", glow: false },
  ];

  if (variant === "icon") {
    return (
      <svg
        width={size} height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Chidi AI neural indicator"
        role="img"
      >
        <defs>
          <radialGradient id="icon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00A86B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#icon-glow)" />
        {[
          { cx: 13, cy: 14, r: 2.5 },
          { cx: 20, cy: 11, r: 2   },
          { cx: 27, cy: 14, r: 2   },
          { cx: 20, cy: 20, r: 3   },
          { cx: 14, cy: 25, r: 2   },
          { cx: 26, cy: 25, r: 2   },
        ].map((n, i) => (
          <circle
            key={i} cx={n.cx} cy={n.cy} r={n.r}
            fill="#00E676"
            style={animated ? {
              animation: `neural-pulse ${1.5 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            } : {}}
          />
        ))}
        {[
          [13,14,20,11],[20,11,27,14],[13,14,20,20],
          [27,14,20,20],[20,20,14,25],[20,20,26,25],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#00A86B" strokeWidth="0.8" strokeOpacity="0.6" />
        ))}
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={size} height={size}
      viewBox="50 40 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? "animate-float-brain" : ""}`}
      style={{ overflow: "visible" }}
      aria-label="CHIDI AI neural brain visualisation"
      role="img"
    >
      <defs>
        <radialGradient id="brain-aura" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#00E676" stopOpacity="0.18" />
          <stop offset="60%"  stopColor="#00A86B" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
        </radialGradient>
        <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="path-glow" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="spark-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="brain-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0a1f15" />
          <stop offset="50%"  stopColor="#07110D" />
          <stop offset="100%" stopColor="#030a06" />
        </linearGradient>
      </defs>

      {/* Atmospheric aura */}
      <ellipse cx="210" cy="160" rx="145" ry="120"
        fill="url(#brain-aura)"
        style={animated ? { animation: "neural-pulse 4s ease-in-out infinite" } : {}}
      />

      {/* Brain silhouette */}
      <path
        d="M 155 85 C 145 70,110 65,100 85 C 88 105,92 130,100 145 C 85 155,78 170,80 185
           C 82 200,95 215,110 220 C 120 250,140 265,160 260 C 170 270,185 272,200 270
           C 215 272,230 270,240 260 C 260 265,280 250,290 220 C 305 215,318 200,320 185
           C 322 170,315 155,300 145 C 308 130,312 105,300 85 C 290 65,255 70,245 85
           C 235 72,218 60,200 62 C 182 60,165 72,155 85 Z"
        fill="url(#brain-fill)"
        stroke="#0d3328" strokeWidth="1.5" opacity="0.92"
      />

      {/* Hemisphere divider */}
      <path d="M 200 62 C 198 130,200 190,200 270"
        stroke="#00A86B" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 8" />

      {/* Cortex folds */}
      <path d="M 120 120 Q 140 110 165 118" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7" />
      <path d="M 240 118 Q 265 110 280 120" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7" />
      <path d="M 100 165 Q 130 158 155 165" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7" />
      <path d="M 245 165 Q 270 158 300 165" stroke="#0d3d28" strokeWidth="1" fill="none" strokeOpacity="0.7" />

      {/* Pathway base */}
      {pathways.map(({ id, d }) => (
        <path key={`base-${id}`} d={d}
          stroke="#00A86B" strokeWidth="1" strokeOpacity="0.25" fill="none" />
      ))}

      {/* Animated energy travel */}
      {animated && pathways.map(({ id, d, delay, dur }) => (
        <path key={`travel-${id}`} d={d}
          stroke="#00E676" strokeWidth="2" fill="none"
          filter="url(#path-glow)" strokeLinecap="round"
          style={{
            strokeDasharray: "12 200",
            animation: `neural-travel ${dur} ease-in-out infinite`,
            animationDelay: delay,
          }}
        />
      ))}

      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`} filter={node.glow ? "url(#node-glow)" : undefined}>
          <circle cx={node.cx} cy={node.cy} r={node.r + 2.5}
            fill="none" stroke="#00E676" strokeWidth="0.5" strokeOpacity="0.3"
            style={animated ? {
              animation: `neural-pulse ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: node.delay,
            } : {}}
          />
          <circle cx={node.cx} cy={node.cy} r={node.r}
            fill="#00E676" fillOpacity="0.9"
            style={animated ? {
              animation: `neural-pulse ${2.2 + i * 0.25}s ease-in-out infinite`,
              animationDelay: node.delay,
            } : {}}
          />
          <circle cx={node.cx} cy={node.cy} r={node.r * 0.45} fill="#B7F7D4" />
        </g>
      ))}

      {/* Spark particles */}
      {animated && sparks.map(({ id, cx, cy, delay, dur }) => (
        <g key={`spark-${id}`}>
          <circle cx={cx} cy={cy} r="2" fill="#00E676"
            filter="url(#spark-glow)"
            style={{
              animation: `neural-spark ${dur} ease-out infinite`,
              animationDelay: delay,
              transformOrigin: `${cx}px ${cy}px`,
            } as React.CSSProperties}
          />
          <circle cx={cx + 3} cy={cy - 2} r="1" fill="#B7F7D4"
            filter="url(#spark-glow)"
            style={{
              animation: `neural-spark ${dur} ease-out infinite`,
              animationDelay: `${parseFloat(delay) + 0.2}s`,
              transformOrigin: `${cx + 3}px ${cy - 2}px`,
            } as React.CSSProperties}
          />
        </g>
      ))}

      {/* Central brain core */}
      <g filter="url(#node-glow)">
        <circle cx="200" cy="200" r="12" fill="#00E676" fillOpacity="0.12"
          style={animated ? { animation: "neural-pulse 3s ease-in-out infinite" } : {}} />
        <circle cx="200" cy="200" r="7" fill="#00A86B"
          style={animated ? { animation: "neural-pulse 2.4s ease-in-out infinite", animationDelay: "0.3s" } : {}} />
        <circle cx="200" cy="200" r="3.5" fill="#00E676" />
        <circle cx="200" cy="200" r="1.5" fill="#ffffff" fillOpacity="0.9" />
      </g>

      {/* Outer glow ring */}
      <ellipse cx="210" cy="162" rx="130" ry="108"
        fill="none" stroke="#00E676" strokeWidth="0.5" strokeOpacity="0.12"
        style={animated ? { animation: "neural-pulse 5s ease-in-out infinite" } : {}}
      />
    </svg>
  );
}
