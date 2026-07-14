"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        "Para computadoras de escritorio 24-48 horas y consolas estándar (PS4, Xbox One), el proceso toma entre 8-12 horas. Para laptops gaming o consolas PS5 (que requieren remoción y reacondicionamiento de metal líquido), el tiempo estimado es de 12-24 horas debido a la precisión y pruebas de estrés necesarias antes de la entrega.",
    },
    {
      id: "faq-2",
      question: "¿Qué tipo de compuestos térmicos utilizan?",
      answer:
        "Utilizamos únicamente marcas de gama alta reconocidas mundialmente. Para pasta térmica estándar aplicamos Arctic MX-6 o Thermal Grizzly Kryonaut. Para equipos que requieren metal líquido de fábrica (como la PS5 y laptops ASUS ROG seleccionadas), empleamos Thermal Grizzly Conductonaut.",
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
        "No es necesario formatear tu equipo. Para limpiezas y mantenimientos preventivos físicos, no requerimos la contraseña de tu cuenta personal. Hacemos las validaciones de encendido y temperatura básicas desde una cuenta creada por el cliente como usuario invitado sin privilegios para proteger al 100% tu privacidad.",
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
        "Aceptamos transferencias bancarias directas (BPD, Banreservas) y efectivo.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-neutral-900/30 border-y border-neutral-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
            Preguntas Frecuentes
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Tienes alguna duda técnica?
          </p>
          <p className="mt-4 text-lg text-neutral-400">
            Aquí resolvemos las preguntas más comunes de nuestros clientes sobre el proceso de servicio.
          </p>
        </div>

        {/* Accordion */}
        <Accordion className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-neutral-950 border border-neutral-900 rounded-xl px-6 transition-all duration-200 data-[state=open]:border-blue-500/30 data-[state=open]:shadow-[0_0_15px_rgba(37,99,235,0.08)]"
            >
              <AccordionTrigger className="text-left text-white font-bold hover:text-blue-400 py-5 transition-colors focus-visible:outline-none">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-sm leading-relaxed pb-5 border-t border-neutral-900/50 pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
