import compose from 'compose-function'
import { useState } from 'preact/hooks'
import { first } from 'remeda'

import Creatures from './Creatures'
import Initiative from './Initiative'
import Items from './Items'
import { RowValue } from './Initiative/Row'
import { Creature } from './Creatures/types'
import TabbedContainer from 'src/components/TabbedContainer'
import { useRows } from './hooks'
import { updateAt } from './utils'
import './app.css'

const TABS = [{ name: 'Creatures' }, { name: 'Items' }]

const flatHp: (c: Creature) => number = compose(
  Number,
  first,
  (hpString: string) => hpString.split(' '),
  (c) => c['Hit Points']
)

const App = () => {
  const [currentTab, setCurrentTab] = useState(0)
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
      <TabbedContainer
        currentTab={currentTab}
        onChange={setCurrentTab}
        tabs={TABS}
      >
        <Creatures onAddToInitiative={addCreatureToInitiative} />
        <Items />
      </TabbedContainer>
    </div>
  )
}

export default App
