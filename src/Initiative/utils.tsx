import { mapValues } from 'remeda'
import partition from 'just-partition'

import { getRowSelections, Selection } from 'src/hooks/useSelections'
import { CellDisplay, CellValue } from './EditableCell'
import { COLUMNS, RowDisplay, RowValue } from './Row'

const MINUS = '\u2212'

/**
 * cells can be updated with a plain new value,
 * or they can be updated with shorthand arithmetic operators.
 * if `value` is a number, and `newValue` starts with `+` or `-`,
 * it will return `value` `+ or -` `newValue`.
 *
 * @example
 *
 * ```
 * calculateUpdate(10, '+3') // returns 13
 * calculateUpdate(10, '+') // returns 10
 * calculateUpdate('Test', '+3') // returns 'Test'
 * calculatUpdate('Test', '3') // returns 3
 *
 * ```
 */
export const calculateUpdate = (
  value: CellValue,
  newValue: CellValue
): CellValue => {
  if (value === newValue) return value

  const valueIsNumeric = /^\d+$/.test(String(value))
  const firstChar = String(newValue).trim()[0]
  const newValueHasOperator = firstChar === '+' || firstChar === '-'
  const numString = String(newValue).replace(/\D/g, '')
  const num = numString === '' ? null : Number(numString)

  // if we have a numeric cell but `newValue` doesn't
  // have a number, we can't do an operation,
  // so just return the old value.
  if (valueIsNumeric && num == null) return value

  // if we have a numeric cell and `newValue`
  // has a number, return the result of the operation.
  if (valueIsNumeric && num != null) {
    if (firstChar === '+') return Number(value) + num
    if (firstChar === '-') return Number(value) - num
  }

  // if we don't have a numeric cell, we're not doing any math.
  // non-numeric cells can ignore shorthand operator updates.
  if (!valueIsNumeric && newValueHasOperator) return value

  // anything else will just overwrite the cell
  return newValue
}

export const createRow = (): RowValue => ({
  hp: NaN,
  initiative: NaN,
  name: '',
  notes: '',
})

export const createRows = (n: number): RowValue[] => {
  const rows = []

  for (let i = 0; i < n; i += 1) {
    rows.push(createRow())
  }

  return rows
}

type PropSelections = {
  [key in keyof RowValue]: boolean
}
export const getPropSelections = (
  selections: Selection[],
  rowIndex: number
): PropSelections => {
  const columns = getRowSelections(selections)(rowIndex)
  const [selected, nonSelected] = partition(
    // partition doesn't provide the index in the cb,
    // so we map COLUMNS to a tuple type which lets us check the index.
    COLUMNS.map((c, i): [keyof RowValue, number] => [c, i]),
    ([, i]) => columns.has(i)
  )

  const propSelections = Object.fromEntries([
    ...selected.map(([prop]) => [prop, true]),
    ...nonSelected.map(([prop]) => [prop, false]),
  ])
  return propSelections
}

export const fillSelection = (
  [firstRow, firstColumn]: Selection,
  [lastRow, lastColumn]: Selection
): Selection[] => {
  const newSelections = []

  for (let i = firstRow; i <= lastRow; i += 1) {
    for (let j = firstColumn; j <= lastColumn; j += 1) {
      newSelections.push([i, j] as Selection)
    }
  }

  return newSelections
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
export const formatCell = (
  value: CellValue,
  inputValue?: CellValue | null
): CellDisplay => {
  if (!/^\d+$/.test(String(value)) || Number.isNaN(value) || inputValue == null)
    return formatStaticCell(value)
  if (value === inputValue) return value

  const firstChar = String(inputValue).trim()[0]
  const numString = String(inputValue).replace(/[^0-9]+/g, '')
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

  return formatStaticCell(value)
}

export const formatRow =
  (selections: Selection[], inputValue?: CellValue) =>
  (row: RowValue, index: number): RowDisplay => {
    const propSelections = getPropSelections(selections, index)

    return mapValues(row, (value, prop) =>
      formatCell(
        value,
        propSelections[prop as keyof RowValue] ? inputValue : null
      )
    )
  }

export const formatStaticCell = (value: CellValue): number | string => {
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return ''
    return value
  }

  return value
}

export const formatInput = formatStaticCell
