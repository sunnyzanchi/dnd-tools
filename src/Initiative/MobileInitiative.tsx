import isEmpty from 'just-is-empty'
import { FunctionalComponent as FC, VNode } from 'preact'
import { partition } from 'remeda'

import { Actions as RowActions, RowState } from 'src/hooks/useRows'
import styles from './MobileInitiative.module.scss'
import { RowValue } from './Row'
import { createRow } from './utils'

type Props = {
  rowActions: RowActions
  rows: RowState
}

const Cards: FC<{ rows: RowState }> = ({ rows }) => {
  const [greaterThan20, lessThan20] = partition(
    rows.map(
      (r) => [r.initiative, <InitiativeCard {...r} />] as [number, VNode]
    ),
    ([i, card]) => i > 20
  )

  return (
    <>
      {[
        greaterThan20.map(([, card]) => card),
        <InitiativeCount20 />,
        lessThan20.map(([, card]) => card),
      ].flat()}
    </>
  )
}

const InitiativeCount20 = () => (
  <li class={styles.initiative20}>
    <hr />
    initiative count 20
    <hr />
  </li>
)

const InitiativeCard: FC<RowValue> = ({ hp, initiative, name, notes }) => (
  <li class={styles.card}>
    <h3>{initiative}:</h3>
    <h2>{name}</h2>
    <p>HP: {Boolean(hp) && hp}</p>
    <aside>{notes}</aside>
  </li>
)

/**
 * The desktop interface for initiative doesn't work
 * very well for mobile — there just isn't enough
 * screen space for a spreadsheet to be ergonomic.
 * Mobile uses a card based approach.
 * Once the initial values for Name and Initiative
 * are entered, only the HP and Notes for an item
 * can be edited.
 */
const MobileInitiative: FC<Props> = ({ rows, rowActions }) => {
  const add = () => {
    rowActions.set([...rows, createRow()])
  }

  return (
    <section class={styles.container}>
      <h1>Initiative</h1>
      {isEmpty(rows) ? (
        <div class={styles.emptyState}>
          <p>add a creature to initiative to get started</p>
        </div>
      ) : (
        <ol class={styles.cards}>
          <Cards rows={rows} />
        </ol>
      )}
      <button class={styles.fab} onClick={add}>
        add
      </button>
    </section>
  )
}

export default MobileInitiative
