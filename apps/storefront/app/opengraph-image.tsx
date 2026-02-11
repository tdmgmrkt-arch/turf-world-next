import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Turf World — Premium Artificial Grass Direct to You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "twlogo2.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "60px",
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={300}
          height={150}
          style={{ objectFit: "contain" }}
          alt=""
        />

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Premium Artificial Grass — Direct to Your Door
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#22c55e",
              }}
            />
            PFAS-Free
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#f59e0b",
              }}
            />
            Class-A Fire Rated
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#3b82f6",
              }}
            />
            16-Year Warranty
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#a855f7",
              }}
            />
            Free Shipping
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
