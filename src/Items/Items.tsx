import compose from 'compose-function'
import { useState } from 'preact/hooks'

import { getInputVal } from 'src/Creatures/utils'
import { SearchHeader } from 'src/components'
import { ListItem } from 'src/components'
import ExpandedItem from './ExpandedItem'
import { Item } from './types'
import useItems from './useItems'
import styles from './Items.module.scss'
import { matchSorter } from 'match-sorter'

const Items = () => {
  const [items] = useItems()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const deselect = () => setExpanded(null)
  const select = (index: number) => () => setExpanded(index)

  let filteredItems: Item[]
  if (searchTerm !== '') {
    filteredItems = matchSorter(items, searchTerm, { keys: ['name'] })
  } else {
    filteredItems = items
  }

  return (
    <section class={styles.container}>
      <SearchHeader
        onAdd={() => {}}
        onInput={compose(setSearchTerm, getInputVal)}
        searchTerm={searchTerm}
        title="Magic Items"
      />
      <ol class={styles.items}>
        {filteredItems.map((item, i) =>
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
