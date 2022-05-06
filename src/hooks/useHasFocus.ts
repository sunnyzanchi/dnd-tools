import { Ref } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

const useHasFocus = (): [Ref<HTMLElement>, boolean] => {
  const [hasFocus, setHasFocus] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setHasFocus(Boolean(ref.current?.contains(document.activeElement)))
  }, [ref.current])

  return [ref, hasFocus]
}

export default useHasFocus
