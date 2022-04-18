import { FunctionComponent as FC, JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

import useClickOutside from 'hooks/useClickOutside'

const MINUS = '\u2212'

type InputHandler = JSX.GenericEventHandler<HTMLInputElement>

export type Cell<T = number | string> = {
  value: T
}

type CellValue = Cell['value']

type Props = Cell & {
  /**
   * pass `true` to the callback to deselect
   * the current cell.
   */
  onSelect: (deselect?: boolean) => void
  onUpdate: (value: CellValue) => void
  selected: boolean
}

const calculateUpdate = (value: CellValue, newValue: CellValue) => {
  if (value === newValue) return value
  // if we don't have any numbers, we're not doing any math.
  if (/[a-z]/i.test(String(newValue))) return newValue

  const firstChar = String(newValue).trim()[0]
  const numString = String(newValue).replace(/[^0-9]+/g, '')
  const num = numString === '' ? null : Number(numString)

  if (num == null) return value

  if (firstChar === '+') return Number(value) + num
  if (firstChar === '-') return Number(value) - num

  return newValue
}

/**
 * return the string to display given the current cell value
 * and the user's current input, before they hit Enter.
 *
 * the current cell value can show autocomplete results
 * if the user types a shorthand operator,
 * `+` or `-`, and a number.
 * ie, if a cell's current value is 15 and a user
 * types `-9`, the cell will display `15 - 9 = 6`.
 * if the user hits enter, the cell will update with
 * the result of the operation.
 */
const formatCell = (value: CellValue, newValue: CellValue) => {
  if (value === newValue) return value

  const firstChar = String(newValue).trim()[0]
  const numString = String(newValue).replace(/[^0-9]+/g, '')
  const num = numString === '' ? null : Number(numString)

  if (firstChar === '+' && num !== null) {
    return (
      <>
        {value}
        <span class="autocomplete-result add">
          {' '}
          + {num} = {Number(value) + num}
        </span>
      </>
    )
  }

  if (firstChar === '-' && num !== null) {
    return (
      <>
        {value}
        <span class="autocomplete-result subtract">
          {' '}
          {MINUS} {num} = {Number(value) - num}
        </span>
      </>
    )
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return ''
    return value
  }

  return value
}

const formatInput = (value: CellValue) => {
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return ''
    return value
  }

  return value
}

const EditableCell: FC<Props> = ({ onSelect, onUpdate, selected, value }) => {
  const cell = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [newValue, setNewValue] = useState(value)
  // useClickOutside(cell, () => save())

  useEffect(() => {
    if (!selected || !input.current || document.activeElement === input.current)
      return

    input.current.focus()
    input.current.select()
  }, [selected, input.current])

  const cancel = () => {
    deselect()
    setNewValue(value)
  }

  const deselect = () => onSelect(true)

  const handleKeys = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }

    if (e.key === 'Enter') {
      save()
    }
  }

  const handleInput: InputHandler = (e) => {
    setNewValue(e.currentTarget.value)
  }

  const save = () => {
    const result = calculateUpdate(value, newValue)

    deselect()
    setNewValue(result)
    onUpdate(result)
  }

  return (
    <div class="editable-cell" onClick={() => onSelect()} ref={cell}>
      {selected && (
        <input
          onBlur={() => {
            if (value !== '' && !Number.isNaN(value)) cancel()
            else save()
          }}
          onInput={handleInput}
          onKeyDown={handleKeys}
          ref={input}
          value={formatInput(newValue)}
        />
      )}
      {formatCell(value, newValue)}
    </div>
  )
}

export default EditableCell
