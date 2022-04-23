import { useState } from 'preact/hooks'

import { RowValue } from 'src/Initiative/Row'

const useTurn = (rows: RowValue[]): [number | null, () => void] => {
  const [turn, setTurn] = useState<number | null>(null)

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

  return [turn, nextTurn]
}

export default useTurn
