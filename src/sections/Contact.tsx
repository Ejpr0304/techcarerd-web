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
import { Phone, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

// Esquema de validación estricto con Zod
const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." }),
  phone: z
    .string()
    .min(8, { message: "El número de teléfono debe ser válido (mínimo 8 dígitos)." }),
  email: z
    .string()
    .email({ message: "Por favor, introduce un correo electrónico válido." })
    .or(z.literal("")), // Permite campo vacío
  deviceType: z.string().min(1, { message: "Por favor, selecciona tu equipo." }),
  serviceType: z.string().min(1, { message: "Por favor, selecciona el servicio." }),
  message: z
    .string()
    .min(10, { message: "El mensaje debe detallar tu problema (mínimo 10 caracteres)." })
    .max(1000, { message: "El mensaje no puede exceder los 1000 caracteres." }),
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
      const response = await submitContactMessage(data);
      if (response.success) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(response.error || "Hubo un problema al enviar tu solicitud.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage("Error de conexión. Inténtalo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-neutral-900/30 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Details (Left Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
                Contáctanos
              </h2>
              <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Agenda tu Mantenimiento Técnico
              </p>
              <p className="mt-4 text-lg text-neutral-400 leading-relaxed">
                ¿Tu equipo se apaga solo, va lento o calienta demasiado? Escríbenos para recibir un diagnóstico previo y cotización sin compromiso.
              </p>

              {/* Direct Info List */}
              <div className="mt-12 space-y-6">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Llámanos o escríbenos</h4>
                    <a
                      href={siteConfig.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-blue-400 text-sm mt-1 block font-medium transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Correo Electrónico</h4>
                    <span className="text-neutral-400 text-sm mt-1 block">
                      {siteConfig.contact.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card (Right Column) */}
          <div className="lg:col-span-7 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-neutral-300">
                    Nombre Completo <span className="text-blue-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    className="h-11 bg-neutral-950 border-neutral-800 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-neutral-600"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp/Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-neutral-300">
                    WhatsApp o Teléfono <span className="text-blue-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej. 809-555-5555"
                    className="h-11 bg-neutral-950 border-neutral-800 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-neutral-600"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-neutral-300">
                  Correo Electrónico <span className="text-neutral-500">(Opcional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="h-11 bg-neutral-950 border-neutral-800 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-neutral-600"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tipo de Equipo */}
                <div className="space-y-2">
                  <Label htmlFor="deviceType" className="text-sm font-semibold text-neutral-300">
                    Tipo de Equipo <span className="text-blue-500">*</span>
                  </Label>
                  <select
                    id="deviceType"
                    className="flex h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500/20 cursor-pointer"
                    {...register("deviceType")}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Laptop">Laptop / Macbook</option>
                    <option value="PC Escritorio">PC de Escritorio</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="PlayStation 4">PlayStation 4</option>
                    <option value="Xbox">Xbox Series / One</option>
                    <option value="Otro">Otro Dispositivo</option>
                  </select>
                  {errors.deviceType && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.deviceType.message}
                    </p>
                  )}
                </div>

                {/* Tipo de Servicio */}
                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="text-sm font-semibold text-neutral-300">
                    Servicio Requerido <span className="text-blue-500">*</span>
                  </Label>
                  <select
                    id="serviceType"
                    className="flex h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-blue-500/20 cursor-pointer"
                    {...register("serviceType")}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Mantenimiento Completo">Mantenimiento Completo</option>
                    <option value="Cambio de Pasta Térmica">Cambio de Pasta Térmica</option>
                    <option value="Cambio de Metal Líquido">Cambio de Metal Líquido</option>
                    <option value="Upgrade de RAM / SSD">Upgrade de RAM / SSD</option>
                    <option value="Diagnóstico Técnico">Diagnóstico Técnico</option>
                    <option value="Otro">Otro Servicio</option>
                  </select>
                  {errors.serviceType && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-neutral-300">
                  Describe los síntomas de tu equipo <span className="text-blue-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Detalla qué problemas presenta el equipo (ej. Se apaga a los 10 min de juego, hace ruido extraño el abanico, etc.)"
                  className="min-h-[120px] bg-neutral-950 border-neutral-800 text-white rounded-lg focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-neutral-600 resize-y"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Alert Status messages */}
              {submitStatus === "success" && (
                <div className="p-4 bg-green-950/80 border border-green-500/30 text-green-400 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">¡Solicitud recibida!</h5>
                    <p className="text-xs mt-1 text-green-300">
                      Hemos recibido tus datos con éxito. En breve nos pondremos en contacto contigo vía WhatsApp para coordinar la entrega o cotización.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-950/80 border border-red-500/30 text-red-400 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Error en el envío</h5>
                    <p className="text-xs mt-1 text-red-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 gap-2 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Enviando solicitud...</>
                ) : (
                  <>
                    Enviar Solicitud
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
