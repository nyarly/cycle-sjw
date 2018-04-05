import xs from 'xstream';

export default function ticker(period, run$) {
  return xs.combine(xs.periodic(period), run$)
  .filter(([_, running]) => running)
  .map(() => 1)
  .fold((ticks, one) => ticks + one, 0)
  .debug((t) => console.log("tick", t))
}
