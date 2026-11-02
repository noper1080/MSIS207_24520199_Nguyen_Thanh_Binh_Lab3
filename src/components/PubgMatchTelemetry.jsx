import { Fragment, useEffect, useState } from 'react';
import styles from './PubgMatchTelemetry.module.css';

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

const PACKET_LOSS_RATE = 0.35;
const LOSSY_MAPS = ['Erangel', 'Miramar'];
const DETAIL_KEYS = ['map', 'phase', 'alive', 'wwcdProb', 'status'];

/**
 * Loads one squad's telemetry. Erangel/Miramar squads simulate 35% packet loss.
 * Always rejects with an AbortError when `signal` is aborted, even if the
 * response has already arrived, so a stale payload never reaches the caller.
 * @param {string} squadId
 * @param {{ signal: AbortSignal }} options
 * @returns {Promise<Squad>}
 */
async function fetchKraftonPubgTelemetry(squadId, { signal }) {
  const res = await fetch('/pubg-vn-squads.json', { signal });
  if (!res.ok) throw new Error(`Telemetry request failed (HTTP ${res.status})`);
  /** @type {Squad[]} */
  const squads = await res.json();
  signal.throwIfAborted();

  const squad = squads.find((s) => s.id === squadId);
  if (!squad) throw new Error(`Unknown squad: ${squadId}`);
  if (LOSSY_MAPS.includes(squad.map) && Math.random() < PACKET_LOSS_RATE) {
    throw new Error(`Packet timeout: ${squad.map} satellite link lost`);
  }
  return squad;
}

/**
 * Live PVS match radar with a 4-state machine and cancelable requests.
 * @param {PubgMatchTelemetryProps} props
 */
export function PubgMatchTelemetry({ squadId = 'te' }) {
  const [view, setView] = useState(
    /** @type {TelemetryView} */ ({ status: 'IDLE', data: null, error: null }),
  );

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((payload) => setView({ status: 'SUCCESS', data: payload, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });
    return () => controller.abort();
  }, [squadId]);

  // IDLE / LOADING / ERROR visuals arrive with the skeleton and retry alert.
  if (view.status !== 'SUCCESS') return null;

  const { data } = view;
  return (
    <article className={styles.panel} aria-live="polite">
      <h2>
        {data.name} — Kills: {data.kills}
      </h2>
      <dl>
        {DETAIL_KEYS.map((k) => (
          <Fragment key={k}>
            <dt>{k}</dt>
            <dd>{data[k]}</dd>
          </Fragment>
        ))}
      </dl>
    </article>
  );
}
