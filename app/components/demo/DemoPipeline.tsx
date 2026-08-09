'use client';

import type { Industry } from '../../lib/industries';
import type { SimState } from './sim/store';

function ago(minutes: number): string {
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h`;
}

/** Kanban view — leads bucketed by stage. STAGE_MOVE events re-bucket a card,
    and the enter animation makes the move read as movement. */
export default function DemoPipeline({ industry, state }: { industry: Industry; state: SimState }) {
  const stages = industry.demo.stages;

  return (
    <div className="demo-pipeline" data-tour="pipeline">
      {stages.map((stage, si) => {
        const cards = state.leads.filter((l) => Math.min(l.stage, stages.length - 1) === si);
        return (
          <div key={stage} className="demo-col">
            <div className="demo-col-head">
              {stage}
              <span className="demo-col-count">{cards.length}</span>
            </div>
            <div className="demo-col-cards">
              {cards.map((l) => (
                // Keyed by id+stage so a stage move remounts the card and
                // replays the enter animation — that's the "it moved" cue.
                <div key={`${l.id}_${si}`} className="demo-card">
                  <b>{l.name}</b>
                  <span className="demo-card-meta">
                    <span>{l.source} · {ago(l.minutesAgo)}</span>
                    <span className="demo-card-score">{l.score}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
