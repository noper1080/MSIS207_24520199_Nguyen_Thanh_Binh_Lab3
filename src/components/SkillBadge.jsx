/**
 * @typedef {Object} SkillBadgeProps
 * @property {string} name  Display name, e.g. 'React 19 Fiber'
 * @property {string} tier  Level label, e.g. 'Core'
 */

/**
 * One skill rendered as a list item. Must be a direct child of a `<ul>`/`<ol>`;
 * the caller sets `key={skill.id}`.
 * @param {SkillBadgeProps} props
 */
export function SkillBadge({ name, tier }) {
  return (
    <li>
      {name} ({tier})
    </li>
  );
}
