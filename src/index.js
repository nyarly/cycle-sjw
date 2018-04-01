import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';

import {App} from './app';
import {FALQSCommGameStateDriver} from './game-state';
import {storeGame} from './storeGame';

const main = App;

const drivers = {
  DOM: makeDOMDriver('#root'),
  Game: FALQSCommGameStateDriver,
  Storage: storageDriver,
}

const gameStoredMain = storeGame(main);

run(gameStoredMain, drivers)
