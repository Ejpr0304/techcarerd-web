import React from "react";

interface LogoIconProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: number;
  variant?: "emblem" | "full";
}

export function LogoIcon({ className, size = 44, variant = "emblem", ...props }: LogoIconProps) {
  const imgSrc = variant === "full" ? "/logo-darkmode.png" : "/logo-emblem-transparent.png";
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center ${className || ""}`}
      {...props}
    >
      <img
        src={imgSrc}
        alt="TechCareRD Logo"
        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
      />
    </div>
  );
}
