/**
 * transforms the JSON at
 * https://github.com/BTMorton/dnd-5e-srd/blob/master/json/10%20magic%20items.json
 * into JSON with more structured data.
 *
 * expects an input file named `items_in.json` in the CWD.
 */
import compose from 'compose-function'
import { promises as fs } from 'fs'
import { dropLast, map, merge, omit, pick, set } from 'remeda'

const RARITIES = ['common', 'uncommon', 'rare', 'very rare', 'legendary']
const rarity = (metaStr = '') =>
  RARITIES.find((st) => {
    if (!metaStr.includes) console.log(metaStr)
    return metaStr.includes(st)
  })

const parseMeta = (metaStr = '') => {
  metaStr.split || console.log(metaStr)
  const parts = metaStr.split(',')
  const rest = parts.slice(0, -1).join(',')
  const type = rest.match(/([a-zA-Z\s]+)(?:\(|,)?/)?.[1]?.trim()

  return {
    attunement: metaStr.includes('attunement'),
    type,
    rarity: rarity(metaStr),
  }
}

const itemJson = await fs.readFile('./items_in.json')
// everything in the source json is in this one property.
const itemsObj = JSON.parse(itemJson)['Magic Items']
const items = compose(
  // remove the source `content` field,
  // `description` is used instead.
  map(omit(['content'])),
  map((item) => set(item, 'description', item.content)),
  // the three different color bags are properties
  // on Bag of Tricks at the same level as `content`.
  // this moves them to be items in the `content` array.
  (itemsMap) => {
    const COLORS = [
      'Gray Bag of Tricks',
      'Rust Bag of Tricks',
      'Tan Bag of Tricks',
    ]
    const bot = itemsMap.get('Bag of Tricks')
    // all we want is an object with the different color bags.
    const allColors = pick(bot, COLORS)
    const colors = Object.entries(allColors).map(([color, tableObj]) => ({
      [color]: tableObj,
    }))
    const updatedBot = {
      ...omit(bot, COLORS),
      content: [...bot.content, ...colors],
    }
    itemsMap.set('Bag of Tricks', updatedBot)

    return Array.from(itemsMap.values())
  },
  (items) => new Map(items.map((i) => [i.name, i])),
  // remove the meta info
  map((item) => ({
    ...item,
    content: item.content?.slice(1),
  })),
  // with AOTC and COFF out of the way,
  // `content[0]` is safely a string with
  // meta information about the item.
  map((item) => merge(item, parseMeta(item.content[0]))),
  // update AOTC and COFF with their
  // table and additional description, respectively.
  ([itemsMap, aotclObj, coffContent]) => {
    const aotc = itemsMap.get('Apparatus of the Crab')
    const cof = itemsMap.get('Cube of Force')
    // the other tables in the source are in objects
    // inside of the `content` array.
    const updatedAotc = { ...aotc, content: [...aotc.content, aotclObj] }
    const updatedCof = { ...cof, content: [...cof.content, ...coffContent] }
    itemsMap.set('Apparatus of the Crab', updatedAotc)
    itemsMap.set('Cube of Force', updatedCof)
    itemsMap.delete('Apparatus of the Crab Levers')
    itemsMap.delete('Cube of Force Faces')

    return Array.from(itemsMap.values())
  },
  // the source has Apparatus of the Crab Levers at
  // the same level as the magic items,
  // but it is just more descriptive text for
  // Apparatus of the Crab.
  // Cube of Force Faces is similar.
  (items) => {
    const itemsMap = new Map(items.map((i) => [i.name, i]))
    const aotcl = itemsMap.get('Apparatus of the Crab Levers')
    const coff = itemsMap.get('Cube of Force Faces')

    // key on name real quick so we can update
    // these guys' parent items more easily.
    return [itemsMap, omit(aotcl, ['name']), coff.content]
  },
  // in the source, each magic item is keyed on its name,
  // but we just want a list of objects.
  map(([name, data]) => ({
    name,
    ...data,
  })),
  // last two items in the source are an artifact and
  // information about sentient magic items.
  dropLast(2),
  Object.entries,
  // the top level 'Magic Items' field has this
  // `content` field which is just preface text from the SRD.
  omit(['content'])
)(itemsObj)

fs.writeFile('./items.json', JSON.stringify(items, null, 2))
