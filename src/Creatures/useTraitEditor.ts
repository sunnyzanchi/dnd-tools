import { useState } from 'preact/hooks'
import { omit } from 'remeda'

import { append, mapProp, updateAt } from 'src/utils'
import { Trait } from './types'

export type Actions = {
  add: () => void
  setDesc: (index: number) => (newVal: string) => void
  setName: (index: number) => (newVal: string) => void
  setStartText?: (newVal: string) => void
}

export type Options = {
  startText?: boolean
}

type State = {
  startText: string
  traits: Trait[]
}

const emptyTrait = (): Trait => ({ description: '', name: '' })

const useTraitEditor = (options?: Options): [State, typeof actions] => {
  const [startText, setStartText] = useState('')
  const [traits, setTraits] = useState<Trait[]>([])

  let actions: Actions = {
    add: () => setTraits(append(emptyTrait())),
    setDesc: (i: number) => (val: string) =>
      setTraits(updateAt(i, mapProp('description', val))),
    setName: (i: number) => (val: string) =>
      setTraits(updateAt(i, mapProp('name', val))),
    setStartText: (val: string) => setStartText(val),
  }
  if (!options?.startText) {
    actions = omit(actions, ['setStartText'])
  }

  return [{ startText, traits }, actions]
}

export default useTraitEditor
