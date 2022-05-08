/**
 * return a new object with the given `prop` updated to
 * `fn`, or the return value of `fn` if it's a function.
 *
 * @example
 *
 * ```js
 * const o1 = { counter: 1, name: 'Hasselhoff' }
 * const incrementCounter = mapProp('counter', x => x + 1)
 * const o2 = incrementCounter(o1)
 * // { counter: 2, name: 'Hasselhoff' }
 * ```
 */
export const mapProp =
  <T extends Record<string | number | symbol, T[keyof T]>, U extends keyof T>(
    prop: U,
    fn: T[U] | ((value: T[U]) => T[U])
  ) =>
  (obj: T): T => ({
    ...obj,
    // @ts-expect-error
    [prop]: typeof fn === 'function' ? fn(obj[prop]) : fn,
  })

export const append =
  <T>(item: T) =>
  (list: T[]) =>
    list.concat(item)

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
