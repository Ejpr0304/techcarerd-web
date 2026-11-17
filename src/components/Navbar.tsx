"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Menu, X, Lock, PhoneCall } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm">
              TC
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                TechCare<span className="text-blue-600">RD</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">
                Lab & Taller
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors uppercase"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${siteConfig.contact.phoneValue}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-full gap-1.5 h-9 px-3.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                {siteConfig.contact.phone}
              </Button>
            </a>

            <Link href="#contacto">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 h-9 rounded-full shadow-sm hover:shadow transition-all cursor-pointer">
                Cotizar Servicio
              </Button>
            </Link>

            <Link
              href="/login"
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Panel Administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/login"
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
              title="Panel Administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-expanded={isOpen}
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 border-b border-slate-200 backdrop-blur-xl transition-all duration-300 shadow-xl ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-1 sm:px-6">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors uppercase tracking-wider"
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            <Link href="#contacto" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-full text-xs font-semibold cursor-pointer">
                Cotizar Servicio Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
