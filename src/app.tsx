import compose from 'compose-function'
import { first } from 'remeda'

import Creatures from './Creatures'
import Initiative from './Initiative'
import { RowValue } from './Initiative/Row'
import { Creature } from './Creatures/types'
import { useRows } from './hooks'
import { updateAt } from './utils'
import './app.css'

const flatHp: (c: Creature) => number = compose(
  Number,
  first,
  (hpString: string) => hpString.split(' '),
  (c) => c['Hit Points']
)

const App = () => {
  const [rows, rowActions] = useRows()

  const addCreatureToInitiative = (creature: Creature) => {
    const firstEmptyIndex = rows.findIndex((r) =>
      Object.values(r).every((v) => !v)
    )
    rowActions.set(
      updateAt(firstEmptyIndex, {
        name: creature.name,
        hp: flatHp(creature),
        notes: '',
        initiative: NaN,
      } as RowValue)(rows)
    )
  }

  return (
    <div class="container">
      <Initiative rows={rows} rowActions={rowActions} />
      <Creatures onAddToInitiative={addCreatureToInitiative} />
    </div>
  )
}

export default App
