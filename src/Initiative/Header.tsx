import { FunctionalComponent as FC } from 'preact'
import styles from './Initiative.module.scss'
import rstyles from './Row.module.scss'

type Props = {
  onSort: () => void
}

const Header: FC<Props> = ({ onSort }) => (
  <li class={rstyles.row}>
    <div class={styles.cell}>
      Initiative
      <button class={styles.sortButton} onClick={onSort}>
        Sort
      </button>
    </div>
    <div class={styles.cell}>Name</div>
    <div class={styles.cell}>HP</div>
    <div class={styles.cell}>Notes</div>
  </li>
)

export default Header
