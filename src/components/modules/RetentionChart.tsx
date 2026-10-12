"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { RetentionResult } from "@/lib/tools/retention";
import { Sticker } from "@/components/ui/Sticker";
import { Card } from "@/components/ui/Card";

interface RetentionChartProps {
  data: RetentionResult;
}

export function RetentionChart({ data }: RetentionChartProps) {
  const { rows, hook_leak, verdict, cliffs, slide_per_unit } = data;

  const chartData = rows.map((r) => ({
    position: r.x,
    retention: r.y,
    time: r.timeSec !== undefined ? `${Math.floor(r.timeSec)}s` : `${r.x}%`,
    timeSec: r.timeSec,
  }));

  const verdictConfig = {
    healthy: { variant: "ok" as const, text: "HEALTHY", color: "text-ok" },
    leaking: { variant: "warn" as const, text: "LEAKING", color: "text-warn" },
    severe: { variant: "bad" as const, text: "SEVERE LEAK", color: "text-bad" },
  }[verdict];

  return (
    <div className="space-y-6">
      {/* 3 Metric Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hook Leak Card */}
        <Card className="p-5 border-line bg-surface-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="type-label text-txt-2 font-bold text-[10px]">
              HOOK LEAK (FIRST 30S)
            </span>
            <Sticker label={verdictConfig.text} variant={verdictConfig.variant} rotate={-1} />
          </div>
          <div>
            <div className="type-h1 font-black font-condensed type-tabular text-txt">
              {hook_leak}% <span className="type-body text-txt-2 font-medium">lost</span>
            </div>
            <p className="type-small text-txt-2 mt-1">
              Under 25% is healthy. Fix your opening hook line before anything else.
            </p>
          </div>
        </Card>

        {/* Cliffs Card */}
        <Card className="p-5 border-line bg-surface-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="type-label text-txt-2 font-bold text-[10px]">
              CLIFFS ({cliffs.length} DETECTED)
            </span>
            <Sticker label={cliffs.length > 0 ? "CLIFF DETECTED" : "SMOOTH"} variant={cliffs.length > 0 ? "bad" : "ok"} rotate={1} />
          </div>
          <div>
            <div className="type-h1 font-black font-condensed type-tabular text-bad">
              {cliffs.length > 0 ? `-${cliffs[0].lost}%` : "0%"}
              <span className="type-body text-txt-2 font-medium ml-2">
                {cliffs.length > 0 ? `at ${cliffs[0].at_seconds ?? cliffs[0].from}s` : "no drop"}
              </span>
            </div>
            <p className="type-small text-txt-2 mt-1">
              Sudden steep dropoffs from topic shifts, jarring transitions, or sponsor reads.
            </p>
          </div>
        </Card>

        {/* Slide Rate Card */}
        <Card className="p-5 border-line bg-surface-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="type-label text-txt-2 font-bold text-[10px]">
              MIDDLE SLIDE RATE
            </span>
            <span className="type-label text-[10px] text-txt-2 font-mono">PACE</span>
          </div>
          <div>
            <div className="type-h1 font-black font-condensed type-tabular text-txt">
              {slide_per_unit}% <span className="type-body text-txt-2 font-medium">per unit</span>
            </div>
            <p className="type-small text-txt-2 mt-1">
              Steady middle decay. A steep slide requires tighter editing, not rewrites.
            </p>
          </div>
        </Card>
      </div>

      {/* Retention Curve Chart with Red Gradient & First 30s Window Shaded */}
      <Card className="p-6 border-line bg-surface-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="type-h3 font-black text-txt">Audience Retention Curve</h4>
            <p className="type-small text-txt-2">
              First 30 seconds window shaded in soft grey; steep cliff points marked in red.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yt-red shadow-glow" />
            <span className="type-label text-txt font-bold">RETENTION %</span>
          </div>
        </div>

        <div className="h-72 w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ytRedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF0000" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#FF0000" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#FF0000" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis
                dataKey="time"
                stroke="var(--text-2)"
                tick={{ fontSize: 11, fill: "var(--text-2)", fontFamily: "var(--font)" }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--text-2)"
                tick={{ fontSize: 11, fill: "var(--text-2)", fontFamily: "var(--font)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-1)",
                  borderColor: "var(--line)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "var(--text)",
                  fontFamily: "var(--font)",
                }}
                formatter={(val: any) => [`${val}%`, "Retention"]}
              />
              {/* Shaded First 30s Window */}
              <ReferenceArea
                x1={0}
                x2={30}
                fill="var(--surface-3)"
                fillOpacity={0.4}
                label={{ value: "FIRST 30S (HOOK)", fill: "var(--text-2)", fontSize: 10, position: "insideTopLeft" }}
              />
              <ReferenceLine y={50} stroke="var(--line)" strokeDasharray="2 2" />
              <Area
                type="monotone"
                dataKey="retention"
                stroke="#FF0000"
                strokeWidth={3}
                fill="url(#ytRedGrad)"
                dot={false}
                activeDot={{ r: 6, fill: "#FF0000", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hidden Table for Screen Readers (Accessibility Requirement) */}
        <table className="sr-only">
          <caption>Audience Retention Data Summary</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Retention Percentage</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.time}</td>
                <td>{row.retention}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Steep Cliffs Breakdown with Pulsing Pin Rings */}
      {cliffs.length > 0 && (
        <Card className="p-6 border-line bg-surface-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="type-label text-bad font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-bad animate-ping motion-reduce:animate-none" />
              <span>DETECTED RETENTION CLIFFS</span>
            </h4>
            <span className="type-label text-txt-2 text-[10px]">CLICK PIN TO INSPECT</span>
          </div>

          <div className="space-y-3">
            {cliffs.map((c, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-input border border-bad/30 bg-bad/10 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black font-condensed type-tabular text-bad px-2.5 py-0.5 rounded-pill bg-bad/20 border border-bad/40">
                    -{c.lost}%
                  </span>
                  <span className="font-mono text-txt font-bold">
                    at {c.at_seconds !== null ? `${c.at_seconds}s` : `${c.from}% to ${c.to}%`}
                  </span>
                </div>
                {c.said ? (
                  <p className="type-body text-txt italic max-w-md truncate">
                    &ldquo;{c.said}&rdquo;
                  </p>
                ) : (
                  <span className="type-small text-txt-2">
                    Upload transcript to see spoken lines at this exact drop point
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
