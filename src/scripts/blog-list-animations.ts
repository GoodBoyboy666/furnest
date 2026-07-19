import { stagger } from 'motion'
import { animateElements } from './animate-elements'

export function initBlogListAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLElement>('#blog-label, #blog-title, #blog-line, [data-animate]').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  requestAnimationFrame(() => {
    const label = document.getElementById('blog-label')
    const title = document.getElementById('blog-title')
    const line = document.getElementById('blog-line')
    if (label) animateElements(label, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, easing: 'ease-out' })
    if (title) animateElements(title, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: 0.1, easing: 'ease-out' })
    if (line) animateElements(line, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.6, delay: 0.2, easing: 'ease-out' })
  })

  const blogList = document.getElementById('blog-list')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll<HTMLElement>('[data-animate]')
        if (cards.length > 0) {
          animateElements(
            Array.from(cards),
            { opacity: [0, 1], y: [24, 0] },
            { duration: 0.5, delay: stagger(0.1), easing: 'ease-out' }
          )
        }
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  if (blogList) observer.observe(blogList)
}
