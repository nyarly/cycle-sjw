import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import {Game} from './game';

export function storeGame(main) {
  return function(sources) {

    const sinks = main(sources);

    const storeSrc = sources.Storage;
    const storeSink = sinks.Storage;

    const liveGame$ = storeSrc.local
    .getItem("liveGame");

    const bootstrapGame$ = liveGame$
    .take(1);

    const refreshGame$ = storeSink
    .compose(sampleCombine(liveGame$))
    .map((_, live) => live);

    const loadedGame$ = xs.merge(bootstrapGame$,refreshGame$)
    .map( (v) => {
        if (v === undefined) {
          return { __game__: () => new Game() };
        }
        const obj = JSON.parse(v);
        const up = {};
        for (const n in obj) {
          up[n] = () => obj[n];
        }
        return up;
      })


    const resetGame = storeSink
    .filter((s) => (s.action == "clear" && s.key == "liveGame"))
    .map(() => new Game());

    const gameSrc = xs.merge( sources.Game.wholeGame(), resetGame)
    .debug("gameSrc");

    const gameStore$ = gameSrc.map((game) => {
        return {
          key: "liveGame",
          value: JSON.stringify(game),
        }
      })
    .debug("storage")

    return {
      ...sinks,
      Game: xs.merge(
        sinks.Game,
        loadedGame$,
      ),
      Storage: xs.merge(
        storeSink,
        gameStore$
      ),
    };
  }
}
