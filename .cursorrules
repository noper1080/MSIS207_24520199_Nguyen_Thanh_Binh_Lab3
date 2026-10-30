# project-rules.md: Lab 3 (EX1-EX3, HW1-HW3), React 19

> Read this file before every task. Copy to `.cursorrules` in the repo root.
> *AI generates code. The developer proves it is correct.*
> Talk to the developer in Vietnamese. Write code, comments, commits, and docs in English.

## 0. SCOPE GUARD (highest priority)

- Build the **MINIMUM** that satisfies the requirements of the current exercise or homework. Nothing more.
- Requirements come ONLY from the screenshot or task text the developer gives you. Never invent
  features, options, props, pages, themes, or animations.
- No routing, no state library, no backend. Small hardcoded data sets (about 6-20 items) are enough.
- **Never add a dependency.** If one seems needed, stop and ask.
- If something is unclear or not specified here or in the task: **ask. Do not decide on your own.**
- One task per prompt. Touch only the files named in that task's WBS entry.

## 1. Stack and Repo Layout

- One repo, one Vite + React 19 project, ES2024, `.jsx` files, JSDoc for contracts (no TypeScript).
- Mount with `createRoot` from `react-dom/client` inside `<StrictMode>`. Import only the hooks you use.
- Styling: CSS Modules (`*.module.css`) + CSS custom properties in a global `src/index.css`.
- Layout:
  ```
  project-rules.md  TASK_DECOMPOSITION.md  AI_FAILURE_AUDIT.md
  src/components/   DeveloperCard.jsx  ScientistDirectory.jsx  PubgMatchTelemetry.jsx   (EX1-3)
  src/homeworks/    DrumMachine/  GrandPiano88/  KraftonPubgVnArena/                      (HW1-3)
  ```
- `App.jsx` only renders each exercise in its own `<section>`; it holds shared state only when a task requires lifting state up.

## 2. Banned Patterns

| Banned | Use instead |
|---|---|
| `class extends React.Component`, `ReactDOM.render` | Function components, `createRoot` |
| `Component.defaultProps`, `PropTypes` | ES6 default parameters + JSDoc |
| `import * as React` | `import { useState } from 'react'` |
| `keyCode`, `keypress` | `keydown` + `e.code` (or `e.key`) |
| `window.alert()` | `<section role="alert">` with a retry button |
| `innerHTML`, `dangerouslySetInnerHTML` | JSX text (auto-escaped) |
| `http://` URLs | `https://` |
| `key={index}`, `key={text}` | `key={item.id}` |
| Mutating state (`push`, `.sort()` on state) | `[...prev, x]`, `filter`, `toSorted` |
| `useEffect` to sync derived data | Compute during render |
| Timers, listeners, or fetches without cleanup | Return a cleanup / `AbortController` |
| `setInterval(s => s - 1)` countdowns | `targetTime - Date.now()` |
| Inline `style={{}}`, hex colors outside `:root` | CSS Module + custom properties |
| `var` | `const` / `let` |

## 3. Semantic HTML and Accessibility

- Zero `<div>` when a semantic tag fits: `main`, `section`, `article`, `header`, `hgroup`, `dl/dt/dd`,
  `ul/li`, `output`, `figure`, `Fragment`. `<div>` is allowed only where a task does not forbid it and no semantic tag fits.
- `<main>` is top-level and contains the sections. Exactly one `<h1>`; headings stay sequential.
- Key-value data uses `<dl>` (with `<Fragment key>` per pair), never several `<h1>`.
- Every `<input>`/`<select>` has a visible `<label htmlFor={id}>` with `id` from `useId()`.
  Placeholders are never labels. Number inputs read `e.target.valueAsNumber`.
- `<button>` always has `type="button"` unless it submits a form. Toggles expose `aria-pressed`.
- Result counts and status changes: `<output role="status" aria-live="polite">`. Errors: `role="alert"`.
- Images: `https`, `width`/`height`, meaningful `alt`, graceful fallback if loading fails.
- Keyboard only must work; keep visible focus; text contrast >= 4.5:1; never color alone.
- Landmark/heading ids that must be unique are generated with `useId()`.

## 4. React and State

- Components are pure: UI = f(props, state). Never mutate props or state; update immutably.
- Keep only independent source-of-truth values in `useState`. Filtered/sorted/counted data is **derived during render**.
- Lists use stable ids as `key`.
- Hooks only at the top level of a component or custom hook.
- Every `useEffect` that starts a timer, listener, fetch, or audio node returns its cleanup.
  The dependency array lists every reactive value used (no stale closures). Must survive StrictMode double-run.
