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
  Plus,
  Minus,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Trash2,
  DollarSign,
  Boxes,
  History,
  CheckCircle2,
  X,
  ArrowUpRight,
  ArrowDownRight,
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
        ? `✅ Entrada registrada: +${qty} unidades de "${prod.name}" (Stock: ${newStock})`
        : `📦 Salida registrada: -${qty} unidades de "${prod.name}" (Stock: ${newStock})`
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src="/logo-official.jpg"
            alt="TechCareRD"
            className="h-10 sm:h-12 w-auto object-contain rounded-lg border border-slate-200/90 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">TechCareRD</h1>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Panel Administrativo
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Control de Inventario & Flujo de Stock en Tiempo Real</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-950 text-xs font-semibold gap-1.5 h-9 rounded-full cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Tienda Pública
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold gap-1.5 h-9 rounded-full cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Navigation Tabs (Pills Style) */}
      <div className="border-b border-slate-200 bg-white px-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "inventory"
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Boxes className="w-4 h-4" />
            Inventario & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("movements")}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "movements"
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4" />
            Movimientos / Kardex ({movements.length})
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "metrics"
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-900"
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
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Artículos en Catálogo</CardDescription>
              <CardTitle className="text-3xl font-black text-slate-900 mt-1">{totalItemsCount}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-500">
              Modelos únicos registrados
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Unidades Físicas en Stock</CardDescription>
              <CardTitle className="text-3xl font-black text-blue-600 mt-1">{totalStockUnits}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-500">
              Total de piezas físicas disponibles
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Valor Total del Stock</CardDescription>
              <CardTitle className="text-3xl font-black text-emerald-600 mt-1">
                RD$ {totalInventoryValue.toLocaleString("es-DO")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-500">
              Precio venta estimado en tienda
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bajo Stock / Agotados</CardDescription>
              <CardTitle className={`text-3xl font-black mt-1 ${lowStockCount > 0 ? "text-amber-500" : "text-slate-400"}`}>
                {lowStockCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-500">
              Artículos con 1 o 0 unidades
            </CardContent>
          </Card>
        </div>

        {/* TAB 1: INVENTARIO */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por artículo, modelo o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 bg-slate-50 border-slate-200 text-xs text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="todos">Todas las Categorías</option>
                  <option value="laptops">Laptops</option>
                  <option value="consolas">Consolas</option>
                  <option value="componentes">Componentes (SSD, RAM, HDD)</option>
                  <option value="accesorios">Accesorios (Controles)</option>
                </select>

                <Button
                  onClick={() => setNewProductModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-10 gap-1.5 px-4 font-bold rounded-full cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Artículo
                </Button>

                <Button
                  onClick={handleResetInitial}
                  variant="outline"
                  title="Restaurar los 19 artículos oficiales"
                  className="border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-xs h-10 px-3 rounded-full cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Artículo / Imagen</th>
                      <th className="py-3.5 px-4">Categoría</th>
                      <th className="py-3.5 px-4">Precio RD$</th>
                      <th className="py-3.5 px-4 text-center">Stock</th>
                      <th className="py-3.5 px-4 text-center">Disponibilidad</th>
                      <th className="py-3.5 px-4 text-right">Flujo de Stock</th>
                      <th className="py-3.5 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          No se encontraron artículos con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr
                          key={prod.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                <Image
                                  src={prod.images[0] || "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"}
                                  alt={prod.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                                  {prod.name}
                                </p>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {prod.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full w-max">
                                {prod.category}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                                {prod.status}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                            RD$ {prod.price.toLocaleString("es-DO")}
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center font-black text-xs px-3 py-1 rounded-full ${
                                (prod.stock || 0) > 2
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : (prod.stock || 0) === 1
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {prod.stock || 0}
                            </span>
                          </td>

                          {/* Availability Badge */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                (prod.stock || 0) > 0
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {(prod.stock || 0) > 0 ? "Disponible" : "Agotado"}
                            </span>
                          </td>

                          {/* Stock Flow Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleOpenMovement(prod, "entrada")}
                                className="h-8 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs px-2.5 font-bold rounded-full gap-1 cursor-pointer transition-all shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Entrada
                              </Button>

                              <Button
                                size="sm"
                                disabled={(prod.stock || 0) <= 0}
                                onClick={() => handleOpenMovement(prod, "salida")}
                                className="h-8 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs px-2.5 font-bold rounded-full gap-1 cursor-pointer transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3.5 h-3.5" />
                                Salida
                              </Button>
                            </div>
                          </td>

                          {/* Delete */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bitácora de Entradas y Salidas (Kardex)</h3>
                <p className="text-xs text-slate-500">
                  Registro cronológico de movimientos para auditoría de piezas y ventas.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Fecha & Hora</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Artículo</th>
                    <th className="py-3.5 px-4 text-center">Cantidad</th>
                    <th className="py-3.5 px-4">Motivo / Justificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">
                        Aún no hay movimientos registrados. Haz clic en "+ Entrada" o "- Salida" en la pestaña de inventario.
                      </td>
                    </tr>
                  ) : (
                    movements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(mov.date).toLocaleString("es-DO")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              mov.type === "entrada"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
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
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {mov.productName}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-sm">
                          {mov.type === "entrada" ? `+${mov.quantity}` : `-${mov.quantity}`}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
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
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Distribución por Línea de Producto</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Conteo de piezas y valor monetario en mostrador.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {["laptops", "consolas", "componentes", "accesorios"].map((cat) => {
                  const catProducts = products.filter((p) => p.category === cat);
                  const catStock = catProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
                  const catVal = catProducts.reduce((acc, p) => acc + p.price * (p.stock || 0), 0);
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-900">{cat}</p>
                        <p className="text-[11px] text-slate-500">{catProducts.length} modelos ({catStock} unidades físicas)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">RD$ {catVal.toLocaleString("es-DO")}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Valor total</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Instrucciones de Uso Diario</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Cómo mantener tu catálogo actualizado en 3 sencillos pasos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Cuando te llegue nueva mercancía:</strong>
                    Presiona el botón verde <strong>`+ Entrada`</strong> junto al artículo y pon la cantidad recibida.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Cuando vendas o uses una pieza:</strong>
                    Presiona el botón rojo <strong>`- Salida`</strong>. Si las unidades llegan a 0, la web pondrá automáticamente la etiqueta roja de <strong>Agotado</strong>.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Sincronización en Vivo:</strong>
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setMovementModal({ isOpen: false, type: "entrada", product: null })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  movementModal.type === "entrada"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {movementModal.type === "entrada" ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {movementModal.type === "entrada" ? "Registrar Entrada de Mercancía" : "Registrar Salida de Inventario"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{movementModal.product.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmMovement} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600 font-medium">Stock Actual en Tienda:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {movementModal.product.stock || 0} unidades
                </span>
              </div>

              <div>
                <Label htmlFor="qty" className="text-xs text-slate-700 font-semibold">
                  Cantidad a {movementModal.type === "entrada" ? "Ingresar (+)" : "Retirar (-)"}
                </Label>
                <Input
                  id="qty"
                  type="number"
                  min="1"
                  max={movementModal.type === "salida" ? movementModal.product.stock || 1 : 999}
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 font-black text-lg h-12 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reason" className="text-xs text-slate-700 font-semibold">
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
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMovementModal({ isOpen: false, type: "entrada", product: null })}
                  className="flex-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs h-11 rounded-full cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 text-white font-bold text-xs h-11 rounded-full cursor-pointer shadow-md ${
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 my-8">
            <button
              onClick={() => setNewProductModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Agregar Nuevo Artículo</h3>
                <p className="text-xs text-slate-500">Se mostrará en la tienda web pública y en tu inventario.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <Label htmlFor="prodName" className="text-xs text-slate-700 font-semibold">
                  Nombre del Artículo / Modelo
                </Label>
                <Input
                  id="prodName"
                  type="text"
                  placeholder="Ej: Nintendo Switch OLED / Laptop Dell XPS 15..."
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="prodDesc" className="text-xs text-slate-700 font-semibold">
                  Descripción Técnica Corta
                </Label>
                <Input
                  id="prodDesc"
                  type="text"
                  placeholder="Ej: Procesador, tarjeta gráfica, detalles de condición..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor="prodCategory" className="text-xs text-slate-700 font-semibold">
                    Categoría
                  </Label>
                  <select
                    id="prodCategory"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                    className="mt-1 w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="consolas">Consolas</option>
                    <option value="componentes">Componentes (SSD/RAM/HDD)</option>
                    <option value="accesorios">Accesorios (Controles)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="prodStatus" className="text-xs text-slate-700 font-semibold">
                    Condición
                  </Label>
                  <select
                    id="prodStatus"
                    value={newProd.status}
                    onChange={(e) => setNewProd({ ...newProd, status: e.target.value as ProductStatus })}
                    className="mt-1 w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado / Seminuevo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor="prodPrice" className="text-xs text-slate-700 font-semibold">
                    Precio de Venta (RD$)
                  </Label>
                  <Input
                    id="prodPrice"
                    type="number"
                    min="1"
                    placeholder="RD$ 0"
                    value={newProd.price || ""}
                    onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="prodStock" className="text-xs text-slate-700 font-semibold">
                    Stock Inicial (Unidades)
                  </Label>
                  <Input
                    id="prodStock"
                    type="number"
                    min="0"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                    className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prodImg" className="text-xs text-slate-700 font-semibold">
                  URL de Imagen (Unsplash u hospedada)
                </Label>
                <Input
                  id="prodImg"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  className="mt-1 bg-slate-50 border-slate-200 text-slate-900 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewProductModal(false)}
                  className="flex-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs h-11 rounded-full cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 rounded-full cursor-pointer shadow-md"
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
