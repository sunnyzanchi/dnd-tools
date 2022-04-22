import { Inputs, useEffect } from 'preact/hooks'

const useOnClick = (cb: (e: MouseEvent) => unknown, deps: Inputs) => {
  useEffect(() => {
    document.addEventListener('click', cb)

    return () => document.removeEventListener('click', cb)
  }, [cb, ...deps])
}

export default useOnClick
