"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MessageSquare, Phone, Lock, ArrowUp } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#090D16] text-slate-400 pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="#inicio" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-sm">
                TC
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                TechCare<span className="text-blue-500">RD</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Taller técnico especializado en el cuidado, optimización térmica y venta de repuestos seleccionados para consolas de videojuegos y laptops en Santo Domingo.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.contact.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-fuchsia-600 hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-600 hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Navegación
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {siteConfig.mainNav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Taller & Clientes
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="#productos" className="hover:text-white transition-colors">
                  Catálogo en Tienda
                </Link>
              </li>
              <li>
                <Link href="#antes-despues" className="hover:text-white transition-colors">
                  Evidencia Antes & Después
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Seguimiento de Órdenes
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Portal Administrativo</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Contacto
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <p className="font-semibold text-white">{siteConfig.contact.phone}</p>
              <p>{siteConfig.contact.address}</p>
              <p className="text-[11px] text-slate-500 pt-2">{siteConfig.openingHours.weekdays}</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} {siteConfig.name}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300 flex items-center gap-1.5 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Acceso Staff</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
