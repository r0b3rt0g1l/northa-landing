import { HMO_COORDS, hoursFromLocalIso } from "@/lib/cerro/sky-time";

/**
 * Clima actual de Hermosillo para la barra del inicio y el cielo del Cerro.
 * Open-Meteo (gratis, sin llave); la respuesta se guarda 10 minutos en la
 * CDN, así el navegador nunca habla con terceros y no gastamos peticiones.
 * Si Open-Meteo falla, responde `weather: null` y el sitio usa la tabla de
 * amaneceres (lib/cerro/sky-time.ts): la hora y el Cerro siguen funcionando.
 */
export const revalidate = 600;

export interface ClimaResponse {
  weather: {
    temperature: number;
    /** Código WMO de Open-Meteo. */
    code: number;
    isDay: boolean;
    /** 0–100 */
    cloudCover: number;
    /** Horas locales decimales. */
    sunrise: number | null;
    sunset: number | null;
  } | null;
  updatedAt: string;
}

export async function GET() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${HMO_COORDS.lat}&longitude=${HMO_COORDS.lon}` +
    `&current=temperature_2m,weather_code,is_day,cloud_cover&daily=sunrise,sunset` +
    `&timezone=America%2FHermosillo&forecast_days=1`;
  let body: ClimaResponse = { weather: null, updatedAt: new Date().toISOString() };
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000), next: { revalidate: 600 } });
    if (res.ok) {
      const json = (await res.json()) as {
        current?: { temperature_2m?: number; weather_code?: number; is_day?: number; cloud_cover?: number };
        daily?: { sunrise?: string[]; sunset?: string[] };
      };
      const c = json.current;
      if (c && typeof c.temperature_2m === "number" && typeof c.weather_code === "number") {
        body = {
          weather: {
            temperature: c.temperature_2m,
            code: c.weather_code,
            isDay: c.is_day === 1,
            cloudCover: typeof c.cloud_cover === "number" ? c.cloud_cover : 0,
            sunrise: hoursFromLocalIso(json.daily?.sunrise?.[0]),
            sunset: hoursFromLocalIso(json.daily?.sunset?.[0]),
          },
          updatedAt: new Date().toISOString(),
        };
      }
    }
  } catch {
    // Sin clima: la barra muestra solo fecha y hora.
  }
  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800" },
  });
}
