const DEFAULT_DECISION_YEAR = 2025;
const YEAR_REGEX = /(19|20)\d{2}/g;

function isPlausibleYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year)) {
    return false;
  }
  return year >= 1900 && year <= DEFAULT_DECISION_YEAR;
}

export function inferDecisionYear(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return DEFAULT_DECISION_YEAR;
  }

  const yearCounts = new Map();

  for (const match of text.matchAll(YEAR_REGEX)) {
    const [value] = match;
    if (!isPlausibleYear(value)) {
      continue;
    }

    const year = Number(value);
    const count = yearCounts.get(year) ?? 0;
    yearCounts.set(year, count + 1);
  }

  if (yearCounts.size === 0) {
    return DEFAULT_DECISION_YEAR;
  }

  const sortedYears = Array.from(yearCounts.entries())
    .sort((a, b) => {
      const [yearA, countA] = a;
      const [yearB, countB] = b;

      if (countA !== countB) {
        return countB - countA;
      }

      return yearB - yearA;
    });

  return sortedYears[0][0];
}

export function getDefaultDecisionYear() {
  return DEFAULT_DECISION_YEAR;
}


