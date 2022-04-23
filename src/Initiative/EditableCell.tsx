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
      {/* this wrapping fragment is to prevent a backspace bug. */}
      {/* without it, backspacing after typing a shorthand update, */}
      {/* like '+3' > Backspace > '+', causes the input to deselect. */}
      {/* i think this is due to a reconcilation mistake */}
      {/* since `value` here switches from a VNode */}
      {/* to a number, and Preact gets confused. */}
      {/* wrapping in a fragment helps Preact update it correctly. */}
      <>{value}</>
      {editing && input}
    </div>
  )
}

export default EditableCell
