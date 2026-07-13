import { Menu, Moon, Search, SquareArrowOutUpRight, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

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

export default function Header({ isHome: initialIsHome = false, pathname: initialPathname = '' }: Props) {
  const [isHome] = useState(initialIsHome)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState(initialPathname)
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

  useEffect(() => {
    setActivePath(window.location.pathname)

    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          <a href="#" className={`transition-colors duration-300 ${linkColor}`} aria-label="搜索">
            <Search size={24} />
          </a>
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
    </header>
  )
}
