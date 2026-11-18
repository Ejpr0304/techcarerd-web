"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQ() {
  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "¿Cuánto tiempo toma realizar un mantenimiento preventivo?",
      answer:
        "Para computadoras de escritorio y consolas estándar (PS4, Xbox One), el proceso toma entre 8-12 horas. Para laptops gaming o consolas PS5 (que requieren remoción y reacondicionamiento de metal líquido), el tiempo estimado es de 12-24 horas debido a la precisión y pruebas térmicas de estrés necesarias antes de la entrega.",
    },
    {
      id: "faq-2",
      question: "¿Qué tipo de compuestos térmicos utilizan?",
      answer:
        "Utilizamos únicamente marcas de gama alta reconocidas mundialmente. Para pasta térmica estándar aplicamos Arctic MX-6 o Thermal Grizzly Kryonaut. Para consolas PS5 y laptops ASUS ROG con APU/CPU de fábrica con metal líquido, empleamos Thermal Grizzly Conductonaut con barrera protectora.",
    },
    {
      id: "faq-3",
      question: "¿Ofrecen garantía sobre el trabajo realizado?",
      answer:
        "Sí, todos nuestros mantenimientos y reparaciones cuentan con una garantía de 30 días. Esto incluye soporte ante cualquier variación anormal de temperatura o inconveniente relacionado con el armado físico del equipo.",
    },
    {
      id: "faq-4",
      question: "¿Debo entregar mi equipo formateado o con contraseñas?",
      answer:
        "No es necesario formatear tu equipo. Para limpiezas y mantenimientos preventivos físicos, no requerimos la contraseña de tu cuenta personal ni ingresamos a tus archivos. Protegemos al 100% tu privacidad.",
    },
    {
      id: "faq-5",
      question: "¿Cómo funciona el seguimiento de órdenes en línea?",
      answer:
        "Al ingresar tu equipo al taller, te proporcionaremos un código de orden exclusivo (ej. TC-2026-0001). Con este código podrás revisar el estado actual de tu reparación (En diagnóstico, Esperando repuestos, Listo para entrega) en tiempo real desde la sección de seguimiento de nuestra web.",
    },
    {
      id: "faq-6",
      question: "¿Qué formas de pago aceptan?",
      answer:
        "Aceptamos transferencias bancarias directas (Banco Popular Dominicano, Banreservas, BHD) y efectivo en tienda.",
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Preguntas Frecuentes
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Respuestas Claras
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Resolvemos las dudas más habituales sobre nuestros tiempos de entrega, compuestos térmicos y políticas de garantía.
          </p>
        </div>

        {/* Accordion in clean rounded items */}
        <Accordion className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl px-6 py-2 shadow-xs transition-all data-[state=open]:shadow-md data-[state=open]:border-blue-500/50 data-[state=open]:bg-white"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-5 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
}
