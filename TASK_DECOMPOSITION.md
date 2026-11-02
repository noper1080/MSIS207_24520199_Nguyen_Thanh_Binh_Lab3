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

---

## EX2: Interactive Scientist & Pioneer Directory

**Source:** In-Class Sprint 2 (45 min, minutes 75-120) + "Exercise 2 Reference Contract: ScientistDirectory.jsx".
**Upgrades legacy:** Ex 0.4, 2.2, 3 and 4.3 (smartPeople), using Lab 2's Reconciliation & Derived State.

### Requirements (restated from the screenshots)

| # | Requirement |
|---|---|
| R1 | Transform Slide 20's static `smartPeople` array (Goethe, Einstein, da Vinci, Newton, Maxwell, ...) into a reactive data explorer, component `ScientistDirectory`. |
| R2 | Feature 1: case-insensitive name search. |
| R3 | Feature 2: min-IQ numeric filter, read with `e.target.valueAsNumber` (stays a number; `NaN` falls back to `0`). |
| R4 | Feature 3: sort by IQ / Age via `.toSorted()` (never `.sort()` on state). Default `sortBy` is `'iq-desc'`; otherwise age ascending. |
| R5 | Feature 4: Delete one item and Reset. `handleDelete` uses `prev.filter(p => p.id !== id)`; `handleReset` restores the `SMART_PEOPLE` snapshot. |
| R6 | ZERO `useEffect` for filtering/sorting. Only independent inputs (`people`, `query`, `minIq`, `sortBy`) live in `useState`; `visible` is computed during render. |
| R7 | Every input bound with `<label htmlFor>` + `useId()`. |
| R8 | Result count in `<output role="status" aria-live="polite">Found {visible.length} pioneers</output>`. |
| R9 | List items use stable `key={p.id}`; schema is normalized with stable ids (`sp-1` ... `sp-6`). |
| R10 | Profiler: typing 1 character in search causes EXACTLY 1 render pass. |
| R11 | Profiler: deleting "Johann Goethe" preserves focus and the remaining items' keys. |
| R12 | Exactly 3 atomic `feat` commits (messages from the slide), plus 1 extra `style(ex2)` commit for basic CSS added at the developer's request (D9). |

**Dataset (from the checkpoint snippet):**
```
{ id: 'sp-1', name: 'Johann Goethe',     age: 82, iq: 210 }
{ id: 'sp-2', name: 'Albert Einstein',   age: 76, iq: 205 }
{ id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 }
{ id: 'sp-4', name: 'Isaac Newton',      age: 84, iq: 190 }
{ id: 'sp-5', name: 'James Maxwell',     age: 48, iq: 190 }
{ id: 'sp-6', name: 'William Sidis',     age: 46, iq: 200 }
```
**Initial state (from the contract):** `people = initialData`, `query = ''`, `minIq = 160`, `sortBy = 'iq-desc'`.

**Expected results (used by verification):**
- `iq-desc`: Goethe 210, Einstein 205, Sidis 200, Newton 190, Maxwell 190, da Vinci 180 (Newton before Maxwell: stable sort, original order).
- `age-asc`: Sidis 46, Maxwell 48, da Vinci 67, Einstein 76, Goethe 82, Newton 84.
- Min IQ 200 shows 3 people; 201 shows 2; 211 shows 0.

### Prerequisite (not counted in EX2's commits)

#### EX2-T0: Commit this WBS section
- **Goal:** Record the EX2 spec before any EX2 code (rules section 9).
- **Files touched:** `TASK_DECOMPOSITION.md`
- **Verification:** `git log --oneline` shows this commit before the first `feat(ex2)`.
- **Commit:** `docs(spec): add EX2 scientist directory WBS`

---

### Commit 1: `feat(ex2): normalize smartPeople schema with stable IDs`

