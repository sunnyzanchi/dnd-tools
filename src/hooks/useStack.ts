import { useState } from 'preact/hooks'

/**
 * a stack
 * @param initial initial state
 * @param limit how many items to store
 */
const useStack = <T>(initial?: T[], limit = 50) => {
  const [stack, setStack] = useState<T[]>(initial ?? [])

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

  return { push, pop }
}

export default useStack
