# Card heights for the site's FIGURE_RESERVE (handoff/site/optimalFigures.ts): mounts each built embed in a 358 px
# and a 760 px wide slot, as a desktop browser and as a phone (touch, 3x pixels), and prints the taller of the two
# beside the reserve the site holds. A card taller than its reserve makes the page jump when it mounts.
#
#   node scripts/build-all.mjs            # the embeds it mounts come from dist/
#   python3 scripts/measure-reserves.py [slug ...]
#
# Needs Python Playwright + Google Chrome. Exits 1 if any card is taller than its reserve.
import sys, os, re, json, threading, functools, http.server, socketserver, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
only = sys.argv[1:]
ts = open(os.path.join(ROOT, 'handoff', 'site', 'optimalFigures.ts')).read()
block = ts[ts.index('export const FIGURE_RESERVE'):ts.index('export type FigureSlug')]
reserve = {m[1]: (int(m[2]), int(m[3])) for m in re.finditer(r"'?([\w-]+)'?: \{ phone: (\d+), desktop: (\d+) \}", block)}

class Q(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript'}
    def log_message(self, *a): pass
    def handle(self):
        try: super().handle()
        except Exception: pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=DIST))
threading.Thread(target=srv.serve_forever, daemon=True).start()
port = srv.server_address[1]

embeds = {}
for d in sorted(os.listdir(DIST)):
    e = os.path.join(DIST, d, 'embed')
    if not os.path.isdir(e): continue
    for f in os.listdir(e):
        m = re.match(r'optimal-fig-(.+)\.js$', f)
        if m and (not only or m[1] in only): embeds[m[1]] = f'{d}/embed/{f}'

HOST = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#FFFCF7} #slot{width:%dpx;margin:0 auto} *{box-sizing:border-box}</style></head>
<body><div id="slot"><optimal-fig-%s theme="light"></optimal-fig-%s></div><script src="/%s"></script></body></html>"""

def height(browser, slug, width, phone):
    ctx = browser.new_context(viewport={'width': 390 if width < 400 else 1280, 'height': 900}, device_scale_factor=3 if phone else 1, is_mobile=phone, has_touch=phone)
    pg = ctx.new_page()
    pg.route('**/host.html', lambda r: r.fulfill(content_type='text/html', body=HOST % (width, slug, slug, embeds[slug])))
    pg.goto(f'http://127.0.0.1:{port}/host.html')
    best = 0
    for _ in range(14):  # the card settles (fonts, the 3-D layer arriving, a first readout)
        time.sleep(0.5)
        best = max(best, pg.evaluate("() => Math.ceil(document.querySelector('#slot').getBoundingClientRect().height)"))
    ctx.close()
    return best

bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'])
    for slug in embeds:
        ph = max(height(b, slug, 358, False), height(b, slug, 358, True))
        de = max(height(b, slug, 760, False), height(b, slug, 760, True))
        r = reserve.get(slug)
        over = r and (ph > r[0] + 1 or de > r[1] + 1)  # heights are rounded up here; the reserves were rounded to nearest
        bad += 1 if over else 0
        print(f"{slug:22} phone {ph:5} (reserve {r[0] if r else '?':>5})   desktop {de:5} (reserve {r[1] if r else '?':>5})   {'TALLER THAN ITS RESERVE' if over else 'fits'}")
    b.close()
sys.exit(1 if bad else 0)
