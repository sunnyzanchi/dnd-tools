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
import { useEffect, useRef } from 'preact/hooks'

const HAMBURGER = '☰'

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
  scrollTo: (top: number) => void
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

export const TraitLine = ({ description, name }: Trait) => (
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
  scrollTo,
  selected,
  shortTraits,
  size,
  traits,
  type,
}) => {
  const liRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if (!liRef.current) return

    const { offsetTop: top } = liRef.current

    scrollTo(top)
    // if we only depend on `liRef.current`,
    // expanding an item directly below or
    // above the currently expanded item
    // won't trigger the scroll behavior
    // since Preact reuses the DOM node.
  }, [liRef.current, name])

  return (
    <li class={cx(styles.listItem, { selected })} key={name} ref={liRef}>
      <div class={styles.titleGroup} onClick={onCollapse}>
        <h2 class={styles.name}>{name}</h2>
        {/* <div class={styles.buttonGroup}>
          <button class={styles.addToInitiative} onClick={onAdd}>
            {HAMBURGER}
          </button>
          <button class="collapse" onClick={onCollapse}>
            col
          </button>
        </div> */}
        <p class={styles.sizeType}>
          {size} {type}, {alignment}
        </p>
      </div>

      <div class={styles.fadeIn}>
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
      </div>
    </li>
  )
}

export default ExpandedItem
