import cx from 'classnames'
import { FunctionalComponent as FC } from 'preact'

import styles from './TabbedContainer.module.scss'

type Props = {
  currentTab: number
  children: JSX.Element[]
  onChange: (i: number) => unknown
  onClickInfo: () => unknown
  tabs: Tab[]
}

type Tab = {
  name: string
}

type TabsProps = {
  currentTab: number
  onChange: (i: number) => unknown
  onClickInfo: () => unknown
  tabs: Tab[]
}

const Tabs: FC<TabsProps> = ({ currentTab, onChange, onClickInfo, tabs }) => (
  <nav class={styles.nav}>
    <ol class={styles.tabs} role="tablist">
      {tabs.map((tab, i) => (
        <li
          class={cx(styles.tab, i === currentTab && styles.selectedTab)}
          onClick={() => onChange(i)}
          id={`${tab.name}-tab`}
          role="tab"
        >
          {tab.name}
        </li>
      ))}
    </ol>

    <button aria-label="About" class={styles.infoButton} onClick={onClickInfo}>
      ?
    </button>
  </nav>
)

const TabbedContainer: FC<Props> = ({ children, ...rest }) => {
  return (
    <div class={styles.container}>
      <Tabs {...rest} />
      {children?.find((t, i) => i === rest.currentTab)}
    </div>
  )
}

export default TabbedContainer
