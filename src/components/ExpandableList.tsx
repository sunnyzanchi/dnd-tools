import { spring } from 'css-spring'
import { FunctionalComponent as FC } from 'preact'
import { MutableRef, useRef, useState } from 'preact/hooks'

import { useScreenSize } from 'src/hooks'

export type ItemComponent = FC<ItemProps>
type ItemProps = {
  expanded: boolean
  onCollapse: () => void
  onExpand: () => void
}

type Props = {
  className?: string
  containerRef: MutableRef<HTMLElement | null>
  items: ItemComponent[]
}

const slideDownKeyframes = (height: number): Keyframe[] =>
  spring(
    { transform: `translateY(${-height}px)` },
    { transform: 'translateY(0px)' },
    { precision: 2, damping: 21, stiffness: 200 }
  )

/**
 * a generic list with items that can be expanded and collapsed.
 * it expects an array of ItemComponents, which are
 * components that receive `expanded` and `onExpand` props.
 * downstream users are ultimately responsible
 * for differentiating between expanded and non-expanded
 * and rendering the appropriate component.
 */
const ExpandableList: FC<Props> = ({ className, containerRef, items }) => {
  const [expandedIndex, setExpanded] = useState<number | null>(null)
  const olRef = useRef<HTMLOListElement | null>(null)
  const [width] = useScreenSize()

  const scrollTo = (top: number) => {
    const args = {
      behavior: 'smooth',
      top,
    }

    // on mobile, the window is as tall as the content.
    // on desktop, the window is as tall as the screen,
    // and the containing section has overflow: scroll.
    if (width < 601) {
      window.scrollTo(args as ScrollToOptions)
    } else {
      // account for tabs at top.
      args.top -= 60
      containerRef.current?.scrollTo(args as ScrollToOptions)
    }
  }

  const collapse = () => setExpanded(null)

  /**
   * this function is kinda chunky,
   * but trying to slide down elements
   * below the newly expanded item in a `useEffect`
   * causes an intermediate state where they're
   * too far down, then a frame later they pop back up.
   * doing the slide here ensures it happens instantly.
   */
  const expand = (index: number) => {
    setExpanded(index)

    if (olRef.current == null || containerRef.current == null) return

    const lis = olRef.current.children
    const scrollTop =
      width < 601 ? window.scrollY : containerRef.current.scrollTop
    if (lis == null) return

    const { top } = lis[index].getBoundingClientRect()
    let scrollAmount = scrollTop + top
    if (expandedIndex) {
      const { height } = lis[expandedIndex].getBoundingClientRect()
      scrollAmount -= height
    }
    scrollTo(scrollAmount)

    const lisBelow = Array.prototype.slice.apply(lis, [
      index,
    ]) as unknown as HTMLCollection

    const { height } = lis[index].getBoundingClientRect()
    // TODO: Get height dynamically
    // this happens before the expanded item is even rendered,
    // so it might be tricky.
    const keyframes = Object.values(slideDownKeyframes(805 - 95))
    // duration should increase slightly as
    // the amount the items need to move increases.
    const duration = 480 + (0.012 * height) ** 2
    // we don't animate every element after the expanding item,
    // `.animate` is pretty slow and doing a lot is a huge perf hit.
    // 10 should be enough to get to the bottom of the screen,
    // and we don't want to go past the last item.
    const maxIndex = Math.min(lisBelow.length, index + 10)

    for (let i = 1; i < maxIndex; i += 1) {
      lisBelow[i].animate(keyframes, {
        easing: 'linear',
        duration,
        fill: 'backwards',
      })
    }
  }

  return (
    <ol class={className} ref={olRef}>
      {items.map((Item, index) => (
        <Item
          expanded={index === expandedIndex}
          onCollapse={collapse}
          onExpand={() => expand(index)}
        />
      ))}
    </ol>
  )
}

export default ExpandableList
