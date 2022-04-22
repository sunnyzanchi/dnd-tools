import empty from 'just-is-empty'
import last from 'just-last'
import { createContext, Ref, VNode } from 'preact'
import { useEffect, useState, useRef } from 'preact/hooks'
import useKeyBind from '@zanchi/use-key-bind'

import {
  useElementSize,
  useKeyIsPressed,
  useOnClick,
  useSelections,
  useStack,
  useTurn,
} from 'src/hooks'
import Header from './Header'
import Row, { COLUMNS, RowValue } from './Row'
import {
  calculateUpdate,
  createRows,
  fillSelection,
  formatInput,
  formatRow,
} from './utils'
import './initiative.css'

const ROW_HEIGHT = 60 // px

type HistoryEntry = [index: number, prevRow: RowValue, newRow: RowValue]

/**
 * when multiselecting, the input shows up wherever the last selection was.
 * this lets an `EditableCell` decide to render the `input`
 * when it's given `editing: true`.
 * context here seemed natural given that the `input`
 * can be rendered by any cell.
 */
export const FloatingInput = createContext<VNode | null>(null)

const Initiative = () => {
  const [rows, setRows] = useState<RowValue[]>([])
  const [turn, nextTurn] = useTurn(rows)
  const [sizeRef, , height] = useElementSize()
  const cmdSelecting = useKeyIsPressed(['Control', 'Meta'])
  const shiftSelecting = useKeyIsPressed(['Shift'])
  const [
    selections,
    {
      add: addSelection,
      clear: clearSelections,
      getColumns: getSelectedColumns,
      set: setSelections,
    },
  ] = useSelections()
  const [lastRow, lastColumn] = last(selections) ?? [NaN, NaN]
  const stack = useStack<HistoryEntry>()

  // these three `const`s are to support the floating input.
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState<number | string>('')
  const input = (
    <input
      class="cell-input"
      onInput={(e) => setInputValue(e.currentTarget.value)}
      ref={inputRef}
      value={formatInput(inputValue)}
    />
  )

  // when the user selects something new,
  // the value in the input should be whatever they last selected.
  useEffect(() => {
    if (Number.isNaN(lastRow)) return

    const value = rows[lastRow][COLUMNS[lastColumn]]
    setInputValue(value)
  }, [selections])

  // fill the available height of initiative tracker with empty rows.
  useEffect(() => {
    // -1 because of the header
    const numRows = Math.floor(height / ROW_HEIGHT) - 1

    setRows(createRows(numRows))
  }, [height])

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current?.focus()
    // TODO: this isn't consistent.
    // it's consistent in the conditions under which it
    // does and doesn't work, but i don't know why
    // it's not working when it's not.
    inputRef.current?.select()
  }, [selections, inputRef])

  // TODO: set up a better interface around the stack and `rows` state.
  // as is, this works fine to undo single cell changes,
  // but starts to get fucky if you try to undo after sorting.
  //
  // useKeybind(
  //   'Cmd + Z',
  //   () => {
  //     const [i, previous] = stack.pop()
  //     const newRows = [...rows]
  //     newRows[i] = previous

  //     setRows(newRows)
  //   },
  //   [stack]
  // )

  useKeyBind(
    ['Enter'],
    () => {
      if (empty(selections)) return

      // if `inputValue` only contains numbers we want to store
      // the value as a number so we can do math with it later.
      if (/^\d+$/.test(String(inputValue))) {
        update(Number(inputValue))
      } else {
        update(inputValue)
      }
    },
    [inputValue, selections]
  )

  useKeyBind(
    ['Shift + Enter'],
    () => {
      if (empty(selections)) return

      setSelections([[lastRow - 1, lastColumn]])
    },
    [selections]
  )

  useKeyBind(
    ['Tab'],
    (e) => {
      e.preventDefault()
      if (empty(selections)) return

      setSelections([[lastRow, lastColumn + 1]])
    },
    [selections]
  )

  useKeyBind(
    ['Shift + Tab'],
    (e) => {
      e.preventDefault()
      if (empty(selections)) return

      setSelections([[lastRow, lastColumn - 1]])
    },
    [selections]
  )

  useOnClick((e) => {
    // if we're clicking on another cell, we might be multi-selecting.
    // otherwise, the user has clicked outside the initiative tracker
    // and we should clear selections and stop showing the input box.
    const el = e.target as HTMLElement
    if (
      el?.classList?.contains('editable-cell') ||
      el?.classList?.contains('cell-input')
    )
      return

    clearSelections()
  }, [])

  const select = (rowIndex: number) => (columnIndex: number | null) => {
    // deselecting
    if (columnIndex == null) return clearSelections()

    // discrete multi selecting
    if (cmdSelecting) return addSelection([rowIndex, columnIndex])

    // in between multi selecting
    const firstSelection = selections[0]
    if (shiftSelecting && firstSelection != null) {
      const newLastSelection: [number, number] = [rowIndex, columnIndex]
      const inBetweenSelections = fillSelection(
        firstSelection,
        newLastSelection
      )
      // `fillSelection` returns a new list of selections,
      // but it includes the first existing selection.
      // without slicing, we would double select the first cell.
      const newSelections = [...selections.slice(1), ...inBetweenSelections]
      return setSelections(newSelections)
    }

    // single selecting
    setSelections([[rowIndex, columnIndex]])
  }

  const sort = () => {
    const newRows = [...rows]
    newRows.sort((a, b) => {
      const i1 = a.initiative as number
      const i2 = b.initiative as number
      // push empty rows to the bottom.
      if (Number.isNaN(i1 + i2)) return 0
      if (Number.isNaN(i1)) return 1
      if (Number.isNaN(i2)) return -1
      // descending order.
      return i2 - i1
    })

    setRows(newRows)
  }

  const update = (value: string | number) => {
    const newRows = [...rows]

    selections.forEach(([rowIndex, columnIndex]) => {
      const columnName = COLUMNS[columnIndex]
      const row = newRows[rowIndex]
      const currentValue = row[columnName]
      row[columnName] = calculateUpdate(currentValue, value)
    })

    setRows(newRows)
    setSelections([[lastRow + 1, lastColumn]])
  }

  return (
    <FloatingInput.Provider value={input}>
      <div class="initiative">
        <ol class="rows" ref={sizeRef as Ref<HTMLOListElement>}>
          <Header onSort={sort} />
          {rows.map(formatRow(selections, inputValue)).map((r, i) => (
            <Row
              {...(r as RowValue)}
              isTurn={turn === i}
              key={i}
              editingCell={i === lastRow ? lastColumn : undefined}
              onSelect={select(i)}
              // if we have at least one selected row,
              // we should always have at least one selected column.
              selections={getSelectedColumns(i) ?? new Set()}
            />
          ))}
        </ol>

        <button class="next" onClick={nextTurn}>
          {turn != null ? 'Next' : 'Start'}
        </button>
      </div>
    </FloatingInput.Provider>
  )
}

export default Initiative
