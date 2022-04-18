import { Ref } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

/**
 * updates when the referenced element resizes
 * using ResizeObserver.
 * @returns `[ref, width, height]`
 * give the ref as a prop the element whose size
 * you want to watch.
 */
const useElementSize = (): [Ref<Element>, number, number] => {
  const [[width, height], setSize] = useState([NaN, NaN])
  const ref = useRef<Element>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      const size = entries.flatMap((e) => e.contentBoxSize)[0]

      setSize([size.inlineSize, size.blockSize])
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref])

  return [ref, width, height]
}

export default useElementSize
