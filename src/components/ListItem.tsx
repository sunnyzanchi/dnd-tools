import cx from 'classnames'
import { FunctionalComponent as FC } from 'preact'
import styles from './ListItem.module.scss'

type Props = {
  key: string | number
  twoLine?: boolean
  onSelect: () => unknown
  selected: boolean
  subText: string
  title: string
}

const ListItem: FC<Props> = ({
  key,
  twoLine,
  onSelect,
  selected,
  subText,
  title,
}) => (
  <li
    class={cx(
      styles.listItem,
      selected && styles.selected,
      twoLine && styles.twoLine
    )}
    key={key}
    onClick={onSelect}
  >
    <h2 class={styles.title}>{title}</h2>
    <p class={styles.subText}>{subText}</p>
  </li>
)

export default ListItem
