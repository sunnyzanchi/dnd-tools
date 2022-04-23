import { useEffect, useState } from 'preact/hooks'
import { Creature } from './types'

/**
 * loads creature JSON async to keep the bundle size down.
 */
const useCreatures = (): Creature[] => {
  const [creatures, setCreatures] = useState<Creature[]>([])

  useEffect(() => {
    import('./creatures.json').then(({ default: creatureData }) => {
      setCreatures(creatureData)
    })
  }, [])

  return creatures
}

export default useCreatures
