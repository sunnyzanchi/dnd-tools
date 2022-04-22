import cx from 'classnames'
import { ComponentChildren, FunctionComponent as FC } from 'preact'
import { useContext } from 'preact/hooks'

import { FloatingInput } from '.'

export type CellDisplay = ComponentChildren
export type CellValue = number | string

type Props = {
  /**
   * this determines if the input box shows up,
   * so it should only be true on the last cell of a multiselection.
   */
  editing: boolean
  onSelect: () => unknown
  selected: boolean
  value: CellDisplay
}

const EditableCell: FC<Props> = ({ editing, onSelect, selected, value }) => {
  const input = useContext(FloatingInput)

  return (
    <div class={cx('editable-cell', { selected })} onClick={onSelect}>
      {value}
      {editing && input}
    </div>
  )
}

export default EditableCell
