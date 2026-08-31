import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Northa Digital y Amplía Consultoría — un municipio, de principio a fin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090B",
          color: "#F2F2F5",
          padding: 80,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 78% 16%, rgba(255,46,126,0.28), transparent 55%), radial-gradient(circle at 16% 92%, rgba(63,184,172,0.16), transparent 55%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="37" fill="none" stroke="#3FB8AC" strokeWidth="9" />
          </svg>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7A7A88",
            }}
          >
            AMPLÍA
          </span>
          <span
            style={{
              width: 44,
              height: 2,
              background:
                "linear-gradient(90deg, #3FB8AC, #FF2E7E)",
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7A7A88",
            }}
          >
            NORTHA
          </span>
          <svg
            width="40"
            height="40"
            viewBox="0 0 200 200"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,46,126,0.6))" }}
          >
            <path
              d="M100 18 L121.2 78.8 L168 100 L121.2 121.2 L100 182 L78.8 121.2 L32 100 L78.8 78.8 Z"
              fill="#F2F2F5"
            />
            <path
              d="M100 18 L121.2 78.8 L100 100 L78.8 78.8 Z"
              fill="#FF2E7E"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            marginTop: 44,
            letterSpacing: -2,
            textAlign: "center",
            maxWidth: 980,
          }}
        >
          Un municipio, de principio a fin.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#A0A0AC",
            marginTop: 22,
            maxWidth: 860,
            textAlign: "center",
          }}
        >
          Amplía ordena la gestión. Northa la publica. Un solo recorrido, para
          los ayuntamientos de Sonora.
        </div>
      </div>
    ),
    { ...size },
  );
}
