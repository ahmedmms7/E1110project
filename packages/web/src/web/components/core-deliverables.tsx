import { useState } from "react";
import { ArrowUpRight, Mail, Copy, Check } from "lucide-react";
import { modules, datasheets, team } from "./project-data";

export function ComponentCards() {
  return (
    <section className="component-library" aria-labelledby="component-cards-title">
      <div className="component-library-head">
        <h3 id="component-cards-title">9 Hardware Components &amp; Datasheets</h3>
        <p>
          Real physical hardware modules from the submitted E1110 poster, electrical specs, GPIO
          pinouts, and IC documentation.
        </p>
      </div>
      <div className="hardware-cards hardware-cards-9">
        {modules.map((m) => (
          <article className="hardware-card" key={m.id}>
            <div className="hardware-card-visual">
              <span>{m.id}</span>
              <img
                src={m.image}
                alt={`${m.part} physical hardware module`}
                loading="lazy"
                className="hardware-real-photo"
              />
              <small>{m.role.toUpperCase()}</small>
            </div>
            <div className="hardware-card-body">
              <span className="hardware-ref">{m.id} / PHYSICAL HARDWARE</span>
              <h4>{m.part}</h4>
              <p className="electrical-spec">{m.supply}</p>
              <p>{m.detail}</p>
              <div className="hardware-pin-spec">{m.spec}</div>
              <div className="component-docs">
                {m.datasheetNames.map((name) => {
                  const doc = datasheets.find((d) => d[0] === name);
                  if (!doc) return null;
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
                {!m.datasheetNames.length && (
                  <>
                    <a href="#schematic-viewer">
                      Inspect live on interactive schematic <ArrowUpRight size={14} />
                    </a>
                    <small className="document-caveat">
                      {m.id === "BT1"
                        ? "Four 1.5 V AA cells in series (6.0 V total) wired into SW1."
                        : m.id === "SW1"
                          ? "Series SPST power cutoff isolating the 6.0 V input to U2."
                          : "Fixed 3.3 V buck converter supplying peripherals only (isolated from U1 USB-C)."}
                    </small>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="verification-note">
        All 9 hardware blocks match the KiCad 10 schematic (14 verified nets, 0 ERC errors, 0 ERC
        warnings). All original component datasheets remain linked below in Section 06.
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
          <span>07</span>
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
