// Runs before every build. Copies uploaded files into the folders Next.js needs and
// writes the few config files that were missing. Original files are never deleted.
import fs from "node:fs";
import path from "node:path";

const generated = {
 "app/layout.jsx": "import \"./globals.css\";\nimport { Inter_Tight } from \"next/font/google\";\n\nconst sans = Inter_Tight({ subsets: [\"latin\"], variable: \"--font-sans\", display: \"swap\" });\nconst title = \"Gevariel — Digital Marketing, Graphic Design & Photography\";\nconst description = \"Portfolio of Gevariel, a digital marketer, graphic designer and photographer based in Surakarta. Photography, product, social media, flyers and T-shirt design.\";\n\nexport const metadata = {\n  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || \"http://localhost:3000\"),\n  title,\n  description,\n  openGraph: { title, description, type: \"website\", locale: \"en_ID\", images: [{ url: \"/og.jpg\", width: 1200, height: 630, alt: \"Gevariel — portfolio\" }] },\n  twitter: { card: \"summary_large_image\", title, description, images: [\"/og.jpg\"] },\n};\nexport const viewport = { themeColor: \"#0b0b0b\", width: \"device-width\", initialScale: 1 };\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang=\"en\" className={sans.variable}>\n      <body>{children}</body>\n    </html>\n  );\n}\n",
 "app/page.jsx": "import Portfolio from \"../components/Portfolio\";\nexport default function Page() { return <Portfolio />; }\n",
 "app/icon.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><rect width=\"64\" height=\"64\" fill=\"#0b0b0b\"/><text x=\"32\" y=\"45\" font-family=\"Helvetica,Arial,sans-serif\" font-size=\"40\" font-weight=\"700\" fill=\"#f2f0eb\" text-anchor=\"middle\">G</text></svg>\n",
 "next.config.mjs": "// Normal Next.js build (best for Vercel). Set STATIC_EXPORT=1 only if you ever host on a static-only service.\nconst base = process.env.NEXT_PUBLIC_BASE_PATH || \"\";\nexport default {\n  ...(process.env.STATIC_EXPORT ? { output: \"export\" } : {}),\n  trailingSlash: true,\n  basePath: base,\n  images: { unoptimized: true },\n};\n",
 "tailwind.config.js": "// Colours and fonts live here. Change `ink` / `paper` / `mute` to re-theme the whole UI.\nmodule.exports = {\n  content: [\"./app/**/*.{js,jsx}\", \"./components/**/*.{js,jsx}\"],\n  theme: {\n    extend: {\n      colors: { ink: \"#0b0b0b\", paper: \"#f2f0eb\", mute: \"#8d8a83\" },\n      fontFamily: { sans: [\"var(--font-sans)\", \"Helvetica Neue\", \"Arial\", \"sans-serif\"] },\n    },\n  },\n  plugins: [],\n};\n",
 "postcss.config.js": "module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n"
};

const place = {
  "globals.css": "app", "Portfolio.jsx": "components", "ui.jsx": "components",
  "projects.js": "data", "site.js": "data", "dims.json": "data", "og.jpg": "public",
};
const put = (target, data) => { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data); };
for (const [file, text] of Object.entries(generated)) { if (!fs.existsSync(file)) put(file, text); }
for (const [file, dir] of Object.entries(place)) {
  if (fs.existsSync(file)) { fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(file, path.join(dir, file)); }
}
for (const f of fs.readdirSync(".")) {
  if (/\.(webp|png|jpe?g)$/i.test(f) && f !== "og.jpg") { fs.mkdirSync("public/work", { recursive: true }); fs.copyFileSync(f, path.join("public/work", f)); }
}
const need = ["app/layout.jsx", "app/page.jsx", "app/globals.css", "components/Portfolio.jsx", "components/ui.jsx", "data/projects.js", "data/site.js", "data/dims.json"];
const missing = need.filter((f) => !fs.existsSync(f));
if (missing.length) { console.error("MISSING FILES:", missing.join(", ")); process.exit(1); }
console.log("organize: structure OK");
