import { useEffect, useState } from 'preact/hooks'
import { append } from 'src/utils'
import { Item } from './types'

type Actions = {
  add: (item: Item) => void
}

/**
 * loads items JSON async to keep the bundle size down.
 */
const useItems = (): [Item[], Actions] => {
  const [items, setItems] = useState<Item[]>([])

  const add = (item: Item) => {
    const fromLS = JSON.parse(localStorage.getItem('items') ?? '[]')
    localStorage.setItem('items', JSON.stringify([...fromLS, item]))
    setItems(append(item))
  }

  useEffect(() => {
    import('./items.json').then(({ default: itemData }) => {
      const fromLS = JSON.parse(localStorage.getItem('items') ?? '[]')
      setItems([...itemData, ...fromLS])
    })
  }, [])

  return [items, { add }]
}

export default useItems
