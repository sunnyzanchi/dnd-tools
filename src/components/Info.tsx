import { FunctionalComponent as FC } from 'preact'
import styles from './Info.module.scss'

type Props = {
  onClose: () => unknown
}

const X = '\u2715'

/**
 * displays a `<dialog>` with info about the app
 * and some future features, and links to the source.
 */
const Info: FC<Props> = ({ onClose }) => (
  <div
    class={styles.backdrop}
    onClick={(e) => {
      if (e.target !== e.currentTarget) return
      onClose()
    }}
  >
    <dialog class={styles.dialog} open>
      <button aria-label="Close" onClick={onClose}>
        {X}
      </button>
      <h1>5e D&D tools 🧙 🐉</h1>
      <p>
        this is an app to help dungeon masters. it is a reference with stats for
        creatures, descriptions for spells and magic items, and a tracker for
        initiative with auto-math. just type "-4" or "+7" and it'll take care of
        it. (initiative is a little buggy)
      </p>
      <p>
        i have plans to add:
        <ul>
          <li>a place for notes</li>
          <li>a name generator</li>
          <li>filtering for creatures/spells/items</li>
        </ul>
      </p>
      <p>
        i also want to implement{' '}
        <a href="https://remotestorage.io/">remoteStorage</a> to make this an{' '}
        <a href="https://unhosted.org/">unhosted</a> app. eyeball warning:
        neither site respects dark mode preferences
      </p>
      <p>
        you can find the source code{' '}
        <a href="https://codeberg.org/sunny/dnd-tools">here</a>. PRs are
        welcome. if you want to contribute, open an issue on Codeberg and i'd be
        happy to discuss it 😄
      </p>
    </dialog>
  </div>
)

export default Info
