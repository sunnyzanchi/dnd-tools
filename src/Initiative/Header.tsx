import { FunctionalComponent as FC } from 'preact'

type Props = {
  onSort: () => void
}

const Header: FC<Props> = ({ onSort }) => (
  <li class="row">
    <div class="cell">
      Initiative
      <button class="sort" onClick={onSort}>
        Sort
      </button>
    </div>
    <div class="cell">Name</div>
    <div class="cell">HP</div>
    <div class="cell">Notes</div>
  </li>
)

export default Header
