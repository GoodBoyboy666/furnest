import { Menu, Moon, Search, SquareArrowOutUpRight, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/categories', label: '分类' },
  { href: '/archive', label: '归档' },
  { href: '/about', label: '关于' },
]

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

  const linkColor = isHome && !scrolled ? 'text-white hover:text-gray-300' : 'text-gray-950 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-400'
  const bgColor = isHome && !scrolled ? 'bg-transparent' : 'bg-white dark:bg-gray-900'
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
    <header className={`${position} top-0 left-0 w-full z-50 rounded-b-lg transition-all duration-300 ${bgColor}`}>
      <nav className="flex items-center justify-between py-4 px-4 sm:px-8 lg:px-16">
        <a href="/" className={`text-2xl font-medium italic no-underline transition-colors duration-300 ${linkColor}`}>
          Furnest
        </a>

        <div className="hidden md:flex gap-16">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-base font-light no-underline transition-colors ${linkColor} ${isActive(link.href) ? 'font-bold underline underline-offset-4' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-6 items-center">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => void openSearch()}
            className={`transition-colors duration-300 ${linkColor}`}
            aria-label="搜索"
            aria-keyshortcuts="Control+K Meta+K"
            aria-haspopup="dialog"
          >
            <Search size={24} />
          </button>
          <a href="#" className={`transition-colors duration-300 ${linkColor}`} aria-label="外链">
            <SquareArrowOutUpRight size={24} />
          </a>
          <button
            onClick={toggleDark}
            className={`transition-colors duration-300 ${linkColor}`}
            aria-label="切换暗黑模式"
          >
            {dark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden transition-colors duration-300 ${linkColor}`}
            aria-label="菜单"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col py-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-base font-light text-gray-950 dark:text-gray-100 no-underline hover:bg-gray-50 dark:hover:bg-gray-800 ${isActive(link.href) ? 'font-bold underline underline-offset-4' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div data-pf-theme={dark ? 'dark' : undefined}>
        <pagefind-modal ref={searchModalRef} reset-on-close></pagefind-modal>
      </div>

      {searchUnavailable && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
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
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-gray-950 shadow-2xl dark:bg-gray-800 dark:text-gray-100">
            <h2 id="search-unavailable-title" className="text-lg font-semibold">搜索暂不可用</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">请先运行 pnpm build 后重试；若仍不可用，请重启开发服务器。</p>
            <button type="button" onClick={closeUnavailableSearch} autoFocus className="mt-5 rounded-lg bg-gray-950 px-4 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-950">
              关闭
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