#### EX2-T1: Data schema + static list + mount in `App.jsx`
- **Goal:** Define the normalized data (stable ids) and render it as a keyed list on the page, with no interactivity yet.
- **Contract:**
  ```js
  /**
   * @typedef {Object} Pioneer
   * @property {string} id    Stable unique id, used as React key ('sp-1' ... 'sp-6')
   * @property {string} name
   * @property {number} age
   * @property {number} iq
   */

  /**
   * @typedef {Object} ScientistDirectoryProps
   * @property {Pioneer[]} [initialData]   Defaults to SMART_PEOPLE
   */
  ```
  - `SMART_PEOPLE`: module-level constant with the 6 objects above, not exported (D1).
  - `ScientistDirectory({ initialData = SMART_PEOPLE })`, named export.
  - `const [people] = useState(initialData)` is the single source of truth from the start (the setter is added in T3).
  - Markup: `section.directory[aria-label="Pioneer Directory"] > ul.list > li.item` with `key={p.id}`, text `{p.name} — IQ {p.iq}, age {p.age}` (D7).
  - `ScientistDirectory.module.css` is created **empty** and imported as `styles`, so the class names above resolve; its rules belong to EX2-T4 (same approach as EX1).
  - `App.jsx` adds a second `<section>` below the EX1 one that renders `<ScientistDirectory />` (D8).
- **Files touched:** `src/components/ScientistDirectory.jsx` (new), `src/components/ScientistDirectory.module.css` (new, empty), `src/App.jsx`
- **Acceptance criteria:** R1, R9; no `PropTypes`/`defaultProps`; no `useEffect`; no `key={index}`; names rendered as JSX text only; still exactly one `<h1>`; no inline `style`.
- **Verification:**
  - Page shows 6 `li`, in data order.
  - Console: zero warnings (no "unique key" warning) in StrictMode.
  - `git grep -nE "useEffect|key=\{(i|index)\}" -- src` → no output.
  - Accessibility tree: region "Pioneer Directory" → list with 6 items.
- **Commit:** `feat(ex2): normalize smartPeople schema with stable IDs`

---

### Commit 2: `feat(ex2): add search, IQ filter & toSorted`

#### EX2-T2: Search, min-IQ filter and sort as derived state
- **Goal:** Add the three controls and compute the visible list during render.
- **Contract:**
  - New state (independent inputs only): `query: string = ''`, `minIq: number = 160`, `sortBy: 'iq-desc' | 'age-asc' = 'iq-desc'`.
  - Derived during render, never stored: `visible` = `people` filtered by (name includes `query`, case-insensitive, trimmed) AND (`p.iq >= minIq`), then `.toSorted()` by `sortBy`. Search uses `String.prototype.includes`, never a `RegExp` built from input.
  - Controls inside `<form role="search" className={styles.controls}>` whose `onSubmit` calls `preventDefault()`; label and control sit side by side as direct children of the form (no wrapper elements):
    - `<label htmlFor={qId}>Name</label>` + `<input id={qId} type="search" value={query}>`
    - `<label htmlFor={iqId}>Min IQ</label>` + `<input id={iqId} type="number" value={minIq}>`; the handler stores `e.target.valueAsNumber`, and `0` when it is `NaN`.
    - `<label htmlFor={sortId}>Sort by</label>` + `<select id={sortId} value={sortBy}>` with options `iq-desc` = "IQ (high to low)" and `age-asc` = "Age (young to old)" (D4).
    - All three ids come from `useId()`.
  - The list renders `visible` instead of `people`.
