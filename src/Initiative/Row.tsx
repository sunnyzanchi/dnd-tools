import EditableCell, { Cell } from './EditableCell'
import { Selectable, Updateable } from '../types'

export const COLUMNS: (keyof Row)[] = ['initiative', 'name', 'hp', 'notes']

type Row = {
  hp: number
  initiative: number
  name: string
  notes: string
}

type Props = {
  isTurn: boolean
} & Row &
  Selectable<Row> &
  Updateable<Row>

const Row = ({ isTurn, onSelect, onUpdate, selected, ...data }: Props) => {
  const select =
    (column: number) =>
    (deselect = false) =>
      deselect ? onSelect() : onSelect(column)

  const update = (prop: keyof Row) => (newValue: Cell['value']) => {
    onUpdate({
      ...data,
      [prop]: newValue,
    })
  }

  return (
    <li class={`row ${isTurn && 'is-turn'}`}>
      {COLUMNS.map((column, i) => (
        <EditableCell
          key={column}
          onSelect={select(i)}
          onUpdate={update(column)}
          selected={selected === i}
          value={data[column]}
        />
      ))}
    </li>
  )
}

export default Row
