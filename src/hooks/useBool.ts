import { useState } from 'preact/hooks'

type Actions = {
  set: (val: boolean) => void
  toggle: () => void
}

const useBool = (initial: boolean): [boolean, Actions] => {
  const [val, set] = useState(initial)
  return [val, { toggle: () => set((v) => !v), set }]
}
export default useBool
