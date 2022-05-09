export type Item = {
  attunement: boolean
  description: Array<unknown>
  name: string
  rarity: Rarity
  type: ItemType
}

type Rarity = 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary'

type ItemType =
  | 'Armor'
  | 'Weapon'
  | 'Wondrous item'
  | 'Rod'
  | 'Potion'
  | 'Ring'
  | 'Scroll'
  | 'Staff'
  | 'Wand'
