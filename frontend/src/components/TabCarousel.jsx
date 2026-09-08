import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function TabCarousel({ tabs, activeId, onChange }) {
  const scrollerRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', updateScrollState)
    }
  }, [updateScrollState, tabs])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const active = el.querySelector(`[data-tab-id="${CSS.escape(activeId)}"]`)
    if (!active) return
    const left = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2
    el.scrollTo({
      left: Math.max(0, left),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [activeId])

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId)
  const hasPrevTab = activeIndex > 0
  const hasNextTab = activeIndex < tabs.length - 1

  const goToAdjacentTab = (dir) => {
    const next = tabs[activeIndex + dir]
    if (next) onChange(next.id)
  }

  const btnClass = (enabled) =>
    `shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition-[transform,background-color,opacity] duration-100 ease-out active:scale-[0.97] ${
      enabled
        ? 'bg-surface border-text-secondary/15 text-text-primary hover:bg-bg cursor-pointer'
        : 'bg-surface/60 border-text-secondary/10 text-text-secondary/40 cursor-not-allowed'
    }`

  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        type="button"
        aria-label="Onglet précédent"
        disabled={!hasPrevTab}
        onClick={() => goToAdjacentTab(-1)}
        className={btnClass(hasPrevTab)}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="relative min-w-0 flex-1">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-bg to-transparent z-10 transition-opacity duration-150 ${canPrev ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-bg to-transparent z-10 transition-opacity duration-150 ${canNext ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          ref={scrollerRef}
          role="tablist"
          className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab-id={tab.id}
              aria-selected={activeId === tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-[transform,background-color,color,box-shadow] duration-150 ease-out cursor-pointer active:scale-[0.97] ${
                activeId === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-text-secondary/10 hover:bg-bg text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Onglet suivant"
        disabled={!hasNextTab}
        onClick={() => goToAdjacentTab(1)}
        className={btnClass(hasNextTab)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
