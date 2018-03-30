import xs from 'xstream';
import {Game} from './game';
import {Organize} from './organize/component';
import {Coordinate} from './coordinate/component';
import isolate from '@cycle/isolate';
import sampleCombine from 'xstream/extra/sampleCombine';

export function App (sources) {
  const actions = intent({ sources });
  const {update$, panes} = model({ actions, sources });

  const view$ = view({ sources, panes });

  return {DOM: view$, Game: update$};
}

function intent({sources}) {
  const domSource = sources.DOM;
  return {
    newgame$: domSource.select("#new-game").events('click'),
  }
}

function model({actions, sources}) {
  const newgame$ = actions.newgame$;

  const create$ = newgame$
  .map((_) => { started: (_) => true });

  const org = isolate(Organize, "organize")({sources});
  const coord = isolate(Coordinate, "coordinate")({sources});
  const panes = {org, coord}

  const update$ = xs.merge(create$, org.update$, coord.update$);

  return { update$, panes };
}

function view({sources, panes}) {
  const start$ = sources.Game.values("started");
  const vtree$ = xs.combine(
    start$,
    panes.org.DOM,
    panes.coord.DOM
  ).debug()
    .map(([started, org, coord]) => {
        const panes = {org, coord};
        return <div id="main">
          <TopMenu />
          <GameView game={started} panes={panes} />
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
  if (started) {
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
      {panes.coord}
    </div>
    <div id="col2" className="columnDiv">
    </div>
    <div id="col3" className="columnDiv">
    </div>
  </div>
}
