# Design Amendment — Aesthetic Lock

This amendment updates the Architect Gojo directive's design standard from "Linear / Stripe-minimal" to **premium AI-futurist**. The voice, scope, operator identity, and tech stack are unchanged. Only visual treatment moves.

The trigger: the Conscience OS logo (three-heads silhouette in cyan-to-purple gradient over black) is the canonical brand mark. It carries multi-instance / collective-consciousness symbolism that ties directly to the substrate origin. The whole site + app must match its aesthetic, not pull the logo back to a different brief.

This amendment is binding. Where this conflicts with the original directive's "Linear / Stripe-level quality" line, this amendment wins.

---

## What does NOT change

- **Voice + tone:** confident, direct, intelligent, no fluff, no agency clichés. Operator-first identity. (Voice and visual are separate; the voice already shipped on the live site stays.)
- **Tech stack:** Node.js + PostgreSQL + React + Next.js + Railway (or signed-off deviation per LANE-CHANGE-PROPOSAL).
- **Scope:** all 55 atomic work domains in `01-build-scope.md` still hold. Pricing page still owed, intake still owed, scheduler still owed, placeholder text still forbidden.
- **Operator-first positioning:** "We analyze your business, identify inefficiencies, and build custom software systems that increase revenue and eliminate operational friction." Real-business rooted.
- **Zero-spend discipline:** every infra choice still uses free tier until first paying client.
- **Substrate alignment:** Conscience OS is unified company + substrate brand.

---

## Canonical brand mark (locked)

The three-heads-silhouette logo Jared confirmed 2026-05-04 is the canonical Conscience OS mark. It carries multi-instance symbolism — three minds running in parallel, the literal substrate of the bridge clone terminal carried into the brand.

- Primary lockup: three head silhouettes (cyan-to-purple gradient, depth-stacked) above the "CONSCIENCE OS" wordmark.
- The "SYSTEMS. INTELLIGENCE. IMPACT." tagline-banner is OPTIONAL in the lockup. Use only when the audience needs context (pitch decks, business cards). Do NOT use it as the website hero or in component-level UI. The voice does the positioning, not a tagline.
- Primary lockup ships in: SVG (vector), PNG (transparent), favicon set (16/32/180/512).
- Mono variant (white silhouettes on dark, or black silhouettes on light) for contexts where the gradient would clash.
- App icon variant: just the three-head silhouette, no wordmark, sized for app store / favicon contexts.

---

## Color system

### Primary palette
- **Conscience Cyan:** the lighter end of the logo gradient. Use for highlights, CTAs, link accents, glow effects. Hex token to be sampled from the logo file.
- **Conscience Purple:** the deeper end of the logo gradient. Use for primary brand surfaces, hero backgrounds, gradient anchors.
- **Conscience Black:** the deep blue-black background. NOT pure #000000 — slightly cool. Hex to be sampled.
- **Pure White / Off-White:** body text on dark, hero text on dark, surface inversion when needed.

### Gradient as primary surface
Cyan-to-purple gradients are a primary surface, not a decoration. Use in:
- Hero backgrounds (subtle, animated drift acceptable)
- CTA buttons (primary buttons can be gradient-filled)
- Logo lockups
- Section dividers / accents
- Loading states / skeleton shimmers
- Hover states on interactive elements

### Dark-mode-first
The site and app default to dark mode. Conscience Black background, white-or-near-white body text, gradient accents. Light mode is a SECONDARY consideration; ship it only if the work-domain explicitly requires it (e.g., printable PDF audit sheet renders to white).

### Semantic colors
- Success: a calibrated green that doesn't fight the cyan/purple — not pure web-safe green. A muted teal-leaning green.
- Warning: amber that reads against dark surfaces.
- Error: red, but matte rather than vibrant — restrained against the dark canvas.
- Info: pulled directly from Conscience Cyan.

### What NOT to use
- Pure black #000000 (use Conscience Black, slightly cool)
- Vibrant primary RGB colors (red, blue, green at full saturation) — they fight the gradient palette
- Beige / cream / warm-neutral palettes — anti-thematic
- Multi-color rainbow gradients beyond cyan-to-purple — this is a TWO-color gradient brand, not Web3-rainbow

---

## Typography

