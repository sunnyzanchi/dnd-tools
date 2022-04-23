import { useState } from 'preact/hooks'

/**
 * a cell location, [rowIndex, columnIndex].
 */
export type Selection = [number, number]

type Actions = {
  /**
   * add a new selection while keeping existing ones.
   */
  add: (selection: Selection) => void
  /**
   * clear selections and return the last state.
   */
  clear: () => Selection[]
  /**
   * get the selected columns for the given row.
   */
  getColumns: ReturnType<typeof getRowSelections>
  /**
   * replace current selections.
   */
  set: (selections: Selection[]) => void
}

export const getRowSelections =
  (selections: Selection[]) =>
  (row: number): Set<number> => {
    const columns = selections
      .filter(([r]) => r === row)
      .map(([, column]) => column)

    return new Set(columns)
  }

/**
 * returns the current selection state as an array.
 * selections are in order, from first to last.
 */
const useSelections = (
  initialSelections: Selection[] = []
): [Selection[], Actions] => {
  const [selections, setSelections] = useState<Selection[]>(initialSelections)

  const add = ([row, column]: Selection) =>
    setSelections((s) => [...s, [row, column]])

  const clear = () => {
    setSelections([])
    return selections
  }

  const set = (selections: Selection[]) => setSelections(selections)

  return [
    selections,
    { add, clear, getColumns: getRowSelections(selections), set },
  ]
}

export default useSelections
