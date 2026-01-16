"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Space_Grotesk } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const sections = useMemo(
    () => [
      {
        id: "s1",
        headline: "Text the restaurant.\nGet an answer.",
        copy:
          "SeatAI replies to guest texts about hours, policies, and reservations so staff can stay on the floor.",
        theme: lightTheme,
      },
      {
        id: "s2",
        headline: "Fewer calls.\nFewer interruptions.",
        copy:
          "Most messages are predictable. Automate the common ones and keep humans for edge cases.",
        theme: lightTheme,
      },
      {
        id: "s3",
        headline: "Escalate cleanly\nwhen it matters.",
        copy:
          "When a request is ambiguous or high-stakes, route it to a person with the full context.",
        theme: darkTheme,
      },
      {
        id: "s4",
        headline: "Built for real ops,\nnot demos.",
        copy:
          "Responses stay consistent with restaurant rules, not whatever the model feels like today.",
        theme: darkTheme,
      },
      {
        id: "s5",
        headline: "Learn more.",
        copy:
          "If you want to pilot SeatAI, leave your details and we will follow up.",
        theme: lightTheme,
        isForm: true,
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.25;
      let next = 0;

      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= threshold) next = i;
      });

      setActive(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = sections[active].theme;
    const r = document.documentElement;

    Object.entries(t).forEach(([k, v]) =>
      r.style.setProperty(`--${k}`, v)
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

      <div className="mx-auto max-w-4xl px-6 py-20">
        <header className="mb-24">
          <div className="text-3xl font-semibold tracking-tight">SeatAI</div>
          <div className="mt-2 text-sm text-[var(--muted)]">
            Simple guest messaging for restaurants.
          </div>
          <div
            className="mt-6 h-px w-full"
            style={{ backgroundColor: "var(--hairline)" }}
          />
        </header>

        <div className="space-y-48">
          {sections.map((s, i) => (
            <section
              key={s.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="min-h-[70vh] flex flex-col justify-center"
            >
              <h1 className="whitespace-pre-line text-5xl md:text-7xl font-bold leading-[0.9] tracking-[-0.04em]">
                {s.headline}
              </h1>

              <p className="mt-7 max-w-[42ch] text-lg leading-relaxed text-[var(--muted)]">
                {s.copy}
              </p>

              {s.isForm && <LeadForm />}
            </section>
          ))}
        </div>

        <footer className="mt-32 pb-10 text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} SeatAI
        </footer>
      </div>
    </main>
  );
}

/* ---------- Section counter ---------- */

function SectionCounter({ active, total }) {
  return (
    <div className="fixed right-6 top-1/2 z-40 -translate-y-1/2">
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

/* ---------- Form ---------- */

function LeadForm() {
  return (
    <form className="mt-12 max-w-xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field placeholder="Name" />
        <Field placeholder="Company" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field placeholder="Email" />
        <Field placeholder="Phone" />
      </div>
      <textarea
        placeholder="Anything else"
        rows={4}
        className="w-full rounded-xl px-4 py-3 outline-none"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--fg)",
        }}
      />
      <button
        type="button"
        className="rounded-xl px-5 py-3 font-semibold"
        style={{
          backgroundColor: "var(--fg)",
          color: "var(--bg)",
        }}
      >
        Submit
      </button>
    </form>
  );
}

function Field({ placeholder }) {
  return (
    <input
      placeholder={placeholder}
      className="rounded-xl px-4 py-3 outline-none"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--fg)",
      }}
    />
  );
}

/* ---------- Themes ---------- */

const lightTheme = {
  bg: "#F9F7F2",
  fg: "#110000",
  muted: "rgba(17,0,0,0.64)",
  ui: "rgba(17,0,0,0.05)",
  card: "rgba(255,255,255,0.6)",
  border: "rgba(17,0,0,0.12)",
  hairline: "rgba(17,0,0,0.14)",
  shadow: "0 14px 40px rgba(17,0,0,0.10)",
};

const darkTheme = {
  bg: "#110000",
  fg: "#F9F7F2",
  muted: "rgba(249,247,242,0.7)",
  ui: "rgba(255,255,255,0.06)",
  card: "rgba(255,255,255,0.05)",
  border: "rgba(249,247,242,0.16)",
  hairline: "rgba(249,247,242,0.14)",
  shadow: "0 18px 60px rgba(0,0,0,0.45)",
};
