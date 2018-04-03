import xs from 'xstream';

export default function ticker(period, run$) {
  return xs.combine(xs.periodic(period), run$)
  .filter(([_, running]) => running)
  .map(() => 1)
}