- Async data uses a 4-state machine `IDLE | LOADING | SUCCESS | ERROR` (no boolean combinations).
  Cancel stale requests with `AbortController`; on `AbortError` do **not** set `ERROR`.
  Show a dimension-matched skeleton while loading (zero layout shift) and a retry button on error.
- Keyboard shortcuts: `window` `keydown` in an effect with cleanup, `e.code`, `if (e.repeat) return`,
  ignore events whose target is `INPUT`, `TEXTAREA`, or `SELECT`.
- Countdowns: derive from an absolute target time with `Date.now()`; resync on `visibilitychange`.
- High-frequency work (audio frames, animation) must not drive React state per frame.
- Use `React.memo` / `useMemo` / `useCallback` **only** where a task explicitly requires it or the Profiler shows a problem.

## 5. CSS

- `src/index.css`: reset (`box-sizing: border-box; margin: 0; padding: 0`) and `:root` tokens.
  **Hex colors appear only inside `:root`.** Component CSS uses `var(--token)`.
- Flexbox for 1-D, Grid for 2-D, `gap` instead of child margins.
- Mobile-first: perfect at **375px**, zero horizontal scroll; use `min-width: 0` / `overflow-wrap: anywhere` on text.
- Reserve space for async content so CLS stays 0.

## 6. Security

- Render data as JSX text only. Test once with `<img src=x onerror=alert(1)>`: it must show as plain text.
- Never build a `RegExp` from raw input without escaping. No `eval`.

## 7. WBS Protocol (when the developer sends a screenshot of ONE exercise)

Input: this file + a screenshot of one exercise/homework. Output: a new section to append to `TASK_DECOMPOSITION.md`. **Write no implementation code in this step.**

1. Take requirements only from the screenshot. Quote or closely restate them; add nothing.
2. Slice into small, independently verifiable tasks. Typical order:
   contract (JSDoc) -> data/logic -> semantic JSX -> CSS -> behavior/a11y -> verification.
3. For each task give:
   - **ID and goal** (one sentence)
   - **Contract:** props/state/data shape as JSDoc
   - **Files touched:** exact paths, only under the layout in section 1
   - **Acceptance criteria:** taken from the screenshot
   - **Verification:** a concrete check (grep, DevTools panel, Profiler, 375px, keyboard)
   - **Commit:** Conventional Commit message (use the exact messages if the screenshot gives them)
4. One concern per commit: never mix JSX with CSS, or CSS with logic. Match the screenshot's commit count when stated.
5. End with **Open questions** for anything ambiguous or contradictory. Do not guess.
6. Do not repeat tasks already in `TASK_DECOMPOSITION.md`. Do not touch earlier sections.

## 8. Code Generation Protocol (one task at a time)

1. Developer sends: `Task: <ID>` + the task's WBS entry. Do only that task.
2. Before coding, restate the contract and list your assumptions. Ask if anything is unclear.
3. Edit only the "Files touched" of that task. No refactors, no extra features.
4. After coding, list what you changed and anything you were unsure about.
5. The developer reviews `git diff` and verifies before committing.

Prompt template:
```
Read project-rules.md.
Task: <ID>  (WBS entry pasted below)
Do only this task. Restate the contract and assumptions first.
```

## 9. Git

- `git init` first. Scaffold commit: `chore: init react19 vite & rules`.
- `docs(spec)` commit for each WBS section **before** its code.
- Conventional Commits, one concern each: `feat(exN)`, `style(exN)`, `fix(...)`, `docs(audit)`.
- Total across the repo: at least 6-8 atomic commits; follow the per-exercise counts in the screenshots.

## 10. AI_FAILURE_AUDIT.md

When the developer reports a defect in AI output, help draft an entry (do not invent defects):
`Failure #NN -> Prompt -> AI code -> Bug -> Detection (DevTools/diff proof) -> Fix + commit hash`.
At least 3 verified entries are required across the lab.

## 11. Checkpoint Commands

```bash
git grep -n "<div" -- src/components/DeveloperCard.jsx   # EX1: expect no output
git grep -n "http://" -- src                              # expect no output
git log --oneline                                          # atomic commits match the WBS
```
DevTools: Accessibility tree, 375px (no horizontal scroll), React Profiler (render counts), Network (aborted requests), zero console warnings.

## 12. Definition of Done (per task)

- [ ] Meets the task's acceptance criteria and adds nothing extra
- [ ] No rule in this file violated (checked in `git diff`)
- [ ] Verified at 375px and with keyboard where relevant
- [ ] Committed atomically with the planned message
- [ ] Developer can explain every line without AI
