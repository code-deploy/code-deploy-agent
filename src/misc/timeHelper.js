export function s(second) {
  return second * 1000;
}

export function minute(min) {
  return min * s(60);
}

export function hour(h) {
  return h * minute(60);
}
