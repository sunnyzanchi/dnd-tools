import { useState } from 'preact/hooks'
import useKeyBind, { useKeyUp } from '@zanchi/use-key-bind'

const useKeyIsPressed = (keyStrings: string[]) => {
  const [pressed, setPressed] = useState(false)

  useKeyBind(keyStrings, () => setPressed(true), [])
  useKeyUp(keyStrings, () => setPressed(false), [])

  return pressed
}

export default useKeyIsPressed
