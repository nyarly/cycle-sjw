import xs from 'xstream'

export function MainView(sources) {
  const vtree$ = xs.of(
    <div id="main">
      <TopMenu />
      <GameView />
    </div>
  )
  return {
    DOM: vtree$,
  }
}

function TopMenu() {
  return <div id="mainMenuDiv">
    <h4 id="titleHead">FALQSComm</h4>
    <button id="newGameButton">New Game</button>
    <button id="supportButton">Patreon</button>
  </div>
}

function GameView() {
  return <div id="gameDiv">
    <div id="startDiv">
    <p>It starts with one conversation.</p>
    <p>"I want to make our world a better place," you say.  "And I want your help."</p>
    <button id="organize">Organize</button>
    </div>
  </div>
}
