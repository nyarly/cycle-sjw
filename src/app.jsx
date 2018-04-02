import xs from 'xstream';
import {Game} from './game';
import {Organize} from './organize/component';
import {Coordinate} from './coordinate/component';
import {Reputation} from './reputation/component';
import isolate from '@cycle/isolate';
import sampleCombine from 'xstream/extra/sampleCombine';

export function App (sources) {
  const actions = intent({ sources });
  const {restart$, update$, panes} = model({ sources, actions });
  const view$ = view({ sources, panes });

  return {DOM: view$, Game: update$, Storage: restart$};
}

function intent({sources}) {
  const domSource = sources.DOM;
  return {
    newgame$: domSource.select("#new-game").events('click'),
    restart$: domSource.select("#newGameButton").events('click'),
  }
}

function model({sources, actions}) {
  const newgame$ = actions.newgame$;

  const create$ = newgame$
  .map((_) => { return {started: (_) => true} });

  const org = isolate(Organize, "organize")({sources});
  const coord = isolate(Coordinate, "coordinate")({sources});
  const rep = isolate(Reputation, "reputation")(sources);
  const panes = {org, coord, rep}

  const update$ = xs.merge(create$, org.update$, coord.update$);

  const restart$ = actions.restart$
  .map(() => { return { action: "clear", key: "liveGame" } });

  return { restart$, update$, panes };
}

function view({sources, panes}) {
  const start$ = sources.Game.values("started");
  const vtree$ = xs.combine(
    start$,
    panes.org.DOM,
    panes.coord.DOM,
    panes.rep.DOM,
  )
  .map(([started, org, coord, rep]) => {
      const panes = {org, coord, rep};
      return <div id="main">
      <TopMenu />
      <GameView started={started} panes={panes} />
      </div>
    })

  return vtree$
}

// JSX component
function TopMenu() {
  return <div id="mainMenuDiv">
    <h4 id="titleHead">FALQSComm</h4>
    <button id="newGameButton">New Game</button>
    <button id="supportButton">Patreon</button>
  </div>
}

// JSX component
function GameView({started, panes}) {
  if (!started) {
    return attractScreen()
  } else {
    return liveGame(panes)
  }
}

function attractScreen() {
  return <div id="gameDiv">
    <div id="startDiv">
    <p>It starts with one conversation.</p>
    <p>"I want to make our world a better place," you say.  "And I want your help."</p>
    <button id="new-game">Organize</button>
    </div>
  </div>
}

function liveGame(panes) {
  return <div id="gameDiv">
    <div id="col1" className="columnDiv">
      {panes.org}
      {panes.rep}
      {panes.coord}
    </div>
    <div id="col2" className="columnDiv">
    </div>
    <div id="col3" className="columnDiv">
    </div>
  </div>
}
