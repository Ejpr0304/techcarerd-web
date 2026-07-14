-- Schema para la base de datos de TechCareRD
-- Preparado para integración futura con Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLA DE SERVICIOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    estimated_time VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública y escritura administrativa
CREATE POLICY "Servicios son legibles por cualquiera" ON public.services
    FOR SELECT USING (true);

-- ==========================================
-- 2. TABLA DE PRODUCTOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'nuevo', -- 'nuevo', 'usado'
    availability VARCHAR(50) NOT NULL DEFAULT 'disponible', -- 'disponible', 'agotado', 'bajo pedido'
    category VARCHAR(100) NOT NULL, -- 'consolas', 'laptops', 'componentes', 'accesorios'
    specs JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Productos son legibles por cualquiera" ON public.products
    FOR SELECT USING (true);

-- ==========================================
-- 3. TABLA DE RESEÑAS / TESTIMONIOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_visible BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Reseñas aprobadas son legibles por cualquiera" ON public.reviews
    FOR SELECT USING (is_visible = true);

-- ==========================================
-- 4. TABLA DE MENSAJES DE CONTACTO (LEADS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    device_type VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'nuevo' NOT NULL, -- 'nuevo', 'contactado', 'resuelto'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Política de inserción pública (los usuarios envían mensajes desde la web)
CREATE POLICY "Cualquiera puede insertar mensajes de contacto" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- 5. TABLA DE ÓRDENES DE REPARACIÓN (TRACKING)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(50) PRIMARY KEY, -- TC-YYYY-XXXX (ej. TC-2026-0001)
    customer_name VARCHAR(255) NOT NULL,
    device VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'recibido' NOT NULL, -- 'recibido', 'en_diagnostico', 'esperando_repuestos', 'completado'
    estimated_completion VARCHAR(100),
    price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política de consulta pública (los clientes buscan su orden por ID exacto)
CREATE POLICY "Clientes pueden buscar su orden por ID" ON public.orders
    FOR SELECT USING (true); -- El filtro se aplica en la app mediante el ID de la orden

-- ==========================================
-- TRIGGERS PARA AUTO-UPDATE DE UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
