import xs from 'xstream';
import {Game} from './game';
import {adapt} from '@cycle/run/lib/adapt';

// The game state driver takes as a sink a stream of update objects. It applies the function value of each key to the game state.
// like { "people": (n) => n+1 }
// It's source is a queriable via a values() function.
// values("people") => stream of the values for the "people" stat.

export function FALQSCommGameStateDriver(sink$, name) {
  let theGame = new Game()

  const source = new Sourcer(theGame);

  sink$
  .addListener({
      next: (updateBundle) => {

        for(const up in updateBundle) {
          const old = theGame[up]
          const nw = updateBundle[up](old)

          console.log("Updating", up, old, nw)
          theGame[up] = nw;
        }

        source.ping()
      }
    })

  return source;
}

class Sourcer {
  constructor(game) {
    this.game = game;
    this.streams = {};
  }

  ping() {
    for(name in this.streams) {
      const val = this.game[name]
      this.streams[name].in.shamefullySendNext(val);
    }
  }

  getStream(name) {
    if (this.streams.hasOwnProperty(name)) {
      return this.streams[name].out;
    }

    console.log("New stream", name)

    const base = xs.create();

    const result = xs.merge(
      xs.of(this.game[name]),
      base)
    .remember()
    .debug((v) => console.log("Sending", name, v));

    this.streams[name] = {
      in: base,
      out: result,
    };

    return result;
  }

  values(name) {
    return adapt(this.getStream(name));
  }

  // receives a list of stat names and returns a stream of objects with those stat values.
  combinedValues(...names) {
    const vals = names.map((n) => this.values(n));
    return xs.combine(...vals).map((vs) => {
        const res = {};
        for(const i in names) {
          const n = names[i];
          const v = vs[i];
          res[n] = v;
        }
        return res;
      });
  }

}
