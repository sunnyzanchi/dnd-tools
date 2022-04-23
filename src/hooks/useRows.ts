import last from 'just-last'
import { RowValue } from 'src/Initiative/Row'
import useStack from './useStack'

/**
 * all rows in the initiative tracker.
 */
type RowState = RowValue[]

type Actions = {
  clear: () => void
  /**
   * returns true if a redo was done,
   * false if there's no more state to redo.
   */
  redo: () => boolean
  set: (newRows: RowState) => void
  sort: () => void
  /**
   * returns false if there's no more history to undo.
   * otherwise returns the undone state.
   */
  undo: () => RowState | false
}

/**
 * keeps track of row history to enable undo functionality.
 * `currentRows` is the current state,
 * which is the last item on the stack.
 * to undo, it pops the last state off the stack,
 * which will make this hook return the previous state.
 * to redo, it keep a separate list of undone actions,
 * which clears whenever state is set by a non-undo action.
 */
const useRows = (): [rows: RowState, actions: Actions] => {
  const [
    rowHistory,
    { clear: clearRowHistory, push: pushRowHistory, pop: popRowHistory },
  ] = useStack<RowState>([], 25)
  const [
    redoHistory,
    { clear: clearRedoHistory, push: pushRedoHistory, pop: popRedoHistory },
  ] = useStack<RowState>([], 25)
  const currentRows = last(rowHistory) ?? []

  const redo = (): boolean => {
    if (redoHistory.length > 0) {
      const redoState = popRedoHistory()
      pushRowHistory(redoState)
      return true
    }

    return false
  }

  const sort = () => {
    const newRows = [...currentRows]
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

    set(newRows)
  }

  const set = (newRows: RowState) => {
    pushRowHistory(newRows)
    clearRedoHistory()
  }

  const undo = (): RowState | false => {
    if (rowHistory.length > 1) {
      const lastState = popRowHistory()
      pushRedoHistory(lastState)
      return lastState
    }
    return false
  }

  return [currentRows, { clear: clearRowHistory, redo, set, sort, undo }]
}

export default useRows
