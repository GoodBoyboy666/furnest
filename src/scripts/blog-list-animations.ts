import { stagger } from 'motion'
import { animateElements } from './animate-elements'
import { completeMotionCandidates, initMotionPage, isMotionPending, markMotionPending } from './motion-handshake'

export function initBlogListAnimations() {
  const blogList = document.getElementById('blog-list')
  if (!blogList) return
  initMotionPage(blogList, (shouldAnimate) => {
    if (!shouldAnimate) return

    const paw = document.querySelector<HTMLElement>('.blog-paw')
    const label = document.getElementById('blog-label')
    const title = document.getElementById('blog-title')
    const line = document.getElementById('blog-line')
    if (paw) animateElements(paw, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.4, easing: 'ease-out' })
    if (label) animateElements(label, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, easing: 'ease-out' })
    if (title) animateElements(title, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: 0.1, easing: 'ease-out' })
    if (line) animateElements(line, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.6, delay: 0.2, easing: 'ease-out' })

    const cards = blogList.querySelectorAll<HTMLElement>('[data-animate]')
    markMotionPending(cards)
    cards.forEach((card) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(24px)'
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (cards.length > 0 && isMotionPending(cards[0])) {
            animateElements(
              Array.from(cards),
              { opacity: [0, 1], y: [24, 0] },
              { duration: 0.5, delay: stagger(0.1), easing: 'ease-out' }
            )
            completeMotionCandidates(cards)
          }
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    observer.observe(blogList)
  })
}
