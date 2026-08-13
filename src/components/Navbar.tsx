"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";

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
          ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/60 py-3 shadow-[0_4px_30px_rgba(37,99,235,0.05)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-3 group">
            <img
              src="/logo-emblem-transparent.png"
              alt="TechCareRD Emblem"
              className="h-11 sm:h-13 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(37,99,235,0.5)]"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none group-hover:text-blue-100 transition-colors">
                TechCare<span className="text-[#D31027] group-hover:text-red-500 transition-colors drop-shadow-[0_0_8px_rgba(211,16,39,0.5)]">RD</span>
              </span>
              <span className="text-[9px] sm:text-[10.5px] font-bold text-blue-400 tracking-[0.18em] uppercase leading-tight mt-1 opacity-90">
                Servicios Técnicos Profesionales
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="#contacto">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 rounded-lg border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300">
                Cotizar Ahora
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none transition-colors"
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
        className={`md:hidden absolute top-full left-0 right-0 bg-neutral-950/95 border-b border-neutral-900 backdrop-blur-lg transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <div className="pt-4 px-3">
            <Link href="#contacto" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg">
                Cotizar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
