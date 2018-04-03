import {thresholdFields, LockedThreshold} from '../allThresholds';

export function Reputation({Game, ticks}) {
  const game$ = Game
  .combinedValues("reputation", "buzz", ...thresholdFields("reputation"))

  const update$ = ticks
  .map(() => {
      buzz: (n) =>  n - 0.01
    })

  return {
    update$,
    DOM: game$
    .map((game) => {
        const {reputation, buzz} = game;
        if (reputation <= 0) {
          return null;
        }

        return <div id="reputation-div">
        <h2>Reputation</h2>
        <dl className="horizontal">
        <dt>Reputation</dt>
        <dd>{reputation}</dd>
        <dt>Buzz</dt>
        <dd>{buzz}</dd>
        </dl>

        <LockedThreshold game={game} stat="reputation" />

        {lowBuzz(game) &&
          <div classNames="low-buzz warning">
          "Your office can't do anything without buzz!"
          </div>
        }
        </div>
      })
    .debug((d) => console.log("rep DOM", d)) ,
  };
}

function lowBuzz(game) {
  return game.buzz < 10 && game.totalStaff > 0
}