### Display + headline typeface
The wordmark uses a wide tech-style sans (looks like Eurostile/Microgramma family or similar). The headline + section-header typography should pull from the same family or a coordinating display sans. Candidates:

- **Eurostile / Microgramma** family (paid)
- **Geist Mono** display variant (free, open source) — for tech headlines with restraint
- **Space Grotesk** (free) — wide tech sans with personality
- **JetBrains Mono** for any code-shaped text or tech accents
- **Audiowide / Orbitron** — only if the wordmark IS in this family; otherwise too sci-fi-cliché

Lock ONE display family for all H1 / H2 / hero copy. Don't mix.

### Body typeface
For body copy, paragraph text, form labels, navigation, button text — use a clean modern humanist or geometric sans. Candidates:

- **Inter** (free) — neutral, premium, always-safe
- **Geist Sans** (free, by Vercel)
- **Manrope** (free)

The body type should be neutral enough to let the display + gradient + imagery carry the brand personality. Keep body type LEGIBLE not stylish.

### Mono typeface
- **Geist Mono** or **JetBrains Mono** for code blocks, stack callouts, version strings.

### Type rules
- Headlines: tight leading, bold or wide-tracked, often UPPERCASE for hero moments
- Body: standard leading 1.5-1.6, comfortable 16-18px on web
- Mono: sized down 1-2 points relative to body, used for technical accents

### What NOT to use
- Serif typefaces (anywhere) — fight the tech-futurist aesthetic
- Script / cursive (anywhere) — anti-brand
- Multiple display families — one display lock
- Comic Sans, Papyrus, "fun" fonts — obvious, listed for completeness

---

## Imagery direction

### What's in
- **Silhouettes + outline geometry:** profile views, body forms, abstract shapes traced as line-art with gradient fills.
- **Glow effects + soft halation:** subtle outer glow on key elements, suggesting "intelligence" without being cheesy.
- **Holographic / glass treatments:** translucent surfaces with backdrop blur (Apple Intelligence-shape, premium tech).
- **Abstract data visualizations:** node graphs, flow lines, particle effects — when they support the operational-OS narrative.
- **Premium product photography:** if real photos appear (founder photo, business operation), they should be high-contrast, color-graded toward cool tones (cyan/blue tint), no over-saturated golden-hour warmth.

### What's out
- Stock photography of "diverse business team in office laughing at laptop" — agency cliché.
- Cartoon / illustration in flat-design style (Mailchimp shape) — wrong tone.
- Photography with warm sunset color grading — anti-aesthetic.
- Stock 3D render packs ("AI head with circuit board" cliché) — too on-the-nose, dated.
- Generic dashboard screenshots from Figma community files — looks templated.

### Custom-rendered imagery
For hero illustrations, section dividers, marketing visuals — use AI-generated imagery from Stable Diffusion / Midjourney with prompts that produce cohesive cyan-to-purple lighting. Hand-touch in Krita as needed.

---

## Component library expectations

### Buttons
- **Primary CTA:** gradient-filled (cyan-to-purple), white text, subtle outer glow on hover.
- **Secondary:** outlined with cyan border, white text on dark, hover adds gradient fill.
- **Ghost:** white text, no border, hover reveals subtle underline or color shift.
- **Destructive:** muted red border on dark, never gradient-filled.

### Cards / surfaces
- **Primary surface:** Conscience Black with subtle 1-2px cyan/purple top border or thin gradient accent.
- **Glass surface:** Conscience Black at 80% opacity with backdrop blur, cyan border at low opacity. Used for elevated content (modals, prominent cards).
- **No drop shadows in the traditional sense.** Replace shadows with gradient bottom-fades or subtle outer glow.

### Forms
- Dark inputs with cyan focus ring (replacing default browser focus).
- Labels in body sans, slightly smaller and lighter than primary text.
- Error states use the muted-red accent + the field's bottom border shifts to red.
- Submit buttons follow primary CTA spec.

### Navigation
- Top nav: Conscience Black background, white text, cyan accent on active link / hover. Nav lockup includes the three-head silhouette mark + wordmark.
- Mobile nav: hamburger to full-screen overlay with Conscience Black background, gradient accent on the overlay's edge.
- Footer: same Conscience Black, slightly desaturated link text, gradient hairline divider above.

