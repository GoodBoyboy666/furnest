import { animate, stagger } from 'motion'

export function initListPageAnimations(titleId: string, listId: string) {
  requestAnimationFrame(() => {
    animate(
      `#${titleId}`,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, easing: 'ease-out' }
    )
  })

  const listEl = document.getElementById(listId)
  if (!listEl) return

  Array.from(listEl.children).forEach(c => {
    c.style.opacity = '0'
    c.style.transform = 'translateY(20px)'
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.children.length > 0) {
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
