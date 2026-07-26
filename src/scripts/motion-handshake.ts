interface FurnestMotionHandshake {
  prepare: (root?: HTMLElement) => void
  claim: () => boolean
  complete: () => void
  fail: () => void
}

declare global {
  interface Window {
    __furnestMotion?: FurnestMotionHandshake
    __furnestMotionLifecycleInstalled?: boolean
  }
}

type MotionSetup = (shouldAnimate: boolean) => void

function revealMotionCandidates() {
  document.querySelectorAll<HTMLElement>('[data-motion]').forEach((candidate) => {
    candidate.style.removeProperty('opacity')
    candidate.style.removeProperty('transform')
    delete candidate.dataset.motionPending
  })
}

export function markMotionPending(candidates: Iterable<HTMLElement>) {
  for (const candidate of candidates) candidate.dataset.motionPending = 'true'
}

export function completeMotionCandidates(candidates: Iterable<HTMLElement>) {
  for (const candidate of candidates) delete candidate.dataset.motionPending
}

export function isMotionPending(candidate: HTMLElement) {
  return candidate.dataset.motionPending === 'true'
}

export function initMotionPage(root: HTMLElement | null, setup: MotionSetup) {
  if (!root || root.dataset.animationInitialized === 'true') return

  root.dataset.animationInitialized = 'true'
  const handshake = window.__furnestMotion
  const shouldAnimate = handshake?.claim() === true
  if (shouldAnimate) {
    markMotionPending(document.querySelectorAll<HTMLElement>('[data-motion]'))
  }

  try {
    setup(shouldAnimate)
    handshake?.complete()
  } catch (error) {
    delete root.dataset.animationInitialized
    revealMotionCandidates()
    handshake?.fail()
    console.error('Motion initialization failed; content was revealed.', error)
  }
}
