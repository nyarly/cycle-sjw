import {actionDefs} from './actionDefs';

export const allThresholds = actionDefs.map((a) => a.threshold);

export function thresholdFields(statname) {
  let list = allThresholds;
  if (statname) {
    list = list.filter((th) => th.statField == "people")
  }
  return list.reduce((list, th) => list.concat(th.gameFields), [])
}

export function LockedThreshold({game, stat}) {
  const thresh = firstLocked(game);
  console.log("locked threshold", thresh);
  if (!thresh) {
    return null
  }
  return <div className="unlock-hint">{thresh.hintText}</div>
}

function firstLocked(game) {
  console.log("all", allThresholds);
  return allThresholds
  .filter((th) => th.statField == "people")
  .filter((th) => !th.unlocked(game))
  .reduce((lowest, th) => (lowest == null || th.minimum < lowest.minimum) ? th : lowest, null)
}
