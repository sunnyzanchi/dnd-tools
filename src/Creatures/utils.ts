import compose from 'compose-function'
import { first } from 'remeda'

import { Creature } from './types'

/**
 * expects an `Event`,
 * returns `e.currentTarget.value`.
 */
export const getInputVal = (
  e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.value

/**
 * get the average HP for a creature.
 *
 * @example
 * ```
 *   const c = { ['Hit Points']: '9 (2d8)' }
 *   flatHp(c) // 9
 * ```
 */
export const flatHp: (c: Creature) => number = compose(
  Number,
  first,
  (hpString: string) => hpString.split(' '),
  (c) => c['Hit Points']
)
