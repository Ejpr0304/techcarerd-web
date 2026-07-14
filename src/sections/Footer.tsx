"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MessageSquare, Phone } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";

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

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="#inicio" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 transition-all duration-300 group-hover:scale-105">
                <LogoIcon size={34} className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                TechCare<span className="text-[#C53030]">RD</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Taller técnico y tienda especializada en el cuidado y optimización de tus dispositivos de juego y cómputo favoritos.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href={siteConfig.contact.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-blue-600 hover:text-white border border-neutral-800 hover:border-blue-500 flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href={siteConfig.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-blue-600 hover:text-white border border-neutral-800 hover:border-blue-500 flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Navegación
            </h4>
            <ul className="space-y-3.5 text-sm">
              {siteConfig.mainNav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Soporte
            </h4>
            <ul className="space-y-3.5 text-sm">
              {siteConfig.mainNav.slice(5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tracking" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors flex items-center gap-1">
                  Seguimiento de Órdenes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                <span className="text-neutral-400 font-medium">{siteConfig.contact.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {currentYear} {siteConfig.name}. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Términos de Servicio</span>
            <span className="hover:text-neutral-400 cursor-pointer">Política de Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
