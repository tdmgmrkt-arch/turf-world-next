# Turf World — 4 Blog Posts (Nov 5 – Nov 16, 2026)

**Purpose:** Bring the blog current through today (Nov 18, 2026). The previous batch ran out at Oct 29; the pet-odor post covered Nov 2. These four fill Nov 5 → Nov 16 on the same Mon/Thu cadence, so the editorial calendar reads continuous with no gap.

**Status:** Already wired into `apps/storefront/lib/blog-posts.ts` (inserted at the top of `BLOG_POSTS`, newest-first). Typecheck passes. All internal links validated against real routes and real post slugs. External links curl-verified. **Not committed — awaiting review.**

**Cadence check:**

| Date | Day | Slug |
|---|---|---|
| 2026-11-05 | Thu | `is-artificial-turf-safe-lead-pfas` |
| 2026-11-09 | Mon | `how-much-artificial-turf-do-i-need` |
| 2026-11-12 | Thu | `turf-backing-polyurethane-vs-latex` |
| 2026-11-16 | Mon | `installing-artificial-turf-in-winter` |

All four dates are in the past, so the date-gate releases them immediately on deploy. Next slot on the cadence is Thu Nov 19.

**Topics vetted against the existing 35 posts** — no cannibalization. Notes on adjacency:
- The safety post is the first to address lead / PFAS / crumb rubber directly; it links out to (rather than repeats) the kid-safe, allergies, and summer-heat posts.
- The backing post completes the spec trilogy with the existing fiber-materials and blade-shapes posts. It covers secondary backing chemistry and perforation, which neither of those touches.
- The measuring post is the first to cover roll geometry, cut planning, and waste factor. The calculator page exists but has no editorial companion.
- The winter-install post is distinct from both the winter *care* post (maintenance on finished turf) and the spring timeline post (which it links to as the contrast case).

---

## IMAGE ASSETS NEEDED (5, not 4)

None of these exist yet. Save PNGs to `apps/storefront/public/blog/`, then batch-convert to WebP and mirror to `apps/storefront/app/blog/` per the usual routine.

> **Also still outstanding:** `dog-urine-odor-turf.webp` for the Nov 2 post is referenced but was never created. That post is uncommitted too, so it needs the image before either goes out.

Consistent style note for all prompts below: editorial documentary photography, This Old House / Dwell feel, soft natural light, no staged smiles, no visible brand marks, 16:9.

---

## 1. Is Artificial Turf Safe? Lead, PFAS, and What the Certifications Actually Mean

- **Slug:** `is-artificial-turf-safe-lead-pfas`
- **Date:** 2026-11-05 (Thu)
- **Category:** Safety
- **Read time:** 9 min
- **Image filename:** `turf-safety-certifications.png`
- **Image prompt:** Editorial documentary photograph. A toddler in soft clothes sits playing with wooden blocks on clean residential artificial turf, a golden retriever lying a few feet away in dappled shade. Shot low and close, parent's hand visible at the frame edge. Soft late-afternoon light through a tree canopy. Palette: sage green, cream, warm oak, soft denim. Calm and reassuring without being saccharine. 16:9.

**Excerpt:** Most of what you will read about turf safety is about crumb rubber sports fields, not residential landscape turf. Here is what separates the two, which concerns have substance, and the five questions to ask a supplier.

**Meta description:** Is artificial turf safe? A straight look at lead, PFAS, crumb rubber, and heat — what the research actually covers, and the documentation to ask your supplier for.

**Primary keywords:** is artificial turf safe, artificial turf lead, PFAS artificial turf, artificial turf toxic, crumb rubber safety

**Editorial note:** This is the post that most needed writing and the one with the most reputational exposure, so it is deliberately not a reassurance piece. It concedes PFAS is an open question, concedes crumb rubber is unresolved, and names heat as the risk a homeowner will actually encounter. The "what the certifications actually cover" table explicitly says STC membership is not a safety certification — that honesty is the asset here, both for trust and for AI-answer citation.

**External links (verified):** EPA PFAS program, CPSC, ATSDR, IPEMA, CA OEHHA Prop 65, Synthetic Turf Council

---

## 2. How Much Artificial Turf Do I Need? Roll Widths, Seams, and Waste Factor

- **Slug:** `how-much-artificial-turf-do-i-need`
- **Date:** 2026-11-09 (Mon)
- **Category:** Installation
- **Read time:** 8 min
- **Image filename:** `measuring-turf-yard.png`
- **Image prompt:** Editorial documentary photograph, shot from above at a slight angle. A homeowner kneels on a bare dirt-and-gravel yard with a long tape measure extended across it, a clipboard beside them showing a hand-drawn rectangle sketch with dimensions. A rolled turf roll sits at the frame edge, cut end visible showing green fiber and backing. Overcast daylight, practical and unglamorous. Palette: slate, kraft paper, olive green, galvanized steel. 16:9.

**Excerpt:** Square footage is the easy part. The number that decides your order is how your yard maps onto a 15-foot roll — and that is where most people under-order or massively over-order.

**Meta description:** How much artificial turf you need is not your yard's square footage. Learn 15ft roll math, cut planning, seam placement, and the waste factor for your yard type.

