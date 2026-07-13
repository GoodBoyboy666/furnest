import { animate, stagger } from 'motion'

export function initBlogListAnimations() {
  requestAnimationFrame(() => {
    animate(
      '#blog-label',
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, easing: 'ease-out' }
    )
    animate(
      '#blog-title',
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.4, delay: 0.1, easing: 'ease-out' }
    )
    animate(
      '#blog-line',
      { scaleX: [0, 1], opacity: [0, 1] },
      { duration: 0.6, delay: 0.2, easing: 'ease-out' }
    )
  })

  const blogList = document.getElementById('blog-list')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('[data-animate]')
        if (cards.length > 0) {
          animate(
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
