import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Leaf,
  Menu,
  X,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Check,
  ChevronDown,
  Move,
  Cpu,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import Hardware, { Face, Telemetry, defaultReadings, type Readings, type Mood } from "./hardware";
import { modules, nets, drawings, datasheets, references } from "./project-data";
import { ComponentCards, ContactTeam } from "./core-deliverables";

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}
function Simulator() {
  const [values, setValues] = useState<Readings>(defaultReadings);
  const [plant, setPlant] = useState(0);
  const presets = [
    {
      name: "Sweet basil",
      tag: "Optimal",
      values: defaultReadings,
      ranges: [
        [40, 80],
        [8000, 20000],
        [20, 30],
        [40, 75],
      ],
    },
    {
      name: "Peace lily",
      tag: "Low light",
      values: { soil: 58, lux: 350, temp: 24, humidity: 62 },
      ranges: [
        [40, 75],
        [1000, 10000],
        [18, 30],
        [40, 80],
      ],
    },
    {
      name: "Snake plant",
      tag: "Dry soil alert",
      values: { soil: 6, lux: 6500, temp: 26, humidity: 42 },
      ranges: [
        [15, 45],
        [2000, 15000],
        [18, 32],
        [25, 65],
      ],
    },
  ];
  const keys = ["soil", "lux", "temp", "humidity"] as const;
  const departures = keys.filter(
    (k, i) => values[k] < presets[plant].ranges[i][0] || values[k] > presets[plant].ranges[i][1],
  );
  const severe = values.soil < 10 || values.temp > 36 || values.temp < 16 || departures.length >= 3;
  const mood: Mood = severe ? "sad" : departures.length ? "neutral" : "happy";
  const settings = [
    {
      key: "soil" as const,
      label: "Soil moisture",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      icon: Droplets,
    },
    {
      key: "lux" as const,
      label: "Illuminance",
      min: 0,
      max: 25000,
      step: 50,
      unit: " lx",
      icon: Sun,
    },
    {
      key: "temp" as const,
      label: "Temperature",
      min: 15,
      max: 40,
      step: 0.1,
      unit: " °C",
      icon: Thermometer,
    },
    {
      key: "humidity" as const,
      label: "Humidity",
      min: 15,
      max: 90,
      step: 1,
      unit: " %RH",
      icon: Wind,
    },
  ];
  return (
    <section id="simulator" className="simulator-section">
      <div className="wrap">
        <SectionLabel number="02">THE DUAL-SCREEN EXPERIENCE</SectionLabel>
        <div className="section-heading">
          <h2>
            Not just data.
            <br />
            <span>A dialogue.</span>
          </h2>
          <p>
            One display tells you how your plant feels.
            <br />
            The other tells you why. Try it for yourself.
          </p>
        </div>
        <div className="simulator">
          <div className="sim-display">
            <div className="live-tag">
              <i /> INTERACTIVE SIMULATION
            </div>
            <div className="display-plaque">
              <svg
                viewBox="0 0 240 330"
                aria-label={`Plant expression: ${mood}. Soil ${values.soil} percent; light ${values.lux} lux; temperature ${values.temp.toFixed(1)} Celsius; humidity ${values.humidity} percent.`}
              >
                <circle cx="120" cy="103" r="80" fill="#0a1711" stroke="#4a6350" strokeWidth="2" />
                <g transform="translate(60,43)">
                  <Face mood={mood} />
                </g>
                <rect
                  x="46"
                  y="212"
                  width="148"
                  height="82"
                  rx="4"
                  fill="#071417"
                  stroke="#41594a"
                  strokeWidth="2"
                />
                <g transform="translate(55,218) scale(1.14)">
                  <Telemetry values={values} adc />
                </g>
              </svg>
              <div className="plaque-slot" />
            </div>
            <div className={`mood-chip ${mood}`}>
              <i />
              {mood === "happy"
                ? "Happy plant. Happy you."
                : mood === "neutral"
                  ? "A little attention, please."
                  : "Something needs your care."}
            </div>
            <p className="mood-reason" aria-live="polite">
              {departures.length
                ? `${departures.map((k) => ({ soil: "Soil moisture", lux: "Light", temp: "Temperature", humidity: "Humidity" })[k]).join(", ")} outside the illustrative ${presets[plant].name.toLowerCase()} range.`
                : "All four readings are within the illustrative target ranges."}
            </p>
          </div>
          <div className="sim-controls">
            <p className="micro">CHOOSE YOUR PLANT</p>
            <div className="presets">
              {presets.map((p, i) => (
                <button
                  key={p.name}
                  className={plant === i ? "selected" : ""}
                  onClick={() => {
                    setPlant(i);
                    setValues(p.values);
                  }}
                >
                  <Leaf size={18} />
                  <strong>{p.name}</strong>
                  <small>{p.tag}</small>
                  {plant === i && <Check size={14} />}
                </button>
              ))}
            </div>
            <div className="sliders">
              {settings.map((s) => (
                <div className="slider-row" key={s.key}>
                  <label htmlFor={s.key}>
                    <s.icon size={17} />
                    {s.label}
                  </label>
                  <output htmlFor={s.key}>
                    {s.key === "temp" ? values[s.key].toFixed(1) : values[s.key].toLocaleString()}
                    {s.unit}
                  </output>
                  <input
                    id={s.key}
                    aria-label={s.label}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={values[s.key]}
                    style={
                      {
                        "--fill": `${((values[s.key] - s.min) / (s.max - s.min)) * 100}%`,
                      } as React.CSSProperties
                    }
                    onChange={(e) => setValues((v) => ({ ...v, [s.key]: Number(e.target.value) }))}
                  />
                  <span className="range-label">
                    {s.min}
                    {s.unit}
                  </span>
                  <span className="range-label end">
                    {s.max.toLocaleString()}
                    {s.unit}
                  </span>
                </div>
              ))}
            </div>
            <div className="sim-foot">
              <span>
                ADC {(2.5 - values.soil * 0.013).toFixed(2)} V{" "}
                <span className="muted">/ GPIO4</span>
              </span>
              <button onClick={() => setValues(presets[plant].values)}>
                <RotateCcw size={13} /> Reset readings
              </button>
            </div>
          </div>
        </div>
        <details className="logic-note">
          <summary>
            How the demo makes a decision <ChevronDown size={15} />
          </summary>
          <p>
            Happy: all readings inside the selected plant’s illustrative ranges. Neutral: one or two
            departures. Sad: three or more departures, soil below 10%, or temperature outside 16–36
            °C. Pressure is held at 1013 hPa. Soil voltage is a linear illustrative mapping: V =
            2.50 − 0.013 × moisture %. These are demo rules, not verified firmware, agronomic advice
            or an actual hardware stream. Plant-care mood feedback is motivated by related
            interaction research [5], [6]; monitoring architecture by [3], [4].
          </p>
          <p>
            {presets[plant].name} targets:{" "}
            {presets[plant].ranges
              .map((r, i) => `${settings[i].label} ${r[0]}–${r[1]}${settings[i].unit}`)
              .join(" · ")}
            .
          </p>
        </details>
      </div>
    </section>
  );
}
function Lightbox({
  image,
  title,
  onClose,
}: {
  image: string;
  title: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = dialog.current?.querySelectorAll<HTMLElement>("button, a");
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
      prev?.focus();
    };
  }, [onClose]);
  return (
    <dialog
      className="lightbox"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="lightbox-head">
        <strong>{title}</strong>
        <div>
          <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
            <Minus />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(5, z + 0.25))}>
            <Plus />
          </button>
          <button
            aria-label="Reset zoom and pan"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            <RotateCcw />
          </button>
          <button aria-label="Close engineering viewer" onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
      <div
        className="pan-area"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
        }}
        onPointerMove={(e) => {
          if (drag.current)
            setOffset({
              x: drag.current.ox + e.clientX - drag.current.x,
              y: drag.current.oy + e.clientY - drag.current.y,
            });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <img
          src={image}
          alt={title}
          draggable={false}
          style={{ transform: `translate(${offset.x}px,${offset.y}px) scale(${zoom})` }}
        />
      </div>
      <div className="lightbox-foot">
        <Move size={15} /> Drag to pan · use + / − to zoom · Escape to close
      </div>
    </dialog>
  );
}
function Gallery() {
  const [open, setOpen] = useState(false);
  const item = drawings[0];
  return (
    <section className="gallery-section wrap" id="engineering">
      <SectionLabel number="03">E1110 / CORE ENGINEERING DELIVERABLES</SectionLabel>
      <div className="section-heading">
        <h2>
          Engineering
          <br />& Schematic.
        </h2>
        <p>
          Inspect the full vector schematic, trace all eleven nets,
          <br />
          and explore the eight real hardware modules.
        </p>
      </div>
      <div id="schematic-viewer">
        <div className="drawing-stage">
          <button
            className="drawing-image"
            onClick={() => setOpen(true)}
            aria-label={`Enlarge ${item.title}`}
          >
            <img src={item.image} alt={item.title} loading="lazy" />
          </button>
          <button className="zoom-button" onClick={() => setOpen(true)}>
            <Maximize2 size={15} /> Explore drawing
          </button>
          <span className="drawing-format">KICAD 10 HARDWARE SCHEMATIC / VECTOR SVG</span>
        </div>
        <div className="drawing-info">
          <div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <small>{item.meta}</small>
          </div>
          <div className="drawing-facts">
            {item.facts.map((f) => (
              <span key={f}>
                <Check size={13} />
                {f}
              </span>
            ))}
            <a href={item.download} download>
              Download original <ArrowDown size={13} />
            </a>
          </div>
        </div>
        <p className="verification-note">{item.note}</p>
      </div>
      <NetTable />
      <ComponentCards />
      {open && <Lightbox image={item.image} title={item.title} onClose={() => setOpen(false)} />}
    </section>
  );
}
function Architecture() {
  return (
    <section id="architecture" className="architecture wrap">
      <SectionLabel number="01">SMALL SYSTEM. SMART CONNECTIONS.</SectionLabel>
      <div className="section-heading">
        <h2>
          Eight modules.
          <br />
          Working as one.
        </h2>
        <p>
          A single ESP32-C3 coordinates three sensors,
          <br />
          two displays, and a protected power stage.
        </p>
      </div>
      <div className="architecture-strip">
        <div>
          <Cpu size={23} />
          <strong>160 MHz</strong>
          <span>32-bit RISC-V controller</span>
        </div>
        <div>
          <span className="number-icon">3.3</span>
          <strong>One regulated rail</strong>
          <span>2S battery → DD4012SA</span>
        </div>
        <div>
          <span className="number-icon">I²C</span>
          <strong>100 kHz</strong>
          <span>Four addresses, two signal nets</span>
        </div>
        <div>
          <span className="number-icon">11</span>
          <strong>Purposeful connections</strong>
          <span>Power, I²C, SPI & analog</span>
        </div>
      </div>
    </section>
  );
}
function NetTable() {
  const [filter, setFilter] = useState("all");
  return (
    <section className="engineering-nets" aria-labelledby="net-table-title">
      <h3 id="net-table-title">11-Net GPIO Pinout & Bus Architecture</h3>
      <p className="engineering-lead">
        Named source and destination pins, reproduced from the project schematic.
      </p>
      <div className="table-inner">
        <div className="bus-controls">
          {[
            ["all", "All nets (11)"],
            ["power", "Power Rail · VIN_7V4 / +3V3 / GND"],
            ["i2c", "100 kHz I²C · GPIO6/7"],
            ["spi", "High-Speed SPI · GPIO5/3/10/1/0"],
            ["adc", "Soil ADC · GPIO4"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={filter === id}
              className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="table-scroll">
          <table aria-label="11-Net GPIO pin-to-pin wiring table">
            <thead>
              <tr>
                <th>NET</th>
                <th>SOURCE PIN</th>
                <th>DESTINATION PINS</th>
              </tr>
            </thead>
            <tbody>
              {nets
                .filter((n) => filter === "all" || filter === n.group)
                .map((n) => (
                  <tr key={n.name}>
                    <td>
                      <i style={{ background: n.color }} />
                      {n.name}
                    </td>
                    <td>{n.source}</td>
                    <td>{n.dest}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="verification-note">
          I²C addresses: AHT20 0x38 · BMP280 0x76/0x77 · BH1750 0x23 · SSD1306 0x3C. Verify
          effective SDA/SCL pull-ups to 3.3 V (schematic: 1.6–10 kΩ). DS1 SCL/SDA labels refer to
          SPI, not I²C. Remove the U1 V0 jumper as specified in the project schematic; do not power
          via USB and external rail simultaneously without verifying isolation.
        </p>
      </div>
      <p className="verification-note">
        SPI is a dedicated display bus; a specific configured SPI clock rate is not established by
        the supplied schematic.
      </p>
    </section>
  );
}
function Sustainability() {
  return (
    <section className="sustainability" id="impact">
      <div className="wrap">
        <SectionLabel number="04">ROOTED IN A GREENER BAHRAIN</SectionLabel>
        <div className="impact-layout">
          <div>
            <h2>
              A small companion.
              <br />
              <span>A greener tomorrow.</span>
            </h2>
            <p>
              Better plant care starts with understanding. Gardening Buddy makes the invisible
              visible—encouraging thoughtful watering and more confident everyday care.
            </p>
            <a
              className="text-link"
              href="https://niadbh.com/forever-green/?lang=en"
              target="_blank"
              rel="noreferrer"
            >
              Explore Bahrain’s Forever Green initiative <ArrowUpRight size={17} />
            </a>
            <p className="impact-disclaimer">
              An educational contribution, not an official NIAD partnership. Water savings and
              environmental outcomes have not been measured.
            </p>
          </div>
          <div className="impact-numbers">
            <div>
              <span>NATIONAL AFFORESTATION STRATEGY [8]</span>
              <strong>
                1.8M <ArrowRight size={29} /> 3.6M
              </strong>
              <p>Target number of trees in Bahrain by 2035</p>
            </div>
            <div>
              <span>BAHRAIN’S CLIMATE COMMITMENT [9]</span>
              <strong>Net zero. 2060.</strong>
              <p>A long-term commitment to a more resilient future</p>
              <a
                href="https://unfccc.int/sites/default/files/resource/BAHRAIN_cop26cmp16cma3_HLS_EN.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Official COP26 statement <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="sdgs">
          {[
            [6, "Clean water", "Informed watering", "#21a8d1"],
            [11, "Sustainable cities", "Greener living spaces", "#e79e38"],
            [12, "Responsible consumption", "Care with intention", "#b69642"],
            [13, "Climate action", "Everyday climate awareness", "#527b46"],
            [15, "Life on land", "Support plant wellbeing", "#67a74a"],
          ].map(([n, title, desc, color]) => (
            <a href={`https://sdgs.un.org/goals/goal${n}`} key={n} target="_blank" rel="noreferrer">
              <span className="sdg-number" style={{ background: String(color) }}>
                {n}
              </span>
              <div>
                <strong>{title}</strong>
                <small>{desc}</small>
              </div>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
        <p className="verification-note">
          Aligned with the intentions of UN Sustainable Development Goals 6, 11, 12, 13 and 15 [10].
          Forever Green campaign context [7]; national afforestation targets [8].
        </p>
      </div>
    </section>
  );
}
function Evidence() {
  return (
    <section className="evidence wrap">
      <div>
        <SectionLabel number="↗">DESIGNED ON EVIDENCE</SectionLabel>
        <h2>
          Sense smarter.
          <br />
          Care better.
        </h2>
        <p>
          Capacitive sensing measures changes in soil dielectric properties instead of
          exposed-electrode resistance. Calibration matters: every soil has its own story.
        </p>
      </div>
      <div className="evidence-stats">
        <article>
          <span>CALIBRATED SOIL SENSOR STUDY [1]</span>
          <h3>
            ~2× <small>lower error</small>
          </h3>
          <p>
            MAE: <strong>1.90% capacitive</strong> vs. 3.82% resistive VWC.
            <br />
            RMSE: 2.62% vs. 5.38%.
          </p>
          <a href="#ref-1">
            Read the source <ArrowUpRight size={13} />
          </a>
        </article>
        <article>
          <span>PROBE CHARACTERIZATION [2]</span>
          <h3>
            −0.945 <small>correlation</small>
          </h3>
          <p>
            Output voltage vs. gravimetric water content. A strong negative relationship—not proof
            that every soil follows a linear calibration.
          </p>
          <a href="#ref-2">
            Read the source <ArrowUpRight size={13} />
          </a>
        </article>
        <p className="verification-note">
          Published research results, not measured accuracy of this project. The simulator uses a
          simplified linear voltage mapping for demonstration only.
        </p>
      </div>
    </section>
  );
}
function References() {
  const [view, setView] = useState("all");
  return (
    <section className="references wrap" id="references">
      <SectionLabel number="04">E1110 / ACADEMIC & HARDWARE SOURCES</SectionLabel>
      <div className="section-heading">
        <h2>
          References
          <br />& Datasheets.
        </h2>
        <p>
          Explore the component documentation
          <br />
          and the literature behind the project.
        </p>
      </div>
      <h3 className="subheading" id="datasheets">
        Hardware documentation <span>09 DOCUMENTS / [11]</span>
      </h3>
      <div className="datasheet-grid">
        {datasheets.map(([name, desc, url]) => (
          <a href={url} key={name} target="_blank" rel="noreferrer">
            <div>
              <strong>{name}</strong>
              <small>{desc}</small>
            </div>
            <ArrowUpRight size={19} />
          </a>
        ))}
      </div>
      <p className="verification-note">
        ¹ ESP32-C3-MINI-1 is a related Espressif module reference, not the SuperMini board fitted
        here. ² GY-302 is a generic breakout designation: this is a supplier guide, not an
        independently verified OEM datasheet. Vendor mirrors are explicitly labeled.
      </p>
      <div className="bibliography-head">
        <h3>
          Project bibliography <span>IEEE-STYLE / 11 ENTRIES</span>
        </h3>
        <div className="reference-filters">
          {[
            ["all", "All"],
            ["research", "Research"],
            ["context", "Policy & hardware"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="bibliography">
        {references.map(
          (ref, i) =>
            (view === "all" || (view === "research" ? i < 6 : i >= 6)) && (
              <details key={ref.text} id={`ref-${i + 1}`} open>
                <summary>
                  <span className="ref-number">[{i + 1}]</span>
                  <span>{ref.text}</span>
                  <Plus size={16} />
                </summary>
                <div className="reference-detail">
                  <p>{ref.evidence}</p>
                  <a
                    href={ref.url}
                    target={ref.url.startsWith("#") ? undefined : "_blank"}
                    rel="noreferrer"
                  >
                    {ref.url.startsWith("#") ? "View documentation" : "Open source"}{" "}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </details>
            ),
        )}
      </div>
      <p className="verification-note">
        References supplied by the project team; bibliographic records and selected evidence checked
        against indexed publisher/government sources. Entries with unconfirmed specific claims are
        qualified above. External document availability can change.
      </p>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="university-footer">
          <div className="university-logos">
            <img src="/images/university.png" alt="University of Strathclyde Bahrain" />
            <img src="/images/science.png" alt="University of Strathclyde Faculty of Science" />
          </div>
          <p>
            Faculty of Science
            <br />
            Department of Electronic & Electrical Engineering
            <br />
            <small>With thanks to the E1110 Electronics teaching staff.</small>
          </p>
        </div>
        <div className="footer-bottom">
          <a href="#hardware" className="brand">
            <Leaf size={19} /> Gardening Buddy<span>™</span>
          </a>
          <span>SMART DUAL-SCREEN EMBEDDED PLANT MONITORING SYSTEM</span>
          <a href="#hardware">Back to the top ↑</a>
        </div>
      </div>
    </footer>
  );
}
export default function Showcase() {
  const hero = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [override, setOverride] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    document.title = "Gardening Buddy — Strathclyde Bahrain E1110";
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (hero.current) {
          const rect = hero.current.getBoundingClientRect();
          setProgress(
            Math.max(0, Math.min(1, -rect.top / (hero.current.offsetHeight - window.innerHeight))),
          );
        }
      });
    };
    const scroll = () => {
      setOverride((current) => (current === 0 ? null : current));
      update();
    };
    const clearManual = () => setOverride(null);
    const clearOnKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key))
        clearManual();
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("wheel", clearManual, { passive: true });
    window.addEventListener("touchmove", clearManual, { passive: true });
    window.addEventListener("keydown", clearOnKey);
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("wheel", clearManual);
      window.removeEventListener("touchmove", clearManual);
      window.removeEventListener("keydown", clearOnKey);
      window.removeEventListener("resize", update);
    };
  }, []);
  const p = override ?? progress;
  const phase = p < 0.2 ? 0 : p < 0.72 ? 1 : 2;
  const component = modules.find((m) => m.id === selected);
  return (
    <>
      <a className="skip-link" href="#simulator">
        Skip to interactive simulator
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#hardware">
            <span className="brand-icon">
              <Leaf size={19} />
            </span>
            Gardening Buddy<span className="brand-tm">™</span>
          </a>
          <nav className={menu ? "open" : ""} aria-label="Main navigation">
            {[
              ["#architecture", "The System"],
              ["#simulator", "Simulator"],
              ["#engineering", "Engineering & Schematic"],
              ["#references", "References & Datasheets"],
              ["#team", "Contact Team"],
            ].map(([url, text]) => (
              <a key={url} href={url} onClick={() => setMenu(false)}>
                {text}
              </a>
            ))}
          </nav>
          <a
            className="header-university"
            href="#team"
            aria-label="University of Strathclyde Bahrain — contact project team"
          >
            <img src="/images/university-header.png" alt="University of Strathclyde Bahrain" />
          </a>
          <button
            className="menu-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero-scroll" ref={hero} id="hardware">
          <div className="hero-sticky">
            <div className="hero-grid wrap">
              <div className="hero-copy">
                <div className="project-tag">
                  <i /> STRATHCLYDE BAHRAIN <span>/</span> E1110
                </div>
                <div className="deliverable-shortcuts" aria-label="Core project deliverables">
                  <a href="#engineering">
                    Schematic <ArrowUpRight size={11} />
                  </a>
                  <a href="#references">
                    References <ArrowUpRight size={11} />
                  </a>
                  <a href="#team">
                    Team emails <ArrowUpRight size={11} />
                  </a>
                </div>
                <div className="hero-phase" key={phase}>
                  {phase === 0 ? (
                    <>
                      <h1>
                        A little tech.
                        <br />A lot of <span>life.</span>
                      </h1>
                      <p>
                        Meet Gardening Buddy. The smart plant companion that turns everyday readings
                        into a little understanding.
                      </p>
                    </>
                  ) : phase === 1 ? (
                    <>
                      <h1>
                        Friendly outside.
                        <br />
                        <span>Brilliant inside.</span>
                      </h1>
                      <p>
                        Scroll deeper. Eight carefully chosen modules come apart to reveal the
                        engineering behind your plant’s personality.
                      </p>
                    </>
                  ) : (
                    <>
                      <h1>
                        Everything
                        <br />
                        <span>connected.</span>
                      </h1>
                      <p>
                        Eleven electrical nets. One shared purpose. Follow the power, sensing and
                        display signals that bring your buddy to life.
                      </p>
                    </>
                  )}
                </div>
                <div className="hero-actions">
                  <a className="primary-button" href="#simulator">
                    Try the simulator <ArrowUpRight size={16} />
                  </a>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setOverride(p > 0.3 ? 0 : 1);
                      setSelected(null);
                    }}
                  >
                    {p > 0.3 ? "Reassemble" : "Explore the hardware"} <Plus size={15} />
                  </button>
                </div>
                <div className="hero-caption">
                  <span className="caption-line" /> TWO SCREENS. ONE HAPPIER PLANT.
                </div>
                {p > 0.68 && (
                  <div className="hero-buses" aria-label="Highlight wiring bus">
                    {[
                      ["all", "All nets · 11"],
                      ["power", "Power rail"],
                      ["i2c", "Shared I²C"],
                      ["spi", "Dedicated SPI"],
                      ["adc", "Soil ADC"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        className={filter === id ? "active" : ""}
                        aria-pressed={filter === id}
                        onClick={() => setFilter(id)}
                      >
                        {label}
                      </button>
                    ))}
                    <small>Electrical routes are illustrative; exact pin mappings below.</small>
                  </div>
                )}
              </div>
              <div className={`product-stage ${p > 0.2 ? "exploded" : ""}`}>
                <div className="product-orbit" />
                <div className="orbit orbit-two" />
                <div className="stage-kicker">
                  GARDENING BUDDY{" "}
                  <span>
                    / {phase === 0 ? "ASSEMBLED" : phase === 1 ? "EXPLODED VIEW" : "LIVE NET MAP"}
                  </span>
                </div>
                <Hardware progress={p} filter={filter} onSelect={setSelected} />
                <div className="stage-bottom">
                  <span>{p > 0.3 ? "TAP A MODULE TO EXPLORE" : "102 × 212 × 61.8 mm"}</span>
                  <span>ILLUSTRATIVE HARDWARE VIEW</span>
                </div>
                {component && (
                  <section className="component-popover" aria-label="Component details">
                    <button
                      className="popover-close"
                      aria-label="Close component details"
                      onClick={() => setSelected(null)}
                    >
                      <X size={16} />
                    </button>
                    <span>
                      {component.id} / {component.part}
                    </span>
                    <h3>{component.name}</h3>
                    <p>{component.detail}</p>
                    <small>{component.spec}</small>
                  </section>
                )}
              </div>
            </div>
            <div className="hero-bottom wrap">
              <div className="scroll-hint">
                <span className="scroll-icon">
                  <ArrowDown size={14} />
                </span>
                <span>
                  SCROLL TO DISCOVER <small>Watch the story unfold</small>
                </span>
              </div>
              <div className="scroll-progress">
                {["THE COMPANION", "THE COMPONENTS", "THE CONNECTIONS"].map((s, i) => (
                  <div className={phase === i ? "current" : ""} key={s}>
                    <span>0{i + 1}</span>
                    <i />
                    <small>{s}</small>
                  </div>
                ))}
              </div>
              <span className="hero-note">
                Designed to care.
                <br />
                Engineered to understand.
              </span>
            </div>
          </div>
        </section>
        <Architecture />
        <Simulator />
        <Gallery />
        <References />
        <ContactTeam />
        <Evidence />
        <Sustainability />
      </main>
      <Footer />
    </>
  );
}
