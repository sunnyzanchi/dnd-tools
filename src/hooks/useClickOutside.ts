import { RefObject } from 'preact'
import { useLayoutEffect } from 'preact/hooks'

const useClickOutside = (
  ref: RefObject<Element>,
  cb: (event: MouseEvent) => void | boolean
) => {
  useLayoutEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current == null || ref.current.contains(event.target as Node)) {
        return
      }

      cb(event)
    }

    document.addEventListener('mousedown', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref, cb])
}

export default useClickOutside
