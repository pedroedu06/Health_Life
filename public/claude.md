## Project Overview

A nutritional ranking application where the user searches for foods, selects a health goal, and receives a ranked list of the best foods for that goal, complete with scores and nutritional data.

**Stack:** React + TypeScript + Tailwind CSS  
**Style separation:** global styles in `index.css`, App component-specific styles in `App.tsx`

---

## Aesthetic Direction

**Theme:** Organic-Modern · Vitalist Health  
**Feel:** Like a premium organic market meets a biohacking app — natural but precise, alive but clean.

**Color Palette (CSS Variables — define in `index.css`):**

```css
:root {
  /* Vital greens */
  --color-leaf:        #3D7A4B;   /* deep leaf green */
  --color-sprout:      #5BA968;   /* medium sprout green */
  --color-mint:        #A8D5A2;   /* soft mint green */
  --color-lime-glow:   #C8F25A;   /* neon lime — vibrant accent */

  /* Earthy bases */
  --color-soil:        #1C1F18;   /* near-black greenish background */
  --color-bark:        #2A2E24;   /* cards and surfaces */
  --color-moss:        #3A3F31;   /* borders and dividers */
  --color-sand:        #E8E0CC;   /* primary text */
  --color-cream:       #F5F0E8;   /* highlight text */

  /* Semantic */
  --color-gold:        #D4A847;   /* ranking #1 */
  --color-silver:      #A8B5C0;   /* ranking #2 */
  --color-bronze:      #C4784A;   /* ranking #3 */
  --color-success:     #5BA968;
  --color-accent:      #C8F25A;   /* neon lime for CTAs */
}
```

**Typography:**
- Display / Headings: `'Playfair Display'` (elegant serif — Google Fonts)
- Body / UI: `'DM Sans'` (clean geometric — Google Fonts)
- Data / Numbers: `'DM Mono'` (monospace for scores and values)

Import in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
```

---

## `index.css` — Global Styles

This file must contain **only** global styles, reset rules, CSS variables, and reusable utility classes.

```css
/* 1. Font imports */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. CSS Custom Properties */
:root {
  --color-leaf:       #3D7A4B;
  --color-sprout:     #5BA968;
  --color-mint:       #A8D5A2;
  --color-lime-glow:  #C8F25A;
  --color-soil:       #1C1F18;
  --color-bark:       #2A2E24;
  --color-moss:       #3A3F31;
  --color-sand:       #E8E0CC;
  --color-cream:      #F5F0E8;
  --color-gold:       #D4A847;
  --color-silver:     #A8B5C0;
  --color-bronze:     #C4784A;
  --color-accent:     #C8F25A;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'DM Mono', 'Courier New', monospace;

  --radius-card:  16px;
  --radius-input: 12px;
  --radius-pill:  999px;

  --shadow-card:  0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
  --shadow-glow:  0 0 24px rgba(200,242,90,0.18);
}

/* 3. Reset and Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-soil);
  color: var(--color-sand);
  min-height: 100vh;
  line-height: 1.6;
  /* Subtle organic grain texture */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}

/* 4. Global utility classes */

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bark); }
::-webkit-scrollbar-thumb { background: var(--color-moss); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-sprout); }

/* Text selection */
::selection {
  background: var(--color-lime-glow);
  color: var(--color-soil);
}

/* Global keyframe animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes rankReveal {
  from { opacity: 0; transform: translateX(-20px) scale(0.97); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 16px rgba(200,242,90,0.12); }
  50%       { box-shadow: 0 0 32px rgba(200,242,90,0.28); }
}

@keyframes scoreCount {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes leafFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33%       { transform: translateY(-6px) rotate(2deg); }
  66%       { transform: translateY(-3px) rotate(-1deg); }
}

/* Reusable animation classes */
.animate-fadeInUp   { animation: fadeInUp 0.5s ease both; }
.animate-rankReveal { animation: rankReveal 0.4s cubic-bezier(0.22,1,0.36,1) both; }
.animate-pulseGlow  { animation: pulseGlow 2.5s ease-in-out infinite; }
.animate-leafFloat  { animation: leafFloat 4s ease-in-out infinite; }

/* Stagger delay utilities */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }

