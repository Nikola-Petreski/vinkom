
# KIRBY Marketing Site (Local static frontend)

**Overview**: This repository holds the static frontend for a KIRBY product/marketing site (Macedonian primary copy). The site is a mostly-static HTML/CSS/JS project that showcases product pages, videos, FAQs, booking and trade-in flows, and small interactive widgets.

- **Main entry**: [index.html](index.html)
- **Build tooling**: [package.json](package.json) (TailwindCSS for utility CSS)
- **Tailwind config**: [tailwind.config.js](tailwind.config.js)
- **Content/data**: `data/` JSON files used by the pages (carousel, faq, testimonials, etc.)

**What's included**
- Static HTML pages: `index.html`, `aboutus.html`, `platinum.html`, `extras.html`, `book.html`, `tradeIn.html`, `faq.html`, `howTo.html`, `blog.html` and thank-you pages.
- Reusable includes in `includes/` (nav, carousels, small JS modules).
- Images under `images/` and optimized WebP versions in `images_webp/`.
- Data-driven JSON in `data/` and a separate `dataEng/` folder for English content.

**Local development**
1. Install dependencies (Node.js + npm required):

```
npm install
```

2. Start Tailwind in watch mode (generates `output.css` from `input.css`):

```
npm run dev
```

Open the site in a browser (e.g., `file://` or via a simple local static server). Tailwind will rebuild `output.css` when you edit styles or the input file.

**Content editing**
- Page structure is plain HTML; to update copy or layout edit the matching HTML file.
- Dynamic lists and carousels are populated from JSON files in `data/` — update those JSON files to change carousel slides, FAQs, tips, testimonials, etc.
- The `includes/` folder contains small shared JS modules (carousel, nav loader) used across pages.

**Assets & images**
- Source images are in `images/`. Web-optimized versions live in `images_webp/`.
- If you need to regenerate optimized images, the project includes `sharp` as a dependency; add scripts to automate image processing if needed.

**Deployment**
- This is a static site; deploy by copying the project files to any static host (Netlify, Vercel static, S3, Apache/nginx). Ensure `output.css` is built before deploying.

**Notes & next steps**
- Contact email in footer: `customercare@vinkom.com.mk`.
- If you want a bilingual README (Macedonian + English) or CI to build `output.css` automatically, tell me and I can add it.

-----
_README updated: provides project overview, dev commands, and where to edit content._

