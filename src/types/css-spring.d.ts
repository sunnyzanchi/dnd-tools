type CSSObj = {
  [key: string]: string
}

type Options = {
  damping?: number
  precision?: number
  preset?: 'gentle' | 'noWobble' | 'stiff' | 'wobbly'
  stiffness?: number
}

declare module 'css-spring' {
  export function spring(
    startKeyframe: CSSObj,
    endKeyframe: CSSObj,
    opts: Options
  )
}