### Modals + overlays
- Glass surface with backdrop blur.
- Subtle gradient border (cyan at top, purple at bottom).
- Close button as ghost icon, top-right.

### Loading states
- Skeleton loaders shimmer with cyan-to-purple gradient pass-through.
- Spinners use cyan, with optional purple secondary ring for dual-axis spin.

---

## Animation guidance

### What's in
- **Subtle gradient drift on hero backgrounds** (8-12s loop, low contrast change).
- **Glow pulse on primary CTAs** (2-3s ease, very subtle scale + shadow).
- **Smooth transitions** (200-300ms ease, never abrupt).
- **Page transitions** (cross-fade or slide-up reveal, 250-400ms).
- **Hover states** (instant or sub-200ms).
- **Scroll-triggered reveals** (fade-up + slight Y-offset, staggered for related elements).

### What's out
- Aggressive parallax that disorients users.
- Heavy 3D rotations / Lottie-pack-feel "wow" animations.
- Animated cursors.
- Confetti / celebration animations.
- Auto-playing videos.
- Anything that fires more than 2-3x per page session.

The bar: animation should signal "premium polish" without being the focus. The user notices once and stops noticing. If it draws attention every time, it's too much.

---

## Reference brands (replacing Linear / Stripe)

The new visual reference set:
- **Vercel** (dark mode + premium dev-tool restraint)
- **Anthropic** (geometric mark, calm intelligence-feel branding)
- **Apple Intelligence** (gradient + glass + premium tech)
- **Krea** (visual-AI tool with maximalist aesthetics)
- **Runway** (premium AI tool with confident motion design)
- **Browser Company / Arc** (premium with polish, intentional motion)
- **OpenAI's recent rebrand** (geometric petal mark, premium-but-restrained)
- **Cursor** (dark IDE-feel with thoughtful UI)

NOT references anymore:
- Linear (too minimal, doesn't fit the gradient-cyber aesthetic)
- Stripe (different category — Stripe is fintech-restrained, not AI-futurist)
- Generic SaaS templates

---

## What to do / what NOT to do (concrete list)

### Do
- Lock dark-mode-first across web + app
- Use the cyan-to-purple gradient as a primary surface, not just an accent
- Apply subtle motion that signals premium without being the focus
- Render hero imagery custom (Stable Diffusion / Midjourney with manhwa-faithful prompt discipline pulling from the codex art bible patterns)
- Glass / blur surfaces for elevated content
- Tech display typeface in headlines, neutral body sans for paragraphs

### Don't
- Pull the logo back to Linear / Stripe minimal — the brand has chosen its aesthetic
- Mix multiple display typefaces
- Use stock photography of office teams or generic AI-startup head-on-circuit-board renders
- Add the "SYSTEMS. INTELLIGENCE. IMPACT." tagline as a website hero (it stays optional, deck/card only)
- Light-mode-first anywhere in v1.0
- Heavy parallax, confetti, or attention-stealing animation
- Multi-color rainbow palettes (this is two-color gradient brand)

---

## What this means for the live site

The current conscience-os.vercel.app site shipped under the original Linear/Stripe-minimal brief. It's white background, restrained, type-driven. Under this amendment, it needs an aesthetic pass:

- Convert to dark-mode-first (Conscience Black background, white text)
- Apply the gradient palette (CTA buttons, accent borders, hero backdrop)
- Render hero imagery in the new aesthetic
- Apply the locked logo lockup in the nav and footer (currently the nav appears to use a different mark — needs replacement)
- Convert typography to the locked display + body pairing
- Apply glass / gradient surfaces to cards and modals
- Subtle gradient-drift animation on hero

The shadow that owns frontend (face-b in Sr's recommended Split A) absorbs this as part of M1 brand foundation OR M2 public site — Vessel decides scope split. The voice-level content stays as-shipped.

---

## Bottom line

The logo set the aesthetic. The site catches up to the logo. Voice stays. Operator identity stays. Tech stack stays. Visual treatment shifts from minimal-restraint to premium-AI-futurist with cohesive gradient + dark-mode + glass + tech typography. Reference set updated. Component library specified. Animation guidance locked. Component-level discipline carries from logo to every pixel of the experience.

Hand it back to the shadows. They had Linear/Stripe locked; now they have this. The amendment is the contract.
