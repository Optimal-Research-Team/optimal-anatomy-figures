/**
 * Optimal anatomy figures: loader shared by <OptimalFigure> (Preact pages) and
 * mountOptimalFigures() (pages whose body is an HTML string, like the two
 * protocols).
 *
 * Each figure is one self-contained script that defines a custom element
 * `<optimal-fig-<slug>>`, rendered in a shadow root so the site's Tailwind and
 * daisyUI styles can't reach it. Scripts are 112–424 KB (35–94 KB gzipped)
 * because each carries the drawing kit, so they load only when the figure's
 * slot comes near the viewport, and each loads once per page view.
 *
 * Copy the scripts to `public/figures/` (see ENGINEERING_HANDOFF.md, "Ship the
 * scripts"). Reserve each slot's height (FIGURE_RESERVE) so nothing jumps
 * when the figure mounts.
 */

export const FIGURE_BASE = '/figures'

/** Whole-card heights (px) at 358 px wide (390 px phones) and at 760 px: the taller of a desktop browser and a
 * phone (touch, 3× pixels), so no card is taller than its slot when it mounts. Re-measured Oct 21. */
export const FIGURE_RESERVE: Record<
  string,
  { phone: number; desktop: number }
> = {
  'menopause-thermostat': { phone: 1061, desktop: 1166 },
  'inbody-580': { phone: 1172, desktop: 1190 },
  'iv-iron': { phone: 1039, desktop: 1047 },
  'creator-600': { phone: 1188, desktop: 1351 },
  vo2max: { phone: 1224, desktop: 1315 },
  'vo2max-treadmill': { phone: 1223, desktop: 1405 },
  'gut-cell': { phone: 1066, desktop: 1287 },
  hypothalamus: { phone: 1311, desktop: 1306 },
  'finger-skin': { phone: 1040, desktop: 1228 },
  heart: { phone: 1379, desktop: 1626 },
  alveolus: { phone: 1186, desktop: 1374 },
  'red-cell-cycle': { phone: 1175, desktop: 1293 },
  knee: { phone: 1117, desktop: 1424 },
  'muscle-water': { phone: 1136, desktop: 1119 },
  'bone-remodelling': { phone: 998, desktop: 1060 },
}

export type FigureSlug = keyof typeof FIGURE_RESERVE

/**
 * The clinic's machines in 3-D (E1–E3, see EquipmentReveal.tsx): each is a take-apart page shown in a sandboxed
 * iframe from `REVEAL_BASE`. Heights (px) are the framed page at 358 px wide (390 px phones) and at 760 px. The
 * frame resizes itself to the page's reported height once it loads; these only hold the space until then.
 */
export const REVEAL_BASE = '/figures/reveals'
export const REVEAL_RESERVE: Record<
  string,
  { phone: number; desktop: number }
> = {
  'inbody-580': { phone: 1164, desktop: 1216 },
  'creator-600': { phone: 825, desktop: 984 },
  'kickr-bike': { phone: 927, desktop: 1005 },
}
export type RevealSlug = keyof typeof REVEAL_RESERVE

const loading = new Map<string, Promise<void>>()

/** Load a figure's script once; resolves when its custom element is defined. */
export function loadFigure(slug: string, base = FIGURE_BASE): Promise<void> {
  const tag = `optimal-fig-${slug}`
  if (customElements.get(tag)) return Promise.resolve()
  const known = loading.get(slug)
  if (known) return known
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${base}/optimal-fig-${slug}.js`
    script.async = true
    script.onload = () => customElements.whenDefined(tag).then(() => resolve())
    script.onerror = () => {
      loading.delete(slug)
      reject(new Error(`Optimal figure failed to load: ${slug}`))
    }
    document.head.appendChild(script)
  })
  loading.set(slug, promise)
  return promise
}

/** Call `onNear` once, when `el` comes within `margin` of the viewport. */
export function whenNear(
  el: Element,
  onNear: () => void,
  margin = '800px 0px'
): () => void {
  if (!('IntersectionObserver' in window)) {
    onNear()
    return () => undefined
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect()
        onNear()
      }
    },
    { rootMargin: margin }
  )
  observer.observe(el)
  return () => observer.disconnect()
}

/**
 * For HTML-string pages: turn every `<div data-optimal-fig="<slug>"></div>`
 * under `root` into its figure as it nears the viewport. Optional attributes:
 * `data-theme="dark"` (default light, the site's Cream theme) and `data-gutter`
 * (16 px side gutters, for a slot outside a padded column). Returns a cleanup
 * function for useEffect.
 */
export function mountOptimalFigures(root: ParentNode): () => void {
  const cleanups: Array<() => void> = []
  root.querySelectorAll<HTMLElement>('[data-optimal-fig]').forEach((slot) => {
    const slug = slot.dataset.optimalFig
    if (!slug || slot.dataset.mounted) return
    slot.classList.add('optimal-figure')
    if (slot.dataset.gutter !== undefined)
      slot.classList.add('optimal-figure--gutter')
    const reserve = FIGURE_RESERVE[slug]
    if (reserve) {
      slot.style.setProperty('--fig-reserve-phone', `${reserve.phone}px`)
      slot.style.setProperty('--fig-reserve-desktop', `${reserve.desktop}px`)
    }
    cleanups.push(
      whenNear(slot, () => {
        loadFigure(slug)
          .then(() => {
            if (slot.dataset.mounted) return
            slot.dataset.mounted = 'true'
            const el = document.createElement(`optimal-fig-${slug}`)
            el.setAttribute(
              'theme',
              slot.dataset.theme === 'dark' ? 'dark' : 'light'
            )
            slot.appendChild(el)
            slot.dataset.ready = 'true'
          })
          .catch(() => slot.setAttribute('data-failed', 'true'))
      })
    )
  })
  return () => cleanups.forEach((c) => c())
}
