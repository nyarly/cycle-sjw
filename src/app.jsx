import xs from 'xstream';
import {Game} from './game';
import {Organize} from './organize/component';
import {Coordinate} from './coordinate/component';
import isolate from '@cycle/isolate';
import sampleCombine from 'xstream/extra/sampleCombine';

export function App (sources) {
  const headGame$ = xs.create();

  const actions = intent({ game$: headGame$, sources });
  const {tailGame$, panes} = model({ game$: headGame$, actions, sources });
  console.log(panes);

  // this is how we loop the game back in
  headGame$.imitate(tailGame$);

  const game$ = tailGame$.startWith(null).debug();

  const view$ = view({ game$, panes });

  return {DOM: view$};
}

function intent({sources}) {
  const domSource = sources.DOM;
  return {
    newgame$: domSource.select("#new-game").events('click'),
  }
}

function model({game$, actions, sources}) {
  const newgame$ = actions.newgame$;

  const create$ = newgame$
  .map((_) => {
      return function() {
        return new Game();
      }
    });

  const g = game$.startWith(null)

  const Org = isolate(Organize, "organize");
  const org = Org({game$: g, sources});
  const Coord = isolate(Coordinate, "coordinate");
  const coord = Coord({game$: g, sources});

  const panes = {org, coord}

  const update$ = xs.merge(create$, org.update$, coord.update$)
  .debug()
  .compose(sampleCombine(g))
  .map(([f, game]) => {
      return f(game);
    });

  return { tailGame$: update$, panes };
}

function view({game$, panes}) {
  const vtree$ = xs.combine(game$, panes.org.DOM)
    .debug()
    .map(([game, org]) => {
        const panes = {org};
        return <div id="main">
          <TopMenu />
          <GameView game={game} panes={panes} />
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
function GameView({game, panes}) {
  if (game == null) {
    return attractScreen()
  } else {
    return liveGame(game, panes)
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

function liveGame(game, panes) {
  return <div id="gameDiv">
    <div id="col1" className="columnDiv">
      <Pane game={game} comp={panes.org} />
    </div>
    <div id="col2" className="columnDiv">
    </div>
    <div id="col3" className="columnDiv">
    </div>
  </div>
}
function Pane({comp}) {
  return comp;
}
