import compose from 'compose-function'
import { useState } from 'preact/hooks'
import oMap from 'just-map-object'

import AbilityScoresDisplay from './AbilityScores'
import { AbilityScores, Creature, Trait } from './types'
import styles from './Create.module.scss'
import { append, map, mapProp } from 'src/utils'
import { FunctionalComponent as FC, JSX } from 'preact'

const shortTraitLabels = {
  'Saving Throws': 'STR +4, DEX +2, etc.',
  Skills: 'Animal Handling + 5, Performance +3',
  'Damage Immunities': 'fire, cold',
  Senses: 'Darkvision 60 ft.',
  Languages: 'Common, Dwarvish',
  Challenge: '1/4 (50XP)',
}
type InputHandler = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void

type ShortTraits = typeof shortTraitLabels

const getInputVal = (
  e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.value
const emptyTrait = () => ({ description: '', name: '' })

const defaultAbilityScores = () => ({
  STR: 10,
  DEX: 10,
  CON: 10,
  INT: 10,
  WIS: 10,
  CHA: 10,
})

type LegendaryActions = {
  actions: Trait[]
  startText: string
}

type PhysicalTraits = {
  name: string
  meta: string
  'Armor Class': string
  'Hit Points': string
  Speed: string
}

type Props = {
  onSave: (creature: Creature) => unknown
}

/**
 * component that lets a user input and save their own creature.
 * @returns
 */
const CreateCreature: FC<Props> = ({ onSave }) => {
  const [abilityScores, setAbilityScores] = useState<AbilityScores>(
    defaultAbilityScores()
  )
  const [actions, setActions] = useState<Trait[]>([])
  const [shortTraits, setShortTraits] = useState(
    oMap(shortTraitLabels, () => '') as ShortTraits
  )
  const [longTraits, setLongTraits] = useState<Trait[]>([])
  const [legendary, setLegendary] = useState<LegendaryActions>({
    actions: [],
    startText: '',
  })
  const [physicalTraits, setPhysicalTraits] = useState({
    meta: '',
    name: '',
    'Armor Class': '',
    'Hit Points': '',
    Speed: '',
  })

  const addAction = () => setActions(append(emptyTrait()))

  const addLegendaryAction = () =>
    setLegendary(mapProp('actions', append(emptyTrait())))

  const addTrait = () => setLongTraits((t) => append(emptyTrait())(t))

  const save = () => {
    // @ts-ignore
    onSave({
      ...abilityScores,
      ...shortTraits,
      ...physicalTraits,
      Actions: actions,
      Traits: longTraits,
      'Legendary Actions': legendary,
    })
  }

  const updateAbilityScores = (name: keyof AbilityScores, value: number) =>
    setAbilityScores(mapProp(name, () => value))

  const updateActions = (
    updateIndex: number,
    prop: keyof Trait
  ): InputHandler =>
    compose(
      (value: string) =>
        setActions(
          map((action, i) =>
            updateIndex === i
              ? // @ts-ignore
                // ? mapProp(prop, () => e.currentTarget.value)(action)
                { ...action, [prop]: value }
              : action
          )
        ),
      getInputVal
    )

  const updateLegendary = (
    updatedIndex: number,
    prop: keyof Trait
  ): InputHandler =>
    compose(
      (value) =>
        setLegendary(
          mapProp(
            'actions',
            // @ts-ignore
            map(
              (action: Trait, i: number): Trait =>
                updatedIndex === i ? { ...action, [prop]: value } : action
            )
          )
        ),
      getInputVal
    )

  const updateLegendaryStartText = compose(
    (value) =>
      setLegendary((l) => ({
        ...l,
        startText: value,
      })),
    getInputVal
  )

  const updateLongTraits = (
    updatedIndex: number,
    prop: keyof Trait
  ): InputHandler =>
    compose(
      (value) =>
        setLongTraits(
          map((trait: Trait, i: number) =>
            updatedIndex === i ? { ...trait, [prop]: value } : trait
          )
        ),
      getInputVal
    )

  const updatePhysicalTraits =
    (key: keyof PhysicalTraits): InputHandler =>
    (e) =>
      setPhysicalTraits(mapProp(key, () => e.currentTarget.value))

  const updateShortTraits =
    (prop: keyof ShortTraits): InputHandler =>
    (e) =>
      setShortTraits(mapProp(prop, () => e.currentTarget.value))

  const title =
    physicalTraits.name.trim() === '' ? 'New Creature' : physicalTraits.name
  return (
    <div class={styles.container}>
      <h2>{title}</h2>

      {Object.keys(physicalTraits).map((key) => (
        <input
          key={key}
          onChange={updatePhysicalTraits(key as keyof PhysicalTraits)}
          placeholder={key}
        />
      ))}

      <AbilityScoresDisplay
        editable
        onUpdate={updateAbilityScores}
        {...abilityScores}
      />

      <section class={styles.shortTraits}>
        {Object.entries(shortTraits).map(([key, value], i) => (
          <>
            <label for={`create-creature-trait-${i}`} key={`${key}-label`}>
              {key}
            </label>
            <input
              id={`create-creature-trait-${i}`}
              key={key}
              onChange={updateShortTraits(key as keyof ShortTraits)}
              placeholder={shortTraitLabels[key as keyof ShortTraits]}
              value={value}
            />
          </>
        ))}
      </section>

      <section class={styles.longTraits}>
        <hr />
        {longTraits.map(({ name, description }, i) => (
          <div class={styles.longTrait} key={i}>
            <input
              onChange={updateLongTraits(i, 'name')}
              placeholder="name"
              value={name}
            />
            <textarea
              // @ts-expect-error
              onChange={updateLongTraits(i, 'description')}
              placeholder="description"
              value={description}
            />
          </div>
        ))}
        <button class={styles.addButton} onClick={addTrait}>
          add feature
        </button>
      </section>

      <section class={styles.actions}>
        <hr />
        <h3>Actions</h3>
        {actions.map(({ name, description }, i) => (
          <div class={styles.longTrait} key={i}>
            <input
              onChange={updateActions(i, 'name')}
              placeholder="name"
              value={name}
            />
            <textarea
              // @ts-expect-error
              onChange={updateActions(i, 'description')}
              placeholder="description"
              value={description}
            />
          </div>
        ))}
        <button class={styles.addButton} onClick={addAction}>
          add action
        </button>
      </section>

      <section class={styles.legendaryActions}>
        <hr />
        <h3>Legendary Actions</h3>
        <textarea
          onChange={updateLegendaryStartText}
          placeholder="start text"
          value={legendary.startText}
        />
        {legendary.actions.map(({ name, description }, i) => (
          <div class={styles.longTrait} key={i}>
            <input
              onChange={updateLegendary(i, 'name')}
              placeholder="name"
              value={name}
            />
            <input
              onChange={updateLegendary(i, 'description')}
              placeholder="description"
              value={description}
            />
          </div>
        ))}
        <button class={styles.addButton} onClick={addLegendaryAction}>
          add action
        </button>
      </section>

      <hr />
      <button class={styles.saveButton} onClick={save}>
        save
      </button>
    </div>
  )
}

export default CreateCreature
