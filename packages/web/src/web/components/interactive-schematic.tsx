/* Interactive SVG circuit schematic uses ARIA roles for keyboard/screen-reader focusable circuit parts and wires. */
/* eslint-disable jsx-a11y/prefer-tag-over-role */
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Maximize2,
  Pause,
  Play,
  Power,
  RotateCcw,
  Zap,
  Cpu,
  Cable,
} from "lucide-react";
import { modules, nets, datasheets, type ElectricalNet, type HardwareModule } from "./project-data";

const S = 4.7;
const ox = 5;
const oy = 6;
const sx = (gx: number) => Number(((gx - ox) * S).toFixed(1));
const sy = (gy: number) => Number(((gy - oy) * S).toFixed(1));

function polylineToPath(pts: [number, number][]) {
  return pts.map(([gx, gy], i) => `${i === 0 ? "M" : "L"} ${sx(gx)} ${sy(gy)}`).join(" ");
}

interface PinDef {
  name: string;
  side: "L" | "R" | "B";
  gx: number;
  gy: number;
  bx: number;
  by: number;
}

interface BoxDef {
  id: string;
  ref: string;
  title: string;
  cx: number;
  cy: number;
  wh: number;
  hh: number;
  imgW: number;
  imgH: number;
  imgDx?: number;
  imgDy?: number;
  subNote?: string;
  subColor?: string;
  topNote?: [string, string];
  pins: PinDef[];
}

function makePin(
  name: string,
  side: "L" | "R" | "B",
  cx: number,
  cy: number,
  wh: number,
  hh: number,
  offset: number,
): PinDef {
  if (side === "L") {
    return { name, side, gx: cx - wh - 3, gy: cy - offset, bx: cx - wh, by: cy - offset };
  }
  if (side === "R") {
    return { name, side, gx: cx + wh + 3, gy: cy - offset, bx: cx + wh, by: cy - offset };
  }
  return { name, side, gx: cx + offset, gy: cy + hh + 3, bx: cx + offset, by: cy + hh };
}

