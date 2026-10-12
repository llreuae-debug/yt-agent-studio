import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "YT Agent Studio — 11 Creator Skills & Deterministic Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#0c0d0e",
          color: "#f4f4f5",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255, 0, 51, 0.12) 0%, transparent 40%)",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#ff0033",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 900,
              boxShadow: "0 0 24px rgba(255, 0, 51, 0.4)",
            }}
          >
            ▶
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            YT Agent Studio
          </span>
          <span
            style={{
              marginLeft: "12px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "#1c1d20",
              border: "1px solid #2e3035",
              fontSize: "14px",
              color: "#a1a1aa",
              fontWeight: 600,
            }}
          >
            11 Skills & Tools
          </span>
        </div>

        {/* Center Main Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Write, Package & Audit
            <br />
            YouTube Videos with Data.
          </h1>
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#a1a1aa",
              maxWidth: "960px",
              margin: 0,
            }}
          >
            Deterministic scoring, dead-air cutting, chapter validation, title linting & retention diagnostics. Zero cloud storage.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {["Script Engine", "3-Word Thumbnails", "EDL Cuts", "Retention Analyzer", "21 Hook Formulas"].map(
            (pill) => (
              <div
                key={pill}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#e4e4e7",
                }}
              >
                {pill}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
