import { stagger } from 'motion'
import { animateElements } from './animate-elements'

export function initListPageAnimations(titleContainerId: string, listId: string) {
  const container = document.getElementById(titleContainerId)
  const listEl = document.getElementById(listId)
  if (!container || !listEl || container.dataset.animationInitialized === 'true') return
  container.dataset.animationInitialized = 'true'

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.querySelectorAll<HTMLElement>('.page-animate').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    const accent = container.querySelector<HTMLElement>('.page-accent')
    if (accent) {
      accent.style.opacity = '1'
      accent.style.transform = 'none'
    }
    listEl.style.opacity = '1'
    Array.from(listEl.children).forEach((child) => {
      const el = child as HTMLElement
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  requestAnimationFrame(() => {
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
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.children.length > 0) {
        const target = entry.target as HTMLElement
        target.style.opacity = '1'
        animateElements(
          Array.from(target.children) as HTMLElement[],
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.5, delay: stagger(0.12), easing: 'ease-out' }
        )
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.05 })

  observer.observe(listEl)
}
