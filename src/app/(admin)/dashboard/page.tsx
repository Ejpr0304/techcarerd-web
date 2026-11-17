"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductCategory, ProductStatus, ProductAvailability, InventoryMovement } from "@/types";
import {
  initialProducts,
  getClientProducts,
  saveClientProducts,
  getClientMovements,
  recordClientMovement,
} from "@/services/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LayoutDashboard,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ExternalLink,
  Trash2,
  DollarSign,
  Boxes,
  AlertTriangle,
  History,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [activeTab, setActiveTab] = useState<"inventory" | "movements" | "metrics">("inventory");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  
  // Modales
  const [movementModal, setMovementModal] = useState<{
    isOpen: boolean;
    type: "entrada" | "salida";
    product: Product | null;
  }>({
    isOpen: false,
    type: "entrada",
    product: null,
  });

  const [movementQty, setMovementQty] = useState(1);
  const [movementReason, setMovementReason] = useState("");

  const [newProductModal, setNewProductModal] = useState(false);
  const [newProd, setNewProd] = useState<{
    name: string;
    description: string;
    price: number;
    stock: number;
    category: ProductCategory;
    status: ProductStatus;
    imageUrl: string;
  }>({
    name: "",
    description: "",
    price: 0,
    stock: 1,
    category: "componentes",
    status: "nuevo",
    imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
  });

  // Notificación breve
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Cargar productos y movimientos al montar
  useEffect(() => {
    const list = getClientProducts();
    setProducts(list);
    const movs = getClientMovements();
    setMovements(movs);
  }, []);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "todos" || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Métricas
  const totalItemsCount = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + p.price * (p.stock || 0),
    0
  );
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 1).length;

  // Manejar Entrada / Salida
  const handleOpenMovement = (product: Product, type: "entrada" | "salida") => {
    setMovementModal({
      isOpen: true,
      type,
      product,
    });
    setMovementQty(1);
    setMovementReason(
      type === "entrada"
        ? "Recepción de nuevo lote o proveedor"
        : "Venta directa en tienda / mostrador"
    );
  };

  const handleConfirmMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementModal.product) return;

    const prod = movementModal.product;
    const qty = Number(movementQty);

    if (qty <= 0) {
      alert("Por favor ingresa una cantidad válida mayor a 0.");
      return;
    }

    if (movementModal.type === "salida" && qty > (prod.stock || 0)) {
      alert(
        `No puedes registrar una salida de ${qty} unidades. Stock actual disponible: ${prod.stock}`
      );
      return;
    }

    const newStock =
      movementModal.type === "entrada"
        ? (prod.stock || 0) + qty
        : (prod.stock || 0) - qty;

    const updatedAvailability: ProductAvailability = newStock > 0 ? "disponible" : "agotado";

    const updatedList = products.map((p) => {
      if (p.id === prod.id) {
        return {
          ...p,
          stock: newStock,
          availability: updatedAvailability,
        };
      }
      return p;
    });

    setProducts(updatedList);
    saveClientProducts(updatedList);

    // Registrar en movimientos
    const mov = recordClientMovement({
      productId: prod.id,
      productName: prod.name,
      type: movementModal.type,
      quantity: qty,
      reason: movementReason || (movementModal.type === "entrada" ? "Entrada regular" : "Venta regular"),
    });

    setMovements((prev) => [mov, ...prev]);

    showToast(
      movementModal.type === "entrada"
        ? `✅ Entrada registrada: +${qty} unidades de "${prod.name}" (Stock actual: ${newStock})`
        : `📦 Salida registrada: -${qty} unidades de "${prod.name}" (Stock actual: ${newStock})`
    );

    setMovementModal({ isOpen: false, type: "entrada", product: null });
  };

  // Crear nuevo producto
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || newProd.price <= 0) {
      alert("Completa el nombre y un precio válido.");
      return;
    }

    const created: Product = {
      id: "prod-custom-" + Date.now(),
      name: newProd.name.trim(),
      description: newProd.description.trim() || "Producto verificado por el taller TechCareRD.",
      price: Number(newProd.price),
      stock: Number(newProd.stock),
      images: [newProd.imageUrl || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"],
      category: newProd.category,
      status: newProd.status,
      availability: Number(newProd.stock) > 0 ? "disponible" : "agotado",
      specs: {
        "Categoría": newProd.category,
        "Condición": newProd.status,
      },
    };

    const updatedList = [created, ...products];
    setProducts(updatedList);
    saveClientProducts(updatedList);

    // Registrar entrada inicial en kardex
    if (created.stock > 0) {
      const mov = recordClientMovement({
        productId: created.id,
        productName: created.name,
        type: "entrada",
        quantity: created.stock,
        reason: "Alta de nuevo producto en catálogo",
      });
      setMovements((prev) => [mov, ...prev]);
    }

    showToast(`✅ Nuevo artículo creado: "${created.name}" con stock de ${created.stock}.`);
    setNewProductModal(false);
    setNewProd({
      name: "",
      description: "",
      price: 0,
      stock: 1,
      category: "componentes",
      status: "nuevo",
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    });
  };

  // Eliminar producto
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) {
      const updatedList = products.filter((p) => p.id !== id);
      setProducts(updatedList);
      saveClientProducts(updatedList);
      showToast(`🗑️ "${name}" ha sido eliminado del catálogo.`);
    }
  };

  // Restaurar los 19 iniciales
  const handleResetInitial = () => {
    if (
      confirm(
        "¿Deseas restaurar la lista oficial con los 19 artículos originales del inventario?"
      )
    ) {
      setProducts(initialProducts);
      saveClientProducts(initialProducts);
      showToast("🔄 Catálogo restaurado con los 19 artículos oficiales.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 border border-blue-400/30">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-neutral-850 bg-neutral-900/40 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-black">
            TC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-wide">TechCareRD</h1>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-neutral-400">Sistema de Control de Inventario & Flujo de Stock</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs gap-1.5 h-9 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Tienda Pública
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10 text-xs gap-1.5 h-9 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-neutral-850 bg-neutral-900/20 px-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "inventory"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Boxes className="w-4 h-4" />
            Inventario & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("movements")}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "movements"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <History className="w-4 h-4" />
            Movimientos / Kardex ({movements.length})
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "metrics"
                ? "border-blue-500 text-blue-400 bg-blue-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Resumen Financiero & Métricas
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-neutral-900/40 border-neutral-850">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs text-neutral-400 font-medium">Artículos en Catálogo</CardDescription>
              <CardTitle className="text-2xl font-black text-white">{totalItemsCount}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] text-neutral-500">
              Modelos únicos registrados
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/40 border-neutral-850">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs text-neutral-400 font-medium">Unidades Físicas en Stock</CardDescription>
              <CardTitle className="text-2xl font-black text-blue-400">{totalStockUnits}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] text-neutral-500">
              Total de piezas físicas disponibles
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/40 border-neutral-850">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs text-neutral-400 font-medium">Valor Total del Stock</CardDescription>
              <CardTitle className="text-2xl font-black text-emerald-400">
                RD$ {totalInventoryValue.toLocaleString("es-DO")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] text-neutral-500">
              Precio venta estimado en tienda
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/40 border-neutral-850">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs text-neutral-400 font-medium">Bajo Stock / Agotados</CardDescription>
              <CardTitle className={`text-2xl font-black ${lowStockCount > 0 ? "text-amber-400" : "text-neutral-400"}`}>
                {lowStockCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-[11px] text-neutral-500">
              Artículos con 1 o 0 unidades
            </CardContent>
          </Card>
        </div>

        {/* TAB 1: INVENTARIO */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/30 p-4 rounded-xl border border-neutral-850">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <Input
                    type="text"
                    placeholder="Buscar por artículo, modelo o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 bg-neutral-950 border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-medium focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="todos">Todas las Categorías</option>
                  <option value="laptops">Laptops</option>
                  <option value="consolas">Consolas</option>
                  <option value="componentes">Componentes (SSD, RAM, HDD)</option>
                  <option value="accesorios">Accesorios (Controles)</option>
                </select>

                <Button
                  onClick={() => setNewProductModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 gap-1.5 px-4 font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Artículo
                </Button>

                <Button
                  onClick={handleResetInitial}
                  variant="outline"
                  title="Restaurar los 19 artículos oficiales"
                  className="border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs h-10 px-3 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/60 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-850 font-bold">
                    <tr>
                      <th className="py-3 px-4">Artículo / Imagen</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Precio RD$</th>
                      <th className="py-3 px-4 text-center">Stock Actual</th>
                      <th className="py-3 px-4 text-center">Disponibilidad</th>
                      <th className="py-3 px-4 text-right">Flujo de Stock</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-neutral-500">
                          No se encontraron artículos con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr
                          key={prod.id}
                          className="hover:bg-neutral-900/40 transition-colors"
                        >
                          {/* Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                                <Image
                                  src={prod.images[0] || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"}
                                  alt={prod.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-white text-sm leading-snug line-clamp-1">
                                  {prod.name}
                                </p>
                                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                                  {prod.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category & Status */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded w-max">
                                {prod.category}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-neutral-500">
                                Condición: {prod.status}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold text-white">
                            RD$ {prod.price.toLocaleString("es-DO")}
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center font-extrabold text-sm px-3 py-1 rounded-full ${
                                (prod.stock || 0) > 2
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : (prod.stock || 0) === 1
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-red-500/15 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {prod.stock || 0}
                            </span>
                          </td>

                          {/* Availability Badge */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                (prod.stock || 0) > 0
                                  ? "bg-emerald-600/20 text-emerald-400"
                                  : "bg-red-600/20 text-red-400"
                              }`}
                            >
                              {(prod.stock || 0) > 0 ? "Disponible" : "Agotado"}
                            </span>
                          </td>

                          {/* Stock Flow Buttons (+ Entrada / - Salida) */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleOpenMovement(prod, "entrada")}
                                className="h-8 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs px-2.5 font-bold gap-1 cursor-pointer transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Entrada
                              </Button>

                              <Button
                                size="sm"
                                disabled={(prod.stock || 0) <= 0}
                                onClick={() => handleOpenMovement(prod, "salida")}
                                className="h-8 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs px-2.5 font-bold gap-1 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3.5 h-3.5" />
                                Salida
                              </Button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="text-neutral-500 hover:text-red-400 p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORIAL DE MOVIMIENTOS (KARDEX) */}
        {activeTab === "movements" && (
          <div className="space-y-4">
            <div className="bg-neutral-900/30 p-4 rounded-xl border border-neutral-850 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Registro de Entradas y Salidas (Kardex)</h3>
                <p className="text-xs text-neutral-400">
                  Historial detallado de todas las recepciones y despachos registrados en el taller.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/60 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-850 font-bold">
                  <tr>
                    <th className="py-3 px-4">Fecha & Hora</th>
                    <th className="py-3 px-4">Tipo Movimiento</th>
                    <th className="py-3 px-4">Artículo</th>
                    <th className="py-3 px-4 text-center">Cantidad</th>
                    <th className="py-3 px-4">Motivo / Justificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850/60">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-neutral-500">
                        Aún no hay movimientos registrados. Haz clic en "+ Entrada" o "- Salida" en la pestaña de inventario.
                      </td>
                    </tr>
                  ) : (
                    movements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                          {new Date(mov.date).toLocaleString("es-DO")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              mov.type === "entrada"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {mov.type === "entrada" ? (
                              <>
                                <ArrowUpRight className="w-3 h-3" /> Entrada (+)
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="w-3 h-3" /> Salida (-)
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {mov.productName}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-sm">
                          {mov.type === "entrada" ? `+${mov.quantity}` : `-${mov.quantity}`}
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          {mov.reason}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MÉTRICAS Y DISTRIBUCIÓN */}
        {activeTab === "metrics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-neutral-900/30 border-neutral-850">
              <CardHeader>
                <CardTitle className="text-base text-white">Distribución de Artículos por Categoría</CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Conteo de piezas y valor por línea de producto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["laptops", "consolas", "componentes", "accesorios"].map((cat) => {
                  const catProducts = products.filter((p) => p.category === cat);
                  const catStock = catProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
                  const catVal = catProducts.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 border border-neutral-850"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-400">{cat}</p>
                        <p className="text-[11px] text-neutral-400">{catProducts.length} modelos ({catStock} unidades físicas)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">RD$ {catVal.toLocaleString("es-DO")}</p>
                        <p className="text-[10px] text-neutral-500">Valor en stock</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-neutral-900/30 border-neutral-850">
              <CardHeader>
                <CardTitle className="text-base text-white">Instrucciones de Uso Diario</CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Cómo mantener tu catálogo actualizado en 3 sencillos pasos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-850 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Cuando te llegue nueva mercancía:</strong>
                    Presiona el botón verde <strong>`+ Entrada`</strong> junto al artículo correspondiente y pon la cantidad recibida. El stock se sumará de inmediato.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-850 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Cuando vendas o uses una pieza:</strong>
                    Presiona el botón rojo <strong>`- Salida`</strong>. Si las unidades llegan a 0, la web pondrá automáticamente la etiqueta roja de <strong>Agotado</strong>.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-850 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5">Sincronización en Vivo:</strong>
                    Los clientes en tu página principal ven los cambios al instante sin que tengas que reprogramar nada.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* MODAL DE ENTRADA / SALIDA */}
      {movementModal.isOpen && movementModal.product && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setMovementModal({ isOpen: false, type: "entrada", product: null })}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  movementModal.type === "entrada"
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-600/20 text-red-400 border border-red-500/30"
                }`}
              >
                {movementModal.type === "entrada" ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {movementModal.type === "entrada" ? "Registrar Entrada de Mercancía" : "Registrar Salida de Inventario"}
                </h3>
                <p className="text-xs text-neutral-400">{movementModal.product.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmMovement} className="space-y-4">
              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs flex justify-between">
                <span className="text-neutral-400">Stock Actual en Tienda:</span>
                <span className="font-extrabold text-white text-sm">
                  {movementModal.product.stock || 0} unidades
                </span>
              </div>

              <div>
                <Label htmlFor="qty" className="text-xs text-neutral-300 font-semibold">
                  Cantidad a {movementModal.type === "entrada" ? "Ingresar" : "Retirar"}
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  max={movementModal.type === "salida" ? movementModal.product.stock || 1 : 999}
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 bg-neutral-950 border-neutral-800 text-white font-bold text-base h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reason" className="text-xs text-neutral-300 font-semibold">
                  Motivo / Comentario
                </Label>
                <Input
                  id="reason"
                  type="text"
                  placeholder={
                    movementModal.type === "entrada"
                      ? "Ej: Compra de lote, llegada de proveedor..."
                      : "Ej: Venta en mostrador #45, usada en reparación..."
                  }
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMovementModal({ isOpen: false, type: "entrada", product: null })}
                  className="flex-1 border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white text-xs h-10 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 text-white font-bold text-xs h-10 cursor-pointer ${
                    movementModal.type === "entrada"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  Confirmar {movementModal.type === "entrada" ? "Entrada" : "Salida"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE NUEVO PRODUCTO */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 my-8">
            <button
              onClick={() => setNewProductModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Agregar Nuevo Artículo</h3>
                <p className="text-xs text-neutral-400">Se mostrará en la tienda web pública y en tu inventario.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <Label htmlFor="prodName" className="text-xs text-neutral-300 font-semibold">
                  Nombre del Artículo / Modelo
                </Label>
                <Input
                  id="prodName"
                  type="text"
                  placeholder="Ej: Nintendo Switch OLED / Laptop Dell XPS 15..."
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="prodDesc" className="text-xs text-neutral-300 font-semibold">
                  Descripción Técnica Corta
                </Label>
                <Input
                  id="prodDesc"
                  type="text"
                  placeholder="Ej: Procesador, tarjeta gráfica, detalles de condición..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="prodCategory" className="text-xs text-neutral-300 font-semibold">
                    Categoría
                  </Label>
                  <select
                    id="prodCategory"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                    className="mt-1 w-full h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="consolas">Consolas</option>
                    <option value="componentes">Componentes (SSD/RAM/HDD)</option>
                    <option value="accesorios">Accesorios (Controles)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="prodStatus" className="text-xs text-neutral-300 font-semibold">
                    Condición
                  </Label>
                  <select
                    id="prodStatus"
                    value={newProd.status}
                    onChange={(e) => setNewProd({ ...newProd, status: e.target.value as ProductStatus })}
                    className="mt-1 w-full h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado / Seminuevo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="prodPrice" className="text-xs text-neutral-300 font-semibold">
                    Precio de Venta (RD$)
                  </Label>
                  <Input
                    id="prodPrice"
                    type="number"
                    min="1"
                    placeholder="RD$ 0"
                    value={newProd.price || ""}
                    onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10 font-bold"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="prodStock" className="text-xs text-neutral-300 font-semibold">
                    Stock Inicial (Unidades)
                  </Label>
                  <Input
                    id="prodStock"
                    type="number"
                    min="0"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                    className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prodImg" className="text-xs text-neutral-300 font-semibold">
                  URL de Imagen (Unsplash u hospedada)
                </Label>
                <Input
                  id="prodImg"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs h-10"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewProductModal(false)}
                  className="flex-1 border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white text-xs h-10 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 cursor-pointer"
                >
                  Guardar Artículo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