const BOXES: BoxDef[] = [
  {
    id: "BT1",
    ref: "BT1",
    title: "4xAA Battery (6.0V)",
    cx: 58,
    cy: 26,
    wh: 12,
    hh: 8,
    imgW: 16.5,
    imgH: 13.5,
    subNote: "4 × 1.5V AA = 6.0V",
    pins: [
      makePin("-", "L", 58, 26, 12, 8, -2),
      makePin("+", "R", 58, 26, 12, 8, 2),
    ],
  },
  {
    id: "SW1",
    ref: "SW1",
    title: "Power Switch",
    cx: 100,
    cy: 26,
    wh: 10,
    hh: 8,
    imgW: 11.5,
    imgH: 12.8,
    subNote: "Click to toggle ON/OFF",
    subColor: "#047857",
    pins: [
      makePin("IN", "L", 100, 26, 10, 8, 2),
      makePin("OUT", "R", 100, 26, 10, 8, 2),
    ],
  },
  {
    id: "U2",
    ref: "U2",
    title: "DD4012SA 3.3V Buck",
    cx: 146,
    cy: 26,
    wh: 13,
    hh: 8,
    imgW: 15.8,
    imgH: 9.6,
    imgDy: -1.6,
    subNote: "3.3V Out → Peripherals Only",
    subColor: "#b91c1c",
    pins: [
      makePin("VI+", "L", 146, 26, 13, 8, 2),
      makePin("VO", "R", 146, 26, 13, 8, 2),
      makePin("GND", "B", 146, 26, 13, 8, 0),
    ],
  },
  {
    id: "B1",
    ref: "B1",
    title: "Capacitive Soil v2.0",
    cx: 46,
    cy: 58,
    wh: 18,
    hh: 7,
    imgW: 23.0,
    imgH: 11.0,
    imgDx: -0.3,
    pins: [
      makePin("VCC", "L", 46, 58, 18, 7, 3),
      makePin("GND", "L", 46, 58, 18, 7, -3),
      makePin("AOUT", "R", 46, 58, 18, 7, 0),
    ],
  },
  {
    id: "B2",
    ref: "B2",
    title: "AHT20+BMP280 (I²C)",
    cx: 46,
    cy: 86,
    wh: 16,
    hh: 9,
    imgW: 17.0,
    imgH: 15.2,
    pins: [
      makePin("VDD", "L", 46, 86, 16, 9, 4),
      makePin("GND", "L", 46, 86, 16, 9, -4),
      makePin("SDA", "R", 46, 86, 16, 9, 4),
      makePin("SCL", "R", 46, 86, 16, 9, -4),
    ],
  },
  {
    id: "B3",
    ref: "B3",
    title: "BH1750 Light (0x23)",
    cx: 46,
    cy: 118,
    wh: 16,
    hh: 10,
    imgW: 14.5,
    imgH: 17.2,
    imgDx: 1.0,
    pins: [
      makePin("VCC", "L", 46, 118, 16, 10, 6),
      makePin("ADDR", "L", 46, 118, 16, 10, 0),
      makePin("GND", "L", 46, 118, 16, 10, -6),
      makePin("SDA", "R", 46, 118, 16, 10, 4),
      makePin("SCL", "R", 46, 118, 16, 10, -4),
    ],
  },
  {
    id: "U1",
    ref: "U1",
    title: "ESP32-C3 SuperMini",
    cx: 118,
    cy: 94,
    wh: 19,
    hh: 27,
    imgW: 19.2,
    imgH: 35.0,
    imgDx: -0.4,
    imgDy: 2.2,
    topNote: ["USB-C 5V Powered", "(Isolated from +3V3)"],
    pins: [
      makePin("GPIO0", "L", 118, 94, 19, 27, 18),
      makePin("GPIO2", "L", 118, 94, 19, 27, 8),
      makePin("GPIO9", "L", 118, 94, 19, 27, -8),
      makePin("GPIO4", "R", 118, 94, 19, 27, 21),
      makePin("GPIO5", "R", 118, 94, 19, 27, 14),
      makePin("GPIO10", "R", 118, 94, 19, 27, 7),
      makePin("GPIO6", "R", 118, 94, 19, 27, 0),
      makePin("GPIO7", "R", 118, 94, 19, 27, -7),
      makePin("GPIO1", "R", 118, 94, 19, 27, -14),
      makePin("GPIO3", "R", 118, 94, 19, 27, -21),
      makePin("GND", "B", 118, 94, 19, 27, 0),
    ],
  },
  {
    id: "DS1",
    ref: "DS1",
    title: '1.28" Round GC9A01',
    cx: 208,
    cy: 68,
    wh: 18,
    hh: 14,
    imgW: 21.8,
    imgH: 24.0,
    imgDx: 0.3,
    pins: [
      makePin("SCL", "L", 208, 68, 18, 14, 10),
      makePin("SDA", "L", 208, 68, 18, 14, 5),
      makePin("RST", "L", 208, 68, 18, 14, 0),
      makePin("DC", "L", 208, 68, 18, 14, -5),
      makePin("CS", "L", 208, 68, 18, 14, -10),
      makePin("VCC", "R", 208, 68, 18, 14, 6),
      makePin("GND", "R", 208, 68, 18, 14, -6),
    ],
  },
  {
    id: "DS2",
    ref: "DS2",
    title: '2.0" ST7789 (GMT020)',
    cx: 208,
    cy: 114,
    wh: 18,
    hh: 15,
    imgW: 21.8,
    imgH: 26.0,
    imgDx: 0.3,
    pins: [
      makePin("SCL", "L", 208, 114, 18, 15, 10),
      makePin("SDA", "L", 208, 114, 18, 15, 5),
      makePin("RST", "L", 208, 114, 18, 15, 0),
      makePin("DC", "L", 208, 114, 18, 15, -5),
      makePin("CS", "L", 208, 114, 18, 15, -10),
      makePin("VCC", "R", 208, 114, 18, 15, 8),
      makePin("BLK", "R", 208, 114, 18, 15, 2),
      makePin("GND", "R", 208, 114, 18, 15, -8),
    ],
  },
];

interface WireRoute {
  netId: string;
  segments: [number, number][][];
  pulsePaths: { pts: [number, number][]; dur: number; count: number }[];
  label?: { text: string; gx: number; gy: number };
  junctions?: [number, number][];
}

