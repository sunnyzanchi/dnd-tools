export type DescriptionTable = {
  table: {
    [key: string]: string[]
  }
}
// i think this is only used for Bag of Tricks.
export type Section = {
  [header: string]: DescriptionTable
}

type BulletPoints = string[]
export type Description = Array<
  string | DescriptionTable | BulletPoints | Section
>
export type Item = {
  attunement: boolean
  description: Description
  name: string
  rarity: Rarity
  type: ItemType
}

type Rarity = 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary'

type ItemType =
  | 'Armor'
  | 'Potion'
  | 'Ring'
  | 'Rod'
  | 'Scroll'
  | 'Staff'
  | 'Wand'
  | 'Weapon'
  | 'Wondrous item'

export const assertUnreachable = (x: never): never => {
  throw new Error("Didn't expect to get here")
}
