/* SVG interactive groups require ARIA roles; HTML buttons cannot be nested inside SVG. */
/* eslint-disable jsx-a11y/prefer-tag-over-role */
import { useState } from "react";
import { modules, nets } from "./project-data";
export type Mood = "happy" | "neutral" | "sad";
export type Readings = { soil: number; lux: number; temp: number; humidity: number };
export const defaultReadings: Readings = { soil: 68, lux: 14200, temp: 25.4, humidity: 54 };
export function Face({ mood = "happy" }: { mood?: Mood }) {
  const color = mood === "happy" ? "#bbf495" : mood === "neutral" ? "#f3c867" : "#fa8b80";
  return (
    <g className={`face face-${mood}`} style={{ color }}>
      <g className="eyes" fill="currentColor">
        <rect x="32" y="34" width="12" height="22" rx="6" />
        <rect x="76" y="34" width="12" height="22" rx="6" />
      </g>
      <path
        d={
          mood === "happy"
            ? "M 35 73 Q 60 104 85 73"
            : mood === "neutral"
              ? "M 38 80 L 82 80"
              : "M 35 89 Q 60 64 85 89"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="22" cy="66" r="6" fill="currentColor" opacity=".13" />
      <circle cx="98" cy="66" r="6" fill="currentColor" opacity=".13" />
    </g>
  );
}
export function Telemetry({
  values = defaultReadings,
  adc = false,
}: {
  values?: Readings;
  adc?: boolean;
}) {
  return (
    <g fill="#c6eef3" fontFamily="IBM Plex Mono, monospace" fontSize="8">
      <text x="7" y="14">
        SOIL: {values.soil}%
      </text>
      <text x="7" y="25">
        LUX: {values.lux}
      </text>
      <text x="7" y="36">
        TEMP: {values.temp.toFixed(1)}C
      </text>
      <text x="7" y="47">
        RH: {values.humidity}% 1013 hPa
      </text>
      {adc && (
        <text x="7" y="58">
          ADC: {(2.5 - values.soil * 0.013).toFixed(2)} V
        </text>
      )}
    </g>
  );
}
export function Board({ id, w, h, color }: { id: string; w: number; h: number; color: string }) {
  if (id === "DS1")
    return (
      <>
        <rect width={w} height={h} rx="13" fill={color} />
        <circle
          cx={w / 2}
          cy={h / 2}
          r={w * 0.47}
          fill="#0b2017"
          stroke="#17231c"
          strokeWidth="4"
        />
        <g transform={`translate(${w / 2 - 52},${h / 2 - 52}) scale(.87)`}>
          <Face />
        </g>
      </>
    );
  if (id === "DS2")
    return (
      <>
        <rect width={w} height={h} rx="4" fill={color} />
        <rect x="8" y="7" width={w - 16} height={h - 17} rx="2" fill="#09181c" />
        <g transform="translate(10,7)">
          <Telemetry />
        </g>
        <g fill="#d6b776">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={27 + i * 17} y={h - 5} width="7" height="6" />
          ))}
        </g>
      </>
    );
  if (id === "B1")
    return (
      <>
        <path d={`M0 0 H${w} V${h - 32} L${w / 2} ${h} L0 ${h - 32}Z`} fill={color} />
        <path
          d={`M9 53 H${w - 9} V${h - 42} L${w / 2} ${h - 16} L9 ${h - 42}Z`}
          stroke="#bbab77"
          fill="none"
          strokeWidth="2"
        />
        <rect x="18" y="12" width="28" height="23" fill="#111713" />
        <text x="20" y="27" fill="#ddd" fontSize="5">
          TLC555
        </text>
      </>
    );
  if (id === "BT1")
    return (
      <>
        <rect width={w} height={h} rx="8" fill="#193b29" />
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={9 + i * 48} y="8" width="42" height={h - 16} rx="13" fill="url(#battery)" />
            <text
              transform={`translate(${33 + i * 48},${h - 18}) rotate(-90)`}
              fontSize="10"
              fill="#cde1ce"
            >
              Li-ion 3.7V
            </text>
          </g>
        ))}
        <text x="7" y={h + 10} fontSize="7" fill="#526d56">
          2S · BMS PROTECTED
        </text>
      </>
    );
  return (
    <>
      <rect width={w} height={h} rx="5" fill={color} stroke="#ffffff" strokeOpacity=".2" />
      {[7, w - 7].map((x, i) => (
        <g key={i} fill="#d8b565">
          {Array.from({ length: id === "U1" ? 8 : 4 }, (_, j) => (
            <rect
              key={j}
              x={x - 3}
              y={14 + (j * (h - 22)) / (id === "U1" ? 8 : 4)}
              width="6"
              height="7"
              rx="1"
            />
          ))}
        </g>
      ))}
      <path
        d={`M17 20 H${w - 20} V${h - 20} H20 V32 H${w - 30}`}
        stroke="#cbd6ac"
        opacity=".5"
        strokeWidth="1"
        fill="none"
      />
      {id === "U1" ? (
        <>
          <rect x="18" y="33" width="43" height="44" rx="2" fill="#bec5c4" />
          <text x="22" y="55" fontSize="8" fill="#414945">
            ESP32
          </text>
          <text x="28" y="67" fontSize="7" fill="#414945">
            C3
          </text>
          <rect
            x="24"
            y={h - 15}
            width="32"
            height="19"
            rx="5"
            fill="#d9dfdd"
            stroke="#5b615e"
            strokeWidth="3"
          />
          <rect x="21" y="5" width="28" height="12" rx="2" fill="#e3d8bb" />
        </>
      ) : id === "U2" ? (
        <>
          <rect x="27" y="12" width="37" height="35" rx="4" fill="#586159" />
          <text x="34" y="34" fill="#cfd2cc" fontSize="11">
            4R7
          </text>
          <rect x="14" y="48" width="20" height="10" fill="#181f1b" />
        </>
      ) : (
        <>
          <rect
            x="24"
            y="18"
            width="27"
            height="21"
            rx="2"
            fill={id === "B3" ? "#e4ded2" : "#c5c9c4"}
          />
          <circle cx="59" cy="30" r="7" fill="#202923" />
          <text x="13" y={h - 8} fontSize="6" fill="#eee">
            {id === "B3" ? "GY-302 / BH1750" : "AHT20 + BMP280"}
          </text>
        </>
      )}
    </>
  );
}
export default function Hardware({
  progress,
  filter,
  onSelect,
}: {
  progress: number;
  filter: string;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState("");
  const e = Math.min(1, Math.max(0, (progress - 0.13) / 0.58));
  const reveal = Math.min(1, Math.max(0, (progress - 0.7) / 0.17));
  const pos = (id: string) => {
    const m = modules.find((m) => m.id === id)!;
    const initial =
      id === "DS1" ? { x: 338, y: 150 } : id === "DS2" ? { x: 338, y: 297 } : { x: 362, y: 232 };
    return { x: initial.x + (m.x - initial.x) * e, y: initial.y + (m.y - initial.y) * e };
  };
  return (
    <svg
      className="hardware-svg"
      viewBox="0 0 760 620"
      role="group"
      aria-label="Illustrative Gardening Buddy hardware assembly. Scroll to separate its eight modules."
    >
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="1" y2=".3">
          <stop stopColor="#ffffff" />
          <stop offset=".7" stopColor="#e6e9df" />
          <stop offset="1" stopColor="#ced5c8" />
        </linearGradient>
        <linearGradient id="side">
          <stop stopColor="#c2cbbb" />
          <stop offset="1" stopColor="#94a58d" />
        </linearGradient>
        <linearGradient id="battery">
          <stop stopColor="#426945" />
          <stop offset=".5" stopColor="#6b8e5e" />
          <stop offset="1" stopColor="#2a492e" />
        </linearGradient>
        <filter id="product-shadow" x="-100%" y="-50%" width="300%" height="250%">
          <feDropShadow dx="5" dy="17" stdDeviation="13" floodColor="#294831" floodOpacity=".14" />
        </filter>
        <filter id="wire-glow">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <ellipse
        cx="395"
        cy="570"
        rx={115 + e * 110}
        ry="15"
        fill="#55754c"
        opacity={0.09 - e * 0.05}
      />
      <g
        transform={`translate(${e * 115},${-e * 37})`}
        opacity={1 - e * 0.72}
        filter="url(#product-shadow)"
      >
        <path
          d="M333 126 L371 111 L492 125 Q503 126 503 141 V356 Q501 374 487 378 L448 390 L332 372Z"
          fill="url(#side)"
        />
        <path d="M417 363 L449 370 V501 L417 558 L406 546 V391Z" fill="#a7b79e" />
      </g>
      <g
        transform={`translate(${-e * 160},${e * 5})`}
        opacity={1 - e * 0.78}
        filter="url(#product-shadow)"
      >
        <path
          d="M317 142 Q317 128 331 128 H463 Q479 128 479 145 V369 Q479 386 462 386 H333 Q317 385 317 368Z"
          fill="url(#shell)"
        />
        <path d="M359 382 H429 V502 L394 560 L359 502Z" fill="url(#shell)" />
        <path d="M367 397 V498 L393 542" fill="none" stroke="#d7ded1" strokeWidth="2" />
        <g fill="#bac4b4">
          {[
            [329, 141],
            [465, 141],
            [329, 371],
            [465, 371],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3" />
              <path d={`M${x - 1.5} ${y} h3`} stroke="#899981" strokeWidth=".6" />
            </g>
          ))}
        </g>
        <rect x="384" y="348" width="29" height="5" rx="1" fill="#29442b" />
        <text x="363" y="366" fontFamily="Manrope" fill="#7c8f72" fontSize="7" letterSpacing="1.3">
          GARDENING BUDDY
        </text>
      </g>
      <g opacity={reveal} className="wire-layer">
        {nets.map((net, i) =>
          net.to.map((id, j) => {
            const from = pos(net.from),
              to = pos(id);
            const fm = modules.find((m) => m.id === net.from)!;
            const x1 = from.x + fm.w,
              y1 = from.y + 12 + (i % 8) * 9,
              x2 = to.x,
              y2 = to.y + 9 + (i % 5) * 8;
            const mid = (x1 + x2) / 2 + (i - 5) * 5;
            const d = `M${x1},${y1} H${mid} V${y2} H${x2}`;
            const active = filter === "all" || filter === net.group;
            return (
              <g key={`${i}-${j}`} opacity={active ? 1 : 0.07}>
                <path
                  d={d}
                  fill="none"
                  stroke={net.color}
                  strokeWidth="3"
                  opacity=".2"
                  filter="url(#wire-glow)"
                />
                <path
                  className={active ? "flow-wire" : ""}
                  d={d}
                  fill="none"
                  stroke={net.color}
                  strokeWidth="1.8"
                  strokeDasharray="4 5"
                />
                <circle cx={x1} cy={y1} r="2.5" fill={net.color} />
                <circle cx={x2} cy={y2} r="2.5" fill={net.color} />
                <title>
                  {net.name}: {net.source} → {net.dest}
                </title>
              </g>
            );
          }),
        )}
      </g>
      {modules.map((m) => {
        const p = pos(m.id),
          display = m.id.startsWith("DS");
        return (
          <g
            key={m.id}
            transform={`translate(${p.x},${p.y})`}
            opacity={display ? 1 : e}
            className="hardware-module"
            role="button"
            tabIndex={e > 0.4 ? 0 : -1}
            aria-label={`${m.id}: ${m.part}. Open component details.`}
            onClick={() => onSelect(m.id)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                onSelect(m.id);
              }
            }}
            onMouseEnter={() => setHover(m.id)}
            onMouseLeave={() => setHover("")}
            style={{
              filter:
                hover === m.id
                  ? "drop-shadow(0 0 7px #7aaf7c)"
                  : "drop-shadow(2px 5px 4px #203a2c22)",
            }}
          >
            <title>
              {m.id} · {m.part}
            </title>
            <Board {...m} />
            <g opacity={e} fontFamily="IBM Plex Mono, monospace">
              <text x="0" y={m.h + 23} fill="#234631" fontSize="11" fontWeight="500">
                {m.id}
              </text>
              <text x="0" y={m.h + 36} fill="#7b8b7a" fontSize="7">
                {m.part}
              </text>
            </g>
          </g>
        );
      })}
      <g opacity={1 - e} fill="#6e8469" fontFamily="IBM Plex Mono" fontSize="8">
        <path d="M492 152 H559" stroke="#a9b7a0" />
        <text x="567" y="151">
          1.28″ TFT
        </text>
        <text x="567" y="164" fill="#9cab93">
          A little personality.
        </text>
        <path d="M480 317 H548" stroke="#a9b7a0" />
        <text x="556" y="316">
          0.96″ OLED
        </text>
        <text x="556" y="329" fill="#9cab93">
          A lot of insight.
        </text>
      </g>
    </svg>
  );
}
