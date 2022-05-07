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

/**
 * returns a new array with the value at `index`
 * replaced with the return value of `fn`.
 */
export const updateAt =
  <T>(index: number, fn: T | ((a: T) => T)) =>
  (list: T[]) =>
    list.map((a, i) =>
      // @ts-ignore
      i === index ? (typeof fn === 'function' ? fn(a) : fn) : a
    )
