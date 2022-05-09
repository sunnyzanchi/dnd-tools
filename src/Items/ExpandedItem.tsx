import { FunctionalComponent as FC } from 'preact'

import { TraitLine } from 'src/Creatures/ExpandedItem'
import styles from 'src/Creatures/ExpandedItem.module.scss'
import { Item } from './types'

type Props = Item & {
  onCollapse: () => unknown
}

const ExpandedItem: FC<Props> = ({ onCollapse, ...item }) => {
  return (
    <li class={styles.listItem}>
      <div class={styles.titleGroup} onClick={onCollapse}>
        <h2 class={styles.name}>{item.name}</h2>
        <p class={styles.sizeType}>{item.type}</p>
      </div>
      <section class={styles.shortTraits}>
        <TraitLine description={item.rarity} name="Rarity:" />
        <TraitLine
          description={item.attunement ? 'yes' : 'no'}
          name="Requires attunement:"
        />
      </section>
      <p class={styles.trait}>{item.description.toString()}</p>
    </li>
  )
}

export default ExpandedItem
