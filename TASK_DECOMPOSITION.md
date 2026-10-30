# TASK_DECOMPOSITION.md: Lab 3 (React 19)

> WBS produced under `project-rules.md` section 7. One section per exercise/homework.
> Implementation code is written later, one task at a time (section 8).

---

## EX1: Semantic Engineer & Pro-Gamer Profile Card

**Source:** In-Class Sprint 1 (35 min, minutes 40-75) + "Exercise 1 Reference Contract: DeveloperCard.jsx".
**Upgrades legacy:** Ex 0.2, 0.3, 4.1, 4.4 (Elon Musk Card), 4.5 (User Profile), under Lab 2's Zero Div-Soup Mandate.

### Requirements (restated from the screenshots)

| # | Requirement |
|---|---|
| R1 | Build `<DeveloperCard />` and `<SkillBadge />` in React 19 using Vite. |
| R2 | ZERO `<div>` tags inside `DeveloperCard.jsx`. Use `<article>`, `<header>`, `<hgroup>`, `<dl>`, `<dt>`, `<dd>`, `<ul>`, `<li>`, `<Fragment>`. |
| R3 | Pure functional component with ES6 default parameters (no `defaultProps`). |
| R4 | Self-contained `<article>` landmark with `aria-labelledby` bound to the card's `<h2>` (id via `useId()`, D5). |
| R5 | `<header>` holds the avatar `<img>` and an `<hgroup>` with `<h2>{fullName}</h2><p>{role}</p>`. |
| R6 | Metrics rendered as key-value pairs: `Object.entries(metrics)` mapped into `<Fragment key={k}><dt/><dd/></Fragment>` inside `<dl>` (replaces Slide 22's triple `<h1>` bug). |
| R7 | Skills rendered via reusable `<SkillBadge />`, stable `key={s.id}`, inside an accessible `<ul aria-label="Engineered Skills">` (D4). Contract output per skill: `{name} ({tier})`. |
| R8 | Replace Slide 18's inline `style={{ background: '#d0f0c0' }}` with `DeveloperCard.module.css` + CSS custom properties. Scoped classes: `styles.card`, `styles.metrics`, `styles.skills` (+ `styles.header`). |
| R9 | Responsive contract: perfect at 375px (iPhone SE), zero horizontal scroll. |
| R10 | Replace Slide 21's insecure `http://` avatar with HTTPS, explicit `width`/`height` (`64`, zero CLS), and fallback initials. |
| R11 | Exactly 2 atomic commits (messages given below). |

**Default props (from the contract):**
```js
fullName  = 'Tran Vinh Khiem'
role      = 'Senior Systems Architect • UIT S3T'
avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240'
metrics   = { commits: 512, vdomNodes: 0, a11yScore: 100 }
skills    = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }]
```

### Prerequisites (repo-wide, not counted in EX1's 2 commits)

#### EX0-T1: Scaffold Vite + React 19 project
- **Goal:** Create the single Vite + React 19 project the whole lab lives in.
- **Contract:** `src/main.jsx` mounts `<App />` with `createRoot` inside `<StrictMode>`; `src/index.css` imported once in `main.jsx`.
- **Files touched:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`, `.cursorrules` (copy of `project-rules.md`). Remove Vite template leftovers (`App.css`, demo assets, counter demo).
- **Acceptance criteria:** `npm run dev` starts; `package.json` lists `react@^19` and `react-dom@^19`; no extra dependencies beyond the Vite React template.
- **Verification:** `npm ls react react-dom` shows 19.x; browser shows a blank page with zero console warnings.
- **Commit:** `chore: init react19 vite & rules`

#### EX0-T2: Commit this WBS section
- **Goal:** Record the EX1 spec before any EX1 code (rules section 9).
- **Files touched:** `TASK_DECOMPOSITION.md`
- **Verification:** `git log --oneline` shows the docs commit before `feat(ex1)`.
- **Commit:** `docs(spec): add EX1 developer card WBS`

---

### Commit 1: `feat(ex1): implement semantic DeveloperCard and SkillBadge`

> Task granularity: one task per commit (revised after T1-T2: those two steps were too small to verify on their own).
> EX1-T1 and EX1-T2 are done; EX1-T3 completes the component, mounts it, and closes Commit 1 (JSX + logic only, no CSS file content).

#### EX1-T1: JSDoc contracts (done)
- **Goal:** Define the prop contracts of `DeveloperCard` and `SkillBadge` before writing JSX.
- **Contract:**
  ```js
  /**
   * @typedef {Object} Skill
   * @property {string} id    Stable unique id, used as React key
   * @property {string} name  Display name, e.g. 'React 19 Fiber'
   * @property {string} tier  Level label, e.g. 'Core'
   */

  /**
   * @typedef {Object} DeveloperCardProps
   * @property {string} [fullName]
   * @property {string} [role]
   * @property {string} [avatarUrl]                 HTTPS only
   * @property {Record<string, number>} [metrics]   Rendered as dt/dd pairs
   * @property {Skill[]} [skills]
   */

  /**
   * @typedef {Object} SkillBadgeProps
   * @property {string} name
   * @property {string} tier
   */
  ```
- **Files touched:** `src/components/DeveloperCard.jsx`, `src/components/SkillBadge.jsx` (D1)
- **Acceptance criteria:** R3; no `PropTypes`, no `defaultProps`; defaults are ES6 default parameters with the exact values above.
- **Verification:** `git grep -nE "PropTypes|defaultProps" -- src` returns nothing.

#### EX1-T2: `<SkillBadge />` component (done)
- **Goal:** Render one skill as `{name} ({tier})` as a reusable, pure component.
- **Contract:** `SkillBadge({ name, tier })` → returns `<li>{name} ({tier})</li>` (D2, D3). Caller passes `key={s.id}`.
- **Files touched:** `src/components/SkillBadge.jsx` (named export `SkillBadge`)
- **Acceptance criteria:** R2, R7; pure (no state, no effects); no `<div>`.
- **Verification:** Static render shows `<ul><li>React 19 Fiber (Core)</li></ul>`; XSS string renders as text. DevTools check moves to EX1-T3.

#### EX1-T3: `<DeveloperCard />` JSX, avatar fallback, and mount in `App.jsx` (merged old T3 + T4 + T5)
- **Goal:** Build the card exactly as the reference contract, give the avatar an initials fallback, and render it on the page.
- **Structure:**
  ```
  main
  ├─ h1 "Lab 3: React 19"                         (D7)
  └─ section
      └─ article.card  [aria-labelledby={headingId}]   headingId = useId() (D5)
          ├─ header.header
          │   ├─ img.avatar (src=avatarUrl, alt=fullName, width=64, height=64, onError)
          │   │   or span.avatar[role=img][aria-label=fullName]{initials}  (D6)
          │   └─ hgroup > h2#{headingId}{fullName} + p{role}
          ├─ dl.metrics
          │   └─ Object.entries(metrics) → <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>  (D8)
          └─ ul.skills [aria-label="Engineered Skills"]  (D4)
              └─ skills.map(s → <SkillBadge key={s.id} name={s.name} tier={s.tier} />)  (D2)
  ```
- **Contract:**
  - State: `const [avatarFailed, setAvatarFailed] = useState(false)` (only independent source of truth).
  - Derived during render (no `useEffect`): `initials` = first letter of the first and last word of `fullName`, uppercased. `'Tran Vinh Khiem'` → `'TK'`; `'Khiem'` → `'K'`; empty → `'?'`.
  - `DeveloperCard.module.css` is created **empty** so the `styles` import resolves; its rules belong to EX1-T4.
- **Files touched:** `src/components/DeveloperCard.jsx`, `src/components/DeveloperCard.module.css` (empty), `src/App.jsx`
- **Acceptance criteria:** R1, R2, R4, R5, R6, R7, R10; named export `DeveloperCard`; imports only `Fragment`, `useId`, `useState` from `react`; no inline `style={{}}`; no `key={index}`; `width="64" height="64"` on `<img>`; App holds no state; exactly one `<h1>`.
- **Verification:**
  - `grep -n '<div' src/components/DeveloperCard.jsx src/components/SkillBadge.jsx` → 0 matches
  - `git grep -n "http://" -- src` → 0 matches
  - DevTools → Accessibility tree: `main` → `article` "Tran Vinh Khiem" → `header` + description list + `list` "Engineered Skills"
  - DevTools → Network → Block request URL `images.unsplash.com` → reload → initials `TK` appear in place of the photo
  - Console: zero warnings (no key warnings) in StrictMode
- **Commit:** `feat(ex1): implement semantic DeveloperCard and SkillBadge`

---

### Commit 2: `style(ex1): add responsive 375px CSS module`

#### EX1-T4: Global tokens + `DeveloperCard.module.css` at 375px (merged old T6 + T7)
- **Goal:** Replace Slide 18's inline `#d0f0c0` with `:root` custom properties and scoped card styles that are perfect at 375px. CSS only, no JSX changes.
- **Contract:**
  - `src/index.css`: reset (`box-sizing: border-box; margin: 0; padding: 0`); `:root` tokens such as `--color-card-bg: #d0f0c0;` plus the text, border, accent, spacing and radius tokens the card actually uses. Hex colors appear **only** inside `:root`.
  - `DeveloperCard.module.css` classes, all values via `var(--token)`:
    - `.card`: background `var(--color-card-bg)`, padding, radius, `max-width` with `width: 100%`.
    - `.header`: Flexbox row, `gap`; text `min-width: 0; overflow-wrap: anywhere`.
    - `.avatar`: fixed 64×64 (`flex-shrink: 0`), shared by `<img>` and the initials `<span>` (zero CLS).
    - `.metrics`: Grid `dt`/`dd` 2 columns, `gap`.
    - `.skills`: Flexbox `flex-wrap: wrap`, `gap`, `list-style: none`.
- **Files touched:** `src/index.css`, `src/components/DeveloperCard.module.css`
- **Acceptance criteria:** R8, R9; `gap` instead of child margins; no inline styles; text contrast ≥ 4.5:1 against `--color-card-bg`.
- **Verification:**
  - `git grep -nE "#[0-9a-fA-F]{3,8}" -- src` matches only lines inside `:root` of `src/index.css`
  - DevTools → Device Toolbar → iPhone SE (375px): no horizontal scrollbar; `document.documentElement.scrollWidth <= 375` in the Console; long `role` text wraps
  - Block the avatar again → initials box is the same 64×64 size (no layout shift)
  - DevTools contrast checker ≥ 4.5
- **Commit:** `style(ex1): add responsive 375px CSS module`

---

### EX1-T5: Checkpoint 1 verification audit (minute 75, no commit)

```bash
# 1. Zero <div> soup inside components (expect empty)
grep -n '<div' src/components/DeveloperCard.jsx src/components/SkillBadge.jsx
# 2. HTTPS-only media origins (expect empty)
grep -n 'http://' src/components/DeveloperCard.jsx
git grep -n "http://" -- src
# 3. Atomic commits match this WBS
git log --oneline
```
- DevTools → Elements → Accessibility tree: `article` → `header` + `dl` + list.
- DevTools → Device Toolbar → iPhone SE (375px): zero horizontal scroll.
- Git log: exactly 2 EX1 commits, messages identical to Commit 1 and Commit 2 above.
- Console: zero warnings under StrictMode.

### Decisions (EX1, agreed with the developer)

- **D1 – SkillBadge file:** Separate file `src/components/SkillBadge.jsx` (reusable; rules section 3 also applies, so zero `<div>` there too).
- **D2 – SkillBadge root:** `SkillBadge` returns the `<li>` itself; `key={s.id}` is set at the `map` call site. Keeps DOM `ul > li` with no wrapper.
- **D3 – Skill field:** `tier` (matches the reference code and default data; `level` in the highlights is treated as a slide typo).
- **D4 – List label:** `aria-label="Engineered Skills"` (matches the reference code).
- **D5 – Heading id:** `useId()` instead of the literal `'dev-heading'` (rules section 3; avoids duplicate ids if the card renders twice). Intentional deviation from the slide.
- **D6 – Avatar fallback:** Initials from first + last word (`TK`), `'?'` if empty; rendered as `<span role="img" aria-label={fullName}>`.
- **D7 – Page heading:** `App.jsx` renders `<main><h1>Lab 3: React 19</h1><section>…</section></main>` (rules section 3: exactly one `<h1>`).
- **D8 – Metric labels:** Keep raw keys in `<dt>` as in the contract (no label map; scope guard).
