"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";

/* ---------- Font ---------- */

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* ---------- Section Counter ---------- */

function SectionCounter({ active, total }) {
  return (
    <div className="hidden md:block fixed right-6 top-1/2 z-40 -translate-y-1/2">
      <div className="flex flex-col items-end gap-3">
        <div className="text-xs text-[var(--muted)] tracking-wide">
          {active + 1} / {total}
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full transition-all"
              style={{
                backgroundColor:
                  i === active ? "var(--fg)" : "var(--hairline)",
                transform: i === active ? "scale(1.1)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function Home() {
  const sections = useMemo(
    () => [
      {
        id: "s1",
        headline: "Text the restaurant.\nGet an answer.",
        copy:
          "SeatAI replies to guest texts about hours, policies, and reservations so staff can stay on the floor.",
        theme: theme1,
      },
      {
        id: "s2",
        headline: "Fewer calls.\nFewer interruptions.",
        copy:
          "Most messages are predictable. Automate the common ones and keep humans for edge cases.",
        theme: theme2,
      },
      {
        id: "s3",
        headline: "Escalate cleanly\nwhen it matters.",
        copy:
          "When a request is ambiguous or high-stakes, route it to a person with the full context.",
        theme: theme3,
      },
      {
        id: "s4",
        headline: "Built for real ops,\nnot demos.",
        copy:
          "Responses stay consistent with restaurant rules, not whatever the model feels like today.",
        theme: theme4,
      },
      {
        id: "s5",
        headline: "FAQ",
        copy: "Common questions from operators evaluating SeatAI.",
        theme: theme5,
        isFAQ: true,
      },
      {
        id: "s6",
        headline: "Learn more.",
        copy:
          "If you want to pilot SeatAI, leave your details and we will follow up.",
        theme: theme6,
        isForm: true,
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);

  // Robust section tracking: choose the most-visible section near the viewport center.
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean);
    if (!els.length) return;

    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          let bestIdx = null;
          let bestRatio = 0;

          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const idx = Number(entry.target.dataset.idx);
            if (Number.isNaN(idx)) continue;

            if (entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              bestIdx = idx;
            }
          }

          if (bestIdx !== null) {
            setActive((prev) => (prev === bestIdx ? prev : bestIdx));
          }
        });
      },
      {
        root: null,
        threshold: [0.05, 0.12, 0.2, 0.35, 0.5, 0.65],
        rootMargin: "-35% 0px -45% 0px",
      }
    );

    els.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Apply theme vars (used throughout the UI).
  useEffect(() => {
    const theme = sections[active]?.theme || theme1;
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v)
    );
  }, [active, sections]);

  return (
    <main
      className={`${grotesk.className} min-h-screen`}
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
        transition: "background-color 700ms ease, color 700ms ease",
      }}
    >
      <SectionCounter active={active} total={sections.length} />

      <div className="mx-auto max-w-6xl px-5 md:px-6 py-16 md:py-20">
        <header className="mb-14 md:mb-16">
          <div className="text-3xl font-semibold tracking-tight">SeatAI</div>
          <div className="mt-2 text-sm text-[var(--muted)]">
            Simple guest messaging for restaurants.
          </div>
          <div
            className="mt-6 h-px w-full"
            style={{ backgroundColor: "var(--hairline)" }}
          />
        </header>

        <div className="space-y-28 md:space-y-40">
          {sections.map((s, i) => (
            <section
              key={s.id}
              data-idx={i}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="min-h-[70vh] flex flex-col justify-center"
            >
              <h1 className="whitespace-pre-line break-words text-5xl md:text-7xl font-bold leading-[0.95] md:leading-[0.9] tracking-[-0.04em]">
                {s.headline}
              </h1>

              {s.copy && (
                <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-[var(--muted)]">
                  {s.copy}
                </p>
              )}

              {s.isFAQ && <FAQ />}

              {s.isForm && <LeadForm />}
            </section>
          ))}
        </div>

        <footer className="mt-24 pb-10 text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} SeatAI
        </footer>
      </div>
    </main>
  );
}

/* ---------- FAQ ---------- */

