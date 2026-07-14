"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Trash2 } from "lucide-react";

export function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section id="antes-despues" className="py-24 bg-neutral-900/30 border-y border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Resultados Reales
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            El Impacto de un Mantenimiento Profesional
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Compara tú mismo. Desliza el control para ver la diferencia entre un equipo descuidado por acumulación de polvo y uno completamente restaurado por nuestro equipo.
          </p>
        </div>

        {/* Interactive Slider Container */}
        <div className="relative max-w-4xl mx-auto aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-neutral-950 select-none">
          {/* Before Image (Background) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/fan-dirty.jpg"
              alt="Abanico sucio antes del servicio"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* After Image (Overlay, clipped dynamically from left using polygon) */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            }}
          >
            <Image
              src="/fan-clean.jpg"
              alt="Abanico limpio después del mantenimiento"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
              priority={false}
            />
          </div>

          {/* Label Before (Left) - Hidden dynamically when slider is dragged too far left */}
          <div
            className="absolute bottom-4 left-4 z-20 px-3.5 py-1.5 rounded-lg bg-red-950/80 border border-red-500/30 backdrop-blur-sm text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 transition-opacity duration-200"
            style={{
              opacity: sliderPosition > 12 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Antes (Sucia y Sobrecalentada)
          </div>

          {/* Label After (Right) - Hidden dynamically when slider is dragged too far right */}
          <div
            className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-lg bg-green-950/80 border border-green-500/30 backdrop-blur-sm text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5 transition-opacity duration-200"
            style={{
              opacity: sliderPosition < 88 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Después (Limpia y Optimizada)
          </div>

          {/* Slider Line Divider */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_15px_rgba(37,99,235,0.8)] flex items-center justify-center pointer-events-none">
              <div className="flex gap-0.5 text-white">
                <span className="font-bold text-[10px]">&lt;</span>
                <span className="font-bold text-[10px]">&gt;</span>
              </div>
            </div>
          </div>

          {/* Range Input (Invisible, covers the image container) */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-ew-resize"
            aria-label="Deslizador antes y después"
          />
        </div>
      </div>
    </section>
  );
}
