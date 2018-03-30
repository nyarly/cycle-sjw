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

  sink$.addListener({
      next: (updateBundle) => {
        for(const up in updateBundle) {
          theGame[up] = updateBundle[up](theGame[up])
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

      this.streams[name].shamefullySendNext(val);
    }
  }

  getStream(name) {
    if (this.streams.hasOwnProperty(name)) {
      return this.streams[name]
    }

    const stream = xs.never();

    this.streams[name] = stream;
    return stream;
  }

  values(name) {
    return adapt(this.getStream(name));
  }

}
