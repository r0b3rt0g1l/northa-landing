import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Northa Digital — Portales municipales de última generación, con inteligencia artificial";
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
          background: "#0B0B0C",
          color: "#F5F5F7",
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
              "radial-gradient(circle at 78% 16%, rgba(255,46,126,0.35), transparent 55%), radial-gradient(circle at 16% 92%, rgba(255,122,179,0.18), transparent 55%)",
          }}
        />

        <svg
          width="118"
          height="118"
          viewBox="0 0 200 200"
          style={{ filter: "drop-shadow(0 0 40px rgba(255,46,126,0.6))" }}
        >
          <path
            d="M100 18 L121.2 78.8 L168 100 L121.2 121.2 L100 182 L78.8 121.2 L32 100 L78.8 78.8 Z"
            fill="#F5F5F7"
          />
          <path
            d="M100 18 L121.2 78.8 L100 100 L78.8 78.8 Z"
            fill="#FF2E7E"
          />
        </svg>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            marginTop: 40,
            letterSpacing: -2,
          }}
        >
          <span>Northa</span>
          <span style={{ color: "#FF4D93", marginLeft: 18 }}>Digital</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#B9B2C2",
            marginTop: 18,
            maxWidth: 920,
            textAlign: "center",
          }}
        >
          Portales municipales de última generación, con inteligencia
          artificial.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#86868B",
            marginTop: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Gobierno municipal de Sonora
        </div>
      </div>
    ),
    { ...size },
  );
}
