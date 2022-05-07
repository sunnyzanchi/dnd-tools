import cx from 'classnames'
import empty from 'just-is-empty'
import { FunctionalComponent as FC } from 'preact'

import AbilityScores from './AbilityScores'
import {
  AbilityScores as AbScores,
  CreatureSize,
  CreatureType,
  Trait,
} from './types'
import styles from './ExpandedItem.module.scss'

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
  reactions: Trait[]
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
  onAdd: () => unknown
  onCollapse: () => unknown
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
  onAdd,
  onCollapse,
  physicalTraits,
  reactions,
  selected,
  shortTraits,
  size,
  traits,
  type,
}) => {
  return (
    <li class={cx(styles.listItem, { selected })} key={name}>
      <div class={styles.titleGroup} onClick={onCollapse}>
        <h2 class={styles.name}>{name}</h2>
        <div class={styles.buttonGroup}>
          <button class={styles.addToInitiative} onClick={onAdd}>
            add
          </button>
          {/* <button class="collapse" onClick={onCollapse}>
            col
          </button> */}
        </div>
        <p class={styles.sizeType}>
          {size} {type}, {alignment}
        </p>
      </div>

      <section class={styles.shortTraits}>
        {Object.entries(physicalTraits).map(([name, value]) => (
          <p class={styles.trait}>
            <span>{name}: </span>
            {value}
          </p>
        ))}
      </section>

      <AbilityScores {...abilityScores} />

      <section class={styles.shortTraits}>
        {Object.entries(shortTraits).map(([name, value]) => (
          <p class={styles.trait}>
            <span>{name}: </span>
            {value}
          </p>
        ))}
      </section>

      {!empty(traits) && (
        <>
          <hr />
          <section class={styles.traits}>
            {traits.map((trait) => (
              <TraitLine {...trait} />
            ))}
          </section>
        </>
      )}

      {!empty(actions) && (
        <>
          <hr />
          <section class={styles.actions}>
            <h3>Actions</h3>
            {actions!.map((action) => (
              <TraitLine {...action} />
            ))}
          </section>
        </>
      )}

      {!empty(reactions) && (
        <>
          <hr />
          <section class={styles.reactions}>
            <h3>Reactions</h3>
            {reactions!.map((action) => (
              <TraitLine {...action} />
            ))}
          </section>
        </>
      )}

      {!empty(legendaryActions) && (
        <>
          <hr />
          <section className={styles.legendaryActions}>
            <h3>Legendary Actions</h3>
            <p class={styles.trait}>{legendaryActions!.startText}</p>
            {legendaryActions!.actions.map((la) => (
              <TraitLine {...la} />
            ))}
          </section>
        </>
      )}
    </li>
  )
}

export default ExpandedItem
