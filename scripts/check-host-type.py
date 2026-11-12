# Does a host page's text styling get into the figures? A shadow root keeps a page's selectors out, but inherited
# text properties (tracking, word spacing, case, indent, alignment, wrapping, hyphenation, text shadow) come down through the
# element. On beoptimal.ca the site's -0.32 px tracking re-wrapped the captions, and the cards came out 14 to 83 px
# shorter than the reserves measured here (Nov 12, 2026). The embeds now reset those properties (shared/page.mjs,
# HOST_TYPE_RESET); this is the test for it.
#
# For each built embed, in a 358 px (phone) and a 760 px (desktop) slot, it mounts the card on a plain page, then
# puts the same card under each of the host pages below and checks that
#   - the card is as tall as on the plain page (a re-wrapped line is 12 px or more; the test allows 0.5 px), and
#   - every element that holds text, in the shadow root, computes the same value for every property in READ.
# The figures add and remove drawing nodes while they animate, so elements are compared as a set, not by position,
# and each host page is tried up to three times if the plain card itself changed in between.
# The test page is in English (lang="en"), like the site: without a language `hyphens: auto` never hyphenates.
# Then the framed take-apart pages (E1-E4): a frame is its own document, so nothing is inherited; it confirms that.
#
#   node scripts/build-all.mjs            # the embeds it mounts come from dist/
#   python3 scripts/check-host-type.py [slug ...] [--no-frames]
#
# Needs Python Playwright + Google Chrome. One browser, one page at a time. Exits 1 if anything differs.
import sys, os, re, threading, functools, http.server, socketserver, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
args = sys.argv[1:]
frames = '--no-frames' not in args
only = [a for a in args if not a.startswith('--')]

# The properties the embed resets, each with a value no figure uses at its root (keep in step with HOST_TYPE_RESET).
PROPS = {
    'letter-spacing': '-0.32px', 'word-spacing': '4px', 'text-transform': 'uppercase', 'text-indent': '24px',
    'text-align': 'center', 'text-align-last': 'center', 'word-break': 'break-all', 'overflow-wrap': 'anywhere',
    'hyphens': 'auto', 'line-break': 'anywhere', 'text-anchor': 'end', 'text-shadow': 'rgb(255, 0, 0) 1px 1px 0px',
    'text-wrap': 'balance', 'white-space': 'nowrap',  # nowrap last: text-wrap would undo it
}
# `white-space` and `text-wrap` are shorthands; these are what they set, and what gets compared.
READ = [p for p in PROPS if p not in ('white-space', 'text-wrap')] + ['white-space-collapse', 'text-wrap-mode', 'text-wrap-style']
ALL = ';'.join(f'{k}:{v}' for k, v in PROPS.items())
SOFT = ';'.join(f'{k}:{v}' for k, v in PROPS.items() if k != 'white-space')
# name -> CSS for the host page. `#slot` is the figure's parent; `#slot > *` is the <optimal-fig-...> element itself.
HOSTS = {
    'tracking -0.32 px (service pages)': '#slot{letter-spacing:-0.32px}',
    'tracking -0.17 px (Menopause Protocol)': '#slot{letter-spacing:-0.17px}',
    'every property, from the parent': '#slot{%s}' % ALL,
    'every property but nowrap, from the parent': '#slot{%s}' % SOFT,
    'every property, on the element itself': '#slot > *{%s}' % ALL,
}

class Q(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript'}
    def log_message(self, *a): pass
    def handle(self):
        try: super().handle()
        except Exception: pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=DIST))
threading.Thread(target=srv.serve_forever, daemon=True).start()
port = srv.server_address[1]

