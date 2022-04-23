import { useState } from 'preact/hooks'

type Actions<T> = {
  clear: () => void
  push: (item: T) => void
  pop: () => T
}

/**
 * a stack
 * @param initial initial state
 * @param limit how many items to store
 */
const useStack = <T>(initial?: T[], limit = 50): [T[], Actions<T>] => {
  const [stack, setStack] = useState<T[]>(initial ?? [])

  const clear = () => setStack([])

  const push = (value: T) => {
    if (stack.length < limit) {
      setStack((s) => [...s, value])
    } else {
      setStack((s) => [...s, value].slice(1))
    }
  }

  const pop = (): T => {
    const result = stack[stack.length - 1]
    setStack((s) => s.slice(0, -1))

    return result
  }

  return [stack, { clear, push, pop }]
}

export default useStack