function FAQ() {
  const items = useMemo(
    () => [
      {
        q: "What is SeatAI?",
        a: "SeatAI is an AI messaging layer for restaurants. Guests text a real phone number and get accurate answers about hours, policies, reservations, large parties, and common ops questions.",
      },
      {
        q: "Does SeatAI take reservations?",
        a: "SeatAI can direct guests into your existing reservation flow (e.g., Resy) and handle the surrounding questions that staff usually answers by phone or DM. We can also route edge cases to a human when needed.",
      },
      {
        q: "How do you keep answers accurate?",
        a: "SeatAI is constrained by restaurant-specific rules and an explicit knowledge base. When confidence is low or the request is high-stakes, it escalates with full context instead of guessing.",
      },
      {
        q: "What happens when the AI can’t handle a request?",
        a: "It escalates cleanly: the message, context, and suggested response can be routed to a manager or inbox so a human can reply quickly without losing the thread.",
      },
      {
        q: "What channels do you support?",
        a: "SMS is the baseline. Depending on your setup, we can support WhatsApp and other messaging surfaces where guests already contact you.",
      },
      {
        q: "How fast is onboarding?",
        a: "Fast pilots are the goal. We start with your core policies and reservation links, test aggressively, and then expand coverage based on real guest messages.",
      },
    ],
    []
  );

  // Start closed
  const [open, setOpen] = useState(-1);

  const rowBase = {
    border: `1px solid var(--border)`,
    backgroundColor: "var(--ui)",
  };

  const rowOpen = {
    border: `1px solid var(--border)`,
backgroundColor: "rgba(255,255,255,0.92)",

  };

  return (
    <div className="mt-10 w-full max-w-3xl">
      <div className="space-y-4">
        {items.map((it, idx) => {
          const isOpen = open === idx;
          return (
            <AccordionRow
              key={idx}
              isOpen={isOpen}
              title={it.q}
              body={it.a}
              onToggle={() => setOpen(isOpen ? -1 : idx)}
              rowStyle={isOpen ? rowOpen : rowBase}
            />
          );
        })}
      </div>
    </div>
  );
}

function AccordionRow({ isOpen, title, body, onToggle, rowStyle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      const next = el.scrollHeight || 0;
      setHeight(next);
      const t = setTimeout(() => {
        if (!contentRef.current) return;
        setHeight(contentRef.current.scrollHeight || 0);
      }, 60);
      return () => clearTimeout(t);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="rounded-2xl overflow-hidden" style={rowStyle}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 px-5 py-5 text-left"
        aria-expanded={isOpen}
      >
        <div className="text-base font-semibold">{title}</div>
        <div className="flex-none text-lg" style={{ color: "var(--fg)" }}>
          {isOpen ? "×" : "↓"}
        </div>
      </button>

      <div
        style={{
          maxHeight: isOpen ? height : 0,
          overflow: "hidden",
          transition: "max-height 220ms ease",
        }}
      >
        <div
          ref={contentRef}
          className="px-5 pb-5 -mt-1 text-[15px] leading-relaxed"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0px)" : "translateY(-2px)",
            transition: "opacity 160ms ease, transform 160ms ease",
          }}
        >
          <div style={{ color: "var(--muted)" }}>{body}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Lead Form ---------- */

