export function uniqueArrayBy<T>(arr: T[], key: keyof T): T[] {
  return arr.filter((v, i, a) => a.findIndex((t: T) => t[key] === v[key]) === i);
}
