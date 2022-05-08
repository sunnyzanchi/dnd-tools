import compose from 'compose-function'
import { FunctionalComponent as FC, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { mapValues } from 'remeda'

import AbilityScoresDisplay from './AbilityScores'
import styles from './Create.module.scss'
import { mapProp } from 'src/utils'
import { AbilityScores, Creature } from './types'
import useTraitEditor from './useTraitEditor'
import TraitEditor, { mapHookActions } from './TraitEditor'

const shortTraitPlaceholders = {
  'Saving Throws': 'STR +4, DEX +2, etc.',
  Skills: 'Animal Handling + 5, Performance +3',
  'Damage Immunities': 'fire, cold',
  Senses: 'Darkvision 60 ft.',
  Languages: 'Common, Dwarvish',
  Challenge: '1/4 (50XP)',
}

const defaultAbilityScores = (): AbilityScores => ({
  STR: 10,
  DEX: 10,
  CON: 10,
  INT: 10,
  WIS: 10,
  CHA: 10,
})
const getInputVal = (
  e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.value

type InputHandler = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
type PhysicalTraits = {
  name: string
  meta: string
  'Armor Class': string
  'Hit Points': string
  Speed: string
}
type ShortTraits = typeof shortTraitPlaceholders

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
  const [{ traits: actions }, actionsActions] = useTraitEditor()
  const [
    { startText: legendaryStartText, traits: legendary },
    legendaryActions,
  ] = useTraitEditor({ startText: true })
  const [{ traits: longTraits }, longTraitsActions] = useTraitEditor()
  const [physicalTraits, setPhysicalTraits] = useState({
    meta: '',
    name: '',
    'Armor Class': '',
    'Hit Points': '',
    Speed: '',
  })
  const [{ traits: reactions }, reactionsActions] = useTraitEditor()
  const [shortTraits, setShortTraits] = useState<ShortTraits>(
    mapValues(shortTraitPlaceholders, () => '')
  )

  const save = () => {
    // @ts-ignore
    onSave({
      ...abilityScores,
      ...shortTraits,
      ...physicalTraits,
      Actions: actions,
      Traits: longTraits,
      'Legendary Actions': {
        startText: legendaryStartText,
        actions: legendary,
      },
    })
  }

  const updateAbilityScores = (name: keyof AbilityScores, value: number) =>
    setAbilityScores(mapProp(name, value))

  const updatePhysicalTraits =
    (key: keyof PhysicalTraits): InputHandler =>
    (e) =>
      setPhysicalTraits(mapProp(key, () => e.currentTarget.value))

  type STUpdater = (a: ShortTraits) => ShortTraits
  const updateShortTraits = (prop: keyof ShortTraits): InputHandler =>
    compose(
      (fn: STUpdater) => setShortTraits(fn),
      (value) => mapProp(prop, value),
      getInputVal
    )

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

      <section class={styles.traitEditor}>
        {Object.entries(shortTraits).map(([key, value], i) => (
          <>
            <label for={`create-creature-trait-${i}`} key={`${key}-label`}>
              {key}
            </label>
            <input
              id={`create-creature-trait-${i}`}
              key={key}
              onChange={updateShortTraits(key as keyof ShortTraits)}
              placeholder={shortTraitPlaceholders[key as keyof ShortTraits]}
              value={value}
            />
          </>
        ))}
      </section>

      <TraitEditor
        {...mapHookActions(longTraitsActions)}
        name="Features"
        noTitle
        traits={longTraits}
      />

      <TraitEditor
        {...mapHookActions(actionsActions)}
        name="Actions"
        traits={actions}
      />

      <TraitEditor
        {...mapHookActions(reactionsActions)}
        name="Reactions"
        traits={reactions}
      />

      <TraitEditor
        {...mapHookActions(legendaryActions)}
        name="Legendary Actions"
        traits={legendary}
        startText={legendaryStartText}
      />

      <hr />
      <button class={styles.saveButton} onClick={save}>
        save
      </button>
    </div>
  )
}

export default CreateCreature
