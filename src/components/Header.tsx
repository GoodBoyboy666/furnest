import { Menu, Moon, Search, SquareArrowOutUpRight, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { siteConfig } from '../config'

interface Props {
  isHome?: boolean
  pathname?: string
}

const PAGEFIND_STYLESHEET = '/pagefind/pagefind-component-ui.css'
const PAGEFIND_SCRIPT = '/pagefind/pagefind-component-ui.js'

let pagefindScriptPromise: Promise<void> | undefined

function loadPagefindStylesheet() {
  const existingLink = document.querySelector<HTMLLinkElement>(`link[href="${PAGEFIND_STYLESHEET}"]`)
  if (existingLink?.dataset.loaded === 'true' || existingLink?.sheet) return Promise.resolve()

  const link = existingLink ?? document.createElement('link')
  if (!existingLink) {
    link.rel = 'stylesheet'
    link.href = PAGEFIND_STYLESHEET
    document.head.appendChild(link)
  }

  return new Promise<void>((resolve, reject) => {
    link.addEventListener('load', () => {
      link.dataset.loaded = 'true'
      resolve()
    }, { once: true })
    link.addEventListener('error', () => {
      link.remove()
      reject(new Error('Pagefind stylesheet unavailable'))
    }, { once: true })
  })
}

function loadPagefindScript() {
  if (customElements.get('pagefind-modal')) return Promise.resolve()
  if (pagefindScriptPromise) return pagefindScriptPromise

  pagefindScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = PAGEFIND_SCRIPT
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => {
      script.remove()
      reject(new Error('Pagefind script unavailable'))
    }, { once: true })
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    pagefindScriptPromise = undefined
    throw error
  })

  return pagefindScriptPromise
}

async function loadPagefindComponentUi() {
  await Promise.all([loadPagefindStylesheet(), loadPagefindScript()])
  await customElements.whenDefined('pagefind-modal')
}

