export const siteConfig = {
  name: "TechCareRD",
  description: "Taller tecnológico premium especializado en mantenimiento y optimización de computadoras y consolas de videojuegos en Santo Domingo.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://techcarerd.com",
  ogImage: "https://techcarerd.com/og.jpg",
  contact: {
    phone: "+1 (809) 912-2222",
    phoneValue: "18099122222",
    whatsapp: "+1 (809) 912-2222",
    whatsappLink: "https://wa.me/18099122222",
    instagram: "@techcarerd",
    instagramLink: "https://instagram.com/techcarerd",
    address: "Santo Domingo, República Dominicana",
    email: "ernestopimentelroa@hotmail.com",
    mapsIframe: "https://maps.google.com/maps?q=Santo+Domingo,+Dominican+Republic&t=&z=14&ie=UTF8&iwloc=&output=embed",
  },
  openingHours: {
    weekdays: "Lunes a Viernes: 9:00 AM - 7:00 PM",
    saturdays: "Sábados: 9:00 AM - 5:00 PM",
    sundays: "Domingos: Cerrado",
  },
  mainNav: [
    { title: "Inicio", href: "#inicio" },
    { title: "Servicios", href: "#servicios" },
    { title: "Precios", href: "#precios" },
    { title: "Productos", href: "#productos" },
    { title: "Antes & Después", href: "#antes-despues" },
    { title: "Galería", href: "#galeria" },
    { title: "FAQ", href: "#faq" },
    { title: "Reseñas", href: "#reseñas" },
    { title: "Contacto", href: "#contacto" },
  ],
};

export type SiteConfig = typeof siteConfig;