// Exact 1-to-1 KiCad 10 orthogonal wire routes + directed current/signal pulse paths!
const WIRE_ROUTES: WireRoute[] = [
  {
    netId: "BAT_6V",
    segments: [[[73, 24], [87, 24]]],
    pulsePaths: [{ pts: [[73, 24], [87, 24]], dur: 1.4, count: 2 }],
    label: { text: "BAT_6V", gx: 74.5, gy: 22.8 },
  },
  {
    netId: "SW_6V",
    segments: [[[113, 24], [130, 24]]],
    pulsePaths: [{ pts: [[113, 24], [130, 24]], dur: 1.4, count: 2 }],
    label: { text: "SW_6V", gx: 116.5, gy: 22.8 },
  },
  {
    netId: "+3V3",
    segments: [
      [[162, 24], [174, 24], [174, 43]],
      [[174, 21], [174, 24]],
      [[18, 43], [234, 43]],
      [[18, 43], [18, 112]],
      [[18, 55], [25, 55]],
      [[18, 82], [27, 82]],
      [[18, 112], [27, 112]],
      [[234, 43], [234, 112]],
      [[229, 62], [234, 62]],
      [[229, 106], [234, 106]],
      [[229, 112], [234, 112]],
    ],
    pulsePaths: [
      { pts: [[162, 24], [174, 24], [174, 43], [18, 43], [18, 112], [27, 112]], dur: 4.2, count: 3 },
      { pts: [[162, 24], [174, 24], [174, 43], [234, 43], [234, 112], [229, 112]], dur: 3.4, count: 3 },
    ],
    label: { text: "+3V3", gx: 164, gy: 22.8 },
    junctions: [
      [174, 24],
      [174, 43],
      [18, 55],
      [18, 82],
      [234, 62],
      [234, 106],
    ],
  },
  {
    netId: "GND",
    segments: [
      [[12, 138], [240, 138]],
      [[118, 124], [118, 141]],
      [[12, 28], [12, 138]],
      [[12, 28], [43, 28]],
      [[12, 39], [146, 39], [146, 37]],
      [[12, 61], [25, 61]],
      [[12, 90], [27, 90]],
      [[12, 118], [27, 118]],
      [[12, 124], [27, 124]],
      [[240, 74], [240, 138]],
      [[229, 74], [240, 74]],
      [[229, 122], [240, 122]],
    ],
    pulsePaths: [
      { pts: [[229, 74], [240, 74], [240, 138], [12, 138], [12, 28], [43, 28]], dur: 6.2, count: 3 },
      { pts: [[118, 124], [118, 138], [12, 138], [12, 28], [43, 28]], dur: 4.8, count: 2 },
    ],
    junctions: [
      [118, 138],
      [12, 39],
      [12, 61],
      [12, 90],
      [12, 118],
      [12, 124],
      [240, 122],
    ],
  },
  {
    netId: "GPIO0",
    segments: [[[67, 58], [85, 58], [85, 76], [96, 76]]],
    pulsePaths: [{ pts: [[67, 58], [85, 58], [85, 76], [96, 76]], dur: 2.0, count: 2 }],
    label: { text: "GPIO0 (SOIL)", gx: 68.5, gy: 56.8 },
  },
  {
    netId: "GPIO2",
    segments: [
      [[65, 82], [73, 82], [73, 114], [65, 114]],
      [[73, 86], [96, 86]],
    ],
    pulsePaths: [
      { pts: [[65, 82], [73, 82], [73, 86], [96, 86]], dur: 1.9, count: 2 },
      { pts: [[65, 114], [73, 114], [73, 86], [96, 86]], dur: 2.3, count: 2 },
    ],
    label: { text: "GPIO2 (SDA)", gx: 79.5, gy: 84.8 },
    junctions: [[73, 86]],
  },
  {
    netId: "GPIO9",
    segments: [
      [[65, 90], [78, 90], [78, 122], [65, 122]],
      [[78, 102], [96, 102]],
    ],
    pulsePaths: [
      { pts: [[96, 102], [78, 102], [78, 90], [65, 90]], dur: 1.9, count: 2 },
      { pts: [[96, 102], [78, 102], [78, 122], [65, 122]], dur: 2.1, count: 2 },
    ],
    label: { text: "GPIO9 (SCL)", gx: 79.5, gy: 100.8 },
    junctions: [[78, 102]],
  },
  {
    netId: "GPIO4",
    segments: [
      [[140, 73], [165, 73]],
      [[165, 58], [165, 104]],
      [[165, 58], [187, 58]],
      [[165, 104], [187, 104]],
    ],
    pulsePaths: [
      { pts: [[140, 73], [165, 73], [165, 58], [187, 58]], dur: 1.6, count: 2 },
      { pts: [[140, 73], [165, 73], [165, 104], [187, 104]], dur: 1.9, count: 2 },
    ],
    label: { text: "GPIO4 (SCK)", gx: 141.5, gy: 71.8 },
    junctions: [[165, 73]],
  },
  {
    netId: "GPIO5",
    segments: [
      [[140, 80], [169, 80]],
      [[169, 63], [169, 109]],
      [[169, 63], [187, 63]],
      [[169, 109], [187, 109]],
    ],
    pulsePaths: [
      { pts: [[140, 80], [169, 80], [169, 63], [187, 63]], dur: 1.5, count: 2 },
      { pts: [[140, 80], [169, 80], [169, 109], [187, 109]], dur: 1.8, count: 2 },
    ],
    label: { text: "GPIO5 (MOSI)", gx: 141.5, gy: 78.8 },
    junctions: [[169, 80]],
  },
  {
    netId: "GPIO10",
    segments: [
      [[140, 87], [173, 87]],
      [[173, 68], [173, 114]],
      [[173, 68], [187, 68]],
      [[173, 114], [187, 114]],
    ],
    pulsePaths: [
      { pts: [[140, 87], [173, 87], [173, 68], [187, 68]], dur: 2.2, count: 1 },
      { pts: [[140, 87], [173, 87], [173, 114], [187, 114]], dur: 2.5, count: 1 },
    ],
    label: { text: "GPIO10 (RST)", gx: 141.5, gy: 85.8 },
    junctions: [[173, 87]],
  },
  {
    netId: "GPIO6",
    segments: [[[140, 94], [177, 94], [177, 73], [187, 73]]],
    pulsePaths: [{ pts: [[140, 94], [177, 94], [177, 73], [187, 73]], dur: 1.7, count: 2 }],
    label: { text: "GPIO6 (RND_DC)", gx: 141.5, gy: 92.8 },
  },
  {
    netId: "GPIO7",
    segments: [[[140, 101], [181, 101], [181, 78], [187, 78]]],
    pulsePaths: [{ pts: [[140, 101], [181, 101], [181, 78], [187, 78]], dur: 1.9, count: 2 }],
    label: { text: "GPIO7 (RND_CS)", gx: 141.5, gy: 99.8 },
  },
  {
    netId: "GPIO1",
    segments: [[[140, 108], [177, 108], [177, 119], [187, 119]]],
    pulsePaths: [{ pts: [[140, 108], [177, 108], [177, 119], [187, 119]], dur: 1.7, count: 2 }],
    label: { text: "GPIO1 (RECT_DC)", gx: 141.5, gy: 106.8 },
  },
  {
    netId: "GPIO3",
    segments: [[[140, 115], [181, 115], [181, 124], [187, 124]]],
    pulsePaths: [{ pts: [[140, 115], [181, 115], [181, 124], [187, 124]], dur: 1.9, count: 2 }],
    label: { text: "GPIO3 (RECT_CS)", gx: 141.5, gy: 113.8 },
  },
];

