"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function AdminDashboardPlaceholder() {
  const modules = [
    {
      title: "Gestión de Productos",
      description: "Administrar consolas, laptops, componentes y accesorios en venta.",
      icon: Package,
      count: "8 productos",
    },
    {
      title: "Gestión de Reparaciones",
      description: "Ver órdenes activas del taller, asignar a técnicos y cambiar estados.",
      icon: Wrench,
      count: "3 activas",
    },
    {
      title: "Gestión de Clientes",
      description: "Directorio de contactos, incidencias y base de datos de clientes.",
      icon: Users,
      count: "12 clientes",
    },
    {
      title: "Seguimiento de Órdenes",
      description: "Búsqueda avanzada, generación de tickets de entrada y facturas.",
      icon: ClipboardList,
      count: "Listo",
    },
    {
      title: "Inventario de Repuestos",
      description: "Stock de pastas térmicas, disipadores, ventiladores y repuestos de consolas.",
      icon: ClipboardList,
      count: "Bajo stock (2)",
    },
    {
      title: "Estadísticas & Reportes",
      description: "Visualizar ingresos, volumen de reparaciones mensuales y rendimiento.",
      icon: BarChart3,
      count: "Dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Admin Sidebar & Header Simulation */}
      <header className="border-b border-neutral-900 bg-neutral-950 py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">TechCareRD</h1>
            <p className="text-[10px] text-neutral-500 font-semibold">Panel de Control Administrativo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 text-neutral-400 hover:text-white text-xs gap-1.5 h-9"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver Sitio Público
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-neutral-500 hover:text-red-400 text-xs gap-1.5 h-9"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warning Banner about Auth Preparation */}
        <div className="mb-10 p-5 rounded-2xl bg-blue-950/20 border border-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Arquitectura de Administración Preparada</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                Este panel representa la estructura del portal administrativo de la tienda. El enrutamiento y las carpetas están configurados. Para habilitarlo en el futuro, solo debes conectar el Middleware de autenticación de Supabase (Supabase Auth) y mapear los servicios correspondientes en <code className="text-blue-400 bg-neutral-900 px-1 py-0.5 rounded">src/services/</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Title & Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Módulos Administrativos</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Selecciona una herramienta para gestionar la tienda física y los servicios técnicos del taller.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const ModIcon = mod.icon;
            return (
              <Card
                key={idx}
                className="bg-neutral-900/10 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/20 transition-all duration-300 relative overflow-hidden group"
              >
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/20 group-hover:text-blue-500 transition-colors">
                      <ModIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900/80 px-2.5 py-1 rounded-full uppercase border border-neutral-900">
                      {mod.count}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-white mt-4">{mod.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 pb-6">
                  <CardDescription className="text-neutral-500 text-xs leading-relaxed">
                    {mod.description}
                  </CardDescription>
                  <Button
                    disabled
                    className="mt-5 w-full bg-neutral-950 border border-neutral-900 text-neutral-600 text-xs font-semibold py-4 rounded-lg cursor-not-allowed"
                  >
                    Módulo Inactivo (Pendiente de Auth)
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
