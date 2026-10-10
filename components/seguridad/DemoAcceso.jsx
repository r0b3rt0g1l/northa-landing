import { KeyRound, Laptop, Lock, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

/**
 * Demostración visual del servicio de seguridad: un equipo entra por un
 * túnel VPN cifrado, pasa por un login seguro y llega a un panel
 * administrativo protegido y monitoreado.
 *
 * Es una ilustración: no tiene campos, botones ni enlaces reales, no imita
 * pantallas de terceros (ni verificaciones ni CAPTCHA) y no muestra datos,
 * direcciones ni accesos. Se anuncia como una sola imagen.
 */
export function DemoAcceso() {
  return (
    <div
      className="acceso"
      role="img"
      aria-label="Ilustración: un equipo se conecta por un túnel VPN cifrado, inicia sesión de forma segura y llega a un panel administrativo protegido y monitoreado."
    >
      <div className="acceso-panel glass glass-interior" aria-hidden="true">
        <div className="acceso-barra">
          <span className="acceso-luces">
            <i />
            <i />
            <i />
          </span>
          <span className="acceso-titulo">
            <LockKeyhole className="h-3.5 w-3.5" strokeWidth={2} />
            Panel administrativo
          </span>
          <span className="acceso-estado">
            <i />
            Protegido
          </span>
        </div>
        <div className="acceso-cuerpo">
          <div className="acceso-lateral">
            {[78, 62, 70, 54, 66].map((w, i) => (
              <span key={i} className={i === 0 ? "is-activo" : undefined} style={{ "--w": `${w}%` }} />
            ))}
          </div>
          <div className="acceso-contenido">
            <div className="acceso-fichas">
              {[0, 1, 2].map((i) => (
                <span key={i} className="acceso-ficha">
                  <i />
                  <b style={{ "--w": `${[64, 48, 56][i]}%` }} />
                </span>
              ))}
            </div>
            <div className="acceso-monitor">
              <svg viewBox="0 0 200 56" preserveAspectRatio="none" focusable="false">
                <path className="acceso-linea" d="M0 40 L22 38 L40 30 L58 34 L76 18 L94 26 L112 20 L130 30 L148 12 L166 22 L184 16 L200 20" />
              </svg>
              <span className="acceso-pulso" />
            </div>
            <div className="acceso-registro">
              {[70, 52, 60].map((w, i) => (
                <span key={i} style={{ "--w": `${w}%`, "--i": i }}>
                  <i />
                  <b />
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="acceso-escaneo" />
      </div>

      <div className="acceso-login glass-strong glass-interior" aria-hidden="true">
        <div className="acceso-login-cabeza">
          <span className="acceso-avatar">
            <UserRound className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="flex min-w-0 flex-col">
            <strong>Login seguro</strong>
            <small>Acceso administrativo</small>
          </span>
        </div>
        <span className="acceso-campo">
          <UserRound className="h-3.5 w-3.5" strokeWidth={1.8} />
          <b style={{ "--w": "58%" }} />
        </span>
        <span className="acceso-campo acceso-campo--clave">
          <KeyRound className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span className="acceso-puntos">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} style={{ "--i": i }} />
            ))}
          </span>
        </span>
        <span className="acceso-entrar">
          <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      </div>

      <div className="acceso-vpn glass glass-interior" aria-hidden="true">
        <span className="acceso-nodo">
          <Laptop className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <span className="acceso-tunel">
          <i />
          <i />
          <i />
        </span>
        <span className="acceso-nodo acceso-nodo--escudo">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <span className="acceso-vpn-texto">
          <strong>VPN</strong>
          <small>Conexión cifrada</small>
        </span>
      </div>

      <span className="acceso-etiqueta" aria-hidden="true">
        Demostración visual
      </span>
    </div>
  );
}

export default DemoAcceso;
