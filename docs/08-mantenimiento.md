# 08 · Mantenimiento mensual

Una revisión al mes (unos 60–90 minutos) mantiene el sitio rápido, seguro y al día. Copia la lista en un issue de GitHub cada mes y marca lo que hagas.

## Cada mes

### Código y dependencias

- [ ] `npm outdated`: actualiza parches y versiones menores en una rama (`npm update`). Las versiones mayores (Next, React, Tailwind, AI SDK, Supabase) van en su propia rama y se prueban aparte.
- [ ] `npm audit`: atiende lo alto y lo crítico.
- [ ] Revisa los avisos de seguridad de Next.js y de Vercel del mes.
- [ ] En la rama: `npm run check`, `npm run test:db` y `npm run build`. Pull Request → el CI debe pasar → revisa la preview en el iPhone → merge.

### Rendimiento y calidad

- [ ] PageSpeed Insights en móvil para `/`, `/portfolio`, `/servicios/desarrollo-web` y `/amplia`. Anota los resultados en `05-lanzamiento.md` (tabla 3.2). Si alguno baja de 95 dos corridas seguidas, investiga qué cambió.
- [ ] Vercel → Speed Insights: LCP, INP y CLS de usuarios reales, en celular.
- [ ] Revisa a mano el inicio en el iPhone: Cerro en vivo (hora, clima y luces al bajar), Nort y un formulario.

### SEO y contenido

- [ ] Search Console: errores de indexación, páginas excluidas y las búsquedas que traen visitas (ideas para el blog).
- [ ] Publica el artículo del mes (`06-contenido.md`, calendario editorial).
- [ ] Cifras y textos siguen siendo ciertos (número de portales, servicios).
- [ ] Enlaces externos del blog y del portafolio siguen vivos.

### Portafolio

- [ ] `npm run capture:portfolio` y revisa las capturas nuevas antes del commit.
- [ ] `npm run audit:sites -- --urls=https://northadigital.com/,https://www.rayontransparencia.com.mx/` (o los que quieras) para confirmar metadatos, peso y H1.
- [ ] Si un portal salió de la flota, quítalo de `content/gov.ts`.

### Leads, Nort y correo

- [ ] Supabase → tabla `leads`: que lleguen, que no haya spam repetido, y que cada uno se haya atendido.
- [ ] Borra los leads que ya no se necesiten, conforme a la sección "Conservación" del aviso de privacidad.
- [ ] AI Gateway: consumo y costo del mes contra el presupuesto.
- [ ] Resend: entregas y rebotes; que el dominio siga verificado.
- [ ] HubSpot (si se usa): que los contactos nuevos coincidan con Supabase.

### Intranet de Amplía

- [ ] Usuarios: desactiva a quien ya no esté en el equipo.
- [ ] Respaldo: `supabase db dump` del proyecto **nuevo** y descarga del bucket `amplia-recursos`. Guárdalo cifrado.
- [ ] Si el proyecto está en el plan gratuito, confirma que no esté pausado.

## Cada tres meses

- [ ] `npm run audit:sites` sobre la competencia (Imagina Studio, Creapptivo, Hecho en Sonora) y actualiza `01-analisis-competitivo.md` si algo cambió.
- [ ] Revisa accesos: miembros del team en Vercel, colaboradores del repo en GitHub, usuarios de Supabase y del portal.
- [ ] Prueba de restauración: levanta el respaldo más reciente en un proyecto de prueba (no en producción).
- [ ] Si cambió algo de la escena del Cerro, vuelve a renderizar los pósters (`npm run render:cerro`, ver `04-cerro-en-vivo.md`).

## Cada año

- [ ] Renovación del dominio `northadigital.com` (y confirma que la renovación automática y el método de pago estén vigentes).
- [ ] Rota los secretos: `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `HUBSPOT_ACCESS_TOKEN`, `TURNSTILE_SECRET_KEY` y, si usas el deploy por Actions, `VERCEL_TOKEN`. Cambia primero en Vercel/GitHub y luego revoca el viejo.
- [ ] Revisa el aviso de privacidad contra los servicios que realmente se usan.
- [ ] Revisa que los datos de contacto de Amplía sigan vigentes con Fabiola.

## Si algo se rompe

1. **El sitio no carga o se ve mal:** Vercel → Deployments → el último deploy bueno → **Instant Rollback**. Después, investiga en una rama.
2. **Nort no responde con IA:** revisa crédito y presupuesto del AI Gateway. Mientras tanto, Nort sigue en modo guiado y manda a WhatsApp.
3. **No llegan leads por correo:** Resend (dominio y llave). Los leads siguen en Supabase, y el formulario ofrece WhatsApp si ningún destino respondió.
4. **La intranet no deja entrar:** ¿proyecto de Supabase pausado? ¿Cuenta desactivada? ¿Variables de Supabase bien escritas en Vercel?
5. **El deploy falla:** abre el log del build en Vercel → Deployments (o, si usas el deploy por Actions, el paso que falló en GitHub). Si fue lint, tipos o `test:db`, se corrige en código; si fue `vercel pull`, revisa `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.
