
import xs from 'xstream';
import {div, h2} from '@cycle/dom';

import {actionComponent} from './actionComponent';

import {actionDefs} from '../actionDefs';

export function Coordinate(sources) {
  const actions = actionDefs.map((def) => actionComponent(sources, def.threshold, def.props));

  const threshold = actionDefs.map((a) => a.threshold).reduce(
    (th, lowest) =>  th.minimum < lowest.minimum ? th : lowest );

  const update$ = xs.merge(...actions.map((action) => action.update$));
  const doms = actions.map((action) => action.DOM);

  const game$ = sources.Game.combinedValues(...threshold.gameFields);

  return {
    update$,
    DOM: xs.combine(game$, ...doms)
    .map(([game, ...actions]) => {
        if (!threshold.unlocked(game)) {
          return null
        }
        return div({id:"coordinate-div"}, [ h2("Coordination"), ...actions ]);
      }),
    };
}