**Primary keywords:** how much artificial turf do i need, artificial turf roll width, turf waste factor, turf seam placement, artificial turf calculator

**Editorial note:** Highest commercial intent of the four — it is a pre-purchase blocker post. Built on the real site constants (15ft width, 100ft max length, 10ft minimum cut) and the real accessory rates from the cut builder (1 infill bag / 50 sqft, 1 seam tape roll per seam, nails and weed barrier per 800 sqft, gopher wire per 400 sqft), so the post and the calculator agree. The 30×20 worked example shows the same yard costing 600 vs 900 sqft depending on strip orientation — that single comparison is the whole reason the post exists. Feeds traffic straight to /calculator and the product cut builder.

**External links (verified):** none needed — this one is entirely first-party mechanics.

---

## 3. Turf Backing Explained: Polyurethane vs. Latex, and Why the Drainage Holes Matter

- **Slug:** `turf-backing-polyurethane-vs-latex`
- **Date:** 2026-11-12 (Thu)
- **Category:** Product Selection
- **Read time:** 7 min
- **Image filename:** `turf-backing-explained.png`
- **Image prompt:** Editorial product-detail photograph, macro. Two turf samples held up at an angle so the undersides face camera — the punched drainage hole grid clearly visible, one sample folded back to show the secondary backing coat and the tuft rows locked into the primary fabric. Hands in frame, natural skin tones, no gloves. Clean neutral surface below. Directional window light raking across to pick out texture. Palette: charcoal, bone white, grass green, warm skin. 16:9.

**Excerpt:** The backing is the half of the product you never look at, and the half that decides whether your turf lasts five years or twenty. Here is how to read it on a spec sheet and check it on a sample.

**Meta description:** Polyurethane vs latex turf backing, primary vs secondary backing, drainage hole spacing, and the four-step test to run on a physical sample before you buy.

**Primary keywords:** turf backing, polyurethane vs latex turf backing, artificial turf drainage holes, tuft bind, double polyurethane backing

**Editorial note:** Completes the spec trilogy (blade shape → fiber material → backing) and is the strongest differentiation post of the four, because every SKU we carry is double polyurethane and most budget competition is latex. The four-step physical sample test (bend it, tug a tuft, check the hole grid, weigh it) is the conversion mechanism — it gives a sample request a concrete purpose. Also ties backing choice to the 16-year warranty, to pet-zone hole spacing, and to rooftop load limits.

**External links (verified):** Society of Plastics Engineers, ASTM, EPA Sustainable Materials Management

---

## 4. Can You Install Artificial Turf in Winter? What Changes Below 50°F

- **Slug:** `installing-artificial-turf-in-winter`
- **Date:** 2026-11-16 (Mon)
- **Category:** Installation
- **Read time:** 7 min
- **Image filename:** `winter-turf-installation.png`
- **Image prompt:** Editorial documentary photograph. Two installers in insulated work jackets and beanies kneel on a prepared gravel base, unrolling artificial turf across a residential backyard on a cold clear day. Breath faintly visible, long low winter light, bare deciduous trees and a wood fence behind. Sandbags weighting a seam line in the foreground. Honest working tone, no posing. Palette: cold blue shadow, straw, olive green, weathered cedar. 16:9.

**Excerpt:** Yes — and in most of the country winter is the cheapest, fastest time to get it done. What changes is the base work, how long the turf needs to relax, and how the adhesives cure.

**Meta description:** You can install artificial turf in winter. Frozen ground is the only real limit — here is the spade test, the adhesive temperature rule, and why Q1 is the best time to book.

**Primary keywords:** install artificial turf in winter, can you install turf in cold weather, winter turf installation, minimum temperature artificial turf

**Editorial note:** The seasonally timed one — it publishes into the exact window when homeowners are asking whether to wait until spring, and the honest answer ("no, and Q1 crews are available next week instead of in six weeks") is also the commercially useful one. Three-climate table keeps it relevant outside SoCal. Includes the split-the-job tactic for hard-freeze zones and roll storage instructions for anyone who genuinely has to wait, so the post converts either way. Pairs against the spring timeline post as the contrast case rather than competing with it.

**External links (verified):** National Weather Service, NOAA Climate Prediction Center

---

## Validation run

- `npx tsc --noEmit -p apps/storefront/tsconfig.json` → exit 0
- 39 posts total, zero duplicate slugs
- `publishedAt` sequence confirmed strictly newest-first (array order matters for `getFeaturedPost`)
- All 70+ internal links in the file resolve to a real `app/` route, a real `/locations/<city>` slug, or a real post slug
- All external links in the new posts return 200, except three that 403 to curl behind a WAF — `cpsc.gov`, `atsdr.cdc.gov`, `syntheticturfcouncil.org` — all three already shipped in earlier posts and load normally in a browser

## Before deploy

1. Generate the 5 images (4 new + the outstanding `dog-urine-odor-turf.webp`)
2. Convert to WebP, drop in `apps/storefront/public/blog/`, mirror to `apps/storefront/app/blog/`
3. Commit — suggested: `feat(blog): add 4 November posts bringing cadence current through Nov 16`
4. Push to `main` → Vercel production (all four dates are past, so they go live on this deploy)
