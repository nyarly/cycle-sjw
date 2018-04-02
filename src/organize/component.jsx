import {thresholdFields, LockedThreshold} from '../allThresholds';

export function Organize({sources}) {
  const organize$ = sources.DOM.select("#organize").events("click")

  const started$ = sources.Game.values("started");
  const money$ = sources.Game.values("money");
  const people$ = sources.Game.values("people");

  const game$ = sources.Game.combinedValues("started", "money", "people", ...thresholdFields("people"));

  const org = {
    update$: organize$.map((click) => {
        let recruit = false;
        let updates = {};

        if (Math.random() < 0.5) {
          recruit = true;
          updates.people = (p) => p+1;
        };
        if (!recruit || (recruit && Math.random() < 0.5) ) {
          const bump = Math.max(1,Math.random() * Math.random() * 100 << 0);
          updates.money = (m) => m + bump;
        };
        return updates;
      }),
    DOM: game$
    .map((game) => {
        const {started, money, people} = game;
        if (!started) {
          return null;
        }

        return <div id="organize-div">
        <h2>Organization</h2>
        <dl className="horizontal">
        <dt>People</dt>
        <dd>{people}</dd>
        <dt>Money</dt>
        <dd>${money}</dd>
        </dl>

        <LockedThreshold game={game} stat="people" />

        <button id="organize">Organize</button>
        </div>
      }),
    };
  return org;
}
