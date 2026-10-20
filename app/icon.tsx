import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const logoWidth = 396;
const logoHeight = 785;

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public/streamtrust.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  const height = 58;
  const width = Math.round((logoWidth / logoHeight) * height);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <img src={src} width={width} height={height} alt="" />
      </div>
    ),
    { ...size },
  );
}
