import { createContext, FunctionComponent as FC } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
// this is only imported for the type,
// it gets tree shaken.
import { marked } from 'marked'

type Parse = typeof marked.parse

const MdContext = createContext<[Parse | null, () => void]>([null, () => {}])

/**
 * this provider will asynchronously and lazily load
 * `marked` and hold it in state to avoid
 * showing the loading state more than once.
 * `marked` weighs in at about 36kB,
 * so it's better not to include it on initial load.
 * this component should be used at the top level
 * of the app where it won't get rerendered.
 *
 * it passes the parser function anywhere
 * it's needed through the context API,
 * along with a function to request the module
 * if it hasn't been loaded yet.
 * this is abstracted behind the `useMdParser` hook.
 * to use `marked`, all you need to do is use
 * `useMdParser` and check if the result is a function.
 *
 * @example
 *
 * ```jsx
 * <MdProvider>
 *   <MyComponent />
 * </MdProvider>
 *
 * const MyComponent = () => {
 *   const parse = useMdParser()
 *
 *   if (typeof parse === 'function') {
 *     parse(someMarkdown)
 *   }
 * }
 * ```
 */
export const MdProvider: FC = ({ children }) => {
  const [parse, setParse] = useState<null | Parse>(null)
  const request = () =>
    import('marked').then(({ marked }) => {
      setParse(() => marked.parse)
    })

  return (
    <MdContext.Provider value={[parse, request]}>{children}</MdContext.Provider>
  )
}

/**
 * asynchronously load and use `marked.parse`.
 * it handles automatically requesting the
 * `parse` function from the provider if
 * it's not a function yet.
 *
 * @returns either the `parse` fn or null
 */
export const useMdParser = () => {
  const [parse, request] = useContext(MdContext)

  useEffect(() => {
    if (typeof parse !== 'function') request()
  }, [parse])

  return parse
}

export default useMdParser
