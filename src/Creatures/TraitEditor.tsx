import compose from 'compose-function'
import { FunctionalComponent as FC } from 'preact'
import { mapKeys } from 'remeda'

import styles from './Create.module.scss'
import { Trait } from './types'
import { Actions } from './useTraitEditor'
import { getInputVal } from './utils'

type ActionProps = {
  onAdd: () => unknown
  onUpdateName: (i: number) => (newVal: string) => void
  onUpdateDescription: (i: number) => (newVal: string) => void
  onUpdateStartText?: (newVal: string) => void
}

type Props = ActionProps & {
  /**
   * name of the type of traits.
   * used for the add button and title
   */
  name: string
  /**
   * hide the title
   */
  noTitle?: boolean
  startText?: string
  traits: Trait[]
}

/**
 * transform the names of the actions exported from the
 * `useTraitEditor` hook to the props this component expects.
 */
export const mapHookActions = (actions: Actions): ActionProps =>
  mapKeys(
    actions,
    (key) =>
      ({
        add: 'onAdd',
        setDesc: 'onUpdateDescription',
        setName: 'onUpdateName',
        setStartText: 'onUpdateStartText',
      }[key] as keyof ActionProps)
  ) as ActionProps

const singularize = (str: string) => str.slice(0, -1)

const TraitEditor: FC<Props> = ({
  name,
  noTitle = false,
  onAdd,
  onUpdateName,
  onUpdateDescription,
  onUpdateStartText,
  startText,
  traits,
}) => (
  <section class={styles.traitEditor}>
    <hr />
    {!noTitle && <h3>{name}</h3>}
    {onUpdateStartText && (
      <textarea
        onChange={compose(onUpdateStartText, getInputVal)}
        placeholder="start text"
        value={startText}
      />
    )}
    {traits.map(({ name, description }, i) => (
      <div class={styles.longTrait} key={i}>
        <input
          onChange={compose(onUpdateName(i), getInputVal)}
          placeholder="name"
          value={name}
        />
        <textarea
          onChange={compose(onUpdateDescription(i), getInputVal)}
          placeholder="description"
          value={description}
        />
      </div>
    ))}
    <button class={styles.addButton} onClick={onAdd}>
      add {singularize(name)}
    </button>
  </section>
)

export default TraitEditor
