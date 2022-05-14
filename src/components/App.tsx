import compose from 'compose-function'
import { FunctionalComponent as FC } from 'preact'
import { useState } from 'preact/hooks'
import { first } from 'remeda'

import Creatures from 'src/Creatures'
import { Creature } from 'src/Creatures/types'
import Initiative from 'src/Initiative'
import { RowValue } from 'src/Initiative/Row'
import Items from 'src/Items'
import TabbedContainer from 'src/components/TabbedContainer'
import { useRows } from 'src/hooks'
import { updateAt } from 'src/utils'
import { MdProvider } from 'src/hooks/useMdParser'

const TABS = [{ name: 'Creatures' }, { name: 'Items' }]

const flatHp: (c: Creature) => number = compose(
  Number,
  first,
  (hpString: string) => hpString.split(' '),
  (c) => c['Hit Points']
)

const App: FC = () => {
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
    <>
      <MdProvider>
        <Initiative rows={rows} rowActions={rowActions} />
        <TabbedContainer
          currentTab={currentTab}
          onChange={setCurrentTab}
          tabs={TABS}
        >
          <Creatures onAddToInitiative={addCreatureToInitiative} />
          <Items />
        </TabbedContainer>
      </MdProvider>
    </>
  )
}

export default App