- **Files touched:** `src/components/ScientistDirectory.jsx`
- **Acceptance criteria:** R2, R3, R4, R6, R7, R10; every control has a visible label; no `useEffect`; no `.sort(`; `people` and `SMART_PEOPLE` never mutated; `type="button"` on any button added.
- **Verification:**
  - Type `ein` and `EIN` → only "Albert Einstein"; `  ein  ` (with spaces) behaves the same.
  - Min IQ 200 → 3 people; 201 → 2; clear the field → no crash, `minIq` falls back to `0` (all 6 visible).
  - Sort: results match the expected orders listed in the Requirements section.
  - `git grep -nE "useEffect|\.sort\(" -- src/components/ScientistDirectory.jsx` → no output.
  - React DevTools Profiler: typing 1 character produces exactly 1 commit (StrictMode double-invokes render in dev; the Profiler still reports 1 commit).
  - Keyboard only: Tab reaches all 3 controls in order; the Accessibility tree names them "Name", "Min IQ", "Sort by".
- **Commit:** `feat(ex2): add search, IQ filter & toSorted`

---

### Commit 3: `feat(ex2): add delete/reset & live status`

#### EX2-T3: Delete, Reset and live result count
- **Goal:** Let the user remove people and restore the dataset, and announce the filtered count to screen readers.
- **Contract:**
  - `setPeople` is now used. `handleDelete(id)` removes the person with that id using `prev.filter(p => p.id !== id)`. `handleReset()` restores the `initialData` snapshot (D2) and leaves `query`, `minIq`, `sortBy` untouched (D3).
  - Each `li` gets `<button type="button" className={styles.button} aria-label="Delete {name}">Delete</button>` (D5).
  - One `<button type="button" className={styles.button}>Reset</button>` right after the status line (D5).
  - `<output className={styles.status} role="status" aria-live="polite">Found {visible.length} pioneers</output>` placed between the form and the list.
  - Handlers are plain functions: no `useCallback`/`memo` (rules section 4).
- **Files touched:** `src/components/ScientistDirectory.jsx`
- **Acceptance criteria:** R5, R6, R8, R11; immutable updates only; stable `key={p.id}` unchanged; no `useEffect`; no `window.alert`/`confirm`.
- **Verification:**
  - Delete "Johann Goethe" → count goes from 6 to 5; the 5 remaining `li` DOM nodes are the same nodes as before (not remounted) and keep their keys.
  - Delete then Reset → 6 people back, in the original data order.
  - Delete while a filter is active → the count reflects the filtered list.
  - Accessibility tree: the `<output>` exposes role `status`, `aria-live="polite"`, and its text updates after every change.
  - Focus behavior as decided in D6 (checked with keyboard only): no focus-management code, the page does not steal focus.
  - Profiler: typing 1 character is still exactly 1 commit.
  - `git grep -nE "useEffect|\.sort\(|alert\(" -- src` → no output.
- **Commit:** `feat(ex2): add delete/reset & live status`

---

### Commit 4: `style(ex2): add basic responsive directory styles`

> Added at the developer's request (D9); the slide itself lists only 3 commits. CSS only, no JSX changes in this commit.

#### EX2-T4: Basic directory styles at 375px
- **Goal:** Make the form, list and buttons readable and easy to follow, reusing the existing design tokens.
- **Contract:** `ScientistDirectory.module.css`, every value via `var(--token)` from `src/index.css`. No new hex colors; if a new token is truly needed it goes inside `:root` and is reported.
  - `.directory`: Grid, `gap`, `width: 100%`, `max-width: var(--card-max-width)`.
  - `.controls`: Grid with 2 columns (`auto 1fr`), `gap`, `align-items: center`; each label/control pair flows into the columns. Inside it, `input` and `select` get `min-width: 0; width: 100%`, a `var(--color-border)` border, `var(--radius-md)` radius, padding and `font: inherit`.
  - `.status`: muted text (`var(--color-text-muted)`).
  - `.list`: `list-style: none`, Grid with `gap`.
  - `.item`: Flexbox, `justify-content: space-between`, `align-items: center`, `gap`; border, radius, padding, `var(--color-badge-bg)` background; text wraps (`min-width: 0; overflow-wrap: anywhere`).
  - `.button`: `var(--color-accent)` background, `var(--color-on-accent)` text, radius, padding, `cursor: pointer`.
  - Visible `:focus-visible` outline on inputs, select and buttons.
