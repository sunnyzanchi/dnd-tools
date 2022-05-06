import cx from 'classnames'
import empty from 'just-is-empty'
import { FunctionalComponent as FC } from 'preact'

import AbilityScores from './AbilityScores'
import { AbilityScores as AbScores, CreatureSize, CreatureType } from './types'
import styles from './ExpandedItem.module.scss'

type Trait = {
  description: string
  name: string
}

type Props = {
  actions?: Trait[]
  abilityScores: AbScores
  alignment: string
  legendaryActions?: {
    startText: string
    actions: Trait[]
  }
  name: string
  physicalTraits: {
    'Armor Class': string
    'Hit Points': string
    Speed: string
  }
  selected?: boolean
  shortTraits: {
    'Condition Immunities'?: string
    'Saving Throws'?: string
    Skills?: string
    'Damage Immunities'?: string
    'Damage Resistances'?: string
    'Damage Vulnerabilities'?: string
    Senses?: string
    Languages?: string
    Challenge: string
  }
  size: CreatureSize
  type: CreatureType
  traits: Trait[]
  onSelect: () => unknown
}

const TraitLine = ({ description, name }: Trait) => (
  <p class={styles.trait}>
    <span>{name} </span>
    {description}
  </p>
)

const ExpandedItem: FC<Props> = ({
  abilityScores,
  actions,
  alignment,
  legendaryActions,
  name,
  onSelect,
  physicalTraits,
  selected,
  shortTraits,
  size,
  traits,
  type,
}) => {
  return (
    <li
      class={cx(styles.listItem, selected && styles.selected)}
      key={name}
      onClick={onSelect}
    >
      <h2 class={styles.name}>{name}</h2>
      <button class={styles.addToInitiative}>add to initiative</button>
      <p class={styles.sizeType}>
        {size} {type}, {alignment}
      </p>

      <div class={styles.shortTraits}>
        {Object.entries(physicalTraits).map(([name, value]) => (
          <p class={styles.trait}>
            <span>{name}: </span>
            {value}
          </p>
        ))}
      </div>

      <AbilityScores {...abilityScores} />

      <div class={styles.shortTraits}>
        {Object.entries(shortTraits).map(([name, value]) => (
          <p class={styles.trait}>
            <span>{name}: </span>
            {value}
          </p>
        ))}
      </div>

      {!empty(traits) && (
        <>
          <hr />
          <div class={styles.traits}>
            {traits.map((trait) => (
              <TraitLine {...trait} />
            ))}
          </div>
        </>
      )}

      {!empty(actions) && (
        <>
          <hr />
          <div class={styles.actions}>
            <h3>Actions</h3>
            {actions!.map((action) => (
              <TraitLine {...action} />
            ))}
          </div>
        </>
      )}

      {!empty(legendaryActions) && (
        <div class={styles.legendaryActions}>
          <h3>Legendary Actions</h3>
          <p class={styles.trait}>{legendaryActions!.startText}</p>
          {legendaryActions!.actions.map((la) => (
            <TraitLine {...la} />
          ))}
        </div>
      )}
    </li>
  )
}

export default ExpandedItem
