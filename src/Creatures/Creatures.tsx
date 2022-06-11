import cx from 'classnames'
import useKeyBind from '@zanchi/use-key-bind'
import compose from 'compose-function'
import { matchSorter } from 'match-sorter'
import { FunctionComponent as FC } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { mapKeys, mapValues, pick } from 'remeda'

import { useBool } from 'src/hooks'
import Create from './Create'
import ExpandedItem from './ExpandedItem'
import { SearchHeader } from 'src/components'
import { AbilityScores, Creature, CreatureSize, CreatureType } from './types'
import useCreatures from './useCreatures'
import { getInputVal } from './utils'
import styles from './Creatures.module.scss'
import ListItem from 'src/components/ListItem'

const abilityScores: (creature: Creature) => AbilityScores = compose(
  mapValues((score) => Number.parseInt(score as string)),
  pick(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'])
)
const parseMeta = (
  creature: Creature
): { alignment: string; size: CreatureSize; type: CreatureType } => {
  const [sizeAndType, alignment] = creature.meta.split(',')
  const [size, ...type] = sizeAndType.split(' ')

  return {
    size: size as CreatureSize,
    type: type.join(' ') as CreatureType,
    alignment: alignment.trim(),
  }
}
const alignment = (creature: Creature) => parseMeta(creature).alignment
const size = (creature: Creature) => parseMeta(creature).size
const type = (creature: Creature) => parseMeta(creature).type
const shortTraits = (creature: Creature) =>
  pick(creature, [
    'Saving Throws',
    'Skills',
    'Damage Immunities',
    'Damage Resistances',
    'Damage Vulnerabilities',
    'Condition Immunities',
    'Senses',
    'Languages',
    'Challenge',
  ])
const physicalTraits = (creature: Creature) =>
  pick(creature, ['Armor Class', 'Hit Points', 'Speed'])

const Loading = () => <div class={styles.loading}>Loading</div>

type Props = {
  onAddToInitiative: (c: Creature) => unknown
}

const Creatures: FC<Props> = ({ onAddToInitiative }) => {
  const [creatures, { add: addCreature }] = useCreatures()
  const [creating, { toggle: toggleCreating }] = useBool(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const hasFocus = () => containerRef.current?.contains(document.activeElement)
  useEffect(() => {
    setSelected(null)
  }, [searchTerm])

  let filteredCreatures: Creature[]
  if (/<>=/.test(searchTerm)) {
    const operatorIndex = searchTerm.search(/<>=/)
    const key = searchTerm.slice(0, operatorIndex).trim()
    const searchValue = searchTerm.slice(operatorIndex + 1).trim()

    filteredCreatures = creatures.filter((creature) => {
      const lowercaseCreature = mapKeys(creature, (k) =>
        String(k).toLowerCase()
      )

      const value = lowercaseCreature[key as keyof Creature] as string
      return value?.includes(searchValue)
    })
  } else {
    filteredCreatures = matchSorter(creatures, searchTerm, {
      keys: ['name'],
    })
  }

  const selectNext = () => {
    if ((selected ?? 0) + 1 > creatures.length) return
    setSelected((s) => (s ?? -1) + 1)
  }

  const selectPrev = () => {
    if ((selected ?? 0) - 1 < 0) {
      setSelected(null)
      return
    }
    setSelected((s) => s! - 1)
  }

  useKeyBind(
    ['Enter'],
    () => {
      if (!hasFocus()) return
      if (filteredCreatures.length > 0) {
        const result = filteredCreatures[0].name
        // we're hitting enter from the input
        if (selected == null) {
          setExpanded(result)
          setSearchTerm(result)
        } else {
          const name = filteredCreatures[selected].name
          setExpanded(name === expanded ? null : name)
        }
      }
    },
    []
  )

  useKeyBind(
    ['ArrowDown'],
    () => {
      if (!hasFocus()) return
      selectNext()
    },
    [setSelected]
  )
  useKeyBind(
    ['ArrowUp'],
    () => {
      if (!hasFocus()) return
      selectPrev()
    },
    [setSelected]
  )

  const deselect = () => setExpanded('')
  const select = (name: string) => () => setExpanded(name)

  const creatureList = (
    <ol class={styles.creatures}>
      {filteredCreatures.map((c, i) => {
        if (expanded === c.name) {
          return (
            <ExpandedItem
              abilityScores={abilityScores(c)}
              actions={c.Actions}
              alignment={alignment(c)}
              legendaryActions={c['Legendary Actions']}
              name={c.name}
              onAdd={() => onAddToInitiative(c)}
              onCollapse={deselect}
              physicalTraits={physicalTraits(c)}
              reactions={c.Reactions}
              selected={selected === i}
              shortTraits={shortTraits(c)}
              size={size(c)}
              traits={c.Traits ?? []}
              type={type(c)}
            />
          )
        }

        return (
          <ListItem
            selected={selected === i}
            key={c.name}
            onSelect={select(c.name)}
            title={c.name}
            subText={type(c)}
          />
        )
      })}
    </ol>
  )

  return (
    <section
      aria-labelledby="Creatures-tab"
      class={styles.container}
      ref={containerRef}
      role="tabpanel"
    >
      <SearchHeader
        onAdd={toggleCreating}
        onInput={compose(setSearchTerm, getInputVal)}
        searchTerm={searchTerm}
        title="Creatures"
      />

      {creating && <Create onSave={addCreature} />}

      {creatures.length === 0 ? <Loading /> : creatureList}
    </section>
  )
}

export default Creatures
