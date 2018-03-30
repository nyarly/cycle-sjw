import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import {App} from './app';
import {FALQSCommGameStateDriver} from './game-state';

const main = App;

const drivers = {
  DOM: makeDOMDriver('#root'),
  Game: FALQSCommGameStateDriver,
}

run(main, drivers)
