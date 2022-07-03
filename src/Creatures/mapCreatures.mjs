/**
 * transforms the JSON at
 * https://gist.github.com/tkfu/9819e4ac6d529e225e9fc58b358c3479
 * into JSON with more structured data without
 * some redundant fields (ie STR_mod can be derived from STR).
 *
 * expects an input file named 'creatures_in.json' in the CWD.
 */
import compose from 'compose-function'
import { promises as fs } from 'fs'
import _ from 'lodash/fp.js'
import { parse } from 'node-html-parser'

const creatureJson = await fs.readFile('./creatures_in.json')
const creatures = JSON.parse(creatureJson)
const spellcastingRegex =
  /^(?:At will|\d\/day|Cantrips|[1-9](?:st|nd|rd|th) level)/

const mapProp = (prop, fn) => (obj) => ({
  ...obj,
  [prop]: fn(obj[prop]),
})

/**
 * need to have a root element,
 * the source has unwrapped sibling nodes.
 */
const parseHtml = (str = '') => parse(`<div>${str}</div>`)

const spellcastingDesc = (html) =>
  html
    .querySelector('div')
    .childNodes.filter((cn) => spellcastingRegex.test(cn.innerText))
    .map((cn) => cn.innerText)
    .join('\n')

// <p> tags, like the ones in "Actions", sometimes have <em>
// tags which contain the name of the feature.
// the rest of the <p> tag is the description.
// this function mutates its argument `p`.
const splitP = (p) => {
  const em = p.querySelector('em')
  p.removeChild(em)

  return {
    description: p.innerText.trim(),
    name: em.innerText.trim(),
  }
}
const transformActions = compose((html) => {
  const ps = html.querySelectorAll('p')
  const newPs = []
  let i = 0
  let newP
  while (ps[i] != null) {
    newP = ps[i]
    const hasNext = ps[i + 1] != null
    const isNextTrait = Boolean(ps[i + 1]?.querySelector('em'))

    if (hasNext && !isNextTrait) {
      newP.appendChild(ps[i + 1])
      ps.splice(i + 1, 1)
    } else {
      newPs.push(newP)
      i += 1
    }
  }

  return ps.map(splitP)
}, parseHtml)
const transformLegendaryActions = compose((html) => {
  const p = html.querySelectorAll('p')
  if (p.length === 0) return undefined
  const startText = p[0].innerText.trim()

  return {
    startText,
    actions: p.slice(1).map(splitP),
  }
}, parseHtml)
const transformReactions = compose((html) => {
  const ps = html.querySelectorAll('p')
  const reactions = ps.map((p) => splitP(p, true))

  return reactions
}, parseHtml)
const transformTraits = compose(
  (html) =>
    html
      .querySelectorAll('p')
      .filter((p) => p.childNodes.some((cn) => cn.rawTagName === 'em'))
      .map(
        compose(
          mapProp('description', (desc) =>
            desc.includes('Spellcasting')
              ? `${desc}\n\n${spellcastingDesc(html)}`
              : desc
          ),
          splitP
        )
      ),
  parseHtml
)

const alter = compose(
  mapProp('Reactions', transformReactions),
  mapProp('Legendary Actions', transformLegendaryActions),
  mapProp('Actions', transformActions),
  mapProp('Traits', transformTraits),
  _.omit([
    'STR_mod',
    'DEX_mod',
    'CON_mod',
    'INT_mod',
    'WIS_mod',
    'CHA_mod',
    'img_url',
  ])
)
fs.writeFile('./creatures.json', JSON.stringify(creatures.map(alter), null, 2))
