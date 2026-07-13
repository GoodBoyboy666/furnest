import { animate, stagger } from 'motion'

export function initListPageAnimations(titleContainerId: string, listId: string) {
  requestAnimationFrame(() => {
    const container = document.getElementById(titleContainerId)
    if (container) {
      const items = container.querySelectorAll('.page-animate')
      animate(
        Array.from(items),
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.4, delay: stagger(0.1), easing: 'ease-out' }
      )
    }
  })

  const listEl = document.getElementById(listId)
  if (!listEl) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.children.length > 0) {
        entry.target.style.opacity = '1'
        animate(
          Array.from(entry.target.children),
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.5, delay: stagger(0.12), easing: 'ease-out' }
        )
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.05 })

  observer.observe(listEl)
}
