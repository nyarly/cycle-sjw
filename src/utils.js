export function attrname(name) {
  return name.toLowerCase().replace(/ /g,'');
}

export function roundNumber(val) {
  return Math.round(val).toLocaleString();
}
