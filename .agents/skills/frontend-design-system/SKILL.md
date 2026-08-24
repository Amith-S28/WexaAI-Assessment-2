---
name: "Frontend Design System"
description: "Master modern web design system guidelines, rich aesthetic styling, glassmorphism, curated HSL color palettes, typography, micro-animations, and premium responsive UI components. Use when building front-end applications, designing web components, styling dashboards, or refining application visual aesthetics."
---

# Frontend Design System

Master modern, premium web frontend aesthetics, responsive design systems, visual feedback, and component architecture.

## Design Principles & Aesthetic Foundations

### 1. Visual Excellence & "Wow" Factor
- **Never settle for generic default browser styles.** Use curated, harmonious color palettes, smooth gradient overlays, subtle drop shadows, glassmorphism (`backdrop-filter: blur()`), and sleek dark mode aesthetics.
- **Typography Excellence:** Use modern Google Fonts (`Inter`, `Plus Jakarta Sans`, `Outfit`, `Roboto`) instead of system sans-serif fonts. Establish clear hierarchy:
  - Titles/Headings: `font-weight: 700`, `letter-spacing: -0.025em`, `line-height: 1.2`
  - Body Text: `font-weight: 400`, `line-height: 1.6`, high contrast readability
  - Monospace/Data: `Fira Code`, `JetBrains Mono` for lab data, code, or metrics.

### 2. Glassmorphism & Depth Layers
```css
/* Glassmorphism Card Utility */
.glass-card {
  background: rgba(18, 24, 38, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 16px;
}
```

### 3. Curated Medical Color System (Dark Mode Focus)
```css
:root {
  /* Primary & Accent */
  --color-primary: hf(217, 91%, 60%);        /* Clinical Cobalt Blue */
  --color-primary-glow: hsla(217, 91%, 60%, 0.3);
  --color-accent: hsl(160, 84%, 39%);         /* Bio Emerald Green */
  --color-warning: hsl(38, 92%, 50%);         /* Warning Amber */
  --color-danger: hsl(350, 89%, 60%);         /* Clinical Alert Red */

  /* Neutral Surface Stack */
  --bg-app: hsl(222, 47%, 7%);              /* Obsidian Base */
  --bg-surface-1: hsl(222, 40%, 11%);       /* Card Background */
  --bg-surface-2: hsl(222, 35%, 15%);       /* Hover Elevation */
  --text-primary: hsl(210, 40%, 98%);       /* High Contrast Text */
  --text-secondary: hsl(215, 20%, 65%);     /* Subdued Label Text */
  --border-subtle: rgba(255, 255, 255, 0.08);
}
```

---

## Interactive Micro-Animations & Motion Design

Smooth state transitions keep the user engaged and provide tactile feedback:

```css
/* Interactive Hover Elevation */
.interactive-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease;
}

.interactive-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -10px var(--color-primary-glow);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Pulsing Status Indicator */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.15); }
}

.status-badge-active {
  animation: pulse-glow 2s infinite ease-in-out;
}
```

---

## Component Architecture Patterns

1. **Header & Navigation Bar:** Floating glassmorphism navbar with active page indicator and system status metrics.
2. **Dashboard Cards:** Elevated cards with subtle gradients, metric icons, and interactive hover states.
3. **Data Tables:** High-contrast clinical data tables with sticky headers, zebra striping, and status badges (Normal / Warning / Critical).
4. **Streaming Response View:** Real-time token insertion with smooth auto-scroll, formatted markdown rendering, code block syntax highlighting, and copy buttons.
