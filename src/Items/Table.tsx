import cx from 'classnames'
import { FunctionalComponent as FC } from 'preact'
import { range } from 'remeda'

import styles from './Table.module.scss'

type Props = {
  table: {
    [header: string]: string[]
  }
}

/**
 * some columns are only numbers,
 * so we should right align them.
 */
const allNumbers = (column: string[]) =>
  // @ts-expect-error `cell` is a string but
  // isNaN tries to convert it to a number.
  column.every((cell) => !isNaN(cell))

const Table: FC<Props> = ({ table }) => {
  const rows: number = Object.values(table)
    .map((column) => column.length)
    .reduce((maxLength, length) => Math.max(maxLength, length), -Infinity)

  return (
    <table class={styles.table}>
      <thead>
        <tr>
          {Object.keys(table).map((heading) => (
            <th>{heading}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {range(0, rows).map((row) => (
          <tr>
            {Object.values(table).map((column) => (
              <td class={cx(allNumbers(column) && styles.number)}>
                {column[row]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
