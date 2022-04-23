import creatures from './creatures.json'

export type AbilityScores = {
  STR: number
  DEX: number
  CON: number
  INT: number
  WIS: number
  CHA: number
}

export type Creature = typeof creatures[number]

export type CreatureSize =
  | 'Tiny'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'Huge'
  | 'Gargantuan'

export type CreatureType =
  | 'aberration'
  | 'beast'
  | 'celestial'
  | 'dragon'
  | 'elemental'
  | 'fey'
  | 'fiend'
  | 'giant'
  | 'humanoid'
  | 'monstrosity'
  | 'ooze'
  | 'plant'
  | 'undead'