/* Glassmorphism card base */
.glass-card {
  background: rgba(42, 46, 36, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(90, 169, 104, 0.15);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

/* Global input base */
.input-organic {
  background: var(--color-bark);
  border: 1.5px solid var(--color-moss);
  border-radius: var(--radius-input);
  color: var(--color-cream);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 0.875rem 1.125rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  outline: none;
}

.input-organic::placeholder {
  color: rgba(232, 224, 204, 0.35);
}

.input-organic:focus {
  border-color: var(--color-sprout);
  box-shadow: 0 0 0 3px rgba(91, 169, 104, 0.15);
}

/* Global select base */
.select-organic {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--color-bark);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235BA968' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  border: 1.5px solid var(--color-moss);
  border-radius: var(--radius-input);
  color: var(--color-cream);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 0.875rem 2.5rem 0.875rem 1.125rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  outline: none;
}

.select-organic:focus {
  border-color: var(--color-sprout);
  box-shadow: 0 0 0 3px rgba(91, 169, 104, 0.15);
}

/* Primary button */
.btn-primary {
  align-items: center;
  background: var(--color-lime-glow);
  border: none;
  border-radius: var(--radius-pill);
  color: var(--color-soil);
  cursor: pointer;
  display: flex;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0.5rem;
  justify-content: center;
  letter-spacing: 0.04em;
  padding: 0.875rem 2rem;
  text-transform: uppercase;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.btn-primary:hover {
  background: #d6f566;
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

---

## `App.tsx` — Component Structure and Styles

### Macro Layout

```
┌─────────────────────────────────────────┐
│  🌿 Header with logo + tagline          │
├─────────────────────────────────────────┤
│  ┌──────────────  FORM  ──────────────┐ │
│  │  [🔍 Input: Food name           ]  │ │
│  │  [🎯 Select: Health goal        ]  │ │
│  │  [    ANALYZE NUTRITION  →      ]  │ │
│  └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  RANKING (appears after search)         │
│  ┌──┐ ┌─────────────────────────────┐  │
│  │#1│ │ Food Name                   │  │
│  │🥇│ │ Fat: 11.4g       Score: 88% │  │
│  └──┘ └─────────────────────────────┘  │
│  ... (up to #5 with stagger animation)  │
└─────────────────────────────────────────┘
```

### Header Section

- Background with dark green radial gradient at the top
- Animated leaf icon using `leafFloat`
- Title in `Playfair Display` — e.g. "NutriRank"
- Tagline in `DM Sans` light italic — e.g. *"Discover what your body needs"*
- Decorative divider line in green-to-lime gradient

### Form Section

```jsx
// Suggested JSX structure for App.tsx
<section className="form-section">
  {/* Styled label above input */}
  <div className="input-wrapper">
    <span className="input-icon">🔍</span>
    <input
      type="text"
      className="input-organic"
      placeholder="e.g. oats, chicken, spinach..."
    />
  </div>

  {/* Select with goal icon */}
  <div className="select-wrapper">
    <span className="select-icon">🎯</span>
    <select className="select-organic">
      <option value="">Select your goal...</option>
      <option value="weight-loss">🔥 Weight Loss</option>
      <option value="muscle-gain">💪 Muscle Gain</option>
      <option value="energy">⚡ More Energy</option>
      <option value="immunity">🛡️ Immunity</option>
      <option value="longevity">🌿 Longevity</option>
    </select>
  </div>

  <button className="btn-primary">
    <span>Analyze Nutrition</span>
    <span>→</span>
  </button>
</section>
```

**Form inline/Tailwind styles to define in App.tsx:**
```tsx
// Form card wrapper
// className="glass-card p-8 max-w-lg mx-auto relative overflow-hidden"
// Add decorative pseudo-element on the corner (via CSS-in-JS or custom class)

// Left decorative accent border on the card
// border-left: 3px solid var(--color-lime-glow)

// Input wrapper with positioned icon
// className="relative mb-5"
// Icon: className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-sprout)] pointer-events-none z-10"
// Input with extra left padding: style={{ paddingLeft: '2.75rem' }}
```

### Ranking Section

Each ranking item must include:

1. **Position badge** (left side):
   - `#1` → gold background (`--color-gold`), dark text, glowing shadow
   - `#2` → silver background (`--color-silver`)
   - `#3` → bronze background (`--color-bronze`)
   - `#4`, `#5` → moss background (`--color-moss`), sand text

2. **Item card layout:**
   ```
   [Badge] | Food Name               (DM Sans 500, cream)
            | ──────────────────────────────────────────
            | Fat:  XX.Xg   |   Score:     XX%
            | (DM Mono, sand)   (DM Mono, lime-glow accent)
   ```

3. **Score progress bar:**
   - Height: 4px, pill border-radius
   - Track: `--color-moss`
   - Fill: gradient `--color-sprout` → `--color-lime-glow`
   - Animated width: CSS transition from `width: 0` → `width: ${score}%` with per-index delay

4. **Card entrance animation:**
   ```tsx
   style={{ animationDelay: `${index * 120}ms` }}
   className="animate-rankReveal glass-card ..."
   ```

5. **Card hover state:**
   - Border-color changes to `--color-sprout`
   - Subtle `translateY(-2px)` with elevated `box-shadow`
   - Smooth `0.2s ease` transition

### Component-specific styles to define **inside App.tsx** (via Tailwind + style prop):

```tsx
// These styles are App-specific and must stay in App.tsx
// Combine Tailwind classNames with inline style={{}} where needed

const styles = {
  rankBadge: (position: number) => ({
    background: position === 1 ? 'var(--color-gold)'
               : position === 2 ? 'var(--color-silver)'
               : position === 3 ? 'var(--color-bronze)'
               : 'var(--color-moss)',
    color: position <= 3 ? 'var(--color-soil)' : 'var(--color-sand)',
    // ... border-radius, width, height, etc.
  }),

  scoreBar: (score: number) => ({
    width: `${score}%`,
    background: 'linear-gradient(90deg, var(--color-sprout), var(--color-lime-glow))',
    transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
  }),

  formCard: {
    background: 'rgba(42, 46, 36, 0.9)',
    borderLeft: '3px solid var(--color-lime-glow)',
    // glassmorphism already handled by global .glass-card class
  },
}
```

---

## Suggested React Component Tree

```
App.tsx
├── <Header />           — logo, tagline, decorative elements
├── <SearchForm />       — input + select + button
│   ├── <FoodInput />    — text field with icon
│   └── <GoalSelect />   — health goal dropdown
└── <RankingList />      — results list
    └── <RankItem />     — individual ranking card
```

Each component may define its own inline style objects as `const styles = {}` within its file, while global and utility styles remain in `index.css`.

---

## UI States

| State | Behavior |
|-------|----------|
| **Idle** | Form visible, ranking hidden |
| **Loading** | Button shows animated spinner, text changes to "Analyzing..." |
| **Success** | Ranking cards appear with stagger animation (120ms per item) |
| **Error** | Subtle toast at the form border, soft red border highlight |
| **Empty** | Message with leaf icon, encouraging copy |

---

## Polish Details (non-negotiable)

- **Semantic label** above each input: `font-size: 0.75rem`, `letter-spacing: 0.08em`, `text-transform: uppercase`, color `--color-sprout`
- **Accessible focus visible**: never remove outline without a visible alternative
- **Responsive**: form and ranking in single column on mobile, generous padding
- **Score numbers** must use `font-family: var(--font-mono)` for consistent alignment
- **Organic decoration**: blurred circles/blobs behind the header (absolute position, pointer-events none, negative z-index)
- **Loading skeleton**: use `background: linear-gradient(90deg, var(--color-bark), var(--color-moss), var(--color-bark))` with animated `background-size: 200%` as a shimmer effect

---

## Ranking Card Visual Reference

```
┌──────────────────────────────────────────────┐
│ ┌────┐                                       │
│ │ #1 │  Farinha, de rosca           ← cream  │
│ │ 🥇 │  ─────────────────────────────────── │
│ └────┘  Fat      11.4g    Score     88%      │
│         (mono)   (sand)   (mono)  (lime)     │
│                                              │
│  ████████████████████████████░░░░░  88%      │
│  └─ animated bar green→lime ───────┘         │
└──────────────────────────────────────────────┘
  hover: sprout border, lifts 2px
```

---

## Implementation Checklist

- [ ] Import fonts in `index.css`
- [ ] Define all CSS variables in `:root` inside `index.css`
- [ ] Global classes (`.glass-card`, `.input-organic`, `.select-organic`, `.btn-primary`, `.animate-*`) in `index.css`
- [ ] Form and ranking-specific styles in `App.tsx` (via Tailwind + style prop)
- [ ] Stagger animation on ranking cards
- [ ] Score progress bar animated by value
- [ ] Position badge with semantic colors (gold/silver/bronze)
- [ ] Loading, empty, and error states handled visually
- [ ] Mobile-first responsiveness
- [ ] Accessibility: labels, focus visible, aria-labels