- **Files touched:** `src/components/ScientistDirectory.module.css` (and `src/index.css` only if a new token is unavoidable)
- **Acceptance criteria:** basic styling only (no animations, themes or extra layout); `gap` instead of child margins; text contrast >= 4.5:1; no inline styles.
- **Verification:**
  - `git show --stat` for this commit lists only `.css` files.
  - `git grep -nE "#[0-9a-fA-F]{3,8}\b" -- src` matches only lines inside `:root` of `src/index.css`.
  - DevTools Device Toolbar at 375px (iPhone SE): no horizontal scrollbar, `document.documentElement.scrollWidth <= 375`; form, list and buttons fit.
  - Keyboard only: Tab shows a visible focus ring on every input, the select, and every button.
  - Contrast checker >= 4.5:1 on text, buttons and list items.
- **Commit:** `style(ex2): add basic responsive directory styles`

---

### EX2-T5: Checkpoint 2 verification audit (minute 120, no commit)

```bash
# 1. No effect-based derived state, no in-place sort, no insecure URLs (expect empty)
grep -nE "useEffect|\.sort\(" src/components/ScientistDirectory.jsx
git grep -n "http://" -- src
# 2. No div soup / inline styles / index keys / banned APIs (expect empty)
git grep -nE "<div|style=\{\{|key=\{(i|index)\}|dangerouslySetInnerHTML|innerHTML|PropTypes|defaultProps" -- src/components/ScientistDirectory.jsx
# 3. Atomic commits match this WBS
git log --oneline
```
- Profiler: 1 character typed in search = exactly 1 render pass of `ScientistDirectory`.
- Deleting "Johann Goethe" keeps the remaining item keys and DOM nodes (see D6 for focus).
- Every `<input>`/`<select>` is reachable through its `<label>` (clicking the label focuses the control).
- DevTools Device Toolbar at 375px: zero horizontal scroll.
- Hex colors appear only inside `:root`: `git grep -nE "#[0-9a-fA-F]{3,8}\b" -- src`.
- Console: zero warnings under StrictMode.
- Git log: 3 `feat(ex2)` commits followed by 1 `style(ex2)` commit, messages identical to the ones above, preceded by the `docs(spec)` commit.

### Decisions (EX2, agreed with the developer)

