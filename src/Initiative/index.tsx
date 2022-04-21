import empty from 'just-is-empty'
import last from 'just-last'
import { Ref } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import useKeyBind from '@zanchi/use-key-bind'

import {
  useElementSize,
  useKeyIsPressed,
  useSelections,
  useStack,
} from 'src/hooks'

import Header from './Header'
import Row from './Row'
import { createRows, fillSelection } from './utils'
import './initiative.css'

const ROW_HEIGHT = 60 // px

type HistoryEntry = [index: number, prevRow: Row, newRow: Row]

const Initiative = () => {
  const [rows, setRows] = useState<Row[]>([])
  const [turn, setTurn] = useState<number | null>(null)
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
  const stack = useStack<HistoryEntry>()
  const [sizeRef, , height] = useElementSize()

  const [lastRow, lastColumn] = last(selections) ?? [NaN, NaN]

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

  useEffect(() => {
    // -1 because of the header
    const numRows = Math.floor(height / ROW_HEIGHT) - 1

    setRows(createRows(numRows))
  }, [height])

  useKeyBind(
    ['Enter'],
    () => {
      if (empty(selections)) return

      setSelections([[lastRow + 1, lastColumn]])
    },
    [selections]
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

  const nextTurn = () => {
    if (turn == null) {
      setTurn(0)
      return
    }

    const lastFilledRowIndex =
      rows.length -
      1 -
      [...rows].reverse().findIndex((r) => !Number.isNaN(r.initiative))

    if (turn + 1 > lastFilledRowIndex) {
      setTurn(0)
    } else {
      setTurn(turn + 1)
    }
  }

  const select = (row: number) => (column: number | null) => {
    // deselecting
    if (column == null) return clearSelections()

    // discrete multi selecting
    if (cmdSelecting) return addSelection([row, column])

    const firstSelection = selections[0]
    // in between multi selecting
    if (shiftSelecting && firstSelection != null) {
      const newLastSelection: [number, number] = [row, column]
      const inBetweenSelections = fillSelection(
        firstSelection,
        newLastSelection
      )
      const newSelections = [...selections, ...inBetweenSelections]
      return setSelections(newSelections)
    }

    // single selecting
    setSelections([[row, column]])
  }

  const sort = () => {
    const newRows = [...rows]
    newRows.sort((a, b) => {
      const i1 = a.initiative
      const i2 = b.initiative
      // push empty rows to the bottom.
      if (Number.isNaN(i1 + i2)) return 0
      if (Number.isNaN(i1)) return 1
      if (Number.isNaN(i2)) return -1
      // descending order.
      return i2 - i1
    })

    setRows(newRows)
  }

  const update = (index: number) => (value: Row) => {
    const newRows = [...rows]
    stack.push([index, rows[index], value])
    newRows[index] = value

    setRows(newRows)
  }

  return (
    <div class="initiative">
      <ol class="rows" ref={sizeRef as Ref<HTMLOListElement>}>
        <Header onSort={sort} />
        {rows.map((r, i) => (
          <Row
            {...r}
            isTurn={turn === i}
            key={i}
            editingCell={i === lastRow ? lastColumn : undefined}
            onSelect={select(i)}
            onUpdate={update(i)}
            // if we have a selected index, we should always
            // have a selected prop.
            selections={getSelectedColumns(i) ?? new Set()}
          />
        ))}
      </ol>
      <button class="next" onClick={nextTurn}>
        {turn != null ? 'Next' : 'Start'}
      </button>
    </div>
  )
}

export default Initiative
