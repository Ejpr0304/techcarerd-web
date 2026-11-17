"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Menu, X, Lock } from "lucide-react";
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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center group">
            <img
              src="/logo-darkmode.png"
              alt="TechCareRD Logo"
              className="h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            />
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

          {/* CTA & Admin Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#contacto">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 rounded-lg border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer">
                Cotizar Ahora
              </Button>
            </Link>
            <Link
              href="/login"
              className="p-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Panel Administrativo"
            >
              <Lock className="w-4 h-4" />
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
          <div className="pt-4 px-3 space-y-2">
            <Link href="#contacto" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg cursor-pointer">
                Cotizar Ahora
              </Button>
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-850 hover:bg-neutral-850 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Administrativo</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
