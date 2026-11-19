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
import InteractiveSchematic from "./interactive-schematic";
import {
  modules,
  nets,
  drawings,
  datasheets,
  references,
  orchidThresholds,
  sdgItems,
} from "./project-data";
import { ComponentCards, ContactTeam } from "./core-deliverables";

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function ProblemHook() {
  return (
    <section className="problem-hook wrap" aria-label="Problem statement">
      <div className="problem-hook-card">
        <div className="problem-hook-copy">
          <span className="problem-kicker">THE PROBLEM · WHY HOUSEPLANTS DIE</span>
          <blockquote>
            “60% of millennials said that what worries them most is ensuring plants get the proper
            amount of sunlight. Other anxieties include watering (56% of respondents) and keeping
            the plants alive (48%).”
          </blockquote>
          <a
            className="problem-cite"
            href="https://www.apartmenttherapy.com/dead-houseplants-average-37076429"
            target="_blank"
            rel="noreferrer"
          >
            — Del Castillo, I. (2022), Apartment Therapy <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="problem-stats">
          <div>
            <strong>60%</strong>
            <span>Sunlight worry</span>
          </div>
          <div>
            <strong>56%</strong>
            <span>Watering anxiety</span>
          </div>
          <div>
            <strong>48%</strong>
            <span>Keeping alive</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Simulator() {
  const [values, setValues] = useState<Readings>(defaultReadings);
  const [plant, setPlant] = useState(0);
  const presets = [
    {
      name: "Orchid (Poster Profile)",
      tag: "Optimal · 4/4",
      values: { soil: 42, lux: 24000, temp: 24.0, humidity: 52 },
      ranges: [
        [25, 65],
        [10000, 50000],
        [19, 29],
        [40, 60],
      ],
    },
    {
      name: "Orchid · Low Light",
      tag: "Neutral · 2/4",
      values: { soil: 45, lux: 3800, temp: 25.0, humidity: 32 },
      ranges: [
        [25, 65],
        [10000, 50000],
        [19, 29],
        [40, 60],
      ],
    },
    {
      name: "Orchid · Dry Bark Alert",
      tag: "Sad · 1/4",
      values: { soil: 8, lux: 4200, temp: 33.0, humidity: 48 },
      ranges: [
        [25, 65],
        [10000, 50000],
        [19, 29],
        [40, 60],
      ],
    },
  ];
  const keys = ["soil", "lux", "temp", "humidity"] as const;
  const healthyCount = keys.filter(
    (k, i) => values[k] >= presets[plant].ranges[i][0] && values[k] <= presets[plant].ranges[i][1],
  ).length;
  const departures = keys.filter(
    (k, i) => values[k] < presets[plant].ranges[i][0] || values[k] > presets[plant].ranges[i][1],
  );
  const scorePct = Math.round((healthyCount / 4) * 100);
  // Exact decision thresholds from Garden Buddy Program Flowchart (Figure 2):
  // >= 75% Happy | 50-74% Neutral | 1-49% Sad | 0% Error
  const mood: Mood =
    scorePct >= 75 ? "happy" : scorePct >= 50 ? "neutral" : scorePct > 0 ? "sad" : "error";

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
      max: 55000,
      step: 500,
      unit: " lx",
      icon: Sun,
    },
    {
      key: "temp" as const,
      label: "Temperature",
      min: 12,
      max: 40,
      step: 0.5,
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
        <SectionLabel number="02">SOFTWARE &amp; DUAL-SCREEN EXPERIENCE</SectionLabel>
        <div className="section-heading">
          <h2>
            Not just data.
            <br />
            <span>A dialogue.</span>
          </h2>
          <p>
            Readings are scored out of 4 every 2 seconds—driving a facial
            <br />
            expression on the round GC9A01 and live values on the 2.0″ ST7789.
          </p>
        </div>

        <div className="simulator">
          <div className="sim-display">
            <div className="live-tag">
              <i /> LIVE SCORE SIMULATION · {healthyCount}/4 ({scorePct}%)
            </div>
            <div className="display-plaque">
              <svg
                viewBox="0 0 240 342"
                aria-label={`Plant expression: ${mood}, score ${healthyCount} out of 4 (${scorePct} percent). Soil ${values.soil} percent; light ${values.lux} lux; temperature ${values.temp.toFixed(1)} Celsius; humidity ${values.humidity} percent.`}
              >
                <circle cx="120" cy="96" r="78" fill="#0a1711" stroke="#4a6350" strokeWidth="2" />
                <g transform="translate(60,36)">
                  <Face mood={mood} />
                </g>
                <rect
                  x="40"
                  y="198"
                  width="160"
                  height="108"
                  rx="6"
                  fill="#071620"
                  stroke="#3b5a70"
                  strokeWidth="2.2"
                />
                <g transform="translate(49,206) scale(1.22)">
                  <Telemetry values={values} score={healthyCount} adc />
                </g>
              </svg>
              <div className="plaque-slot" />
            </div>
            <div className={`mood-chip ${mood}`}>
              <i />
              {mood === "happy"
                ? `Happy (${scorePct}% · ≥75%)`
                : mood === "neutral"
                  ? `Neutral (${scorePct}% · 50–74%)`
                  : mood === "sad"
                    ? `Sad (${scorePct}% · 1–49%)`
                    : "Error / Severe Stress (0%)"}
            </div>
            <p className="mood-reason" aria-live="polite">
              {departures.length
                ? `${departures.map((k) => ({ soil: "Soil moisture", lux: "Light", temp: "Temperature", humidity: "Humidity" })[k]).join(", ")} outside the orchid reference band.`
                : "All four parameters are within the preferred orchid growing thresholds."}
            </p>
          </div>

          <div className="sim-controls">
            <p className="micro">TEST PLANT CARE SCENARIO</p>
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
                Soil ADC {(2.5 - values.soil * 0.013).toFixed(2)} V{" "}
                <span className="muted">/ GPIO0 (ADC1_CH0)</span>
              </span>
              <button onClick={() => setValues(presets[plant].values)}>
                <RotateCcw size={13} /> Reset readings
              </button>
            </div>
          </div>
        </div>

        {/* Software Flowchart & Orchid Preferred Thresholds matching Poster Section 3 */}
        <div className="software-flowchart-panel">
          <div className="sfp-text">
            <span className="sfp-kicker">HOW IT WORKS — SOFTWARE &amp; FIRMWARE LOOP</span>
            <h3>Program Flowchart &amp; Orchid Care Thresholds</h3>
            <p>
              Readings are taken from sensors (moisture, humidity, temperature, and light) every 2
              seconds, then processed as either “healthy” or “unhealthy” depending on how far off
              they are from the plant’s preferred levels. The amount of healthy readings determines
              the plant’s score out of 4—displayed on the 2.0″ rectangular ST7789 screen while the
              1.28″ round GC9A01 screen draws a Happy (≥75%), Neutral (50–74%), Sad (1–49%), or
              Error (0%) face (Talking Plant Project, 2026). Daily scheduled sampling can also be
              enabled to save battery power.
            </p>

            <div className="orchid-thresh-box">
              <strong>PREFERRED PLANT THRESHOLDS (ORCHID REFERENCE PROFILE)</strong>
              <div className="orchid-thresh-grid">
                {orchidThresholds.map((t) => (
                  <div className="orchid-thresh-row" key={t.param}>
                    <span className="ot-param">{t.param}</span>
                    <code className="ot-range">{t.range}</code>
                    <span className="ot-note">
                      {t.note}{" "}
                      <a href={t.url} target="_blank" rel="noreferrer">
                        ({t.citation})
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <figure className="sfp-figure">
            <img
              src="/images/program-flowchart.png"
              alt="Garden Buddy program flowchart showing 2-second loop, validity check, 0-100% health score, and face classification"
              loading="lazy"
            />
            <figcaption>
              Figure 2. Garden Buddy firmware flowchart paired with calibrated orchid growing
              thresholds (Orchid Web, n.d.; American Orchid Society, n.d.).
            </figcaption>
          </figure>
        </div>

        <details className="logic-note">
          <summary>
            How the scoring thresholds map to facial expressions <ChevronDown size={15} />
          </summary>
          <p>
            Each of the four measured parameters (soil moisture, illuminance, air temperature, and
            relative humidity) is compared against the preferred plant range. 3–4 healthy metrics
            (≥75%) display Happy; 2 healthy metrics (50–74%) display Neutral; 1 healthy metric
            (1–49%) displays Sad; 0 healthy metrics or an invalid sensor reading displays the Error
            state. Reference ranges follow Orchid Web (n.d.) and American Orchid Society (n.d.).
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
      <SectionLabel number="03">E1110 / INTERACTIVE HARDWARE &amp; SCHEMATIC</SectionLabel>
      <div className="section-heading">
        <h2>
          Interactive Circuit
          <br />&amp; Schematic.
        </h2>
        <p>
          Hover over any of the 9 physical modules or 14 electrical wires to inspect
          <br />
          live current flow, toggle power switch SW1, and trace every GPIO pin.
        </p>
      </div>

      <p className="hardware-narrative">
        Garden Buddy uses four 1.5 V AA batteries (6 V) through a power switch (SW1) and DD4012SA
        voltage regulator to supply all sensors and both screens with a stable, constant 3.3 V
        output. The sensors measure temperature and humidity (AHT20+BMP280), light (BH1750 /
        GY-302), and soil moisture (Capacitive Soil Moisture Sensor v2.0; Placidi et al., 2020),
        transmitting all readings to the ESP32-C3 microcontroller (USB-C powered, shared common
        ground)—the brain of the device—which displays live values alongside a matching facial
        expression.
      </p>

      <div id="schematic-viewer">
        <InteractiveSchematic onOpenLightbox={() => setOpen(true)} />
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
      <SectionLabel number="01">INTRODUCTION · WHAT IS GARDEN BUDDY?</SectionLabel>
      <div className="section-heading">
        <h2>
          Nine modules.
          <br />
          Working as one.
        </h2>
        <p>
          The Garden Buddy is a smart monitoring device designed to make it easier to keep your
          plants alive (Gaia Project, 2026). Your plant tells you what is wrong and what it
          needs—simply stick it in the soil and tend to its needs with zero guesswork.
        </p>
      </div>
      <div className="architecture-strip">
        <div>
          <Cpu size={23} />
          <strong>ESP32-C3</strong>
          <span>USB-C 5 V MCU · common GND</span>
        </div>
        <div>
          <span className="number-icon">3.3V</span>
          <strong>Isolated peripheral rail</strong>
          <span>4×AA (6 V) → SW1 → DD4012SA</span>
        </div>
        <div>
          <span className="number-icon">2×TFT</span>
          <strong>Shared SPI displays</strong>
          <span>1.28″ GC9A01 + 2.0″ ST7789</span>
        </div>
        <div>
          <span className="number-icon">14</span>
          <strong>0-ERC verified nets</strong>
          <span>Power, I²C (GPIO2/9), SPI &amp; ADC</span>
        </div>
      </div>
    </section>
  );
}

function NetTable() {
  const [filter, setFilter] = useState("all");
  return (
    <section className="engineering-nets" aria-labelledby="net-table-title">
      <h3 id="net-table-title">14-Net GPIO Pinout &amp; Bus Architecture</h3>
      <p className="engineering-lead">
        Exact source-to-destination connections verified with 0 ERC errors and 0 ERC warnings in KiCad
        10.
      </p>
      <div className="table-inner">
        <div className="bus-controls">
          {[
            ["all", "All nets (14)"],
            ["power", "Power · BAT_6V / SW_6V / +3V3 / GND"],
            ["i2c", "Shared I²C · GPIO2 / GPIO9"],
            ["spi", "Dual SPI · GPIO4/5/10/6/7/1/3"],
            ["adc", "Soil ADC · GPIO0"],
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
          <table aria-label="14-Net GPIO pin-to-pin wiring table">
            <thead>
              <tr>
                <th>NET</th>
                <th>SOURCE PIN</th>
                <th>DESTINATION PINS</th>
                <th>SIGNAL / ROLE</th>
              </tr>
            </thead>
            <tbody>
              {nets
                .filter((n) => filter === "all" || filter === n.group)
                .map((n) => (
                  <tr key={n.id}>
                    <td>
                      <i style={{ background: n.color }} />
                      {n.name}
                    </td>
                    <td>{n.source}</td>
                    <td>{n.dest}</td>
                    <td>{n.protocol}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="verification-note">
          Power Isolation: 4×AA (6.0 V) → SW1 → DD4012SA (+3V3) powers B1, B2, B3, DS1, and DS2
          (VCC + BLK) ONLY—never tied to ESP32-C3 (U1), which runs via USB-C 5 V with a unified
          common GND across all 9 modules. Shared I²C addresses: AHT20 0x38 · BMP280 0x76/0x77 ·
          BH1750 0x23 (ADDR → GND).
        </p>
      </div>
    </section>
  );
}

function ResultsAndFuture() {
  return (
    <section className="results-future-section wrap" id="results">
      <SectionLabel number="04">RESULTS, REAL-WORLD REVIEW &amp; FUTURE WORK</SectionLabel>
      <div className="section-heading">
        <h2>
          Tested on real plants.
          <br />
          <span>Built to grow further.</span>
        </h2>
        <p>
          Hands-on plant care testing by team member Hamza Majed validated how glanceable faces and
          live readings remove daily guesswork (IoP, 2026; Nramat et al., 2026).
        </p>
      </div>

      <div className="results-future-grid">
        {/* Left: Hamza's Google Review + 3-Step Real Use Loop */}
        <div className="rf-card">
          <span className="rf-kicker">RESULTS &amp; PLANT CARE VALIDATION</span>
          <h3>Real-World Hands-On User Review</h3>
          <figure className="hamza-review-figure">
            <img
              src="/images/hamza-review.png"
              alt="5-star hands-on user review from team member Hamza Majed describing how Garden Buddy simplified daily plant care"
              loading="lazy"
            />
            <figcaption>
              Figure 3. Hands-on user experience review from team member Hamza Majed after using
              Garden Buddy to monitor and care for his plant in daily life.
            </figcaption>
          </figure>
          <div className="care-steps">
            <div>
              <span>STEP 01 · GLANCE</span>
              <strong>Check the Face</strong>
              <p>Round GC9A01 face alerts you in &lt; 2 s if the plant feels stressed.</p>
            </div>
            <div>
              <span>STEP 02 · INSPECT</span>
              <strong>Look Down at Data</strong>
              <p>2.0″ ST7789 reveals whether water or light is outside target range.</p>
            </div>
            <div>
              <span>STEP 03 · CARE</span>
              <strong>Act With Confidence</strong>
              <p>Tend to the exact need—removing daily guessing and overwatering.</p>
            </div>
          </div>
        </div>

        {/* Right: Conclusion & Future Improvements + Analog pH Sensor Figure 4 */}
        <div className="rf-card">
          <span className="rf-kicker">CONCLUSION &amp; FUTURE IMPROVEMENTS</span>
          <h3>Making Plant Care Accessible to Everyone</h3>
          <p className="rf-prose">
            In conclusion, Garden Buddy is a useful device that makes planting more accessible and
            eases taking care of plants. To improve it, we can add pH sensors to track nutrient
            balance and program the device to guide users on what to do when readings are too high
            or low. Whether you are new to planting or experienced, Garden Buddy helps monitor your
            plants on a busy schedule and guides you through the process even without prior
            knowledge.
          </p>

          <div className="future-split">
            <div className="future-list">
              <div>
                <span>IMPROVEMENT 1 · SOIL pH &amp; NUTRIENTS</span>
                <p>
                  Integrate an analog pH probe (Figure 4) to track soil acidity and nutrient uptake.
                </p>
              </div>
              <div>
                <span>IMPROVEMENT 2 · ACTIONABLE GUIDANCE</span>
                <p>
                  Display step-by-step on-screen prompts explaining how to correct high or low
                  readings.
                </p>
              </div>
              <div>
                <span>IMPROVEMENT 3 · DAILY SLEEP &amp; SEALING</span>
                <p>
                  Add deep-sleep daily scheduling and weather-sealed housing for outdoor deployment.
                </p>
              </div>
            </div>

            <figure className="ph-figure">
              <span>FUTURE HARDWARE ADD-ON · ANALOG pH PROBE</span>
              <img
                src="/images/parts/future-ph-sensor.png"
                alt="Gravity Analog pH sensor module and BNC electrode probe planned for future soil nutrient balance monitoring"
                loading="lazy"
              />
              <figcaption>
                Figure 4. Gravity Analog pH sensor module and BNC electrode planned for future soil
                nutrient balance monitoring.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sustainability() {
  return (
    <section className="sustainability" id="impact">
      <div className="wrap">
        <SectionLabel number="05">BAHRAIN VISION, GO-GREEN &amp; UN SDGS</SectionLabel>
        <div className="impact-layout">
          <div>
            <h2>
              A small companion.
              <br />
              <span>A greener Bahrain.</span>
            </h2>
            <p>
              What deters novices from planting is the guesswork of daily care. Accommodating
              beginners and children to gardening through facial feedback, Garden Buddy lets users
              absorbed with busy schedules grow plants without managing complex details. Its real
              soil moisture readings also stop blind watering—saving scarce desalinated water across
              households and schools.
            </p>
            <div className="impact-links">
              <a
                className="text-link"
                href="https://sdgs.gov.bh"
                target="_blank"
                rel="noreferrer"
              >
                Explore Bahrain SDGs Portal (sdgs.gov.bh) <ArrowUpRight size={17} />
              </a>
              <a
                className="text-link"
                href="https://niadbh.com/forever-green/?lang=en"
                target="_blank"
                rel="noreferrer"
              >
                NIAD Forever Green Campaign <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="impact-numbers">
            <div>
              <span>NATIONAL AFFORESTATION STRATEGY 2035</span>
              <strong>
                1.8M <ArrowRight size={29} /> 3.6M
              </strong>
              <p>Target number of trees in Bahrain by 2035 (NIAD &amp; Ministry of Municipalities)</p>
            </div>
            <div>
              <span>BAHRAIN’S CLIMATE &amp; WATER STRATEGY</span>
              <strong>Net-Zero 2060</strong>
              <p>
                Directly linked with Bahrain’s National Water Strategy 2030, Net-Zero 2060, and VNR
                Report
              </p>
              <a href="https://sdgs.gov.bh" target="_blank" rel="noreferrer">
                Kingdom of Bahrain SDGs Portal <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Official UN/Bahrain SDG Icon Boxes directly from the Submitted Poster */}
        <div className="poster-sdg-grid">
          {sdgItems.map((sdg) => (
            <a
              href={sdg.url}
              key={sdg.num}
              target="_blank"
              rel="noreferrer"
              className="poster-sdg-card"
            >
              <img
                src={sdg.img}
                alt={`UN Sustainable Development Goal ${sdg.num}: ${sdg.title}`}
                loading="lazy"
              />
              <div className="poster-sdg-meta">
                <strong>
                  SDG {sdg.num} · {sdg.title}
                </strong>
                <small>{sdg.desc}</small>
              </div>
              <ArrowUpRight size={15} className="poster-sdg-arrow" />
            </a>
          ))}
        </div>

        <p className="verification-note">
          Aligned with UN Sustainable Development Goals 6, 11, 12, 13, and 15 (United Nations, 2015)
          and the Kingdom of Bahrain’s National Water Strategy 2030, Net-Zero 2060, Forever Green
          (NIAD, 2021), and 2035 Afforestation targets (sdgs.gov.bh).
        </p>
      </div>
    </section>
  );
}

function References() {
  const [view, setView] = useState<"all" | "care" | "research" | "policy" | "ai">("all");
  const visibleRefs = references.filter((r) => view === "all" || r.category === view);

  return (
    <section className="references wrap" id="references">
      <SectionLabel number="06">E1110 / HARVARD REFERENCES &amp; HARDWARE DATASHEETS</SectionLabel>
      <div className="section-heading">
        <h2>
          References
          <br />&amp; Datasheets.
        </h2>
        <p>
          All hardware component datasheets preserved alongside the complete
          <br />
          14-entry Harvard bibliography matching our submitted E1110 poster.
        </p>
      </div>

      <h3 className="subheading" id="datasheets">
        Hardware documentation <span>{datasheets.length} DOCUMENTS</span>
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
        ¹ ESP32-C3-MINI-1 is a related Espressif module reference alongside the ESP32-C3 chip
        datasheet. ² GY-302 is a supplier module guide for the ROHM BH1750FVI sensor. ST7789V
        documents the 2.0″ GMT020-02-8P display driver; SSD1306 is retained from early prototyping.
      </p>

      <div className="bibliography-head">
        <h3>
          Project bibliography <span>HARVARD STYLE / {references.length} ENTRIES</span>
        </h3>
        <div className="reference-filters">
          {(
            [
              ["all", `All (${references.length})`],
              ["care", "Plant Care & Hook"],
              ["research", "Sensors & UX Research"],
              ["policy", "Bahrain & UN SDGs"],
              ["ai", "AI Consultation"],
            ] as const
          ).map(([id, label]) => (
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
        {visibleRefs.map((ref, i) => (
          <details key={ref.text} id={`ref-${i + 1}`} open>
            <summary>
              <span className="ref-number">{ref.shortCite}</span>
              <span>{ref.text}</span>
              <Plus size={16} />
            </summary>
            <div className="reference-detail">
              <p>
                <strong>How we utilized this source:</strong> {ref.utilization}
              </p>
              <a href={ref.url} target="_blank" rel="noreferrer">
                Open source <ArrowUpRight size={14} />
              </a>
            </div>
          </details>
        ))}
      </div>
      <p className="verification-note">
        Full Harvard-style reference list synced directly with the submitted E1110 Garden Buddy A1
        poster and project references logbook.
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
            Department of Electronic &amp; Electrical Engineering
            <br />
            <small>
              E1110 Electronics teaching and laboratory staff, University of Strathclyde Bahrain —
              for bench facilities, metrology guidance, and feedback.
            </small>
          </p>
        </div>
        <div className="footer-bottom">
          <a href="#hardware" className="brand">
            <Leaf size={19} /> Garden Buddy<span>™</span>
          </a>
          <span>SINGLE-NODE ESP32-C3 DUAL-TFT PLANT MONITORING SYSTEM</span>
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
    document.title = "Garden Buddy — Strathclyde Bahrain E1110";
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
      <a className="skip-link" href="#engineering">
        Skip to interactive circuit schematic
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#hardware">
            <span className="brand-icon">
              <Leaf size={19} />
            </span>
            Garden Buddy<span className="brand-tm">™</span>
          </a>
          <nav className={menu ? "open" : ""} aria-label="Main navigation">
            {[
              ["#architecture", "Overview"],
              ["#simulator", "Software & Demo"],
              ["#engineering", "Interactive Circuit"],
              ["#results", "Results & Future"],
              ["#impact", "Bahrain & SDGs"],
              ["#references", "References"],
              ["#team", "Team"],
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
                  <i /> STRATHCLYDE BAHRAIN <span>/</span> E1110 DUAL-TFT SYSTEM
                </div>
                <div className="deliverable-shortcuts" aria-label="Core project deliverables">
                  <a href="#engineering">
                    Interactive Circuit <ArrowUpRight size={11} />
                  </a>
                  <a href="#results">
                    User Review <ArrowUpRight size={11} />
                  </a>
                  <a href="#impact">
                    UN SDGs <ArrowUpRight size={11} />
                  </a>
                  <a href="#references">
                    References <ArrowUpRight size={11} />
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
                        Meet Garden Buddy. The standalone smart monitor where your plant tells you
                        what is wrong and what it needs—no app and no guesswork.
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
                        Scroll deeper. Nine real hardware modules—from 4×AA + switch + 3.3 V buck to
                        dual SPI TFT screens—come apart to reveal the build.
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
                        Fourteen verified KiCad nets. Zero ERC errors. Follow the power, I²C, analog
                        moisture, and dual-SPI display paths.
                      </p>
                    </>
                  )}
                </div>
                <div className="hero-actions">
                  <a className="primary-button" href="#engineering">
                    Explore interactive circuit <ArrowUpRight size={16} />
                  </a>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setOverride(p > 0.3 ? 0 : 1);
                      setSelected(null);
                    }}
                  >
                    {p > 0.3 ? "Reassemble" : "Explode hardware"} <Plus size={15} />
                  </button>
                </div>
                <div className="hero-caption">
                  <span className="caption-line" /> 1.28″ ROUND GC9A01 · 2.0″ RECT ST7789
                </div>
                {p > 0.68 && (
                  <div className="hero-buses" aria-label="Highlight wiring bus">
                    {[
                      ["all", "All nets · 14"],
                      ["power", "Power rail"],
                      ["i2c", "Shared I²C"],
                      ["spi", "Dual SPI"],
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
                    <small>Scroll down for the full live interactive KiCad circuit schematic.</small>
                  </div>
                )}
              </div>

              <div className={`product-stage ${p > 0.2 ? "exploded" : ""}`}>
                <div className="product-orbit" />
                <div className="orbit orbit-two" />
                <div className="stage-kicker">
                  GARDEN BUDDY{" "}
                  <span>
                    / {phase === 0 ? "ASSEMBLED" : phase === 1 ? "EXPLODED VIEW" : "14-NET MAP"}
                  </span>
                </div>
                <Hardware progress={p} filter={filter} onSelect={setSelected} />
                <div className="stage-bottom">
                  <span>{p > 0.3 ? "TAP A MODULE TO EXPLORE" : "9 MODULES · 14 VERIFIED NETS"}</span>
                  <span>ESP32-C3 DUAL-TFT SYSTEM</span>
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
                  SCROLL TO DISCOVER <small>Watch the system unfold</small>
                </span>
              </div>
              <div className="scroll-progress">
                {["THE COMPANION", "9 MODULES", "14 CONNECTIONS"].map((s, i) => (
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

        <ProblemHook />
        <Architecture />
        <Simulator />
        <Gallery />
        <ResultsAndFuture />
        <Sustainability />
        <References />
        <ContactTeam />
      </main>
      <Footer />
    </>
  );
}
