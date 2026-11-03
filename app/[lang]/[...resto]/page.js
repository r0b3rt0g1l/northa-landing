import { notFound } from "next/navigation";

// Cualquier ruta que no exista dentro de un idioma muestra el 404 de ese
// idioma (app/[lang]/not-found.js), con su layout y su traducción.
export default function RutaInexistente() {
  notFound();
}
