import { FunctionalComponent as FC } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import Creatures from 'src/Creatures'
import { Creature } from 'src/Creatures/types'
import { flatHp } from 'src/Creatures/utils'
import { Initiative, MobileInitiative } from 'src/Initiative'
import { RowValue } from 'src/Initiative/Row'
import Items from 'src/Items'
import TabbedContainer from 'src/components/TabbedContainer'
import { useRows, useScreenSize } from 'src/hooks'
import { updateAt } from 'src/utils'
import { MdProvider } from 'src/hooks/useMdParser'

const DESKTOP_TABS = [{ name: 'Creatures' }, { name: 'Items' }]
const MOBILE_TABS = [
  { name: 'Creatures' },
  { name: 'Items' },
  { name: 'Initiative' },
]

const App: FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [rows, rowActions] = useRows()
  const [width] = useScreenSize()

  const isMobile = width < 601

  useEffect(() => {
    const tabsLength = (isMobile ? MOBILE_TABS : DESKTOP_TABS).length
    if (currentTab > tabsLength - 1) {
      setCurrentTab(0)
    }
  }, [currentTab, width])

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
        {!isMobile && <Initiative rows={rows} rowActions={rowActions} />}
        <TabbedContainer
          currentTab={currentTab}
          onChange={setCurrentTab}
          tabs={isMobile ? MOBILE_TABS : DESKTOP_TABS}
        >
          <Creatures onAddToInitiative={addCreatureToInitiative} />
          <Items />
          {isMobile && <MobileInitiative rows={rows} rowActions={rowActions} />}
        </TabbedContainer>
      </MdProvider>
    </>
  )
}

export default App
