export const mapProp =
  <T extends Record<string | number | symbol, T[keyof T]>, U extends keyof T>(
    prop: U,
    fn: (value: T[U]) => T[U]
  ) =>
  (obj: T): T => ({
    ...obj,
    [prop]: fn(obj[prop]),
  })

export const append =
  <T>(item: T) =>
  (list: T[]) =>
    list.concat(item)

export const map =
  <T, U>(cb: (item: T, index: number, list: T[]) => U) =>
  (list: T[]): any[] =>
    list.map(cb)
