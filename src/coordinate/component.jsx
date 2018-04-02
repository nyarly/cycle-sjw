import xs from 'xstream';

import {Threshold} from '../threshold';
import {actionComponent} from './actionComponent';

export function Coordinate({sources}) {
  const actions = [
    actionComponent(sources, new Threshold("March", "people", 10),
      {completionFactor: 0.2, people:  0.2, money: 0, reputation: 0.8, max: undefined}),
    actionComponent(sources, new Threshold("Picket", "people", 20),
      {completionFactor: 0.1, people: 0, money: 0, reputation: 1, max: 100}),
    actionComponent(sources, new Threshold("Direct Action", "people", 100),
      {completionFactor: 0.5, people: 0.4, money: 0.2, reputation: 0.4, max: 500}),
  ];

  const update$ = xs.merge(...actions.map((action) => action.update$));
  const doms = actions.map((action) => action.DOM);

  const game$ = sources.Game.combinedValues("started", "people");

  return {
    name: "Coordination",
    update$,
    DOM: xs.combine(game$, ...doms)
    .map(([{started, people}, march, picket, direct]) => {
        if (!started || people < 10) {
          return null
        }
        return <div id="coordinate-div">
        <h2>Coordination</h2>
        {march}
        {picket}
        {direct}
        </div>
      }),
    };
}
