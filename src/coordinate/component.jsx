import xs from 'xstream';

export function Coordinate({sources, game$}) {
  const clicks = intents(sources);

  const march = March({sources, game$});

  const org = {
    name: "Coordination",
    update$: xs.never(),
    DOM: xs.combine(game$, march.DOM).map(([game, march]) => {
        if (game == null || !game.getUnlocked("Coordination")) {
          return null;
        }
        return <div id="coordinate-div">
        <h2>Coordination</h2>
        march
        </div>
      }),
    };
  return org;
}

function intents(sources) {
  return {
    organize$: sources.DOM.select("#organize").events("click")
  }
}

function March({sources, game$}) {
  function amUnlocked(game) {
    return (game != null && game.people > 10);
  }

  return {
    DOM: game$.map((game) => {
        if (!amUnlocked(game)) {
          return null
        }
        return <div id="march-action">
          <button id="plan-march">Plan March</button>
          <button id="do-march">Go!</button>
        </div>
      })
  };
}
