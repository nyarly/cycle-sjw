import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

export function Coordinate({sources}) {
  const march = March(sources);

  const game$ = sources.Game.combinedValues("started", "people");

  return {
    name: "Coordination",
    update$: xs.merge(march.update$),
    DOM: xs.combine(game$, march.DOM)
    .map(([{started, people}, marchAction]) => {
        if (!started || people < 10) {
          return null
        }
        return <div id="coordinate-div">
        <h2>Coordination</h2>
        {marchAction}
        </div>
      }),
    };
}


function March({Game, DOM}) {
  const game$ = Game.combinedValues(
    "started",
    "people",
    "buzz",
    "volunteercoordinators"
  );

  // {name:'March',header:'Coordination',completion:0.2,people: 0.2,money: 0,reputation:0.8,progress:0},
  const prop$ = xs.of({
      name: "March",
      completion: 0.2,
      people:  0.2,
      money: 0,
      reputation: 0.8,
      max: undefined,
    }).remember();

  /*
    }),
    */

  const newProps$ = prop$.map((ps) => {
      return { ...ps, progress: 0, ready: false };
    })

  const clicks = marchIntents({DOM})

  const planning$ = clicks.plan$
  .compose(sampleCombine(game$))
  .map((_, {people, volunteercoordinators}) => {
      return (action) => {
        completion = Math.min(Math.floor(action.completion * people), action.max);
        action.progress += (1 + volunteercoordinators);
        if (action.progress >= completion) {
          action.progress = Infinity;
          action.ready = true;
        };
        return action;
      }
    });


  const reset$ = clicks.do$
  .map((_) => {
      return (action) => {
        return {...action, ready: false};
      };
    });

  const state$ = xs.merge(planning$, reset$)
  .fold((acc, f) => f(acc), newProps$);

  const update$ = clicks.do$
  .compose(sampleCombine(game$, prop$))
  .map((_, [{people, buzz}, action]) => {
      const turnout = attendees(people, action);
      const buzzModifier = buzzModifier(buzz);
      const modifiedBuzz = turnout * buzzModifier;

       return {
       reputation: (n) => {return n + action.reputation * modifiedBuzz},
       people: (n) => {return n + action.people * modifiedBuzz},
       money: (n) => {return n + action.money * modifiedBuzz},
       buzz: (n) => {return n + action.reputation * modifiedBuzz},
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
    .debug((v) => console.log("March DOM", v))
    .map(([game, state]) => {
        console.log(state);
        const {started, people} = game;
        const {name, progress, completion, ready} = state;

        if (!started || people < 10) {
          return null
        }
        return <div id="march-action">
        <button className="plan" disabled={ready}> {planText(name, progress, completion)} </button>
          <button className="do" disabled={!ready}>Go!</button>
        </div>
      })
  };
}

function planText(name, progress, completion) {
  if (progress < completion) {
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

function marchIntents({DOM}) {
  return {
    plan$: DOM.select("#march-action buton.plan").events("click"),
    do$: DOM.select("#march-action button.do").events("click"),
  };
}
