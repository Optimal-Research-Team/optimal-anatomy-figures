import 'components/optimal-figures/optimal-figures.css'

import {
  REVEAL_BASE,
  REVEAL_RESERVE,
  RevealSlug,
  whenNear,
} from 'components/optimal-figures/optimalFigures'
import { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

type Props = {
  /** The machine: 'inbody-580', 'creator-600' or 'kickr-bike'. */
  slug: RevealSlug
  /** What the frame shows, for screen readers (e.g. "The InBody 580, taken apart, in 3-D"). */
  title: string
  /** Side gutters (16 px) for a slot on its own between sections. */
  gutter?: boolean
  /** Extra classes for the slot (spacing in the host section). */
  className?: string
}

/**
 * One of the clinic's machines in 3-D: drag to turn it, and its own buttons take it apart. The page runs in a
 * sandboxed iframe (scripts only: no access to this page, cookies or storage), loaded when the slot nears the
 * viewport. Its only message out is its height, so the frame always fits with no inner scrollbar.
 */
export default function EquipmentReveal({
  slug,
  title,
  gutter = false,
  className,
}: Props): JSX.Element {
  const slot = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const [near, setNear] = useState(false)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!slot.current) return
    return whenNear(slot.current, () => setNear(true))
  }, [slug])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return
      const d = e.data as { type?: string; height?: number } | null
      if (
        d &&
        d.type === 'optimal-reveal' &&
        typeof d.height === 'number' &&
        d.height > 200 &&
        d.height < 4000
      )
        setHeight(Math.ceil(d.height))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const reserve = REVEAL_RESERVE[slug]
  return (
    <div
      ref={slot}
      className={`optimal-figure${gutter ? ' optimal-figure--gutter' : ''}${className ? ` ${className}` : ''}`}
      data-optimal-reveal={slug}
      data-ready={height ? 'true' : undefined}
      style={{
        '--fig-reserve-phone': `${reserve.phone}px`,
        '--fig-reserve-desktop': `${reserve.desktop}px`,
      }}
    >
      {near && (
        <iframe
          ref={frame}
          className="optimal-reveal-frame"
          src={`${REVEAL_BASE}/${slug}-apart.html`}
          title={title}
          sandbox="allow-scripts"
          loading="lazy"
          style={height ? { height: `${height}px` } : undefined}
        />
      )}
    </div>
  )
}