type InspectTarget = { kind: "part"; id: string } | { kind: "net"; id: string } | null;

export default function InteractiveSchematic({ onOpenLightbox }: { onOpenLightbox: () => void }) {
  const [busFilter, setBusFilter] = useState<"all" | "power" | "i2c" | "spi" | "adc">("all");
  const [switchOn, setSwitchOn] = useState(true);
  const [flowPlaying, setFlowPlaying] = useState(true);
  const [hovered, setHovered] = useState<InspectTarget>(null);
  const [pinned, setPinned] = useState<InspectTarget>(null);

  const activeTarget = hovered ?? pinned;

  const selectedModule: HardwareModule | undefined =
    activeTarget?.kind === "part" ? modules.find((m) => m.id === activeTarget.id) : undefined;
  const selectedNet: ElectricalNet | undefined =
    activeTarget?.kind === "net" ? nets.find((n) => n.id === activeTarget.id) : undefined;

  const isNetConnectedToModule = (net: ElectricalNet, modId: string) =>
    net.from === modId || net.to.includes(modId);

  const isNetHighlighted = (net: ElectricalNet) => {
    if (busFilter !== "all" && net.group !== busFilter) return false;
    if (!activeTarget) return true;
    if (activeTarget.kind === "net") return activeTarget.id === net.id;
    return isNetConnectedToModule(net, activeTarget.id);
  };

  const isModuleHighlighted = (modId: string) => {
    if (!activeTarget) {
      if (busFilter === "all") return true;
      return nets.some((n) => n.group === busFilter && isNetConnectedToModule(n, modId));
    }
    if (activeTarget.kind === "part") return activeTarget.id === modId;
    const net = nets.find((n) => n.id === activeTarget.id);
    return net ? isNetConnectedToModule(net, modId) : false;
  };

  const isModulePowered = (modId: string) => {
    if (modId === "U1" || modId === "BT1" || modId === "SW1") return true;
    return switchOn;
  };

  return (
    <div className="isch-shell">
      {/* Top Interactive Controls Toolbar */}
      <div className="isch-toolbar">
        <div className="isch-bus-pills" role="group" aria-label="Filter schematic buses">
          {(
            [
              ["all", "All 14 Nets"],
              ["power", "Power · 6V / +3V3 / GND"],
              ["i2c", "I²C · GPIO2 / GPIO9"],
              ["spi", "Dual SPI · 7 Nets"],
              ["adc", "Soil ADC · GPIO0"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`isch-pill ${busFilter === id ? "active" : ""}`}
              aria-pressed={busFilter === id}
              onClick={() => setBusFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="isch-actions">
          <button
            type="button"
            className={`isch-toggle ${switchOn ? "on" : "off"}`}
            onClick={() => setSwitchOn((v) => !v)}
            aria-pressed={switchOn}
            title="Toggle physical power switch SW1 between 4xAA 6V battery and DD4012SA 3.3V buck"
          >
            <Power size={14} />
            <span>SW1 Power: {switchOn ? "ON (+3.3V)" : "OFF (0V)"}</span>
          </button>

          <button
            type="button"
            className="isch-icon-btn"
            onClick={() => setFlowPlaying((v) => !v)}
            aria-label={flowPlaying ? "Pause current flow animation" : "Resume current flow animation"}
            title={flowPlaying ? "Pause current flow" : "Play current flow"}
          >
            {flowPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{flowPlaying ? "Flow Live" : "Paused"}</span>
          </button>

          {(pinned || busFilter !== "all" || !switchOn) && (
            <button
              type="button"
              className="isch-icon-btn"
              onClick={() => {
                setPinned(null);
                setHovered(null);
                setBusFilter("all");
                setSwitchOn(true);
                setFlowPlaying(true);
              }}
              title="Reset schematic view"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          <button type="button" className="isch-icon-btn" onClick={onOpenLightbox}>
            <Maximize2 size={14} />
            <span>Full Drawing</span>
          </button>
        </div>
      </div>

      {/* Main Split Stage: Interactive SVG Circuit + Live Inspector HUD */}
      <div className="isch-grid">
        <div className="isch-canvas-wrap">
          <div className="isch-status-bar">
            <span className={`isch-led ${switchOn ? "live" : "off"}`}>
              <i />
              PERIPHERAL +3V3 RAIL: {switchOn ? "3.30 V ACTIVE" : "0.00 V CUTOFF (SW1 OPEN)"}
            </span>
            <span className="isch-led usb">
              <i />
              ESP32-C3 (U1): USB-C 5V ISOLATED
            </span>
            <span className="isch-hint">Hover or tap any component or wire to inspect</span>
          </div>

          <svg
            className="isch-svg"
            viewBox="0 0 1150 676"
            role="img"
            aria-label="Interactive Garden Buddy KiCad 10 hardware schematic with animated current flow across 9 components and 14 nets."
          >
            <defs>
              <pattern id="ischGrid" width="23.5" height="23.5" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.9" fill="#cbd5e1" opacity="0.55" />
              </pattern>
              <filter id="ischGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="ischPartShadow" x="-15%" y="-15%" width="130%" height="135%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#002b5c" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* Subtle KiCad dot grid background */}
            <rect width="1150" height="676" fill="#fcfefd" />
            <rect width="1150" height="676" fill="url(#ischGrid)" />

            {/* Power Symbols (+3V3 top, GND bottom) */}
            <g opacity={switchOn ? 1 : 0.35}>
              <path
                d={`M ${sx(174)} ${sy(21)} L ${sx(174)} ${sy(18.6)} M ${sx(172.8)} ${sy(20)} L ${sx(174)} ${sy(18.6)} L ${sx(175.2)} ${sy(20)}`}
                fill="none"
                stroke="#b91c1c"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x={sx(174)}
                y={sy(16.6)}
                textAnchor="middle"
                className="isch-pwr-lbl"
                fill="#002b5c"
              >
                +3V3
              </text>
            </g>
            <g>
              <path
                d={`M ${sx(118)} ${sy(141)} L ${sx(118)} ${sy(143.2)} M ${sx(115.6)} ${sy(143.2)} L ${sx(120.4)} ${sy(143.2)} L ${sx(118)} ${sy(145.6)} Z`}
                fill="none"
                stroke="#991b1b"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <text
                x={sx(118)}
                y={sy(148.5)}
                textAnchor="middle"
                className="isch-pwr-lbl"
                fill="#002b5c"
              >
                GND
              </text>
            </g>

            {/* ALL 14 INTERACTIVE WIRES + CURRENT FLOW PARTICLES */}
            <g className="isch-wires">
              {WIRE_ROUTES.map((route) => {
                const net = nets.find((n) => n.id === route.netId)!;
                const highlighted = isNetHighlighted(net);
                const energized = !net.needsSwitchOn || switchOn;
                const isDirectlySelected =
                  activeTarget?.kind === "net" && activeTarget.id === net.id;
                const wireColor = !energized
                  ? "#94a3b8"
                  : activeTarget || busFilter !== "all"
                    ? net.color
                    : "#15803d";
                const strokeW = isDirectlySelected ? 3.8 : highlighted ? 2.4 : 1.7;
                const opacity = highlighted ? (energized ? 1 : 0.42) : 0.14;

                return (
                  <g
                    key={route.netId}
                    className="isch-wire-group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Wire ${net.name}: ${net.source} to ${net.dest}`}
                    onMouseEnter={() => setHovered({ kind: "net", id: net.id })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() =>
                      setPinned((prev) =>
                        prev?.kind === "net" && prev.id === net.id
                          ? null
                          : { kind: "net", id: net.id },
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPinned((prev) =>
                          prev?.kind === "net" && prev.id === net.id
                            ? null
                            : { kind: "net", id: net.id },
                        );
                      }
                    }}
                  >
                    {/* Base + glow wires */}
                    {route.segments.map((seg, idx) => {
                      const d = polylineToPath(seg);
                      return (
                        <g key={idx}>
                          {/* Generous invisible hit area for effortless wire hover/tap */}
                          <path d={d} fill="none" stroke="transparent" strokeWidth="14" />
                          {(isDirectlySelected || (highlighted && energized && activeTarget)) && (
                            <path
                              d={d}
                              fill="none"
                              stroke={net.color}
                              strokeWidth="6"
                              opacity="0.24"
                              filter="url(#ischGlow)"
                            />
                          )}
                          <path
                            d={d}
                            fill="none"
                            stroke={wireColor}
                            strokeWidth={strokeW}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={opacity}
                          />
                          {/* Animated subtle directional dashes */}
                          {flowPlaying && energized && highlighted && (
                            <path
                              d={d}
                              fill="none"
                              stroke={net.color}
                              strokeWidth={isDirectlySelected ? 2.6 : 1.7}
                              strokeDasharray="5 12"
                              className="isch-flow-dash"
                              opacity={isDirectlySelected ? 0.95 : 0.55}
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Junction Dots */}
                    {route.junctions?.map(([jx, jy], j) => (
                      <circle
                        key={j}
                        cx={sx(jx)}
                        cy={sy(jy)}
                        r={isDirectlySelected ? 4.4 : 3.4}
                        fill={wireColor}
                        opacity={opacity}
                      />
                    ))}

                    {/* Animated Glowing Current / Signal Pulses */}
                    {flowPlaying &&
                      energized &&
                      highlighted &&
                      route.pulsePaths.map((pp, pIdx) => {
                        const d = polylineToPath(pp.pts);
                        return Array.from({ length: pp.count }, (_, cIdx) => {
                          const begin = `${((pp.dur / pp.count) * cIdx).toFixed(2)}s`;
                          return (
                            <circle
                              key={`${pIdx}-${cIdx}`}
                              r={isDirectlySelected ? 4.4 : 3.2}
                              fill={net.color}
                              stroke="#ffffff"
                              strokeWidth="1.2"
                              filter="url(#ischGlow)"
                            >
                              <animateMotion
                                dur={`${pp.dur}s`}
                                begin={begin}
                                repeatCount="indefinite"
                                path={d}
                              />
                            </circle>
                          );
                        });
                      })}

                    {/* Wire Net Label */}
                    {route.label && (
                      <text
                        x={sx(route.label.gx)}
                        y={sy(route.label.gy)}
                        className={`isch-net-lbl ${isDirectlySelected ? "active" : ""}`}
                        fill={
                          isDirectlySelected
                            ? net.color
                            : highlighted
                              ? "#0f172a"
                              : "#94a3b8"
                        }
                        opacity={highlighted ? 1 : 0.28}
                      >
                        {route.label.text}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ALL 9 INTERACTIVE HARDWARE COMPONENT BLOCKS WITH REAL PHOTOS */}
            <g className="isch-parts">
              {BOXES.map((box) => {
                const mod = modules.find((m) => m.id === box.id)!;
                const highlighted = isModuleHighlighted(box.id);
                const powered = isModulePowered(box.id);
                const isSelected = activeTarget?.kind === "part" && activeTarget.id === box.id;

                const x0 = sx(box.cx - box.wh);
                const y0 = sy(box.cy - box.hh);
                const bw = box.wh * 2 * S;
                const bh = box.hh * 2 * S;
                const imgW = box.imgW * S;
                const imgH = box.imgH * S;
                const imgX = sx(box.cx + (box.imgDx ?? 0)) - imgW / 2;
                const imgY = sy(box.cy + (box.imgDy ?? 0)) - imgH / 2;

                return (
                  <g
                    key={box.id}
                    className={`isch-part-group ${isSelected ? "selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${mod.id}: ${mod.part}. Inspect component or toggle switch.`}
                    opacity={highlighted ? (powered ? 1 : 0.56) : 0.28}
                    onMouseEnter={() => setHovered({ kind: "part", id: box.id })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      if (box.id === "SW1") {
                        setSwitchOn((v) => !v);
                      }
                      setPinned((prev) =>
                        prev?.kind === "part" && prev.id === box.id
                          ? null
                          : { kind: "part", id: box.id },
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (box.id === "SW1") setSwitchOn((v) => !v);
                        setPinned((prev) =>
                          prev?.kind === "part" && prev.id === box.id
                            ? null
                            : { kind: "part", id: box.id },
                        );
                      }
                    }}
                  >
                    {/* Component Reference & Name above box */}
                    <text x={x0} y={y0 - 7} className="isch-ref">
                      {box.ref}
                    </text>
                    <text x={x0 + (box.ref.length >= 3 ? 34 : 26)} y={y0 - 7} className="isch-val">
                      {box.title}
                    </text>

                    {/* Pin stubs + pin names */}
                    {box.pins.map((p) => (
                      <g key={p.name}>
                        <line
                          x1={sx(p.gx)}
                          y1={sy(p.gy)}
                          x2={sx(p.bx)}
                          y2={sy(p.by)}
                          stroke={isSelected ? "#047857" : "#991b1b"}
                          strokeWidth="1.7"
                        />
                      </g>
                    ))}

                    {/* KiCad Cream Symbol Body */}
                    <rect
                      x={x0}
                      y={y0}
                      width={bw}
                      height={bh}
                      rx="5"
                      fill={isSelected ? "#f0fdf4" : "#fefce8"}
                      stroke={isSelected ? "#047857" : "#991b1b"}
                      strokeWidth={isSelected ? 2.8 : 1.75}
                      filter={isSelected ? "url(#ischPartShadow)" : undefined}
                    />

                    {/* Pin labels cleanly inside edges */}
                    {box.pins.map((p) => {
                      if (p.side === "L") {
                        return (
                          <text
                            key={p.name}
                            x={sx(p.bx) + 4.5}
                            y={sy(p.by) + 3.2}
                            className="isch-pin-lbl"
                            textAnchor="start"
                          >
                            {p.name}
                          </text>
                        );
                      }
                      if (p.side === "R") {
                        return (
                          <text
                            key={p.name}
                            x={sx(p.bx) - 4.5}
                            y={sy(p.by) + 3.2}
                            className="isch-pin-lbl"
                            textAnchor="end"
                          >
                            {p.name}
                          </text>
                        );
                      }
                      return (
                        <text
                          key={p.name}
                          x={sx(p.bx)}
                          y={sy(p.by) - 4.5}
                          className="isch-pin-lbl"
                          textAnchor="middle"
                        >
                          {p.name}
                        </text>
                      );
                    })}

                    {/* Top inline note inside U1 (USB-C isolation) */}
                    {box.topNote && (
                      <>
                        <text
                          x={sx(box.cx)}
                          y={y0 + 18}
                          textAnchor="middle"
                          className="isch-u1-note"
                          fill="#0f4c81"
                          fontWeight="700"
                        >
                          {box.topNote[0]}
                        </text>
                        <text
                          x={sx(box.cx)}
                          y={y0 + 30}
                          textAnchor="middle"
                          className="isch-u1-note"
                          fill="#0f4c81"
                        >
                          {box.topNote[1]}
                        </text>
                      </>
                    )}

                    {/* Real Transparent Hardware Photo inside each KiCad box */}
                    <image
                      href={mod.image}
                      x={imgX}
                      y={imgY}
                      width={imgW}
                      height={imgH}
                      preserveAspectRatio="xMidYMid meet"
                      style={{ pointerEvents: "none" }}
                    />

                    {/* Live LED status indicator dot on each active module */}
                    <circle
                      cx={x0 + bw - 9}
                      cy={y0 + 9}
                      r="3.8"
                      fill={
                        box.id === "U1"
                          ? "#2563eb"
                          : box.id === "SW1"
                            ? switchOn
                              ? "#10b981"
                              : "#ef4444"
                            : powered
                              ? "#10b981"
                              : "#cbd5e1"
                      }
                    />

                    {/* Switch Open/Closed State Badge on SW1 */}
                    {box.id === "SW1" && (
                      <g transform={`translate(${sx(box.cx) - 24}, ${y0 + bh - 16})`}>
                        <rect
                          width="48"
                          height="13"
                          rx="6.5"
                          fill={switchOn ? "#047857" : "#b91c1c"}
                        />
                        <text
                          x="24"
                          y="9.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontFamily="IBM Plex Mono, monospace"
                          fontWeight="700"
                        >
                          {switchOn ? "CLOSED" : "OPEN"}
                        </text>
                      </g>
                    )}

                    {/* Clean sub-note underneath top power blocks */}
                    {box.subNote && (
                      <text
                        x={box.id === "U2" ? sx(box.cx) + 10 : sx(box.cx)}
                        y={y0 + bh + 13}
                        textAnchor={box.id === "U2" ? "start" : "middle"}
                        className="isch-sub-note"
                        fill={box.subColor ?? "#475569"}
                      >
                        {box.subNote}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Live Context-Sensitive Inspector Panel */}
        <aside className="isch-inspector" aria-live="polite">
          {selectedModule ? (
            <div className="isch-inspect-body">
              <div className="isch-inspect-head">
                <span className="isch-badge part">
                  <Cpu size={13} /> {selectedModule.id} · {selectedModule.role}
                </span>
                {pinned && (
                  <button
                    type="button"
                    className="isch-clear-pin"
                    onClick={() => setPinned(null)}
                  >
                    Unpin
                  </button>
                )}
              </div>

              <div className="isch-inspect-hero">
                <img src={selectedModule.image} alt={selectedModule.part} />
                <div>
                  <h4>{selectedModule.part}</h4>
                  <small>{selectedModule.supply}</small>
                </div>
              </div>

              <p className="isch-inspect-desc">{selectedModule.detail}</p>

              <div className="isch-pin-list">
                <strong>PIN CONNECTIONS ({selectedModule.pins.length})</strong>
                <ul>
                  {selectedModule.pins.map((p) => {
                    const netObj = nets.find((n) => n.name === p.net);
                    return (
                      <li key={p.pin}>
                        <button
                          type="button"
                          onClick={() => netObj && setPinned({ kind: "net", id: netObj.id })}
                        >
                          <code>{p.pin}</code>
                          <span
                            className="isch-net-dot"
                            style={{ background: netObj?.color ?? "#15803d" }}
                          />
                          <em>{p.net}</em>
                          <small>{p.note}</small>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {selectedModule.datasheetNames.length > 0 && (
                <div className="isch-inspect-docs">
                  {selectedModule.datasheetNames.map((name) => {
                    const doc = datasheets.find((d) => d[0] === name);
                    if (!doc) return null;
                    return (
                      <a key={name} href={doc[2]} target="_blank" rel="noreferrer">
                        {name} datasheet <ArrowUpRight size={13} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ) : selectedNet ? (
            <div className="isch-inspect-body">
              <div className="isch-inspect-head">
                <span
                  className="isch-badge net"
                  style={{ borderColor: selectedNet.color, color: selectedNet.color }}
                >
                  <Cable size={13} /> {selectedNet.group.toUpperCase()} NET
                </span>
                {pinned && (
                  <button
                    type="button"
                    className="isch-clear-pin"
                    onClick={() => setPinned(null)}
                  >
                    Unpin
                  </button>
                )}
              </div>

              <h4 className="isch-net-title">
                <i style={{ background: selectedNet.color }} />
                {selectedNet.name}
              </h4>

              <div className="isch-net-meta">
                <div>
                  <span>SIGNAL / VOLTAGE</span>
                  <strong>{selectedNet.voltage}</strong>
                </div>
                <div>
                  <span>PROTOCOL</span>
                  <strong>{selectedNet.protocol}</strong>
                </div>
                <div>
                  <span>FLOW DIRECTION</span>
                  <strong>{selectedNet.direction}</strong>
                </div>
                <div>
                  <span>LIVE STATE</span>
                  <strong
                    style={{
                      color: !selectedNet.needsSwitchOn || switchOn ? "#047857" : "#b91c1c",
                    }}
                  >
                    {!selectedNet.needsSwitchOn || switchOn
                      ? "Energized / Active"
                      : "Powered Down (SW1 Open)"}
                  </strong>
                </div>
              </div>

              <p className="isch-inspect-desc">{selectedNet.note}</p>

              <div className="isch-connected-parts">
                <strong>CONNECTED MODULES</strong>
                <div className="isch-mod-chips">
                  {[selectedNet.from, ...selectedNet.to]
                    .filter((v, idx, a) => a.indexOf(v) === idx)
                    .map((modId) => {
                      const m = modules.find((x) => x.id === modId);
                      if (!m) return null;
                      return (
                        <button
                          key={modId}
                          type="button"
                          onClick={() => setPinned({ kind: "part", id: modId })}
                        >
                          <code>{m.id}</code> {m.shortPart}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="isch-inspect-body isch-inspect-idle">
              <span className="isch-badge idle">
                <Zap size={13} /> LIVE INTERACTIVE CIRCUIT
              </span>
              <h4>Hover or click any module or wire.</h4>
              <p className="isch-inspect-desc">
                Trace animated power and signal flow across all <strong>9 hardware modules</strong>{" "}
                and <strong>14 verified KiCad nets</strong> (0 ERC errors, 0 warnings). Click{" "}
                <strong>SW1</strong> to cut off the 6 V → +3.3 V peripheral rail while observing
                ESP32-C3 USB-C power isolation.
              </p>

              <div className="isch-legend">
                <div>
                  <i style={{ background: "#ea580c" }} />
                  <span>6.0 V Battery / Switch (BAT_6V, SW_6V)</span>
                </div>
                <div>
                  <i style={{ background: "#dc2626" }} />
                  <span>+3V3 Regulated Peripheral Rail (Peripherals Only)</span>
                </div>
                <div>
                  <i style={{ background: "#059669" }} />
                  <span>Analog Soil Moisture ADC (GPIO0)</span>
                </div>
                <div>
                  <i style={{ background: "#0284c7" }} />
                  <span>Shared 100 kHz I²C Bus (GPIO2 SDA, GPIO9 SCL)</span>
                </div>
                <div>
                  <i style={{ background: "#7c3aed" }} />
                  <span>Dual SPI TFT Bus (GPIO4/5/10 + DC/CS)</span>
                </div>
                <div>
                  <i style={{ background: "#475569" }} />
                  <span>Unified Common Ground Return (GND)</span>
                </div>
              </div>

              <div className="isch-downloads">
                <a href="/images/schematic.svg" download="E1110_GardenBuddy_DualTFT_visual.svg">
                  Download Vector SVG <ArrowDown size={13} />
                </a>
                <a href="/images/schematic.png" download="E1110_GardenBuddy_DualTFT_visual.png">
                  Download HD PNG <ArrowDown size={13} />
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
