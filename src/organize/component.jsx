import xs from 'xstream';

import {allThresholds} from '../allThresholds';

export function Organize({sources}) {
  const organize$ = sources.DOM.select("#organize").events("click")

  const started$ = sources.Game.values("started");
  const money$ = sources.Game.values("money");
  const people$ = sources.Game.values("people");

  const thresholdFields = allThresholds.reduce((list, th) => list.concat(th.gameFields), [])
  const game$ = sources.Game.combinedValues("started", "money", "people", ...thresholdFields);

  const org = {
    name: "Organization",
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

function LockedThreshold({game, stat}) {
  const thresh = firstLocked(game);
  console.log("locked threshold", thresh);
  if (!thresh) {
    return null
  }
  return <div className="unlock-hint">{thresh.hintText}</div>
}

function firstLocked(game) {
  console.log("all", allThresholds);
  return allThresholds
  .filter((th) => th.statField == "people")
  .filter((th) => !th.unlocked(game))
  .reduce((lowest, th) => (lowest == null || th.minimum < lowest.minimum) ? th : lowest, null)
}
