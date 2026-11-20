-- ========================================================
-- TechCareRD: Esquema de Base de Datos Supabase (PostgreSQL)
-- Copia y pega este script en el "SQL Editor" de tu proyecto en https://supabase.com
-- ========================================================

-- 1. Tabla de Productos del Inventario
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  images text[] default '{}',
  status text default 'nuevo',
  availability text default 'disponible',
  category text default 'componentes',
  specs jsonb default '{}'::jsonb,
  stock integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tabla de Movimientos de Inventario (Entradas y Salidas)
create table if not exists public.movements (
  id text primary key,
  product_id text,
  product_name text,
  type text not null, -- 'entrada' o 'salida'
  quantity integer not null,
  reason text,
  date timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Habilitar Row Level Security (RLS) con políticas de lectura y escritura pública
alter table public.products enable row level security;
alter table public.movements enable row level security;

-- Políticas para Products
create policy "Lectura pública de productos" on public.products
  for select using (true);

create policy "Escritura pública de productos" on public.products
  for all using (true);

-- Políticas para Movements
create policy "Lectura pública de movimientos" on public.movements
  for select using (true);

create policy "Inserción pública de movimientos" on public.movements
  for insert with check (true);