export default function Header({ isHome: initialIsHome = false, pathname: initialPathname = '' }: Props) {
  const [isHome] = useState(initialIsHome)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState(initialPathname)
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
  const [searchUnavailable, setSearchUnavailable] = useState(false)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchModalRef = useRef<PagefindModalElement>(null)

  useEffect(() => {
    setActivePath(window.location.pathname)

    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openSearch = useCallback(async () => {
    setSearchUnavailable(false)

    try {
      await loadPagefindComponentUi()
      const modal = searchModalRef.current
      if (!modal) throw new Error('Pagefind modal unavailable')
      searchButtonRef.current?.focus()
      modal.open()
    } catch {
      setSearchUnavailable(true)
    }
  }, [])

  const closeUnavailableSearch = useCallback(() => {
    setSearchUnavailable(false)
    requestAnimationFrame(() => {
      searchButtonRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    const onSearchShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, [contenteditable="true"]')) return

      event.preventDefault()
      void openSearch()
    }

    window.addEventListener('keydown', onSearchShortcut)
    return () => window.removeEventListener('keydown', onSearchShortcut)
  }, [openSearch])

  useEffect(() => {
    if (!searchUnavailable) return

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeUnavailableSearch()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [closeUnavailableSearch, searchUnavailable])

  const isActive = (href: string) => {
    const pathname = activePath
    const subpath = pathname.match(/[^/]+/g)
    return href === pathname || href === '/' + (subpath?.[0] || '')
  }

  const overHero = isHome && !scrolled
  const linkColor = overHero ? 'text-white hover:text-[#ffd7b8]' : 'text-[var(--color-ink)] hover:text-[var(--color-sky)]'
  const bgColor = overHero ? 'bg-transparent' : 'bg-[color:var(--color-surface)]/95 border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] backdrop-blur-md'
  const position = isHome ? 'fixed' : 'sticky'

  const toggleDark = useCallback(() => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }, [dark])

  return (
    <header className={`${position} top-0 left-0 w-full z-50 rounded-b-2xl transition-all duration-300 ${bgColor}`}>
      <nav className="flex items-center justify-between py-4 px-4 sm:px-8 xl:px-16">
        <a href="/" className={`group flex items-end gap-2 text-2xl font-semibold italic no-underline transition-colors duration-300 ${linkColor}`}>
          <span className="relative leading-none">
            <svg viewBox="0 0 48 24" className="absolute -top-3 left-1/2 h-4 w-8 -translate-x-1/2" fill="none" aria-hidden="true" focusable="false">
              <path d="M4 20 8 4l15 13M44 20 40 4 25 17" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
             {siteConfig.brand.shortMark}
          </span>
          <span className={`hidden text-[10px] not-italic tracking-[.16em] xl:inline ${overHero ? 'text-white/75' : 'text-[var(--color-muted)]'}`}>{siteConfig.brand.eyebrow}</span>
        </a>

        {siteConfig.navigation.primary.length > 0 && (
          <div className="hidden gap-4 md:flex lg:gap-10 xl:gap-16">
            {siteConfig.navigation.primary.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-2 py-1 text-base font-light no-underline transition-colors ${linkColor} ${isActive(link.href) ? overHero ? 'bg-white/15 font-bold' : 'bg-[var(--color-surface-soft)] font-bold text-[var(--color-paw)]' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => void openSearch()}
            className={`rounded-full p-1.5 transition-colors duration-300 sm:p-2 ${linkColor} ${overHero ? 'hover:bg-white/15' : 'hover:bg-[var(--color-surface-soft)]'}`}
            aria-label="搜索"
            aria-keyshortcuts="Control+K Meta+K"
            aria-haspopup="dialog"
          >
            <Search size={24} />
          </button>
          {siteConfig.navigation.external && (
            <a href={siteConfig.navigation.external.href} className={`rounded-full p-1.5 transition-colors duration-300 sm:p-2 ${linkColor} ${overHero ? 'hover:bg-white/15' : 'hover:bg-[var(--color-surface-soft)]'}`} aria-label={siteConfig.navigation.external.label} target={siteConfig.navigation.external.external ? '_blank' : undefined} rel={siteConfig.navigation.external.external ? 'noopener noreferrer' : undefined}>
              <SquareArrowOutUpRight size={24} />
            </a>
          )}
          <button
            onClick={toggleDark}
            className={`rounded-full p-1.5 transition-colors duration-300 sm:p-2 ${linkColor} ${overHero ? 'hover:bg-white/15' : 'hover:bg-[var(--color-surface-soft)]'}`}
            aria-label="切换暗黑模式"
          >
            {dark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          {siteConfig.navigation.primary.length > 0 && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`rounded-full p-1.5 transition-colors duration-300 sm:p-2 md:hidden ${linkColor} ${overHero ? 'hover:bg-white/15' : 'hover:bg-[var(--color-surface-soft)]'}`}
              aria-label="菜单"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {siteConfig.navigation.primary.length > 0 && (
        <div id="mobile-navigation" aria-hidden={!menuOpen} className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col py-2">
            {siteConfig.navigation.primary.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? undefined : -1}
                className={`mx-3 block rounded-xl px-4 py-3 text-base font-light text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-soft)] ${isActive(link.href) ? 'font-bold text-[var(--color-paw)]' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div data-pf-theme={dark ? 'dark' : undefined}>
        <pagefind-modal ref={searchModalRef} reset-on-close></pagefind-modal>
      </div>

      {searchUnavailable && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-unavailable-title"
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault()
              event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus()
            }
          }}
        >
          <div className="theme-surface w-full max-w-sm p-6">
            <h2 id="search-unavailable-title" className="text-lg font-semibold">搜索暂不可用</h2>
            <p className="theme-muted mt-2 text-sm">请先运行 pnpm build 后重试；若仍不可用，请重启开发服务器。</p>
            <button type="button" onClick={closeUnavailableSearch} autoFocus className="mt-5 rounded-full bg-[var(--color-paw)] px-4 py-2 text-sm font-semibold text-[var(--color-on-paw)]">
              关闭
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
