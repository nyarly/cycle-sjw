import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import isolate from '@cycle/isolate';

export function actionComponent(sources, threshold, {completionFactor, people, money, reputation, max}) {
  return isolate(Action, threshold.name)({...sources,
      props: xs.of({ threshold, completionFactor, people, money, reputation, max })
    });
}

function Action({Game, DOM, props}) {
  const prop$ = props.remember();

  const game$ = prop$
  .map((p) => Game.combinedValues(
    "people",
    "buzz",
    "volunteercoordinators",
    ...p.threshold.gameFields
  ))
  .flatten();

  const newProps$ = xs.combine(prop$, game$)
  .map(([ps, {people}]) => {
      const base = { ...ps,
        completion:  Math.floor(ps.completionFactor * people),
        name: ps.threshold.name,
        progress: 0,
        ready: false
      };
      return base
    })

  const clicks = actionIntents({DOM})

  const planning$ = clicks.plan$
  .compose(sampleCombine(game$))
  .map(([_, {people, volunteercoordinators}]) => {
      return (action) => {
        action.completion = Math.floor(action.completionFactor * people);
        if (action.max !== undefined) {
          action.completion = Math.min(action.completion, action.max);
        }
        action.progress += (1 + volunteercoordinators);
        if (action.progress >= action.completion) {
          action.ready = true;
        };
        return action;
      }
    });


  const reset$ = clicks.do$
  .compose(sampleCombine(newProps$))
  .map(([_, np]) => {
      return (action) => {
        return {...np, ready: false};
      };
    });


  const state$ = newProps$
  .map((newProps) => {
      return xs.merge(planning$, reset$)
      .fold((acc, f) => f(acc), newProps)
    })
  .flatten();

  const update$ = clicks.do$
  .compose(sampleCombine(game$, prop$))
  .map(([_, {people, buzz}, action]) => {
      const turnout = attendees(people, action);
      const modifiedBuzz = turnout * buzzModifier(buzz);

      const add = (val) => (n) => Math.floor(n + val * modifiedBuzz);

       return {
         reputation: add(action.reputation),
         people: add(action.people),
         money: add(action.money),
         buzz: add(action.reputation),
       };
   });

  /*
    view.displayEventResult(action,turnout,buzzModifier);

    this.unlocked.Reputation = true;
    view.unlock('ReputationReputationDiv');
    view.unlock('ReputationBuzzDiv');
  */

  return {
    update$,
    DOM: xs.combine(game$, state$)
    .map(([game, state]) => {
        const {people} = game;
        const {name, progress, completion, ready, threshold} = state;

        if (!threshold.unlocked(game)) {
          return null
        }
        return <div className="action">
        <button className="plan" disabled={ready}> {planText(name, ready, progress, completion)} </button>
          <button className="do" disabled={!ready}>Go!</button>
        </div>
      })
  };
}

function planText(name, ready, progress, completion) {
  if (!ready) {
    return "Plan " + name + " (needs " + (completion - progress).toLocaleString() + " shifts)"
  } else {
    return name + " Ready!";
  }
}

function attendees(people, action) {
  var attendees = people * (Math.random() * 0.5 + 0.5);
  /*
  for (var ally of this.allies) {
    attendees += ally.members * Math.random();
  };
  */
  if (action.max !== undefined) {
    attendees = Math.min(attendees,action.max);
  };
  attendees = Math.floor(attendees);
  return attendees;
}

function buzzModifier(buzz) {
  return Math.floor(Math.log(buzz+1) / Math.LN10 + 1.000000001)
};

function actionIntents({DOM}) {
  return {
    plan$: DOM.select("div.action button.plan").events("click"),
    do$: DOM.select("div.action button.do").events("click"),
  };
}
