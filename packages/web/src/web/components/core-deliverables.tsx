import { useState } from "react";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";
import { Board } from "./hardware";
import { modules, datasheets, team } from "./project-data";

const componentDocuments: Record<string, string[]> = {
  U1: ["ESP32-C3"],
  U2: [],
  BT1: [],
  B1: ["TLC555"],
  B2: ["AHT20", "BMP280"],
  B3: ["BH1750FVI", "GY-302"],
  DS1: ["GC9A01"],
  DS2: ["SSD1306"],
};
const electricalSpecs: Record<string, string> = {
  U1: "3.3 V logic · 160 MHz RISC-V · USB-C · ceramic antenna",
  U2: "4.75–40 V input · fixed 3.3 V output · project DMM target +3.30 V",
  BT1: "7.4 V nominal · 6.0–8.4 V range · integrated 2S BMS required",
  B1: "3.3 V supply · analog AOUT 1.20–2.50 V · GPIO4 ADC1_CH4",
  B2: "3.3 V system rail · I²C 0x38 + 0x76/0x77 · ±0.3 °C / ±2 %RH / ±1 hPa under stated conditions",
  B3: "3.3 V system rail · I²C 0x23 · ADDR → GND · nominal 1–65,535 lx",
  DS1: "3.3 V logic · 7-pin SPI · 240 × 240 RGB · 1.28″ round IPS",
  DS2: "3.3 V system rail · 4-pin I²C 0x3C · 128 × 64 monochrome · 0.96″",
};
export function ComponentCards() {
  return (
    <section className="component-library" aria-labelledby="component-cards-title">
      <div className="component-library-head">
        <h3 id="component-cards-title">8 Hardware Components & Datasheets</h3>
        <p>Native hardware diagrams, key electrical specs, and primary IC documentation.</p>
      </div>
      <div className="hardware-cards">
        {modules.map((m) => (
          <article className="hardware-card" key={m.id}>
            <div className="hardware-card-visual">
              <span>{m.id}</span>
              <svg
                viewBox={`-15 -10 ${m.w + 30} ${m.h + 30}`}
                aria-label={`Illustrative ${m.part} module diagram`}
              >
                <Board {...m} />
              </svg>
              <small>NATIVE MODULE DIAGRAM</small>
            </div>
            <div className="hardware-card-body">
              <span className="hardware-ref">{m.id} / PROJECT HARDWARE</span>
              <h4>
                {m.id === "U2"
                  ? "DD4012SA 3.3 V Buck"
                  : m.id === "BT1"
                    ? "2S 7.4 V Li-ion Pack"
                    : m.id === "B1"
                      ? "Capacitive Soil Sensor v1.2 / TLC555"
                      : m.part}
              </h4>
              <p className="electrical-spec">{electricalSpecs[m.id]}</p>
              <p>{m.detail}</p>
              <div className="hardware-pin-spec">{m.spec}</div>
              <div className="component-docs">
                {componentDocuments[m.id].map((name) => {
                  const doc = datasheets.find((d) => d[0] === name)!;
                  return (
                    <a key={name} href={doc[2]} target="_blank" rel="noreferrer">
                      <span>
                        {name} {name === "GY-302" ? "module guide" : "datasheet"}
                        <small>{doc[1]}</small>
                      </span>
                      <ArrowUpRight size={14} />
                    </a>
                  );
                })}
                {!componentDocuments[m.id].length && (
                  <>
                    <a href="/images/schematic.svg" target="_blank" rel="noreferrer">
                      Project electrical specification <ArrowUpRight size={14} />
                    </a>
                    <small className="document-caveat">
                      No verified manufacturer datasheet supplied for this{" "}
                      {m.id === "BT1" ? "battery pack" : "converter module"}; see the project
                      schematic.
                    </small>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="verification-note">
        Diagrams are illustrative, not dimensionally accurate CAD. IC datasheets do not certify a
        generic breakout board. Manufacturer documents, distributor mirrors and supplier guides are
        labeled individually.
      </p>
    </section>
  );
}

export function ContactTeam() {
  const [status, setStatus] = useState<Record<string, string>>({});
  async function copyEmail(email: string) {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
      else {
        const field = document.createElement("textarea");
        field.value = email;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("Copy unavailable");
      }
      setStatus((v) => ({ ...v, [email]: "Email copied" }));
    } catch {
      setStatus((v) => ({ ...v, [email]: "Copy unavailable — select the email above" }));
    }
  }
  return (
    <section className="contact-section" id="team">
      <div className="wrap">
        <div className="section-label">
          <span>05</span>
          <span>E1110 / DIRECT TEAM CONTACTS</span>
        </div>
        <div className="section-heading">
          <h2>Contact Team.</h2>
          <p>
            Questions about the schematic, hardware or research?
            <br />
            Contact the University of Strathclyde Bahrain project team.
          </p>
        </div>
        <div className="contact-cards">
          {team.map(([name, email], i) => (
            <article className="contact-card" key={email}>
              <div className="contact-card-top">
                <span>0{i + 1}</span>
                <span>E1110 PROJECT TEAM</span>
              </div>
              <h3>{name}</h3>
              <a className="visible-email" href={`mailto:${email}`}>
                {email}
              </a>
              <div className="contact-actions">
                <a href={`mailto:${email}`}>
                  <Mail size={15} /> Email {name.split(" ")[0]}
                </a>
                <button aria-label={`Copy email for ${name}`} onClick={() => copyEmail(email)}>
                  {status[email] === "Email copied" ? <Check size={15} /> : <Copy size={15} />} Copy
                  email
                </button>
              </div>
              <output className="copy-status" aria-live="polite">
                {status[email] || "One click to email. One click to copy."}
              </output>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
