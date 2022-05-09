import { useState } from 'preact/hooks'

import { SearchHeader } from 'src/components'
import { ListItem } from 'src/components'
import ExpandedItem from './ExpandedItem'
import useItems from './useItems'
import styles from './Items.module.scss'

const Items = () => {
  const [items] = useItems()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const deselect = () => setExpanded(null)
  const select = (index: number) => () => setExpanded(index)

  return (
    <section class={styles.container}>
      <SearchHeader
        onAdd={() => {}}
        onInput={() => {}}
        searchTerm={''}
        title="Magic Items"
      />
      <ol class={styles.items}>
        {items.map((item, i) =>
          expanded === i ? (
            <ExpandedItem onCollapse={deselect} {...item} />
          ) : (
            <ListItem
              key={item.name}
              onSelect={select(i)}
              subText={item.type}
              selected={i === selected}
              title={item.name}
              twoLine
            />
          )
        )}
      </ol>
    </section>
  )
}

export default Items
