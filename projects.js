// ─────────────────────────────────────────────────────────────
// THE ONLY FILE YOU NEED TO EDIT TO ADD WORK.
// 1. Upload images to /public/work/ named  <slug>-1.webp, <slug>-2.webp …  (jpg/png also fine: see `ext`)
// 2. Add ONE line to `projects` below. A new `category` appears automatically.
// 3. Optional: bg (artwork background colour), dark (true if bg is dark), size: [width, height].
// ─────────────────────────────────────────────────────────────
import dims from "./dims.json";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
// img("slug", 3) → the first 3 images of /public/work/slug
const img = (slug, count = 1, o = {}) =>
  Array.from({ length: count }, (_, i) => {
    const d = dims[`${slug}/${i + 1}`] || { w: o.size?.[0] || 1200, h: o.size?.[1] || 1200, bg: "#0b0b0b", dark: true };
    return { src: `${base}/work/${slug}-${i + 1}.${o.ext || "webp"}`, ...d, ...(o.bg ? { bg: o.bg } : {}), ...(o.dark !== undefined ? { dark: o.dark } : {}) };
  });

export const TSHIRT = "T-Shirt Design";

// Order of category blocks on the page. Unlisted categories are appended automatically.
export const categoryOrder = ["Photography", "Product", "Instagram", "Feed Template", "Flyer"];
export const categoryMeta = {
  Photography: { sub: "photography is an austere and blazing poetry of the real." },
  Flyer: { sub: "Event / Promotions" },
  [TSHIRT]: { sub: "Apparel artwork" },
};

const p = (slug, title, category, count = 1, extra = {}) => {
  const images = img(slug, count, extra);
  return { slug, title, category, images, thumbnail: images[0], description: "", featured: false, ...extra };
};

// description / process / year are optional — they only render when filled in.
export const projects = [
  // ── T-SHIRT DESIGN ──
  p("tshirt-vision", "VISION", TSHIRT, 1, { featured: true }),
  p("tshirt-truth-lies-in-chaos", "TRUTH LIES IN CHAOS", TSHIRT),
  p("tshirt-hungry-co", "HUNGRY&CO", TSHIRT),
  p("tshirt-huco-rider", "HUCO RIDER", TSHIRT, 1, { featured: true }),
  p("tshirt-hucodvsn-skull", "HUCODVSN SKULL", TSHIRT, 1, { featured: true }),
  p("tshirt-h-logo", "H LOGO", TSHIRT),
  // ── PHOTOGRAPHY ──
  p("photography-01", "Photography 01", "Photography", 1, { featured: true }),
  p("photography-02", "Photography 02", "Photography"),
  p("photography-03", "Photography 03", "Photography", 3),
  // ── PRODUCT ──
  p("product-01", "Product 01", "Product", 1, { featured: true }),
  p("product-02", "Product 02", "Product", 3),
  // ── SOCIAL ──
  p("instagram-not-plastic", "Not Plastic. Fantastic!", "Instagram", 9),
  p("feed-data-privacy", "Data Privacy", "Feed Template", 9),
  // ── FLYER · EVENT / PROMOTIONS ──
  p("flyer-halloween", "Halloween", "Flyer"),
  p("flyer-happy-hour", "Happy Hour", "Flyer"),
  p("flyer-pizza-up", "Pizza-Up", "Flyer"),
  p("flyer-sundays", "Sundays", "Flyer"),
  p("flyer-burger", "Prince Burger", "Flyer"),
  p("flyer-beer", "Beer Promo", "Flyer"),
];

export const aboutPortrait = img("about-portrait")[0];
export const heroImage = img("photography-01")[0];

export const workCategories = () => {
  const present = [...new Set(projects.map((x) => x.category))].filter((c) => c !== TSHIRT);
  return [...categoryOrder.filter((c) => present.includes(c)), ...present.filter((c) => !categoryOrder.includes(c))];
};
