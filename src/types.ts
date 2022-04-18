export type Selectable<T> = T & {
  /**
   * `column` here is which cell in the row is selected.
   * pass nothing to deselect.
   */
  onSelect: (column?: number) => void
  selected: false | number
}

export type Updateable<T> = T & {
  onUpdate: (updated: T) => void
}

export type ValueOf<T> = T[keyof T]
