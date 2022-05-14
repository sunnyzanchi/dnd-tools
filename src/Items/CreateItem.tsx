import cx from 'classnames'
import compose from 'compose-function'
import { FunctionalComponent as FC } from 'preact'
import { useState } from 'preact/hooks'

import { getInputVal } from 'src/Creatures/utils'
import { useBool } from 'src/hooks'
import styles from 'src/Creatures/Create.module.scss'
import { Item } from './types'

const RARITIES = ['common', 'uncommon', 'rare', 'very rare', 'legendary']
const TYPES = [
  'Armor',
  'Potion',
  'Ring',
  'Rod',
  'Scroll',
  'Staff',
  'Wand',
  'Weapon',
  'Wondrous item',
]

type Props = {
  onSave: (item: Item) => unknown
}

const CreateItem: FC<Props> = ({ onSave }) => {
  const [attunement, { toggle: toggleAttunement }] = useBool(false)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [rarity, setRarity] = useState<Item['rarity']>('common')
  const [type, setType] = useState<Item['type']>('Armor')

  const save = () =>
    onSave({
      attunement,
      name,
      description: description.split('\n'),
      type,
      rarity,
    })

  const title = name || 'New Item'
  return (
    <div class={cx(styles.container, styles.itemEditor)}>
      <h2>{title}</h2>
      <input onInput={compose(setName, getInputVal)} placeholder="name" />
      <label for="rarity">rarity</label>
      <select
        id="rarity"
        onChange={compose(setRarity, getInputVal)}
        value={rarity}
      >
        {RARITIES.map((rarity) => (
          <option>{rarity}</option>
        ))}
      </select>
      <label for="type">type</label>
      <select id="type" onChange={compose(setType, getInputVal)} value={type}>
        {TYPES.map((type) => (
          <option>{type}</option>
        ))}
      </select>
      <label for="attunement">requires attunement</label>
      <input
        id="attunement"
        onChange={toggleAttunement}
        type="checkbox"
        checked={attunement}
      />
      <textarea
        class={styles.description}
        onInput={compose(setDescription, getInputVal)}
        placeholder="description (markdown is supported)"
      />

      <button class={styles.saveButton} onClick={save}>
        save
      </button>
    </div>
  )
}

export default CreateItem