- **D1 – `SMART_PEOPLE` location:** Module-level constant inside `ScientistDirectory.jsx`, not exported (no new file).
- **D2 – Reset target:** Restores `initialData` (equal to `SMART_PEOPLE` with the default props).
- **D3 – Reset scope:** Restores `people` only; `query`, `minIq` and `sortBy` stay as the user left them.
- **D4 – Sort control:** `<select>` labelled "Sort by", options `iq-desc` = "IQ (high to low)" and `age-asc` = "Age (young to old)".
- **D5 – Buttons:** Delete button inside each `li` with `aria-label="Delete {name}"`; one Reset button after the status line; all `type="button"`.
- **D6 – Focus after delete:** No focus-management code. "Preserves focus" is verified as: remaining items keep their keys, their DOM nodes are not remounted, and the page does not steal focus.
- **D7 – Item text:** `{p.name} — IQ {p.iq}, age {p.age}` (age added so the age sort is visible; deliberate addition to the slide's text).
- **D8 – `App.jsx`:** Wraps `<ScientistDirectory />` in its own `<section>`, as for EX1.
- **D9 – CSS:** EX2 gets a basic `ScientistDirectory.module.css` in a 4th commit `style(ex2): add basic responsive directory styles`. This is a deliberate extra over the slide's 3 commits (rules section 7.4 says to match the stated count), chosen by the developer to make the exercise easier to follow. JSX gets its class names in T1-T3 so the CSS commit contains no JSX.
- **D10 – Contract quirks kept:** clearing the Min IQ field shows `0`, and the status text reads "Found 1 pioneers" for one result (both follow the slide literally).

---

## EX3: KRAFTON PUBG Vietnam Series (PVS) Live Telemetry

**Source:** In-Class Sprint 3 (35 min, minutes 120-155) + "Exercise 3 Reference Contract: PubgMatchTelemetry.jsx".
**Goal (slide):** a fault-tolerant live esports radar for Vietnamese PUBG pro squads.

### Requirements (restated from the screenshots)

| # | Requirement |
|---|---|
| R1 | Build `<PubgMatchTelemetry />` tracking live PVS stats for Cerberus Esports (CES), The Expendables (TE, PGC World Champions) and Genius Esports (GE). |
| R2 | 4-state machine: `'IDLE' \| 'LOADING' \| 'SUCCESS' \| 'ERROR'` (single `view` state object `{ status, data, error }`). |
| R3 | During `LOADING`: a 220px pulsing Blue-Zone Skeleton card (`<section aria-busy="true">`, text "Syncing KRAFTON Radar..."). |
| R4 | Simulate 35% Erangel/Miramar satellite packet loss. |
| R5 | Rapid squad switching aborts stale requests cleanly via `AbortController`: the effect cleanup calls `controller.abort()`. |
| R6 | Safe AbortError guard: `if (err.name === 'AbortError') return;` so switching never flashes a false error banner. |
| R7 | Zero `window.alert()` (Slide 19 fix): packet-timeout errors render in `<section role="alert">` with a "Reconnect Satellite (Retry)" `<button type="button">`. |
| R8 | Retry button increments `retryTick`, which re-runs the `useEffect` pipeline (`[squadId, retryTick]`). |
| R9 | Success view: `<article aria-live="polite">` showing `{name} — Kills: {kills}`. |
| R10 | Props: `squadId = 'te'` (default). |
| R11 | Checkpoint 3 (DevTools): Network "Slow 3G" -> 0.00 CLS skeleton loader; rapidly click CES -> TE -> GE -> Network shows `(canceled)` requests. |
| R12 | Exactly 2 atomic commits (messages below). |

**Dataset (from the slide):**
```
{ id: 'ces', name: 'Cerberus Esports', map: 'Erangel', phase: 'Phase 6', alive: 4, kills: 14, wwcdProb: '68%', status: 'In Safe Zone' }
{ id: 'te',  name: 'The Expendables',  map: 'Miramar', phase: 'Phase 7', alive: 4, kills: 18, wwcdProb: '82%', status: 'Holding High Ground' }
{ id: 'ge',  name: 'Genius Esports',   map: 'Taego',   phase: 'Phase 5', alive: 3, kills: 9,  wwcdProb: '41%', status: 'Rotating Blue Zone' }
```

### Analysis: what the slide leaves unclear or contradicts

1. **`(canceled)` in the Network panel needs a real HTTP request.** The contract calls `fetchKraftonPubgTelemetry(squadId, { signal })` but never defines it. A fake function built on `setTimeout` makes no request, so Network never shows `(canceled)` and "Slow 3G" does nothing. See D1.
2. **IDLE has no render branch.** The effect only runs after the first paint, so the contract paints an empty `<article>` ("— Kills:") for one frame before the skeleton. That is a layout shift, against "0.00 CLS". See D5.
3. **Skeleton is 220px, success card is one `<h3>`.** Swapping them collapses the box. See D5.
4. **Heading level:** the contract uses `<h3>`, but the page has `h1` then nothing, and rules section 3 requires sequential headings. See D6.
5. **Three names for the retry button:** "Reconnect Telemetry" (bullet), "Reconnect Satellite (Retry)" (spec), "Reconnect Satellite" (code). See D7.
6. **"35% Erangel/Miramar packet loss" is ambiguous:** all squads, or only squads playing on those two maps (CES, TE)? See D2.
7. **The squad selector exists in the checkpoint ("click CES -> TE -> GE") but has no markup,** and `squadId` is a prop, so the state must be lifted into `App.jsx`. See D3.
8. **StrictMode runs effects twice in dev,** so the first load shows one `(canceled)` request even before any click. This is expected, not a bug.
9. **A response can arrive in the same tick as an abort.** The fetch helper must re-check `signal` before resolving so a stale payload never reaches `setView`.

### Prerequisite (not counted in EX3's commits)

#### EX3-T0: Commit this WBS section
- **Goal:** Record the EX3 spec before any EX3 code (rules section 9).
- **Files touched:** `TASK_DECOMPOSITION.md`
- **Commit:** `docs(spec): add EX3 PUBG telemetry WBS`

---

### Commit 1: `feat(ex3): implement PUBG VN 4-state telemetry & AbortController`

#### EX3-T1: Data source, state machine, abortable effect, squad selector
- **Goal:** Load squad telemetry through a cancelable pipeline, switch squads, and show the success card. LOADING/ERROR visuals come in T2.
- **Contract:**
  ```js
  /**
   * @typedef {Object} Squad
   * @property {string} id            'ces' | 'te' | 'ge'
   * @property {string} name
   * @property {string} map           'Erangel' | 'Miramar' | 'Taego'
   * @property {string} phase
   * @property {number} alive
   * @property {number} kills
   * @property {string} wwcdProb      e.g. '68%'
   * @property {string} status
   */

  /**
   * @typedef {Object} TelemetryView
   * @property {'IDLE'|'LOADING'|'SUCCESS'|'ERROR'} status
   * @property {Squad|null} data
   * @property {string|null} error
   */

  /**
   * @typedef {Object} PubgMatchTelemetryProps
   * @property {string} [squadId]     Defaults to 'te'
   */
  ```
  - `fetchKraftonPubgTelemetry(squadId, { signal })`: module-level, not exported (D1). Real `fetch` with `signal`; finds the squad by id; applies the packet-loss rule (D2); re-checks `signal` before resolving/rejecting so an aborted call always rejects with `AbortError`.
  - `PubgMatchTelemetry({ squadId = 'te' })`: `useState({ status: 'IDLE', data: null, error: null })`; one `useEffect` keyed on `[squadId]` that creates the `AbortController`, sets `LOADING`, chains `.then`/`.catch` (AbortError returns silently), and returns `() => controller.abort()`.
  - Render in this commit: success `<article aria-live="polite">` with `<h2>{name} — Kills: {kills}</h2>` and a `<dl>` (EX1 pattern) for map, phase, alive, wwcdProb and status (D6, D8). LOADING/ERROR visuals are T2.
  - `App.jsx`: lifted `squadId` state (initial `'te'`) and a squad picker in a new `<section>`: `<fieldset>` + `<legend>Squad</legend>`, three `type="button"` buttons with `aria-pressed` and visible full names (D3, D4). It imports `App.module.css` and applies its class names now, so the style commit needs no JSX.
  - `src/App.module.css` created **empty** (rules come in T3).
  - `PubgMatchTelemetry.module.css` created **empty**, imported as `styles` (same approach as EX1/EX2).
- **Files touched:** `public/pubg-vn-squads.json` (new, D1), `src/components/PubgMatchTelemetry.jsx` (new), `src/components/PubgMatchTelemetry.module.css` (new, empty), `src/App.module.css` (new, empty), `src/App.jsx`
- **Acceptance criteria:** R1, R2, R4, R5, R6, R8 (partly, `retryTick` lands in T2), R9, R10; effect returns a cleanup; AbortError never sets `ERROR`; no `window.alert`; no `http://`; no inline `style`; no `key={index}`; no new dependency.
- **Verification:**
  - `grep -nE "alert\(|http://|style=|<div" src/components/PubgMatchTelemetry.jsx src/App.jsx` -> no output.
  - Network panel, throttling "Slow 3G": click CES -> TE -> GE quickly -> earlier requests show `(canceled)`, only the last one completes, and the card ends on Genius Esports.
  - Force outcomes without touching code: in the Console run `Math.random = () => 0` (loss on Erangel/Miramar) or `Math.random = () => 0.99` (no loss). React DevTools -> Components shows `view.status` becoming `ERROR` / `SUCCESS`; rapid switching never leaves `status: 'ERROR'` caused by an abort.
  - Dev/StrictMode: first load shows one canceled + one completed request (expected).
  - Console: zero warnings.
- **Commit:** `feat(ex3): implement PUBG VN 4-state telemetry & AbortController`

---

### Commit 2: `feat(ex3): add skeleton UI & retry alert`

#### EX3-T2: Skeleton, retry alert and `retryTick`
- **Goal:** Give LOADING/IDLE and ERROR their UI, and let the user retry without `window.alert`.
- **Contract:**
  - `retryTick`: `useState(0)`; added to the effect deps -> `[squadId, retryTick]`.
  - `IDLE` or `LOADING` -> `<section aria-busy="true" className={styles.skeleton}>Syncing KRAFTON Radar...</section>` (IDLE shares the skeleton, D5).
  - `ERROR` -> `<section role="alert">` containing `<p>Blue-Zone Link Lost: {view.error}</p>` and `<button type="button">Reconnect Satellite</button>` whose click does `setRetryTick(t => t + 1)` (D7).
  - Panels get `className={styles.panel}` so one shared box exists for all states (D5).
- **Files touched:** `src/components/PubgMatchTelemetry.jsx`
- **Acceptance criteria:** R3 (structure; size/pulse come in T3), R6, R7, R8; `role="alert"`; `type="button"`; no `window.alert`; retry re-runs the effect; stale `ERROR` never shows after an abort.
- **Verification:**
  - `Math.random = () => 0` then select CES -> alert appears with the message and the button; Accessibility tree: `alert` with a button.
  - Click the button -> status goes `ERROR` -> `LOADING` -> `ERROR` again (still lossy) -> run `Math.random = () => 0.99`, click again -> `SUCCESS`.
  - Rapid CES -> TE -> GE never flashes the alert (AbortError guard).
  - Keyboard: Tab reaches the retry button, Enter activates it. Focus is not managed after state swaps (same stance as EX2 D6).
  - `git grep -nE "alert\(" -- src` -> no output.
- **Commit:** `feat(ex3): add skeleton UI & retry alert`

---

### Commit 3: `style(ex3): add skeleton pulse and responsive 375px layout`

> Extra commit beyond the slide's 2, same pattern as EX1/EX2 (D9). CSS only, no JSX.

#### EX3-T3: Skeleton pulse, shared 220px panel, picker and alert styles
- **Goal:** Make the skeleton a 220px pulsing Blue-Zone card and keep layout shift at 0.00 across all states, perfect at 375px.
- **Contract:** all values via `var(--token)`; hex only inside `:root` (new blue-zone tokens, if needed, are added there).
  - `PubgMatchTelemetry.module.css`: `.panel` (shared by skeleton, alert and success card: `min-height: 220px`, padding, border, radius), `.skeleton` (Blue-Zone color, `@keyframes` opacity pulse), alert and retry-button styles (`.button` look as in EX2), `:focus-visible` outline, text `overflow-wrap: anywhere`.
  - `src/App.module.css` (created empty in T1): picker `<fieldset>` layout with `flex-wrap` and `gap`; the pressed state must not rely on color alone (for example a border or weight change as well) (D4).
  - `@media (prefers-reduced-motion: reduce)` stops the pulse (D10).
- **Files touched:** `src/components/PubgMatchTelemetry.module.css`, `src/App.module.css`, `src/index.css` (only for new `:root` tokens). No JSX file is touched.
- **Acceptance criteria:** R3 (220px, pulsing), R11 (0.00 CLS); no margin on children (`gap`); contrast >= 4.5:1; no inline styles.
- **Verification:**
  - Slow 3G, reload and switch squads -> DevTools Performance "Layout Shifts" track (or Lighthouse CLS) shows 0.00; skeleton, alert and success boxes have the same height.
  - 375px (iPhone SE): `document.documentElement.scrollWidth <= 375`; picker buttons wrap, no overflow.
  - Reduced-motion emulation (Rendering tab) -> no animation.
  - `git grep -nE "#[0-9a-fA-F]{3,8}\b" -- src` -> only lines inside `:root` of `src/index.css`.
- **Commit:** `style(ex3): add skeleton pulse and responsive 375px layout`

---

### EX3-T4: Checkpoint 3 verification audit (minute 155, no commit)

```bash
# 1. No window.alert, no insecure URLs, no inline styles / index keys / div soup (expect empty)
git grep -nE "alert\(|http://|style=|key=\{(i|index)\}|<div" -- src/components/PubgMatchTelemetry.jsx
git grep -n "http://" -- src
# 2. Abort wiring is present (expect matches)
grep -nE "AbortController|\.abort\(\)|AbortError" src/components/PubgMatchTelemetry.jsx
# 3. Atomic commits match this WBS
git log --oneline
```
- DevTools -> Network "Slow 3G": skeleton appears, CLS 0.00.
- Rapidly click CES -> TE -> GE: stale requests show `(canceled)`, the final card is Genius Esports, no alert flashes.
- Force failure (`Math.random = () => 0`), see the alert, click Reconnect Satellite, recover with `Math.random = () => 0.99`.
- Accessibility tree: `status`/live region on the article, `alert` on the error section.
- 375px: zero horizontal scroll. Console: zero warnings under StrictMode.
- Whole-lab sweep: `git grep -n "http://" -- src` empty; `git grep -nE "<div" -- src/components` empty; `git log --oneline` shows the EX1, EX2, EX3 commits.

### Decisions (EX3, agreed with the developer)

- **D1 – Data source:** three squads live in `public/pubg-vn-squads.json`; `fetchKraftonPubgTelemetry` is a module-level, non-exported function in `PubgMatchTelemetry.jsx` doing a real `fetch('/pubg-vn-squads.json', { signal })`, picking the squad by id, then applying packet loss. No artificial delay: "Slow 3G" provides it. New file outside the layout in `project-rules.md`, approved by the developer.
- **D2 – Packet loss:** squads on Erangel or Miramar (CES, TE) fail with probability 0.35 (`Math.random() < 0.35`), Taego (GE) never fails; the roll happens after the response arrives; error text `Packet timeout: {map} satellite link lost`. Tests force outcomes with `Math.random = () => 0` (loss) or `() => 0.99` (no loss) in the Console.
- **D3 – Selector location:** `App.jsx` owns `squadId` (initial `'te'`) and renders the picker in a new `<section>` next to the telemetry panel.
- **D4 – Picker markup/style:** `<fieldset>` + `<legend>Squad</legend>`, three `type="button"` buttons with `aria-pressed` and full names (Cerberus Esports, The Expendables, Genius Esports). Styled by a new `src/App.module.css`, imported in T1 (empty) and filled in T3.
- **D5 – IDLE and CLS:** IDLE renders the same skeleton as LOADING; skeleton, alert and success card share one `.panel` with `min-height: 220px`. Deliberate addition to the slide's contract to reach 0.00 CLS.
- **D6 – Heading level:** success card uses `<h2>` (rules: sequential headings), not the contract's `<h3>`.
- **D7 – Retry label:** `Reconnect Satellite`.
- **D8 – Extra fields:** a `<dl>` shows map, phase, alive, wwcdProb and status next to `{name} — Kills: {kills}`.
- **D9 – Commits:** the 2 slide commits plus a 3rd `style(ex3)` commit, so JSX and CSS stay apart (deliberate extra over the slide's count, as in EX2 D9).
- **D10 – Reduced motion:** the pulse stops under `prefers-reduced-motion: reduce`.
