import * as utils from './utils';

export class Threshold {
  constructor(name, stat, minimum) {
    this.name = name;
    this.stat = stat;
    this.minimum = minimum;
  }

  get statField() {
    return utils.attrname(this.stat);
  }

  get gameFields() {
    return ["started", this.statField];
  }

  get hintText() {
    this.name + " at " + this.minimum.toLocaleString() + " " + this.stat + ".";
  }

  unlocked(game) {
    return (game.started && game[this.statField] > this.minimum);
  }

}
