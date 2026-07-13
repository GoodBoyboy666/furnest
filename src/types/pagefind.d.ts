import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  interface PagefindModalElement extends HTMLElement {
    readonly isOpen: boolean
    open(): void
    close(): void
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'pagefind-modal': DetailedHTMLProps<HTMLAttributes<PagefindModalElement>, PagefindModalElement> & {
        'reset-on-close'?: boolean
      }
    }
  }
}
