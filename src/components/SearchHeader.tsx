import { FunctionalComponent } from 'preact'

import { Add } from 'src/icons'
import styles from './SearchHeader.module.scss'

type Props = {
  onAdd: () => unknown
  onInput: JSX.GenericEventHandler<HTMLInputElement>
  searchTerm: string
  title: string
}

const SearchHeader: FunctionalComponent<Props> = ({
  onAdd,
  onInput,
  searchTerm,
  title,
}) => (
  <header class={styles.header}>
    <h1>{title}</h1>
    <input
      class={styles.search}
      onInput={onInput}
      placeholder="Search"
      value={searchTerm}
    />
    <button class={styles.addButton} onClick={onAdd}>
      <Add />
      add
    </button>
  </header>
)

export default SearchHeader