function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function formatPhone(v) {
    const d = v.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.company.trim()) e.company = true;
    if (!form.email.trim()) e.email = true;
    if (form.phone.replace(/\D/g, "").length !== 10) e.phone = true;
    if (!form.message.trim()) e.message = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    setErrorMsg("");
    if (!validate()) return;

    setStatus("sending");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\D/g, ""),
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }

      if (data && data.ok === false) {
        const msg = data.error || data.message || "Request failed";
        throw new Error(msg);
      }

      setStatus("sent");
    } catch (err) {
      const msg =
        err && typeof err.message === "string" && err.message
          ? err.message
          : "Failed to submit. Try again.";
      setErrorMsg(msg);
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  const inputStyle = (err) => ({
    backgroundColor: "var(--card)",
    border: `1px solid ${err ? "rgba(180,0,0,0.45)" : "var(--border)"}`,
    color: "var(--fg)",
    fontSize: 16, // prevents iOS zoom on focus
  });

  // Inline "Required" for inputs (left aligned).
  const inlineReqStyle = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 11,
    lineHeight: "11px",
    color: "rgba(180,0,0,0.7)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  // For the textarea, we want "Required" near the top-left (not vertically centered),
  // because centering looks weird in a tall field.
  const textareaReqStyle = {
    position: "absolute",
    left: 14,
    top: 14,
    fontSize: 11,
    lineHeight: "11px",
    color: "rgba(180,0,0,0.7)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  return (
    <form className="mt-12 w-full max-w-xl space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldInlineError
          placeholder="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          error={errors.name}
          style={inputStyle(errors.name)}
          inlineReqStyle={inlineReqStyle}
          autoComplete="name"
        />
        <FieldInlineError
          placeholder="Company"
          value={form.company}
          onChange={(v) => setForm({ ...form, company: v })}
          error={errors.company}
          style={inputStyle(errors.company)}
          inlineReqStyle={inlineReqStyle}
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldInlineError
          placeholder="Email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          error={errors.email}
          style={inputStyle(errors.email)}
          inlineReqStyle={inlineReqStyle}
          inputMode="email"
          autoComplete="email"
        />
        <FieldInlineError
          placeholder="Phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: formatPhone(v) })}
          error={errors.phone}
          style={inputStyle(errors.phone)}
          inlineReqStyle={inlineReqStyle}
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          placeholder="Anything else"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl px-4 py-3 outline-none resize-none"
          style={{
            ...inputStyle(errors.message),
            // Reserve space for the top-left "Required" label in the textarea.
            paddingTop: errors.message ? 28 : 12,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        />
        {errors.message && <div style={textareaReqStyle}>Required</div>}
      </div>

      <button
        type="submit"
        className="rounded-xl px-5 py-3 font-semibold"
        style={{
          backgroundColor: "var(--fg)",
          color: "var(--bg)",
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "sending"
          ? "Sending…"
          : status === "sent"
          ? "Submitted"
          : "Submit"}
      </button>

      {status === "error" && (
        <div className="text-sm text-[var(--muted)]">
          {errorMsg || "Failed to submit. Try again."}
        </div>
      )}

      {status === "sent" && (
        <div className="text-sm text-[var(--muted)]">
          Thanks — we’ll follow up.
        </div>
      )}
    </form>
  );
}

function FieldInlineError({
  placeholder,
  value,
  onChange,
  style,
  error,
  inlineReqStyle,
  inputMode,
  autoComplete,
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 outline-none"
        style={{
          ...style,
          paddingLeft: error ? 84 : 16, // makes room for "Required" on the left
          paddingRight: 16,
        }}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
      {error && <div style={inlineReqStyle}>Required</div>}
    </div>
  );
}

/* ---------- Themes (neutral, more noticeable per section) ---------- */

const base = {
  fg: "#110000",
  muted: "rgba(17,0,0,0.62)",
  card: "rgba(255,255,255,0.62)",
  border: "rgba(17,0,0,0.12)",
  hairline: "rgba(17,0,0,0.14)",
};

/* ---------- Themes (REALFOOD-STYLE, HIGH-CONTRAST PER SECTION) ---------- */

/**
 * Design rule:
 * Each section = a different ingredient / room.
 * Background, text, UI, borders all move together.
 */

const theme1 = {
  // PAPER / INTRO
  bg: "#FBF6EC",
  fg: "#1A0F0A",
  muted: "rgba(26,15,10,0.60)",
  card: "rgba(255,255,255,0.75)",
  border: "rgba(26,15,10,0.14)",
  hairline: "rgba(26,15,10,0.18)",
  ui: "rgba(26,15,10,0.045)",
};

const theme2 = {
  // LEAF / AUTOMATION
  bg: "#0F6B43",
  fg: "#F5FFF9",
  muted: "rgba(245,255,249,0.72)",
  card: "rgba(255,255,255,0.14)",
  border: "rgba(255,255,255,0.22)",
  hairline: "rgba(255,255,255,0.26)",
  ui: "rgba(255,255,255,0.10)",
};

const theme3 = {
  // SKY / ESCALATION
  bg: "#2C6FA3",
  fg: "#F7FBFF",
  muted: "rgba(247,251,255,0.75)",
  card: "rgba(255,255,255,0.16)",
  border: "rgba(255,255,255,0.22)",
  hairline: "rgba(255,255,255,0.26)",
  ui: "rgba(255,255,255,0.11)",
};

const theme4 = {
  // CLAY / OPS
  bg: "#8B3E2F",
  fg: "#FFF6F3",
  muted: "rgba(255,246,243,0.72)",
  card: "rgba(255,255,255,0.18)",
  border: "rgba(255,255,255,0.24)",
  hairline: "rgba(255,255,255,0.28)",
  ui: "rgba(255,255,255,0.12)",
};

const theme5 = {
  // FAQ — calm paper, editorial, readable
  bg: "#F4F1EA",            // warm off-white (paper, not grain)
  fg: "#1A1A1A",            // neutral ink
  muted: "rgba(26,26,26,0.60)",
  card: "rgba(255,255,255,0.92)", // FAQ rows feel crisp
  border: "rgba(26,26,26,0.14)",
  hairline: "rgba(26,26,26,0.18)",
  ui: "rgba(26,26,26,0.045)",
};

const theme6 = {
  // CHARCOAL / CTA
  bg: "#1B1B1B",
  fg: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  card: "rgba(255,255,255,0.14)",
  border: "rgba(255,255,255,0.22)",
  hairline: "rgba(255,255,255,0.28)",
  ui: "rgba(255,255,255,0.10)",
};
