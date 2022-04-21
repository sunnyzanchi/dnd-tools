import cx from 'classnames'

import EditableCell, { Cell } from './EditableCell'

const COLUMNS: (keyof Row)[] = ['initiative', 'name', 'hp', 'notes']

type Row = {
  hp: number
  initiative: number
  name: string
  notes: string
}

type Props = Row & {
  editingCell?: number
  isTurn: boolean
  /**
   * `column` here is which cell in the row has been selected.
   * pass null to deselect.
   */
  onSelect: (column: number | null) => void
  onUpdate: (updated: Row) => void
  selections: Set<number>
}

const Row = ({
  editingCell,
  isTurn,
  onSelect,
  onUpdate,
  selections,
  ...data
}: Props) => {
  const select =
    (column: number) =>
    (deselect = false) =>
      deselect ? onSelect(null) : onSelect(column)

  const update = (prop: keyof Row) => (newValue: Cell['value']) => {
    onUpdate({
      ...data,
      [prop]: newValue,
    })
  }

  return (
    <li class={cx('row', { isTurn })}>
      {COLUMNS.map((columnName, i) => (
        <EditableCell
          editing={i === editingCell}
          key={columnName}
          onSelect={select(i)}
          onUpdate={update(columnName)}
          selected={selections.has(i)}
          value={data[columnName]}
        />
      ))}
    </li>
  )
}

export default Row
