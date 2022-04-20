import { Ref } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import useElementSize from 'hooks/useElementSize'
import useKeyBind from '@zanchi/use-key-bind'
import useStack from 'hooks/useStack'
import Header from './Header'
import Row, { COLUMNS } from './Row'
import { createRows } from './utils'
import './initiative.css'

const ROW_HEIGHT = 60 // px

type HistoryEntry = [index: number, prevRow: Row, newRow: Row]

const Initiative = () => {
  const [rows, setRows] = useState<Row[]>([])
  const [[selectedRow, selectedColumn], setSelected] = useState<
    Partial<[number, number]>
  >([undefined, undefined])
  const [turn, setTurn] = useState<number | null>(null)
  const stack = useStack<HistoryEntry>()
  const [sizeRef, , height] = useElementSize()

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
      if (selectedRow == null || selectedColumn == null) return

      select(selectedRow + 1)(selectedColumn)
    },
    [selectedRow, selectedColumn]
  )

  useKeyBind(
    ['Shift + Enter'],
    () => {
      if (selectedRow == null || selectedColumn == null) return

      select(selectedRow - 1)(selectedColumn)
    },
    [selectedRow, selectedColumn]
  )

  useKeyBind(
    ['Tab'],
    (e) => {
      e.preventDefault()
      if (selectedRow == null || selectedColumn == null) return

      const column =
        selectedColumn + 1 > COLUMNS.length - 1 ? 0 : selectedColumn + 1
      const row = selectedColumn + 1 > COLUMNS.length - 1 ? 1 : 0
      select(selectedRow + row)(column)
    },
    [selectedRow, selectedColumn]
  )

  useKeyBind(
    ['Shift + Tab'],
    (e) => {
      e.preventDefault()
      if (selectedRow == null || selectedColumn == null) return

      const column =
        selectedColumn - 1 < 0 ? COLUMNS.length - 1 : selectedColumn - 1
      const row = selectedColumn - 1 < 0 ? -1 : 0
      select(selectedRow + row)(column)
    },
    [selectedRow, selectedColumn]
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

  const select = (row: number) => (column?: number) => {
    if (column == null) {
      setSelected([undefined, undefined])
    } else {
      setSelected([row, column])
    }
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
            onSelect={select(i)}
            onUpdate={update(i)}
            // if we have a selected index, we should always
            // have a selected prop.
            selected={selectedRow === i ? selectedColumn! : false}
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
