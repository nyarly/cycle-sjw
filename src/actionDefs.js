import {Threshold} from './threshold';

class ActionDef {
  constructor({
      name, gameStat, statMinimum, completionFactor,
      max = undefined,
      people = 0,
      money = 0,
      reputation = 0,
    }) {
    this.threshold = new Threshold(name, gameStat, statMinimum);
    this.props = { completionFactor, people, money, reputation, max };
  }
}

export const actionDefs = [
  new ActionDef({name: "March", gameStat: "people", statMinimum: 10, completionFactor: 0.2, people:  0.2,  reputation: 0.8}),
  new ActionDef({name: "Picket", gameStat: "people", statMinimum: 20, completionFactor: 0.1, reputation: 1, max: 100}),
  new ActionDef({name: "Direct Action", gameStat: "people", statMinimum: 100, completionFactor: 0.5, people: 0.4, money: 0.2, reputation: 0.4, max: 500}),
];
