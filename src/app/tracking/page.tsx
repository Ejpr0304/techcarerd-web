"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trackOrder } from "@/services/repairs";
import { Order, OrderStatus } from "@/types";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/sections/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Clock, ShieldCheck, Hammer, CheckCircle, HelpCircle } from "lucide-react";

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedId = orderId.trim();
    if (!formattedId) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setOrder(null);

    try {
      const result = await trackOrder(formattedId);
      if (result) {
        setOrder(result);
      } else {
        setError("No se encontró ninguna orden con ese identificador. Verifica los datos e intenta de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error al buscar el estado. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case "recibido":
        return 1;
      case "en_diagnostico":
        return 2;
      case "esperando_repuestos":
        return 3;
      case "completado":
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  const steps = [
    { label: "Recibido", icon: Clock, desc: "Equipo ingresado al sistema" },
    { label: "En Diagnóstico", icon: Hammer, desc: "Técnico revisando componentes" },
    { label: "Repuestos", icon: HelpCircle, desc: "Esperando piezas o autorización" },
    { label: "Completado", icon: CheckCircle, desc: "Listo para entrega y pruebas" },
  ];

  // Máscara simple para privacidad del nombre del cliente
  const maskName = (name: string) => {
    const parts = name.split(" ");
    if (parts.length === 1) return name;
    return `${parts[0]} ${parts[1][0]}.`;
  };

  const getWhatsAppMessage = (id: string) => {
    const baseMsg = `Hola TechCareRD, consulto sobre el estado de mi orden ${id}.`;
    return `${siteConfig.contact.whatsappLink}?text=${encodeURIComponent(baseMsg)}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 pt-32 pb-24 text-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs / Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Seguimiento de Órdenes
            </h1>
            <p className="text-neutral-400 mt-2">
              Ingresa el código único provisto al entregar tu equipo en nuestro taller para conocer el estado del servicio en tiempo real.
            </p>
          </div>

          {/* Search Box */}
          <Card className="bg-neutral-900/20 border-neutral-900 shadow-xl mb-8 p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Código de Orden (Ej: TC-2026-0002)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="h-12 bg-neutral-950 border-neutral-800 text-white rounded-lg pl-11 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-neutral-600 uppercase"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 rounded-lg shadow-md transition-colors gap-2 cursor-pointer"
              >
                {loading ? "Buscando..." : "Buscar Orden"}
              </Button>
            </form>
          </Card>

          {/* Results Area */}
          {searched && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {loading ? (
                <div className="h-64 rounded-2xl bg-neutral-900/50 border border-neutral-900 animate-pulse" />
              ) : error ? (
                <Card className="border-red-950 bg-red-950/10 p-6 text-center text-red-400">
                  <p>{error}</p>
                </Card>
              ) : order ? (
                <div className="space-y-6">
                  {/* Order Details Header */}
                  <Card className="bg-neutral-900/20 border-neutral-900 overflow-hidden shadow-lg">
                    <CardHeader className="bg-neutral-900/40 p-6 border-b border-neutral-900 flex flex-row flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Orden ID</span>
                        <CardTitle className="text-xl font-extrabold text-white mt-0.5">{order.id}</CardTitle>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Última actualización</span>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("es-DO")}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Cliente</span>
                        <span className="text-white font-bold text-base mt-1 block">{maskName(order.customerName)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Equipo / Consola</span>
                        <span className="text-white font-bold text-base mt-1 block">{order.device}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Costo Estimado</span>
                        <span className="text-white font-bold text-base mt-1 block">
                          {order.price ? `RD$ ${order.price.toLocaleString("es-DO")}` : "Pendiente de diagnóstico"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Steps Visualizer */}
                  <Card className="bg-neutral-900/20 border-neutral-900 shadow-lg p-8">
                    <h3 className="text-lg font-bold text-white mb-8">Etapa de la Reparación</h3>
                    
                    {/* Responsive Stepper */}
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 w-full">
                      {/* Connector Line (Desktop) */}
                      <div className="hidden md:block absolute top-[23px] left-[3%] right-[3%] h-0.5 bg-neutral-800 z-0" />
                      
                      {/* Active Connector (Desktop) */}
                      <div
                        className="hidden md:block absolute top-[23px] left-[3%] h-0.5 bg-blue-500 transition-all duration-500 z-0"
                        style={{
                          width: `${((currentStep - 1) / (steps.length - 1)) * 94}%`,
                        }}
                      />

                      {steps.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isActive = stepNum <= currentStep;
                        const isCurrent = stepNum === currentStep;
                        const StepIcon = step.icon;

                        return (
                          <div
                            key={idx}
                            className="relative flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-1/4"
                          >
                            {/* Circle */}
                            <div
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                isActive
                                  ? isCurrent
                                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                    : "bg-neutral-950 border-blue-500 text-blue-500"
                                  : "bg-neutral-950 border-neutral-800 text-neutral-600"
                              }`}
                            >
                              <StepIcon className="w-5 h-5" />
                            </div>

                            {/* Text Details */}
                            <div className="text-left md:text-center">
                              <h4
                                className={`font-bold text-sm transition-colors ${
                                  isActive ? "text-white" : "text-neutral-500"
                                }`}
                              >
                                {step.label}
                              </h4>
                              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug max-w-[150px] mx-auto">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Estimated Date & CTA Alert */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-blue-950/20 border border-blue-500/10 shadow-md">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Fecha Estimada de Entrega</h4>
                        <p className="text-xs text-neutral-400 mt-1">
                          {order.estimatedCompletion || "Sujeto a confirmación de diagnóstico."}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getWhatsAppMessage(order.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto shrink-0"
                    >
                      <Button className="w-full sm:w-auto bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-5 rounded-lg py-5 text-xs font-semibold cursor-pointer">
                        Consultar al Técnico
                      </Button>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
