import { useEffect } from 'react'

/**
 * useReveal
 * Observes all elements matching `.reveal-item` and adds `.is-revealed`
 * when they enter the viewport. Unobserves immediately after first reveal
 * to prevent re-triggering when scrolling backwards.
 */
export function useReveal() {
  useEffect(() => {
    // If IntersectionObserver is not supported, reveal everything immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-item').forEach((el) => {
        el.classList.add('is-revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            obs.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    )

    const elements = document.querySelectorAll('.reveal-item')
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])
}
