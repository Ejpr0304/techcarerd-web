"use client";

import { MapPin, Navigation, Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function Map() {
  const handleDirectionsClick = () => {
    // Abre Google Maps en una nueva pestaña con una búsqueda para Santo Domingo
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=Santo+Domingo,+Dominican+Republic",
      "_blank"
    );
  };

  return (
    <section className="relative h-[450px] w-full overflow-hidden border-t border-neutral-900 bg-neutral-950">
      {/* Map Iframe */}
      <iframe
        src={siteConfig.contact.mapsIframe}
        width="100%"
        height="100%"
        style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de TechCareRD en Santo Domingo"
        className="absolute inset-0 z-0"
      />

      {/* Floating Address Card */}
      <div className="absolute inset-x-4 bottom-6 md:left-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:max-w-md z-10">
        <div className="bg-neutral-950/90 border border-neutral-800 p-6 rounded-2xl backdrop-blur-md shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                Ubicación Física
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Visítanos en Santo Domingo</h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                {siteConfig.contact.address}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 bg-neutral-900/50 p-3 rounded-lg border border-neutral-900">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <p>Ubicación céntrica con parqueo vigilado para tu comodidad y seguridad.</p>
              </div>

              <Button
                onClick={handleDirectionsClick}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                <Navigation className="w-3.5 h-3.5" />
                Cómo llegar con Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
