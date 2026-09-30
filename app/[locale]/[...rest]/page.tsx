import { notFound } from "next/navigation";

/** Cualquier ruta desconocida cae aquí y muestra el 404 con el diseño del sitio. */
export default function CatchAll() {
  notFound();
}
