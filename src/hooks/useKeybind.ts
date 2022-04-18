import { Inputs, useEffect } from 'preact/hooks'

enum Modifier {
  Alt = 'Alt',
  Cmd = 'Cmd',
  Ctrl = 'Ctrl',
  Shift = 'Shift',
}

/**
 * the modifier keys are named after their property name on KeyboardEvent.
 */
type KeyConfig = {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  key: string
}

type KeyboardEventModifier = keyof KeyConfig

/**
 * get a string like `'Ctrl + Z'`
 * and give back more convenient data structure
 * for the keydown listener.
 */
const parseKey = (str: string): KeyConfig | null => {
  const keys = str.split('+').map((s) => s.trim())
  const modifiers = new Set(keys.slice(0, -1))
  const key = keys.pop()

  if (key == null) {
    console.warn(`Invalid key config string: \`${str}\`.`)
    console.warn('Not setting up keybind')

    return null
  }

  return {
    altKey: modifiers.has(Modifier.Alt),
    metaKey: modifiers.has(Modifier.Cmd),
    ctrlKey: modifiers.has(Modifier.Ctrl),
    shiftKey: modifiers.has(Modifier.Shift),
    // we don't care if the user types `Ctrl + Z`
    // or `Ctrl + z`.
    key: key.toLowerCase(),
  }
}

const useKeybind = (
  /**
   * string format for a key, like `'Alt + G'`
   * or `'Cmd + Z'`.
   */
  keyString: string,
  /**
   * function to call when the specified combination
   * is pressed.
   */
  cb: (e: KeyboardEvent) => void,
  /**
   * this may not be needed in some cases but i'll leave it here.
   * it's a gotcha if you have dependencies because it won't error
   * or show a lint error but it definitely won't work.
   */
  dependencies: Inputs
) => {
  const config = parseKey(keyString)
  if (config == null) return

  const { key, ...modifiers } = config
  const listener = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== key) return

    const correctModifiers = Object.entries(modifiers).reduce(
      (acc: boolean, modifier) => {
        const [property, required] = modifier
        if (!acc) return acc

        return e[property as KeyboardEventModifier] === required
      },
      true
    )

    if (!correctModifiers) return
    cb(e)
  }

  useEffect(() => {
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [key, ...dependencies])
}

export default useKeybind
