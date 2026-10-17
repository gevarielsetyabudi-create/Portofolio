"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, className = "", delay = 0, y = 28 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.div>
  );
}

export function Img({ im, alt, className = "", eager = false }) {
  return <img src={im.src} width={im.w} height={im.h} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={className} />;
}

// Clickable project image with masked reveal + subtle hover zoom.
export function Tile({ p, onOpen, i = 0, className = "", imgClass = "w-full h-auto", showTitle = true }) {
  const t = p.thumbnail;
  return (
    <Reveal className={className} delay={(i % 3) * 0.06}>
      <button type="button" onClick={() => onOpen(p)} data-cursor="VIEW" aria-label={`View ${p.title}`} className="group block w-full text-left">
        <span className="block overflow-hidden" style={{ background: t.bg }}>
          <Img im={t} alt={`${p.title} — ${p.category}`} className={`${imgClass} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]`} />
        </span>
        {showTitle && (
          <span className="mt-3 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.14em]">
            <span>{p.title}</span><span className="text-mute">{p.category}</span>
          </span>
        )}
      </button>
    </Reveal>
  );
}

export function Cursor() {
  const el = useRef(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOn(true);
    let x = -100, y = -100, cx = -100, cy = -100, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; const t = e.target.closest?.("[data-cursor]"); setLabel(t ? t.dataset.cursor : ""); };
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; if (el.current) el.current.style.transform = `translate3d(${cx}px,${cy}px,0)`; raf = requestAnimationFrame(loop); };
    window.addEventListener("mousemove", move); raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  if (!on) return null;
  return (
    <div ref={el} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference">
      <div className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-white text-[10px] font-medium tracking-[0.18em] text-black transition-[width,height] duration-300 ease-out ${label ? "h-[72px] w-[72px]" : "h-2.5 w-2.5"}`}>{label}</div>
    </div>
  );
}

const links = [["About", "#about"], ["Work", "#work"], ["T-Shirt Design", "#tshirt"], ["Experience", "#experience"], ["Contact", "#contact"]];

export function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; const k = (e) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open]);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-5 py-5 text-white mix-blend-difference md:px-10">
        <a href="#top" data-cursor="OPEN" className="text-sm font-semibold tracking-[0.18em]" onClick={() => setOpen(false)}>GEVARIEL</a>
        <nav aria-label="Primary" className="hidden gap-8 text-[11px] uppercase tracking-[0.18em] md:flex">
          {links.map(([l, h]) => <a key={h} href={h} data-cursor="OPEN" className="opacity-80 transition-opacity hover:opacity-100">{l}</a>)}
        </nav>
        <button type="button" className="-mr-2 px-2 py-2 text-[11px] uppercase tracking-[0.18em] md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile" className="fixed inset-0 z-[65] flex flex-col justify-end bg-ink px-5 pb-12 text-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.6, ease }}>
            {links.map(([l, h], i) => (
              <motion.a key={h} href={h} onClick={() => setOpen(false)} className="border-t border-white/15 py-4 text-[2rem] font-semibold uppercase leading-none tracking-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease }}>{l}</motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// Project detail view. Sections render only when data exists.
export function Detail({ p, onClose, onNav, hasSiblings }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onNav(1); if (e.key === "ArrowLeft") onNav(-1); };
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden"; closeRef.current?.focus();
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose, onNav]);
  const first = p.images[0];
  const grid = p.images.length >= 4;
  const fg = first.dark ? "text-white" : "text-black";
  return (
    <motion.div role="dialog" aria-modal="true" aria-label={p.title} className={`fixed inset-0 z-[80] overflow-y-auto overscroll-contain ${fg}`} style={{ background: first.bg }}
      initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 48 }} transition={{ duration: 0.6, ease }}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-5 text-[11px] uppercase tracking-[0.18em] md:px-10">
        <span>{p.category}</span>
        <button ref={closeRef} type="button" data-cursor="OPEN" onClick={onClose} className="-mr-2 px-2 py-2">Close ✕</button>
      </div>
      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <h2 className="mb-8 text-[clamp(2.2rem,8vw,7rem)] font-semibold uppercase leading-[0.92] tracking-tighter md:mb-14">{p.title}</h2>
        <div className={grid ? "grid grid-cols-2 gap-2 md:grid-cols-3" : "mx-auto flex max-w-[640px] flex-col gap-4"}>
          {p.images.map((im, i) => <Img key={im.src} im={im} eager={i === 0} alt={`${p.title} — ${p.category}${p.images.length > 1 ? `, image ${i + 1}` : ""}`} className="h-auto w-full" />)}
        </div>
        {(p.description || p.process || p.year) && (
          <div className="mx-auto mt-12 grid max-w-[900px] gap-8 text-base leading-relaxed md:grid-cols-2">
            {p.year && <p className="text-[11px] uppercase tracking-[0.18em] opacity-60 md:col-span-2">{p.year}</p>}
            {p.description && <p>{p.description}</p>}
            {p.process && <p>{p.process}</p>}
          </div>
        )}
        {hasSiblings && (
          <div className="mt-16 flex justify-between text-[11px] uppercase tracking-[0.18em]">
            <button type="button" onClick={() => onNav(-1)} data-cursor="VIEW" className="py-3">← Previous</button>
            <button type="button" onClick={() => onNav(1)} data-cursor="VIEW" className="py-3">Next →</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
