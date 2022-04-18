export const createRow = () => ({
  hp: NaN,
  initiative: NaN,
  name: '',
  notes: '',
})

export const createRows = (n: number) => {
  const rows = []

  for (let i = 0; i < n; i += 1) {
    rows.push(createRow())
  }

  return rows
}
