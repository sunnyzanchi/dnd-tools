import { useEffect, useState } from 'preact/hooks'

/**
 * updates when the window's `resize` event fires.
 * @returns `[width, height]`
 */
const useScreenSize = (): [number, number] => {
  const [[width, height], setSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ])

  const listener = (e: Event) =>
    setSize([window.innerWidth, window.innerHeight])

  useEffect(() => {
    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [])

  return [width, height]
}

export default useScreenSize
