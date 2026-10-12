import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#0c0d0e",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff0033",
          fontWeight: 900,
          borderRadius: "6px",
          border: "1px solid #ff0033",
        }}
      >
        ▶
      </div>
    ),
    {
      ...size,
    }
  );
}
