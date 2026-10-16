import { useCallback, useLayoutEffect, useRef } from 'react'

const DURATION = 320
const EASING = 'cubic-bezier(0.2, 0.7, 0.2, 1)'

/**
 * Animates children of `ref` (marked with data-flip-id) from where they were when
 * `capture()` was called to where the next render puts them.
 */
export function useFlip(ref) {
  const before = useRef(null)

  const capture = useCallback(() => {
    const el = ref.current
    if (!el) return
    before.current = new Map(
      [...el.children].map((child) => [
        child.dataset.flipId,
        { x: child.offsetLeft, y: child.offsetTop },
      ])
    )
  }, [ref])

  useLayoutEffect(() => {
    const el = ref.current
    const start = before.current
    if (!el || !start) return
    before.current = null
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    for (const child of el.children) {
      const from = start.get(child.dataset.flipId)
      if (!from) continue
      const dx = from.x - child.offsetLeft
      const dy = from.y - child.offsetTop
      if (!dx && !dy) continue
      child.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: DURATION, easing: EASING }
      )
    }
  })

  return capture
}
