import { stagger } from 'motion'
import { animateElements } from './animate-elements'
import { completeMotionCandidates, initMotionPage, isMotionPending, markMotionPending } from './motion-handshake'

export function initListPageAnimations(titleContainerId: string, listId: string) {
  const container = document.getElementById(titleContainerId)
  const listEl = document.getElementById(listId)
  if (!container || !listEl) return

  initMotionPage(container, (shouldAnimate) => {
    if (!shouldAnimate) return

    const accent = container.querySelector<HTMLElement>('.page-accent')
    const items = container.querySelectorAll<HTMLElement>('.page-animate')
    if (accent) {
      animateElements(accent, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.4, easing: 'ease-out' })
    }
    animateElements(
      Array.from(items),
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, delay: stagger(0.1), easing: 'ease-out' }
    )

    const listItems = Array.from(listEl.children) as HTMLElement[]
    markMotionPending(listItems)
    listItems.forEach((item) => {
      item.style.opacity = '0'
      item.style.transform = 'translateY(20px)'
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && listItems.length > 0 && isMotionPending(listItems[0])) {
          animateElements(
            listItems,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.5, delay: stagger(0.12), easing: 'ease-out' }
          )
          completeMotionCandidates(listItems)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05 })

    observer.observe(listEl)
  })
}