embeds, reveals = {}, {}
for d in sorted(os.listdir(DIST)):
    e = os.path.join(DIST, d, 'embed')
    if not os.path.isdir(e): continue
    for f in sorted(os.listdir(e)):
        m = re.match(r'optimal-fig-(.+)\.js$', f)
        if m and (not only or m[1] in only): embeds[m[1]] = f'{d}/embed/{f}'
        m = re.match(r'(.+)-apart\.html$', f)
        if m and (not only or m[1] in only): reveals[m[1]] = f'{d}/embed/{f}'

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap">
<style>body{margin:0;background:#FFFCF7} #slot{width:%dpx;margin:0 auto} *{box-sizing:border-box} iframe{display:block;width:100%%;height:900px;border:0}</style>
<style id="host"></style></head><body><div id="slot">%s</div></body></html>"""

SNAP = """(props) => {
  const el = document.querySelector('#slot').firstElementChild;
  const doc = el.shadowRoot || el.contentDocument;
  const view = el.contentWindow || window;
  const card = el.shadowRoot ? el : doc.documentElement;
  const text = [...doc.querySelectorAll('*')].filter(n => !/^(style|script|title)$/i.test(n.tagName) && [...n.childNodes].some(c => c.nodeType === 3 && c.nodeValue.trim()));
  return { h: card.getBoundingClientRect().height,
           t: text.map(n => { const s = view.getComputedStyle(n); return n.tagName.toLowerCase() + ' ' + props.map(p => s.getPropertyValue(p)).join(' | '); }).sort() };
}"""

TOL = 0.5
def apart(a, b):  # how many text elements one snapshot has that the other does not
    left = list(b)
    miss = 0
    for x in a:
        if x in left: left.remove(x)
        else: miss += 1
    return miss + len(left)

def check(browser, name, width, body, phone):
    ctx = browser.new_context(viewport={'width': 390 if phone else 1280, 'height': 900}, device_scale_factor=1)
    pg = ctx.new_page()
    pg.route('**/host.html', lambda r: r.fulfill(content_type='text/html', body=PAGE % (width, body)))
    pg.goto(f'http://127.0.0.1:{port}/host.html')
    pg.evaluate("() => document.fonts.ready.then(() => 1)")
    best, same = 0, 0
    for _ in range(24):  # until the card has held one height for 2 s (fonts, the 3-D layer arriving, a first readout)
        time.sleep(0.5)
        h = pg.evaluate(SNAP, [])['h']
        same = same + 1 if abs(h - best) < TOL else 0
        best = h
        if same >= 4: break
    out = []
    for label, css in HOSTS.items():
        for attempt in range(3):
            plain = pg.evaluate(SNAP, READ)
            pg.evaluate("(css) => { document.querySelector('#host').textContent = css }", css)
            time.sleep(0.4)
            hot = pg.evaluate(SNAP, READ)
            pg.evaluate("() => { document.querySelector('#host').textContent = '' }")
            time.sleep(0.3)
            back = pg.evaluate(SNAP, READ)
            steady = abs(back['h'] - plain['h']) < TOL and apart(plain['t'], back['t']) == 0
            if steady: break
        out.append((label, plain['h'], hot['h'], apart(plain['t'], hot['t']) if steady else -1, steady, len(plain['t'])))
    ctx.close()
    return out

bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'])
    jobs = [(slug, f'<optimal-fig-{slug} theme="light"></optimal-fig-{slug}><script src="/{src}"></script>', (358, 760)) for slug, src in embeds.items()]
    if frames: jobs += [(f'{slug} (framed)', f'<iframe src="/{src}"></iframe>', (358,)) for slug, src in reveals.items()]
    for name, body, widths in jobs:
        for width in widths:
            rows = check(b, name, width, body, width < 400)
            ok = all(r[4] and r[3] == 0 and abs(r[2] - r[1]) < TOL for r in rows)
            bad += 0 if ok else 1
            drift = max(abs(r[2] - r[1]) for r in rows)
            print(f"{name:30} {width:4} px   plain {rows[0][1]:7.1f}   {'same under all %d host pages (%d text elements; largest height difference %.1f px)' % (len(rows), rows[0][5], drift) if ok else 'DIFFERS'}")
            if not ok:
                for label, h0, h1, differ, steady, n in rows:
                    note = 'the plain card did not hold still in three tries' if not steady else f'{h1 - h0:+.1f} px, {differ} text elements compute differently'
                    print(f"    {label:44} {h1:7.1f}   {note}")
    b.close()
print('\nhost typography: ' + ('FAILED' if bad else 'passed'))
sys.exit(1 if bad else 0)
