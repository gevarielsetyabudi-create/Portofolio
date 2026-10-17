# GEVARIEL — Portfolio website

Next.js 14 · React 18 · Tailwind CSS 3 · Framer Motion. Builds to a **static site** (no server needed).

## Structure
```
data/projects.js    ← every project + category (edit this to add work)
data/site.js        ← name, about text, contact details, experience
data/dims.json      ← image sizes + background colour per image
public/work/<slug>-1.webp …   ← images shown on the site
assets/masters/     ← uncompressed PNG masters (reuse for a future showreel/video)
assets/source/tshirts/        ← your original T-shirt files
components/ui.jsx  ← Reveal, Tile, Cursor, Nav, project Detail view
components/Portfolio.jsx      ← page sections + per-category layouts
tailwind.config.js ← colours + font
```
Sitemap (single page): Hero → About → Selected Works (filter + Photography, Product, Instagram, Feed Template, Flyer) → T-Shirt Design → More Visual More Experience → Contact / Thank you.

## Install & run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # outputs static site to /out
npm start          # preview /out locally
```
Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` at build time so link previews (WhatsApp/LinkedIn) use the right absolute URL.

## Deploy
- **Vercel:** push to GitHub → vercel.com → Import → defaults work. Add env var `NEXT_PUBLIC_SITE_URL`.
- **Netlify:** build command `npm run build`, publish directory `out`.
- **GitHub Pages:** build with `NEXT_PUBLIC_BASE_PATH=/repo-name npm run build`, publish the `out` folder (add an empty `out/.nojekyll`).

## Replace an image
Overwrite `public/work/<slug>-<n>.webp` with the new file (same name). Then update that image's `w`, `h` in `data/dims.json`
(and `bg` = its edge colour, `dark` = true if that colour is dark). Higher-resolution originals can be dropped in with no layout changes.
Note: images cut from the PDF are only ~160–360 px wide; the site shows them at native size where it can, but sharper originals will make a big difference.

## Add a project
1. Upload images to `public/work/` as `my-project-1.webp, my-project-2.webp …`
2. Add to `projects` in `data/projects.js`:
```js
p("my-project", "Project Title", "T-Shirt Design", 3, { featured: true, year: "2025", description: "…", process: "…" })
```
(`3` = number of images). `description`, `process`, `year` only appear when filled in. `featured: true` makes T-shirt tiles larger.

## Add a category
Just use a new category string in a project — it appears in the filter and gets a grid automatically.
Optional: choose its order in `categoryOrder`, add a subtitle in `categoryMeta`, or map a custom layout in `layouts` (Portfolio.jsx).

## Change text / contact
`data/site.js`. Empty contact values are hidden. Set `pdf: "/portfolio.pdf"` (copy the PDF into `/public`) to show a download link.

## Colours & fonts
`tailwind.config.js` → `ink`, `paper`, `mute`. Font: swap `Inter_Tight` in `app/layout.jsx`. Per-project colours come from each image's own `bg`.

## How responsiveness works
Mobile-first Tailwind. Under 768 px everything is a single column with 20 px gutters, the nav becomes a full-screen MENU, and galleries drop to 2–3 tight columns. From 768 px a 12-column grid gives asymmetric editorial spans (offsets, featured tiles). Headline sizes use `clamp()` so they scale from 375 px phones to 1920 px screens. The custom cursor only mounts on fine-pointer (mouse) devices. `prefers-reduced-motion` disables smooth scroll and animations.

## Performance & accessibility
Images are WebP, lazy-loaded with width/height set (no layout shift); only the hero image is eager. Animations are transform/opacity only. Semantic landmarks, one `h1`, keyboard-operable buttons, Esc/←/→ in project view, skip link, alt text.

## Future showreel
`assets/masters/*.png` + `assets/source/` are named by project slug, so they can be dropped straight into a video editor in the same order as `data/projects.js`.
