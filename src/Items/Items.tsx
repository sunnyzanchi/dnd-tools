import { useState } from 'preact/hooks'

import { SearchHeader } from 'src/components'
import { ListItem } from 'src/components'
import useItems from './useItems'
import styles from './Items.module.scss'

const Items = () => {
  const [items] = useItems()
  const [selected, setSelected] = useState<number | null>(null)

  const select = (index: number) => () => setSelected(index)

  return (
    <section class={styles.container}>
      <SearchHeader
        onAdd={() => {}}
        onInput={() => {}}
        searchTerm={''}
        title="Magic Items"
      />
      <ol class={styles.items}>
        {items.map((item, i) => (
          <ListItem
            key={item.name}
            onSelect={select(i)}
            subText={item.type}
            selected={i === selected}
            title={item.name}
            twoLine
          />
        ))}
      </ol>
    </section>
  )
}

export default Items
