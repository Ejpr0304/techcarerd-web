import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechCareRD - Taller Premium de Tecnología",
    short_name: "TechCareRD",
    description: "Mantenimiento profesional de laptops, computadoras de escritorio y consolas de videojuegos en Santo Domingo.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
