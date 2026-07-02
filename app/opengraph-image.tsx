import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const fontBold = readFileSync(
    join(process.cwd(), "fonts/NimbusSanL-Bol.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          backgroundColor: "#FAFAFA",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontFamily: "NimbusSans",
              fontWeight: 700,
              fontSize: 100,
              color: "#1A1A1A",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Anders Soelvsten Thomsen
          </span>
          <span
            style={{
              fontFamily: "NimbusSans",
              fontWeight: 700,
              fontSize: 14,
              color: "#1A1A1A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.4,
            }}
          >
            Stylist & Creative Director — London, UK
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "NimbusSans",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
