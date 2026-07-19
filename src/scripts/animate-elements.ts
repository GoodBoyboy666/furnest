import { animate } from 'motion'

type ElementTarget = Element | Element[] | NodeListOf<Element>
type ElementAnimate = (
  target: ElementTarget,
  keyframes: Record<string, unknown>,
  options?: Record<string, unknown>,
) => unknown

// Motion's current overloads are not inferred correctly by TypeScript 7 for DOM targets.
const animateElementTarget = animate as unknown as ElementAnimate

export function animateElements(
  target: ElementTarget,
  keyframes: Record<string, unknown>,
  options?: Record<string, unknown>,
) {
  return animateElementTarget(target, keyframes, options)
}
