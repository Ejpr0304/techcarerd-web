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
      {/* Laptop Screen (Grosor y bordes redondeados) */}
      <rect
        x="24"
        y="18"
        width="52"
        height="35"
        rx="5"
        stroke="#2563EB"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Red Cross inside Screen (Cruz médica de cuidado/techcare) */}
      <path
        d="M50 26V43M41.5 34.5H58.5"
        stroke="#C53030"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Laptop Keyboard Base & Trackpad area */}
      <path
        d="M19 53C19 55.5 21 57.5 24.5 57.5H75.5C79 57.5 81 55.5 81 53V53H19V53Z"
        stroke="#2563EB"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M40 53H60"
        stroke="#2563EB"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Wrench Tool below the Laptop */}
      {/* Wrench Shaft / Handle */}
      <path
        d="M36 67.5H64"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Wrench Open Claw (Left side) */}
      <path
        d="M36 67.5C36 63.5 32 61 28.5 63C25 65 25 70 28.5 72C32 74 36 71.5 36 67.5Z"
        stroke="#2563EB"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Open jaw gap */}
      <path
        d="M24 67.5H30.5"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Wrench Ring End with Inner Gear/Cog (Right side) */}
      <circle
        cx="67.5"
        cy="67.5"
        r="6.5"
        stroke="#2563EB"
        strokeWidth="3.5"
        fill="none"
      />
      {/* Cog core circle */}
      <circle
        cx="67.5"
        cy="67.5"
        r="2"
        fill="#2563EB"
      />
      {/* Cog wheel teeth */}
      <path
        d="M67.5 60.5V62.5M67.5 72.5V74.5M60.5 67.5H62.5M72.5 67.5H74.5"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
