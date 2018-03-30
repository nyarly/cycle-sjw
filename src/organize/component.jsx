export function Organize({sources, game$}) {
  const clicks = intents(sources);

  const org = {
    name: "Organization",
    update$: clicks.organize$.map((click) => {
        return function(game) {
          var recruit = false;
          if (Math.random() < 0.5) {
            recruit = true;
            game.update('People',1);
          };
          if (!recruit || (recruit && Math.random() < 0.5) ) {
            game.update('Money',Math.max(1,Math.random() * Math.random() * 100 << 0));
          };
          return game;
        };
      }),
    DOM: game$.map((game) => {
        if (game == null || !game.getUnlocked("Organization")) {
          return null;
        }
        return <div id="organize-div">
        <h2>Organization</h2>
        <dl>
        <dt>People</dt>
        <dd>{game.people}</dd>
        <dt>Money</dt>
        <dd>{game.money}</dd>
        </dl>
        <button id="organize">Organize</button>
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
