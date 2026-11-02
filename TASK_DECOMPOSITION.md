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
