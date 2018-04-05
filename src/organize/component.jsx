import {thresholdFields, LockedThreshold} from '../allThresholds';
import {roundNumber} from "../utils";

export function Organize({DOM, Game}) {
  const organize$ = DOM.select("#organize").events("click")

  const started$ = Game.values("started");
  const money$ = Game.values("money");
  const people$ = Game.values("people");

  const game$ = Game.combinedValues("started", "money", "people", ...thresholdFields("people"));

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
          <dd>{roundNumber(people)}</dd>
          <dt>Money</dt>
          <dd>${roundNumber(money)}</dd>
        </dl>

        <LockedThreshold game={game} stat="people" />

        <button id="organize">Organize</button>
        </div>
      }),
    };
  return org;
}
