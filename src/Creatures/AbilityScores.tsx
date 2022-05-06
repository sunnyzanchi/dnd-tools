import { AbilityScores as AbScores } from './types'

type Props = {
  editable?: boolean
  onUpdate?: (name: keyof AbScores, newValue: number) => unknown
} & AbScores

const modifier = (abilityScore: number) => Math.floor(abilityScore / 2) - 5

const AbilityScores = ({ editable, onUpdate, ...abilityScores }: Props) => (
  <ol class="ability-scores">
    {Object.entries(abilityScores).map(([name, score]) => (
      <li class="ability-score">
        <p class="ability-score-name">{name}</p>
        {!editable && <p class="ability-score-value">{score}</p>}
        {editable && (
          <input
            onInput={(e) =>
              onUpdate?.(name as keyof AbScores, Number(e.currentTarget.value))
            }
            value={score}
          />
        )}
        <p class="ability-scores-modifier">
          ({modifier(score) >= 0 && '+'}
          {modifier(score)})
        </p>
      </li>
    ))}
  </ol>
)

export default AbilityScores
