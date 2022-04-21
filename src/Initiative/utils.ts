import { Selection } from 'src/hooks/useSelections'

export const createRow = () => ({
  hp: NaN,
  initiative: NaN,
  name: '',
  notes: '',
})

export const createRows = (n: number) => {
  const rows = []

  for (let i = 0; i < n; i += 1) {
    rows.push(createRow())
  }

  return rows
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
