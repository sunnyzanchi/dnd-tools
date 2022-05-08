import { useEffect, useState } from 'preact/hooks'
import { Creature } from './types'
import { append } from 'src/utils'

type Actions = {
  add: (creature: Creature) => void
}

/**
 * loads creature JSON async to keep the bundle size down.
 */
const useCreatures = (): [Creature[], Actions] => {
  const [creatures, setCreatures] = useState<Creature[]>([])

  const add = (creature: Creature) => {
    const fromLS = JSON.parse(localStorage.getItem('creatures') ?? '[]')
    localStorage.setItem('creatures', JSON.stringify([...fromLS, creature]))
    setCreatures(append(creature))
  }

  useEffect(() => {
    import('./creatures.json').then(({ default: creatureData }) => {
      const fromLS = JSON.parse(localStorage.getItem('creatures') ?? '[]')
      setCreatures([...creatureData, ...fromLS])
    })
  }, [])

  return [creatures, { add }]
}

export default useCreatures
