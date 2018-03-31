import xs from 'xstream';

export function Coordinate({sources}) {
  const march = March({sources});
  const started$ = sources.Game.values("started");
  const people$ = sources.Game.values("people");

  const org = {
    name: "Coordination",
    update$: xs.never(),
    DOM: xs.combine(started$, people$).map(([started, people]) => {
        if (!started || people < 10) {
          return null
        }
        return <div id="coordinate-div">
        <h2>Coordination</h2>
        march
        </div>
      }),
    };
  return org;
}

function March({sources}) {
  const started$ = sources.Game.values("started");
  const people$ = sources.Game.values("people");

  return {
    DOM: xs.combine(started$, people$).map(([started, people]) => {
        if (!started || people < 10) {
          return null
        }
        return <div id="march-action">
          <button id="plan-march">Plan March</button>
          <button id="do-march">Go!</button>
        </div>
      })
  };
}
