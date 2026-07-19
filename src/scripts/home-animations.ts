import { stagger } from 'motion'
import { animateElements } from './animate-elements'

export function initHomeAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    document.querySelectorAll<HTMLElement>('#hero-bg, #hero-title, #hero-subtitle, .board-animate, .board-line, #card-grid > *, footer > :not(.footer-boundary)').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  requestAnimationFrame(() => {
    const heroBg = document.getElementById('hero-bg')
    const heroTitle = document.getElementById('hero-title')
    const heroSubtitle = document.getElementById('hero-subtitle')
    if (heroBg) animateElements(heroBg, { opacity: [0, 1] }, { duration: 0.6, easing: 'ease-out' })
    if (heroTitle) animateElements(heroTitle, { opacity: [0, 1], y: [40, 0] }, { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] })
    if (heroSubtitle) animateElements(heroSubtitle, { opacity: [0, 1], y: [24, 0] }, { duration: 0.4, delay: 0.15, easing: [0.25, 0.46, 0.45, 0.94] })
  })

  const boardEl = document.getElementById('board-heading')
  const cardGrid = document.getElementById('card-grid')
  const footerEl = document.querySelector('footer')

  if (boardEl) {
    boardEl.querySelectorAll<HTMLElement>('.board-animate').forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
    })
    const bl = boardEl.querySelector<HTMLElement>('.board-line')
    if (bl) { bl.style.opacity = '0'; bl.style.transform = 'scaleX(0)' }
  }
  if (cardGrid) {
    Array.from(cardGrid.children).forEach((child) => {
      const c = child as HTMLElement
      c.style.opacity = '0'
      c.style.transform = 'translateY(32px)'
    })
  }
  if (footerEl) {
    Array.from(footerEl.children).forEach((child) => {
      const c = child as HTMLElement
      if (!c.classList.contains('footer-line') && !c.classList.contains('footer-boundary')) {
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
          animateElements(
            Array.from(items),
            { opacity: [0, 1], y: [24, 0] },
            { duration: 0.6, delay: stagger(0.12), easing: 'ease-out' }
          )
          const boardLine = entry.target.querySelector<HTMLElement>('.board-line')
          if (boardLine) {
            animateElements(boardLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.7, delay: 0.24, easing: 'ease-out' })
          }
        }
        if (entry.target === cardGrid && cardGrid.children.length > 0) {
          animateElements(
            Array.from(cardGrid.children) as HTMLElement[],
            { opacity: [0, 1], y: [32, 0] },
            { duration: 0.6, delay: stagger(0.1), easing: 'ease-out' }
          )
        }
        if (entry.target === footerEl) {
          const footerLine = footerEl.querySelector<HTMLElement>('.footer-line')
          if (footerLine) {
            animateElements(footerLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 1.2, easing: 'ease-out' })
          }
          animateElements(
            (Array.from(footerEl.children) as HTMLElement[]).filter(c => !c.classList.contains('footer-line') && !c.classList.contains('footer-boundary')),
            { opacity: [0, 1] },
            { duration: 1.5, delay: stagger(0.4), easing: 'ease-out' }
          )
        }
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  if (boardEl) observer.observe(boardEl)
  if (cardGrid) observer.observe(cardGrid)
  if (footerEl) observer.observe(footerEl)
}
