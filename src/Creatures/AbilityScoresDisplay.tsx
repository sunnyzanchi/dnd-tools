import { AbilityScores } from './types'
import './AbilityScoresDisplay.css'

const modifier = (abilityScore: number) => Math.floor(abilityScore / 2) - 5

const AbilityScoresDisplay = (abilityScores: AbilityScores) => (
  <ol class="ability-scores">
    {Object.entries(abilityScores).map(([name, score]) => (
      <li class="ability-score">
        <p class="ability-score-name">{name}</p>
        <p class="ability-score-value">
          {score}{' '}
          <span class="ability-score-modifier">
            ({modifier(score) >= 0 && '+'}
            {modifier(score)})
          </span>
        </p>
      </li>
    ))}
  </ol>
)

export default AbilityScoresDisplay
