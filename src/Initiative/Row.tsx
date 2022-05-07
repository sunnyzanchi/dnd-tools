import cx from 'classnames'
import { ComponentChildren, FunctionalComponent as FC } from 'preact'

import EditableCell, { CellValue } from './EditableCell'
import styles from './Row.module.scss'

export const COLUMNS: (keyof RowValue)[] = ['initiative', 'name', 'hp', 'notes']

export type RowValue = {
  hp: CellValue
  initiative: CellValue
  name: CellValue
  notes: CellValue
}

export type RowDisplay = {
  [key in keyof RowValue]: ComponentChildren
}

type Props = RowDisplay & {
  /**
   * column index for which cell should show the input box.
   */
  editingCell?: number
  /**
   * to show the current turn marker.
   */
  isTurn: boolean
  /**
   * `column` here is which cell in the row has been selected.
   * pass null to deselect.
   */
  onSelect: (column: number | null) => void
  /**
   * which column indices are selected.
   */
  selections: Set<number>
}

const Row: FC<Props> = ({
  editingCell,
  isTurn,
  onSelect,
  selections,
  ...data
}) => (
  <li class={cx(styles.row, { [styles.isTurn]: isTurn })}>
    {COLUMNS.map((columnName, i) => (
      <EditableCell
        editing={i === editingCell}
        key={columnName}
        onSelect={() => onSelect(i)}
        selected={selections.has(i)}
        value={data[columnName]}
      />
    ))}
  </li>
)

export default Row
