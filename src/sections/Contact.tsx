"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { siteConfig } from "@/config/site";
import { submitContactMessage } from "@/services/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Send, CheckCircle2, AlertCircle, MessageSquare, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }).max(100),
  phone: z.string().min(8, { message: "Introduce un número de contacto válido." }),
  email: z.string().email().or(z.literal("")),
  deviceType: z.string().min(1, { message: "Por favor, selecciona tu equipo." }),
  serviceType: z.string().min(1, { message: "Por favor, selecciona el servicio." }),
  message: z.string().min(10, { message: "Cuéntanos brevemente el problema (mínimo 10 caracteres)." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      deviceType: "",
      serviceType: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const result = await submitContactMessage(data);
      if (result.success) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Ocurrió un error al enviar el mensaje.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("No se pudo conectar con el servidor. Inténtalo por WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            Canales de Atención
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Agenda tu Diagnóstico Técnico
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Escríbenos directamente o llena el formulario para recibir una cotización estimada y apartar turno para tu equipo en el taller.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900">
                Información del Taller
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900">Teléfono & WhatsApp</span>
                    <a href={`tel:${siteConfig.contact.phoneValue}`} className="hover:text-blue-600 font-medium">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900">Ubicación</span>
                    <span>{siteConfig.contact.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold text-slate-900">Horario de Atención</span>
                    <span>{siteConfig.openingHours.weekdays}</span>
                    <span className="block text-xs text-slate-500">{siteConfig.openingHours.saturdays}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-2">
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-5 rounded-full shadow-lg shadow-emerald-500/20 gap-2 cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                    Chatear por WhatsApp Ahora
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Envíanos un Mensaje
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Te responderemos en menos de 2 horas en horario laboral.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Tu Nombre Completo</Label>
                  <Input
                    id="name"
                    placeholder="Ej. Juan Pérez"
                    className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-11 rounded-xl"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Teléfono (WhatsApp)</Label>
                  <Input
                    id="phone"
                    placeholder="Ej. 809-000-0000"
                    className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-11 rounded-xl"
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deviceType" className="text-xs font-semibold text-slate-700">Tipo de Equipo</Label>
                  <select
                    id="deviceType"
                    className="mt-1 w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs h-11 rounded-xl px-3 outline-none"
                    {...register("deviceType")}
                  >
                    <option value="">Selecciona tu equipo...</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="PlayStation 4">PlayStation 4</option>
                    <option value="Xbox Series / One">Xbox Series / One</option>
                    <option value="Laptop Gaming">Laptop Gaming (ASUS/MSI/Alienware)</option>
                    <option value="Laptop Oficina / MacBook">Laptop Oficina / MacBook</option>
                    <option value="PC de Escritorio">PC de Escritorio / Gaming Rig</option>
                    <option value="Otro">Otro Dispositivo</option>
                  </select>
                  {errors.deviceType && <p className="text-xs text-red-500 mt-1">{errors.deviceType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="serviceType" className="text-xs font-semibold text-slate-700">Servicio Requerido</Label>
                  <select
                    id="serviceType"
                    className="mt-1 w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs h-11 rounded-xl px-3 outline-none"
                    {...register("serviceType")}
                  >
                    <option value="">Selecciona el servicio...</option>
                    <option value="Mantenimiento Preventivo / Ruido">Mantenimiento Preventivo (Limpieza & Ruido)</option>
                    <option value="Reacondicionamiento Metal Líquido">Reacondicionamiento Metal Líquido (PS5)</option>
                    <option value="Cambio de Pasta Térmica">Cambio de Pasta Térmica (CPU / GPU)</option>
                    <option value="Instalación / Upgrade SSD">Instalación / Upgrade de SSD</option>
                    <option value="Ampliación de RAM">Ampliación de Memoria RAM</option>
                    <option value="Diagnóstico General">Diagnóstico General por Falla</option>
                  </select>
                  {errors.serviceType && <p className="text-xs text-red-500 mt-1">{errors.serviceType.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-xs font-semibold text-slate-700">Detalles del Problema o Consulta</Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Describe qué le pasa a tu equipo (se apaga, suena fuerte, se calienta, lentitud, etc.)..."
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs rounded-xl"
                  {...register("message")}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              {submitStatus === "success" && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Mensaje recibido con éxito! Nos pondremos en contacto contigo de inmediato.</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-5 rounded-full shadow-md cursor-pointer transition-all"
              >
                {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud de Diagnóstico"}
                <Send className="w-3.5 h-3.5 ml-2" />
              </Button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
