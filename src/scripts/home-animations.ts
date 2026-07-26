import { stagger } from 'motion'
import { animateElements } from './animate-elements'
import { completeMotionCandidates, initMotionPage, isMotionPending, markMotionPending } from './motion-handshake'

export function initHomeAnimations() {
  const heroBg = document.getElementById('hero-bg')
  if (!heroBg) return
  initMotionPage(heroBg, (shouldAnimate) => {
    if (!shouldAnimate) return

    const heroEars = document.querySelector<HTMLElement>('.hero-ears')
    const heroCreation = document.getElementById('hero-creation')
    const heroTitle = document.getElementById('hero-title')
    const heroSubtitle = document.getElementById('hero-subtitle')
    animateElements(heroBg, { opacity: [0, 1] }, { duration: 0.6, easing: 'ease-out' })
    if (heroEars) animateElements(heroEars, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.4, easing: 'ease-out' })
    if (heroCreation) animateElements(heroCreation, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.4, delay: 0.1, easing: 'ease-out' })
    if (heroTitle) animateElements(heroTitle, { opacity: [0, 1], y: [40, 0] }, { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] })
    if (heroSubtitle) animateElements(heroSubtitle, { opacity: [0, 1], y: [24, 0] }, { duration: 0.4, delay: 0.15, easing: [0.25, 0.46, 0.45, 0.94] })

    const boardEl = document.getElementById('board-heading')
    const cardGrid = document.getElementById('card-grid')
    const footerEl = document.querySelector('footer')

    if (boardEl) {
      const boardItems = boardEl.querySelectorAll<HTMLElement>('.board-animate, .board-line')
      markMotionPending(boardItems)
      boardEl.querySelectorAll<HTMLElement>('.board-animate').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
      })
      const bl = boardEl.querySelector<HTMLElement>('.board-line')
      if (bl) { bl.style.opacity = '0'; bl.style.transform = 'scaleX(0)' }
    }
    if (cardGrid) {
      const cards = Array.from(cardGrid.children) as HTMLElement[]
      markMotionPending(cards)
      cards.forEach((c) => {
        c.style.opacity = '0'
        c.style.transform = 'translateY(32px)'
      })
    }
    if (footerEl) {
      const footerItems = (Array.from(footerEl.children) as HTMLElement[])
        .filter((child) => !child.classList.contains('footer-boundary'))
      markMotionPending(footerItems)
      footerItems.forEach((c) => {
        if (!c.classList.contains('footer-line')) {
          c.style.opacity = '0'
        }
      })
      const fl = footerEl.querySelector<HTMLElement>('.footer-line')
      if (fl) { fl.style.opacity = '0'; fl.style.transform = 'scaleX(0)' }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === boardEl) {
            const items = entry.target.querySelectorAll<HTMLElement>('.board-animate')
            const boardLine = entry.target.querySelector<HTMLElement>('.board-line')
            if (items.length === 0 || !isMotionPending(items[0])) {
              observer.unobserve(entry.target)
              return
            }
            animateElements(
              Array.from(items),
              { opacity: [0, 1], y: [24, 0] },
              { duration: 0.6, delay: stagger(0.12), easing: 'ease-out' }
            )
            if (boardLine) {
              animateElements(boardLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.7, delay: 0.24, easing: 'ease-out' })
            }
            completeMotionCandidates(boardLine ? [...items, boardLine] : items)
          }
          if (entry.target === cardGrid && cardGrid.children.length > 0 && isMotionPending(cardGrid.children[0] as HTMLElement)) {
            const cards = Array.from(cardGrid.children) as HTMLElement[]
            animateElements(
              cards,
              { opacity: [0, 1], y: [32, 0] },
              { duration: 0.6, delay: stagger(0.1), easing: 'ease-out' }
            )
            completeMotionCandidates(cards)
          }
          if (entry.target === footerEl) {
            const footerItems = (Array.from(footerEl.children) as HTMLElement[])
              .filter(c => !c.classList.contains('footer-boundary'))
            if (footerItems.length === 0 || !isMotionPending(footerItems[0])) {
              observer.unobserve(entry.target)
              return
            }
            const footerLine = footerEl.querySelector<HTMLElement>('.footer-line')
            if (footerLine) {
              animateElements(footerLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 1.2, easing: 'ease-out' })
            }
            animateElements(
              (Array.from(footerEl.children) as HTMLElement[]).filter(c => !c.classList.contains('footer-line') && !c.classList.contains('footer-boundary')),
              { opacity: [0, 1] },
              { duration: 1.5, delay: stagger(0.4), easing: 'ease-out' }
            )
            completeMotionCandidates(footerItems)
          }
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    if (boardEl) observer.observe(boardEl)
    if (cardGrid) observer.observe(cardGrid)
    if (footerEl) observer.observe(footerEl)
  })
}
