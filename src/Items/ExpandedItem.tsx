import { FunctionalComponent as FC } from 'preact'

import styles from 'src/Creatures/ExpandedItem.module.scss'
import { useMdParser } from 'src/hooks'
import Table from './Table'
import {
  assertUnreachable,
  Description,
  DescriptionTable,
  Item,
  Section,
} from './types'

type Props = Item & {
  onCollapse: () => unknown
}

const isSection = (line: object): line is Section =>
  Object.keys(line as Section).length > 0
const isTable = (line: object): line is DescriptionTable =>
  (line as DescriptionTable).table != null

const meta = (item: Item) =>
  `${item.type}, ${item.rarity}${
    item.attunement ? ', (requires attunement)' : ''
  }`

/**
 * lines of the `description` array need
 * a different rendering method for each type.
 * this takes care of that.
 */
const Line: FC<{ line: Description }> = ({ line }) => {
  const parse = useMdParser()

  if (typeof line === 'string' && typeof parse === 'function') {
    return (
      <p
        dangerouslySetInnerHTML={{ __html: parse(line) }}
        class={styles.description}
      />
    )
  }
  if (typeof line === 'string') {
    return <p className={styles.description}>Loading...</p>
  }
  if (isTable(line)) {
    return <Table table={line.table} />
  }
  // bullet points.
  if (Array.isArray(line)) {
    return (
      <ul class={styles.descriptionList}>
        {line.map((li) => (
          <li>{li}</li>
        ))}
      </ul>
    )
  }
  if (isSection(line)) {
    const [[header, sectionLine]] = Object.entries(line)
    return (
      <>
        <h3 class={styles.descriptionHeader}>{header}</h3>
        <Line line={sectionLine as Description} />
      </>
    )
  }

  return assertUnreachable(line)
}

const ExpandedItem: FC<Props> = ({ onCollapse, ...item }) => {
  const description = item.description.map((line) => (
    <Line line={line as Description} />
  ))

  return (
    <li class={styles.listItem}>
      <div class={styles.titleGroup} onClick={onCollapse}>
        <h2 class={styles.name}>{item.name}</h2>
        <p class={styles.sizeType}>{meta(item)}</p>
      </div>
      {description}
    </li>
  )
}

export default ExpandedItem
