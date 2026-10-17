"use client";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import { site } from "../data/site";
import { projects, TSHIRT, categoryMeta, workCategories, aboutPortrait, heroImage } from "../data/projects";
import { Reveal, Img, Tile, Cursor, Nav, Detail, ease } from "./ui";

const label = "text-[11px] uppercase tracking-[0.18em]";
const byCat = (c) => projects.filter((p) => p.category === c);

/* ───────────── HERO ───────────── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-paper">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.img src={heroImage.src} alt="" aria-hidden="true" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 0.55, scale: 1 }} transition={{ duration: 2.2, ease }} className="h-full w-full object-cover" />
      </motion.div>
      <motion.div style={{ opacity: fade }} className="relative flex h-full flex-col justify-end px-5 pb-8 md:px-10 md:pb-10">
        <h1 aria-label="Gevariel" className="font-semibold leading-[0.82] tracking-tighter text-[clamp(3rem,16.5vw,19rem)]">
          {site.name.split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.2 + i * 0.05, ease }}>{c}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1, ease }} className={`mt-6 ${label} md:mt-8`}>
          {site.disciplines.join(" · ")}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }} className={`mt-10 flex items-end justify-between ${label} text-paper/70`}>
          <span>Based in {site.location}</span>
          <a href="#about" data-cursor="OPEN" className="flex items-center gap-3">Scroll to explore <span className="relative block h-10 w-px overflow-hidden bg-white/20"><span className="cue absolute inset-0 bg-white" /></span></a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────────── ABOUT ───────────── */
function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="px-5 py-24 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1500px] gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-3"><h2 id="about-h" className={label}>(01) About</h2></Reveal>
        <div className="md:col-span-9">
          <Reveal><p className="text-[clamp(2rem,5.6vw,5.5rem)] font-semibold leading-[0.98] tracking-tighter">
            {site.disciplines[0]}, {site.disciplines[1].toLowerCase()} and {site.disciplines[2].toLowerCase()} — based in {site.location}.
          </p></Reveal>
          <div className="mt-14 grid items-start gap-10 md:mt-24 md:grid-cols-[minmax(0,260px)_1fr] md:gap-16">
            <Reveal><div className="w-[min(70%,260px)]"><Img im={aboutPortrait} alt={`Portrait of ${site.fullName}`} className="h-auto w-full" /></div></Reveal>
            <Reveal delay={0.1}><div className="max-w-xl space-y-4 text-lg leading-relaxed md:text-xl">{site.about.map((t) => <p key={t}>{t}</p>)}</div></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── CATEGORY LAYOUTS (each category gets its own composition) ───────────── */
function Strip({ p, onOpen, className = "" }) {
  const ims = p.images.slice(0, 3);
  const ar = (i) => i.w / i.h;
  const equal = Math.abs(ar(ims[0]) - ar(ims[1])) < 0.1;
  const stack = ims[2] ? 1 / (1 / ar(ims[1]) + 1 / ar(ims[2])) : ar(ims[1]);
  return (
    <Reveal className={className}>
      <button type="button" onClick={() => onOpen(p)} data-cursor="VIEW" aria-label={`View ${p.title}`} className="group block w-full text-left">
        {equal ? (
          <span className="grid grid-cols-3 gap-1 overflow-hidden">{ims.map((im) => <Img key={im.src} im={im} alt="" className="h-auto w-full" />)}</span>
        ) : (
          <span className="grid gap-1 overflow-hidden" style={{ gridTemplateColumns: `${ar(ims[0])}fr ${stack}fr` }}>
            <Img im={ims[0]} alt="" className="h-full w-full object-cover" />
            <span className="grid gap-1">{ims.slice(1).map((im) => <Img key={im.src} im={im} alt="" className="h-full w-full object-cover" />)}</span>
          </span>
        )}
        <span className={`mt-3 flex justify-between gap-4 ${label.replace("0.18", "0.14")}`}><span>{p.title}</span><span className="text-mute">{p.images.length} images</span></span>
      </button>
    </Reveal>
  );
}

const edPattern = ["md:col-span-8", "md:col-span-4 md:mt-36", "md:col-span-12", "md:col-span-5", "md:col-span-7 md:mt-24"];
function Editorial({ items, onOpen }) {
  return (
    <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6 md:gap-y-12">
      {items.map((p, i) => p.images.length > 1
        ? <Strip key={p.slug} p={p} onOpen={onOpen} className={edPattern[i % edPattern.length]} />
        : <Tile key={p.slug} p={p} i={i} onOpen={onOpen} className={edPattern[i % edPattern.length]} />)}
    </div>
  );
}

