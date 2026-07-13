import { animate, stagger } from 'motion'

export function initHomeAnimations() {
  requestAnimationFrame(() => {
    animate(
      '#hero-title',
      { opacity: [0, 1], y: [40, 0] },
      { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
    )
    animate(
      '#hero-subtitle',
      { opacity: [0, 1], y: [24, 0] },
      { duration: 0.4, delay: 0.15, easing: [0.25, 0.46, 0.45, 0.94] }
    )
  })

  const boardEl = document.getElementById('board-heading')
  const cardGrid = document.getElementById('card-grid')
  const footerEl = document.querySelector('footer')

  if (boardEl) {
    boardEl.querySelectorAll('.board-animate').forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
    })
    const bl = boardEl.querySelector('.board-line')
    if (bl) { bl.style.opacity = '0'; bl.style.transform = 'scaleX(0)' }
  }
  if (cardGrid) {
    Array.from(cardGrid.children).forEach(c => {
      c.style.opacity = '0'
      c.style.transform = 'translateY(32px)'
    })
  }
  if (footerEl) {
    Array.from(footerEl.children).forEach(c => {
      if (!c.classList.contains('footer-line')) {
        c.style.opacity = '0'
      }
    })
    const fl = footerEl.querySelector('.footer-line')
    if (fl) { fl.style.opacity = '0'; fl.style.transform = 'scaleX(0)' }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === boardEl) {
          const items = entry.target.querySelectorAll('.board-animate')
          animate(
            Array.from(items),
            { opacity: [0, 1], y: [24, 0] },
            { duration: 0.6, delay: stagger(0.12), easing: 'ease-out' }
          )
          const boardLine = entry.target.querySelector('.board-line')
          if (boardLine) {
            animate(boardLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.7, delay: 0.24, easing: 'ease-out' })
          }
        }
        if (entry.target === cardGrid && cardGrid.children.length > 0) {
          animate(
            Array.from(cardGrid.children),
            { opacity: [0, 1], y: [32, 0] },
            { duration: 0.6, delay: stagger(0.1), easing: 'ease-out' }
          )
        }
        if (entry.target === footerEl) {
          const footerLine = footerEl.querySelector('.footer-line')
          if (footerLine) {
            animate(footerLine, { scaleX: [0, 1], opacity: [0, 1] }, { duration: 1.2, easing: 'ease-out' })
          }
          animate(
            Array.from(footerEl.children).filter(c => !c.classList.contains('footer-line')),
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
