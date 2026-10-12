import 'components/optimal-figures/optimal-figures.css'

import {
  FIGURE_RESERVE,
  FigureSlug,
  loadFigure,
  whenNear,
} from 'components/optimal-figures/optimalFigures'
import { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

type Props = {
  /** The figure's slug, e.g. 'heart' for <optimal-fig-heart>. */
  slug: FigureSlug
  /** 'light' (Cream) on the site; 'dark' (Forest night) is for the exam-room TV. */
  theme?: 'light' | 'dark'
  /**
   * Side gutters (16 px) for a figure placed on its own between sections. Leave
   * off inside a section that already pads its content.
   */
  gutter?: boolean
  /** Extra classes for the slot (spacing in the host section). */
  className?: string
}

/**
 * One interactive anatomy figure. Reserves its height, loads its script when
 * the slot nears the viewport, then renders the custom element. The figure
 * brings its own title, controls, readout and caption; it pauses when off
 * screen and respects prefers-reduced-motion.
 */
export default function OptimalFigure({
  slug,
  theme = 'light',
  gutter = false,
  className,
}: Props): JSX.Element {
  const slot = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!slot.current) return
    return whenNear(slot.current, () => {
      loadFigure(slug)
        .then(() => setReady(true))
        .catch(() => setFailed(true))
    })
  }, [slug])

  const reserve = FIGURE_RESERVE[slug]
  const Tag = `optimal-fig-${slug}` as unknown as 'div'
  return (
    <div
      ref={slot}
      className={`optimal-figure${gutter ? ' optimal-figure--gutter' : ''}${className ? ` ${className}` : ''}`}
      data-optimal-fig={slug}
      data-ready={ready ? 'true' : undefined}
      data-failed={failed ? 'true' : undefined}
      style={{
        '--fig-reserve-phone': `${reserve.phone}px`,
        '--fig-reserve-desktop': `${reserve.desktop}px`,
      }}
    >
      {ready && <Tag {...({ theme } as Record<string, string>)} />}
    </div>
  )
}
