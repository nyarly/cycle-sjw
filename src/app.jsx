import xs from 'xstream'

export function App (sources) {
  const vtree$ = xs.of(
    <div>My SJW Cycle.js app</div>
  )
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
