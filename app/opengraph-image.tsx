import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "StreamTrust Diagnostics, laboratory and imaging in Uyo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/streamtrust.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#0b0b0b",
          color: "#ffffff",
          padding: "64px 72px",
        }}
      >
        <img src={src} width={210} height={416} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 56,
            maxWidth: 760,
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: 4, color: "#fbd424" }}>
            UYO · AKWA IBOM
          </div>
          <div style={{ fontSize: 84, marginTop: 16, lineHeight: 1 }}>
            StreamTrust
          </div>
          <div style={{ fontSize: 40, marginTop: 8, color: "#e771af" }}>
            Diagnostics
          </div>
          <div style={{ fontSize: 30, marginTop: 28, lineHeight: 1.35 }}>
            Laboratory, imaging, and home sample kits
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
