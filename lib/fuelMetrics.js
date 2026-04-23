export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeFuelLogs(logs = []) {
  return logs
    .map((log) => ({
      ...log,
      odometer: Number(log.odometer || 0),
      liters: Number(log.liters || 0),
      pricePerLiter: Number(log.pricePerLiter || 0),
      dateObj: toDate(log.date) || new Date(),
    }))
    .sort((a, b) => a.dateObj - b.dateObj);
}

export function buildFuelEntriesWithEfficiency(logs = []) {
  const sortedLogs = normalizeFuelLogs(logs);

  return sortedLogs.map((log, index) => {
    if (index === 0) return { ...log, kmpl: null, distanceSinceLast: null };

    const prev = sortedLogs[index - 1];
    const distance = log.odometer - prev.odometer;
    const kmpl = log.liters > 0 && distance > 0 ? distance / log.liters : null;
    return { ...log, kmpl, distanceSinceLast: distance > 0 ? distance : null };
  });
}

export function getRecentAverageKmpl(entries = [], lastCount = 3) {
  const valid = entries.filter((entry) => typeof entry.kmpl === "number");
  if (!valid.length) return null;
  const recent = valid.slice(-lastCount);
  const sum = recent.reduce((acc, item) => acc + item.kmpl, 0);
  return recent.length ? sum / recent.length : null;
}

export function getLatestKmpl(entries = []) {
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    if (typeof entries[i].kmpl === "number") return entries[i].kmpl;
  }
  return null;
}

export function getFuelCostThisMonth(entries = [], now = new Date()) {
  return entries
    .filter(
      (entry) =>
        entry.dateObj.getFullYear() === now.getFullYear() &&
        entry.dateObj.getMonth() === now.getMonth()
    )
    .reduce((sum, entry) => sum + entry.liters * entry.pricePerLiter, 0);
}
