import React from "react";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function LogoIcon({ className, size = 40, ...props }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Laptop Screen Frame */}
      <rect
        x="24"
        y="15"
        width="52"
        height="32"
        rx="4"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
      />

      {/* Syringe (Inside Screen Left) */}
      <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Barrel */}
        <rect x="37" y="24" width="10" height="15" transform="rotate(-35 42 31.5)" rx="1" />
        {/* Plunger & Rod */}
        <path d="M 43 20 L 48 13" />
        <path d="M 45 11 L 51 15" />
        <path d="M 41 23 L 43 24" />
        {/* Syringe Tip */}
        <path d="M 35 37 L 33 40" strokeWidth="2.5" />
        {/* Drop */}
        <circle cx="31.5" cy="43" r="1.5" fill="currentColor" stroke="none" />
      </g>

      {/* Cleaning Brush (Inside Screen Right) */}
      <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Handle */}
        <path d="M 66 18 C 68 20 67 22 65 24 L 58 31" />
        {/* Ferrule (Metal Collar) */}
        <path d="M 58 31 L 55 34" strokeWidth="3" />
        {/* Bristles (Flared) */}
        <path d="M 54 35 L 48 42 C 47 43 51 46 54 44 L 58 38 Z" fill="currentColor" opacity="0.8" />
      </g>

      {/* Laptop Base Tray */}
      <path
        d="M 18 49 C 18 53 21 55 25 55 H 75 C 79 55 82 53 82 49 Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trackpad Notch */}
      <path
        d="M 44 50 H 56"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Wrench and Gear Bar (Below Laptop Base) */}
      {/* Wrench Handle Shaft */}
      <path
        d="M 33 65 H 64"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Left Wrench Open Jaw */}
      <path
        d="M 35 65 C 35 60 30 58 25 60 C 21 62 21 68 25 70 C 30 72 35 70 35 65 Z"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Jaw Gap */}
      <path
        d="M 20 65 H 28"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Right Cog / Gear Wheel */}
      <circle
        cx="69"
        cy="65"
        r="7.5"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="69"
        cy="65"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Gear Teeth */}
      <path
        d="M 69 55.5 V 57.5 M 69 72.5 V 74.5 M 59.5 65 H 61.5 M 76.5 65 H 78.5 M 62.5 58.5 L 64 60 M 74 70 L 75.5 71.5 M 62.5 71.5 L 64 70 M 74 60 L 75.5 58.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
