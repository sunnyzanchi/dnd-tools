import cx from 'classnames'
import useKeyBind from '@zanchi/use-key-bind'
import compose from 'compose-function'
import oMap from 'just-map-object'
import kMap from 'just-map-keys'
import pick from 'just-pick'
import { matchSorter } from 'match-sorter'
import { useEffect, useState } from 'preact/hooks'
import { useBool } from 'src/hooks'
import Create from './Create'
import ExpandedItem from './ExpandedItem'
import { AbilityScores, Creature, CreatureSize, CreatureType } from './types'
import useCreatures from './useCreatures'
import styles from './Creatures.module.scss'

const abilityScores: (creature: Creature) => AbilityScores = compose(
  (abilityScores) =>
    // @ts-ignore
    oMap(abilityScores as Record<string, string>, (_name, score) =>
      Number.parseInt(score)
    ) as AbilityScores,
  (creature: Creature) =>
    // @ts-ignore
    pick(creature, ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'])
)
const parseMeta = (
  creature: Creature
): [CreatureSize, CreatureType, string] => {
  const [sizeAndType, alignment] = creature.meta.split(',')
  const [size, ...type] = sizeAndType.split(' ')

  return [
    size as CreatureSize,
    type.join(' ') as CreatureType,
    alignment.trim(),
  ]
}
const size = (creature: Creature) => parseMeta(creature)[0]
const type = (creature: Creature) => parseMeta(creature)[1]
const alignment = (creature: Creature) => parseMeta(creature)[2]
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

const Creatures = () => {
  const [creatures, { add: addCreature }] = useCreatures()
  const [creating, { toggle: toggleCreating }] = useBool(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  useEffect(() => {
    setSelected(null)
  }, [searchTerm])

  let filteredCreatures: Creature[]
  if (/<>=/.test(searchTerm)) {
    const operatorIndex = searchTerm.search(/<>=/)
    const key = searchTerm.slice(0, operatorIndex).trim()
    const searchValue = searchTerm.slice(operatorIndex + 1).trim()

    filteredCreatures = creatures.filter((creature) => {
      const lowercaseCreature = kMap(creature, (v, k) =>
        String(k).toLowerCase()
      ) as Creature

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

  useKeyBind(['ArrowDown'], selectNext, [setSelected])
  useKeyBind(['ArrowUp'], selectPrev, [setSelected])

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
          <li
            class={cx(styles.listItem, { selected: selected === i })}
            key={c.name}
            onClick={select(c.name)}
          >
            <h2 class={styles.name}>{c.name}</h2>
            <p class={styles.type}>({type(c)})</p>
          </li>
        )
      })}
    </ol>
  )

  return (
    <section class={styles.container}>
      <header>
        <h1>Creatures</h1>
        <input
          class={styles.search}
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
          placeholder="Search"
          value={searchTerm}
        />
        <button class={styles.addCreature} onClick={toggleCreating}>
          add
        </button>
      </header>
      {creating && <Create onSave={addCreature} />}

      {creatures.length === 0 ? <Loading /> : creatureList}
    </section>
  )
}

export default Creatures
