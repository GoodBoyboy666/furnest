import type { ImageMetadata } from 'astro'

export type ConfigImage = string | ImageMetadata

export interface ConfigLink {
  href: string
  label: string
  external?: boolean
}

export interface PageConfig {
  title: string
  kicker: string
  description: string
  emptyState?: string
}

export interface SiteConfig {
  site: {
    title: string
    description: string
    url: string
    locale: string
    dateLocale: string
    contentDateLocale: string
  }
  brand: {
    name: string
    shortMark: string
    eyebrow: string
    ownerName: string
    ownerTagline: string
    avatar: ConfigImage
    copyrightStartYear: number
    version: string
  }
  navigation: {
    primary: ConfigLink[]
    external?: ConfigLink
  }
  home: {
    heroImage: ConfigImage
    heroEyebrow: string
    heroTitle: string
    heroSubtitle: string
    recentArticlesKicker: string
    recentArticlesTitle: string
    emptyState: string
    recentArticleCount: number
  }
  pages: {
    blog: PageConfig
    about: PageConfig & { intro: string; paragraphs: string[] }
    friends: PageConfig
    categories: PageConfig & { uncategorizedLabel: string }
    archive: PageConfig
  }
  footer: {
    groups: Array<{ title: string; links: ConfigLink[] }>
    registrationRecords: string[]
    license?: string
    poweredBy: string
  }
  blog: {
    pageSize: number
    previousLabel: string
    nextLabel: string
  }
}

export const siteConfig: SiteConfig = {
  site: {
    title: 'Furnest',
    description: 'Furnest | 绒毛小窝 - 个人博客',
    url: 'https://www.furwolf.com',
    locale: 'zh-CN',
    dateLocale: 'zh-CN',
    contentDateLocale: 'zh-CN',
  },
  brand: {
    name: 'FurWolf Creation',
    shortMark: 'Furnest',
    eyebrow: 'WARM NEST',
    ownerName: 'GoodBoyboy',
    ownerTagline: '绒狼创意-探新求异',
    avatar: 'https://gravatar.furwolf.com/avatar/9da9d1d515d273d4794015f2321f6e04?s=512&d=monsterid&r=g',
    copyrightStartYear: 2015,
    version: '1.0.0',
  },
  navigation: {
    primary: [
      { href: '/', label: '首页' },
      { href: '/blog', label: '博客' },
      { href: '/categories', label: '分类' },
      { href: '/archive', label: '归档' },
      { href: '/about', label: '关于' },
    ],
    external: { href: '#', label: '外链' },
  },
  home: {
    heroImage: 'https://api.furry.ist/furry-img/?mode=auto',
    heroEyebrow: 'FURWOLF CREATION',
    heroTitle: 'Furnest | 绒毛小窝',
    heroSubtitle: '看朝霞万里，石头花开',
    recentArticlesKicker: 'RECENT ARTICLES',
    recentArticlesTitle: '近期文章',
    emptyState: '暂无文章',
    recentArticleCount: 4,
  },
  pages: {
    blog: {
      title: '博客文章',
      kicker: 'BLOG ARTICLES',
      description: 'Furnest | 绒毛小窝 - 个人博客',
      emptyState: '暂无文章',
    },
    about: {
      title: '关于',
      kicker: 'ABOUT THE NEST',
      description: '关于我',
      intro: '一处收拢创作、探索与日常发现的温暖小窝。',
      paragraphs: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra.',
        'Morbi tristique senectus et netus. Id semper risus in hendrerit gravida rutrum quisque non tellus. Habitasse platea dictumst quisque sagittis purus sit amet.',
        'Mollis nunc sed id semper risus in. Convallis a cras semper auctor neque. Diam sit amet nisl suscipit. Lacus viverra vitae congue eu consequat ac felis donec.',
      ],
    },
    friends: { title: '友情链接', kicker: 'FRIENDS', description: '友情链接', emptyState: '暂无友链' },
    categories: { title: '分类', kicker: 'CATEGORIES', description: '文章分类', emptyState: '暂无分类', uncategorizedLabel: '未分类' },
    archive: { title: '归档', kicker: 'ARCHIVE', description: '文章归档', emptyState: '暂无归档' },
  },
  footer: {
    groups: [
      { title: '服务', links: [{ href: '#', label: '网站地图' }, { href: '/rss.xml', label: 'RSS订阅' }] },
      { title: '协议', links: [{ href: '#', label: 'Cookie协议' }, { href: '#', label: '隐私协议' }] },
      { title: '链接', links: [{ href: '/friends', label: '友情链接' }] },
    ],
    registrationRecords: ['XICP备2026xxxxxx号', 'X公网安备xxxxxxxxxxxxxx号'],
    license: 'CC BY-NC-SA 4.0',
    poweredBy: 'Powered by Astro 7.0.7 &',
  },
  blog: { pageSize: 5, previousLabel: '上一页', nextLabel: '下一页' },
}