function ProductBlock({ items, onOpen }) {
  return (
    <div className="grid items-start gap-y-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
      {items.map((p, i) => p.images.length > 1
        ? <Strip key={p.slug} p={p} onOpen={onOpen} className="md:col-span-7 md:mt-20" />
        : <Tile key={p.slug} p={p} i={i} onOpen={onOpen} className="md:col-span-5" />)}
    </div>
  );
}

function Mosaic({ items, onOpen, flip }) {
  return (
    <div className="space-y-16 md:space-y-28">
      {items.map((p) => (
        <div key={p.slug} className="grid items-start gap-6 md:grid-cols-12 md:gap-10">
          <div className={`md:col-span-4 md:sticky md:top-28 ${flip ? "md:order-2" : ""}`}>
            <Reveal><h4 className="text-3xl font-semibold leading-none tracking-tighter md:text-5xl">{p.title}</h4>
              <button type="button" onClick={() => onOpen(p)} data-cursor="VIEW" className={`mt-6 border-b border-current pb-1 ${label}`}>View all {p.images.length} →</button></Reveal>
          </div>
          <Reveal className={`md:col-span-8 ${flip ? "md:order-1" : ""}`}>
            <button type="button" onClick={() => onOpen(p)} data-cursor="VIEW" aria-label={`View ${p.title}`} className="group block w-full">
              <span className="grid grid-cols-3 gap-1 overflow-hidden">{p.images.slice(0, 9).map((im, i) => <Img key={im.src} im={im} alt={i === 0 ? `${p.title} — ${p.category}` : ""} className="h-auto w-full transition-transform duration-[1200ms] group-hover:scale-[1.02]" />)}</span>
            </button>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function FlyerGrid({ items, onOpen }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
      {items.map((p, i) => <Tile key={p.slug} p={p} i={i} onOpen={onOpen} className={i % 3 === 1 ? "md:mt-20" : ""} />)}
    </div>
  );
}

function DefaultGrid({ items, onOpen }) {
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p, i) => <Tile key={p.slug} p={p} i={i} onOpen={onOpen} />)}</div>;
}

// Add a category → add an entry here for a custom layout, otherwise DefaultGrid is used.
const layouts = { Photography: Editorial, Product: ProductBlock, Instagram: Mosaic, "Feed Template": Mosaic, Flyer: FlyerGrid };

/* ───────────── SELECTED WORKS ───────────── */
function Work({ onOpen }) {
  const cats = workCategories();
  const [cat, setCat] = useState("All");
  return (
    <section id="work" aria-labelledby="work-h" className="px-5 pb-12 pt-8 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <h2 id="work-h" className="text-[clamp(3rem,11vw,11rem)] font-semibold uppercase leading-[0.86] tracking-tighter">Selected<br />Works</h2>
          <div role="group" aria-label="Filter works by category" className="mt-10 flex flex-wrap gap-2">
            {["All", ...cats].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border border-ink px-4 py-2.5 ${label} transition-colors ${cat === c ? "bg-ink text-paper" : "hover:bg-ink/10"}`}>{c}</button>
            ))}
          </div>
        </Reveal>
        <div className="mt-16 space-y-28 md:mt-28 md:space-y-48">
          <AnimatePresence mode="popLayout">
            {cats.filter((c) => cat === "All" || cat === c).map((c, idx) => {
              const Layout = layouts[c] || DefaultGrid;
              return (
                <motion.div key={c} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <div className="mb-8 flex items-end justify-between gap-6 border-t border-ink pt-4 md:mb-16">
                    <h3 className="text-[clamp(1.8rem,5vw,4.5rem)] font-semibold uppercase leading-none tracking-tighter">{c}</h3>
                    {categoryMeta[c]?.sub && <p className="max-w-[16rem] text-right text-sm text-mute">{categoryMeta[c].sub}</p>}
                  </div>
                  <Layout items={byCat(c)} onOpen={onOpen} flip={idx % 2 === 1} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────────── T-SHIRT DESIGN ───────────── */
function TShirts({ onOpen }) {
  const items = byCat(TSHIRT);
  if (!items.length) return null;
  return (
    <section id="tshirt" aria-labelledby="tshirt-h" className="mt-28 bg-ink px-5 py-24 text-paper md:mt-48 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className={`${label} text-mute`}>{String(items.length).padStart(2, "0")} designs — {categoryMeta[TSHIRT].sub}</p>
          <h2 id="tshirt-h" className="mt-4 text-[clamp(3rem,11vw,11rem)] font-semibold uppercase leading-[0.86] tracking-tighter">T-Shirt<br />Design</h2>
        </Reveal>
        <div className="mt-16 grid items-end gap-x-6 gap-y-14 md:mt-28 md:grid-cols-12 md:gap-y-24">
          {items.map((p, i) => (
            <Reveal key={p.slug} className={p.featured ? "md:col-span-7" : "md:col-span-5"} delay={(i % 2) * 0.08}>
              <button type="button" onClick={() => onOpen(p)} data-cursor="VIEW" aria-label={`View ${p.title}`} className="group block w-full text-left">
                <span className={`grid place-items-center overflow-hidden ${p.featured ? "aspect-[5/4]" : "aspect-square"}`} style={{ background: p.thumbnail.bg }}>
                  <Img im={p.thumbnail} alt={`${p.title} — T-shirt artwork`} className="h-auto w-[78%] max-w-[460px] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045]" />
                </span>
                <span className={`mt-4 flex items-baseline gap-4 ${label.replace("0.18", "0.14")}`}>
                  <span className="text-mute">{String(i + 1).padStart(2, "0")}</span><span>{p.title}</span><span className="ml-auto text-mute">{TSHIRT}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── STATEMENT / EXPERIENCE ───────────── */
function Statement() {
  return (
    <section id="experience" aria-label="Experience" className="px-5 py-32 md:px-10 md:py-56">
      <div className="mx-auto max-w-[1500px]">
        <Reveal><p className="text-[clamp(2.6rem,10vw,10rem)] font-semibold uppercase leading-[0.88] tracking-tighter">More visual<br />more experience</p></Reveal>
        {site.experience.length > 0 && (
          <ul className="mt-20 border-t border-ink">
            {site.experience.map((e, i) => (
              <li key={i} className="grid gap-1 border-b border-ink/20 py-5 md:grid-cols-12"><span className="md:col-span-3 text-mute">{e.period}</span><span className="md:col-span-5 font-semibold">{e.role}</span><span className="md:col-span-4">{e.where}</span></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ───────────── CONTACT + CLOSING ───────────── */
function Contact() {
  const c = site.contact;
  const rows = [["Email", c.email, c.email && `mailto:${c.email}`], ["Instagram", c.instagram, c.instagram], ["WhatsApp", c.whatsapp, c.whatsapp], ["LinkedIn", c.linkedin, c.linkedin], ["Portfolio PDF", site.pdf && "Download", site.pdf]].filter((r) => r[1]);
  return (
    <section id="contact" aria-labelledby="contact-h" className="bg-ink px-5 pb-10 pt-24 text-paper md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-3"><h2 id="contact-h" className={label}>(02) Contact</h2></Reveal>
          <Reveal className="md:col-span-9">
            {rows.length ? (
              <ul>{rows.map(([k, v, href]) => (
                <li key={k} className="border-t border-white/15"><a href={href} data-cursor="OPEN" {...(href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="flex items-baseline justify-between gap-6 py-5 text-[clamp(1.5rem,4vw,3.5rem)] font-semibold tracking-tighter"><span className={`${label} text-mute`}>{k}</span><span className="break-all text-right">{v}</span></a></li>
              ))}</ul>
            ) : <p className="border-t border-white/15 pt-5 text-[clamp(1.5rem,4vw,3.5rem)] font-semibold tracking-tighter text-paper/60">Contact details coming soon.</p>}
          </Reveal>
        </div>
        <div className="mt-28 border-t border-white/15 pt-16 md:mt-48 md:pt-24">
          <Reveal y={40}><h2 className="text-[clamp(2.6rem,10vw,10rem)] font-semibold uppercase leading-[0.88] tracking-tighter">Thank you<br />for watching</h2></Reveal>
          <Reveal delay={0.3}><div className={`mt-16 flex items-end justify-between md:mt-28 ${label}`}><span>Warm regards</span><span>{site.name}</span></div></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── PAGE ───────────── */
export default function Portfolio() {
  const [open, setOpen] = useState(null);
  const onOpen = useCallback((p) => setOpen(p), []);
  const onClose = useCallback(() => setOpen(null), []);
  const onNav = useCallback((d) => setOpen((cur) => {
    if (!cur) return cur;
    const l = byCat(cur.category); const i = l.findIndex((x) => x.slug === cur.slug);
    return l[(i + d + l.length) % l.length];
  }), []);
  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="sr-only z-[90] bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Cursor />
      <Nav />
      <main>
        <Hero /><About /><Work onOpen={onOpen} /><TShirts onOpen={onOpen} /><Statement /><Contact />
      </main>
      <AnimatePresence>
        {open && <Detail key={open.slug} p={open} onClose={onClose} onNav={onNav} hasSiblings={byCat(open.category).length > 1} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
