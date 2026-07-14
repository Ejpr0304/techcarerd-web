# TechCareRD - Plataforma Web Oficial

Plataforma web moderna, premium y escalable para **TechCareRD**, un taller tecnológico de Santo Domingo, República Dominicana, especializado en el mantenimiento y optimización de laptops, computadoras de escritorio y consolas de videojuegos (PlayStation 5, PlayStation 4, Xbox).

Este proyecto está construido con un enfoque corporativo y está diseñado para crecer durante los próximos años mediante una arquitectura limpia y modular basada en Next.js.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Tipado Estricto)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Construido sobre Radix UI Primitives)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) (Discretas y premium)
- **Formularios y Validación:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Base de Datos & Storage (Listo):** [Supabase](https://supabase.com/)

---

## 📁 Estructura del Proyecto

El código fuente principal está en la carpeta `src/` y sigue la siguiente arquitectura desacoplada:

- `src/config/site.ts`: Configuración global y metadatos de la empresa (teléfonos, redes, direcciones). **Toda la app consume de aquí.**
- `src/types/`: Definiciones estrictas de TypeScript (`Product`, `Service`, `Order`, `Review`, `FAQItem`).
- `src/lib/`: Inicialización de librerías globales (ej. cliente de Supabase `supabase.ts` y utilidades de clases `utils.ts`).
- `src/services/`: Capa lógica de servicios de datos (`products.ts`, `services.ts`, `contact.ts`, `repairs.ts`). Proporciona fallbacks dinámicos con datos mock locales de alta fidelidad si Supabase no está conectado.
- `src/ui/` / `src/components/`: Componentes reutilizables de UI (botones, inputs, cards, accordion, dialogs).
- `src/sections/`: Secciones de la página de aterrizaje (Hero, Servicios, Catálogo, Antes y Después, FAQ, Reseñas, Contacto, Mapa).
- `src/app/`: Estructura de enrutamiento:
  - `page.tsx`: Página pública principal (Inicio).
  - `/tracking/page.tsx`: Portal público para seguimiento de reparaciones por código de orden.
  - `(admin)/login`: Entrada para el personal administrativo (Demo credentials: `admin@techcare.com.do` / `admin123`).
  - `(admin)/dashboard`: Panel preparado para control de inventario, órdenes e ingresos (Listo para integraciones).

---

## 🚀 Comenzar en Desarrollo

### Requisitos Previos
- [Node.js](https://nodejs.org/) LTS (v24+) instalado.

### Instalación
1. Clona o entra en la carpeta del proyecto.
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

### Ejecución
Para iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para visualizar el sitio.

### Compilación (Producción)
Para validar el tipado estricto y generar el build optimizado de producción:
   ```bash
   npm run build
   ```

---

## ⚡ Conexión con Supabase (Futuro)

El proyecto está 100% estructurado para conectarse a Supabase de forma rápida. Para activarlo:

1. **Configura tus variables de entorno:**
   Copia el archivo `.env.local.example` y renombralo como `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Escribe la URL del proyecto (`NEXT_PUBLIC_SUPABASE_URL`) y la clave anónima (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) provistos en el panel de Supabase.

2. **Crea el esquema de base de datos:**
   Abre el editor SQL de tu panel de Supabase y ejecuta el contenido del archivo:
   `supabase/migration.sql`

Este script creará las tablas `services`, `products`, `reviews`, `contact_messages` y `orders` con Row Level Security (RLS) y triggers automáticos de fecha de actualización. Los archivos en `src/services/` detectarán automáticamente las variables y cambiarán de modo simulado (mock) a base de datos en tiempo real de forma transparente.

---

## ♿ Accesibilidad y Rendimiento

- **WCAG Compliant:** Estructura semántica HTML5 completa, navegación integral mediante teclado (`focus-visible`) y atributos `aria` apropiados.
- **Rendimiento Next.js:** Uso de fuentes optimizadas autohospedadas, optimización de imágenes responsivas mediante `next/image` con dominios remotos autorizados en `next.config.ts`, y carga diferida (lazy loading).
- **Tema Oscuro:** El sitio es oscuro de fábrica con un tema premium (inspirado en ROG y PlayStation), pero la arquitectura CSS de Tailwind está lista para modo claro en el futuro agregando los estilos inversos.
