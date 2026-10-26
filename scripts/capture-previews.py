# Gallery card loops: records each figure's stage in motion (Cream theme) and writes
# figures/<dir>/assets/preview.mp4 (800x1000, 5.5 s, seamless crossfade loop) + preview.jpg (poster).
#
#   node scripts/build-all.mjs                      # the pages it records come from dist/
#   python3 scripts/capture-previews.py [dir ...]   # all figures, or just the ones named (e.g. a4-heart)
#
# How: the figure page is widened (.iso-page 1080 px, stage ~1030 px) and captured through Chrome's screencast (JPEG
# q95) with GPU flags, so WebGL figures run near real time; Playwright's own recorder smears the cream into grey blocks.
# The stage is padded to 4:5 with its own edge pixels fading into the stage colour (no seam, no streaks), then the
# last 0.5 s fades into the first.
# Needs: Python Playwright + Google Chrome, ffmpeg, Pillow. Re-run after a figure's look changes, then commit the assets.
import sys, os, json, base64, subprocess, threading, functools, http.server, socketserver, shutil, asyncio
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist'); OUT = os.path.join(ROOT, 'renders', '_previews'); ONLY = sys.argv[1:]
SECS, WARM = 6.0, 1.0; VW, VH = int(os.environ.get('VW', 1200)), int(os.environ.get('VH', 1650)); OW, OH = 800, 1000
PAGEW = os.environ.get("PAGEW", "1080")
WIDE = "document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style'); s.textContent='.iso-page{width:min(" + PAGEW + "px,100% - 32px)!important}'; document.head.appendChild(s)})"
class Q(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.html': 'text/html; charset=utf-8', '.js': 'text/javascript'}
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=DIST)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
dirs = [d for d in sorted(os.listdir(DIST)) if os.path.isdir(os.path.join(DIST, d)) and not d.startswith('e') and d != 'review' and any(x.endswith('-light.html') for x in os.listdir(os.path.join(DIST, d)))]
if ONLY: dirs = [d for d in dirs if d in ONLY]
os.makedirs(OUT, exist_ok=True)

async def one(b, d):
    page_file = next(x for x in os.listdir(os.path.join(DIST, d)) if x.endswith('-light.html'))
    ctx = await b.new_context(viewport={'width': VW, 'height': VH}); await ctx.add_init_script(WIDE)
    pg = await ctx.new_page()
    await pg.goto(f'http://127.0.0.1:{port}/{d}/{page_file}', wait_until='networkidle'); await asyncio.sleep(2.5)
    for sel in ('[data-play][aria-label="Play"]', 'button:has-text("Play")'):
        el = await pg.query_selector(sel)
        if el and await el.is_visible():
            try: await el.click(); break
            except Exception: pass
    await pg.evaluate("()=>{const r=document.querySelector('.iso-stage').getBoundingClientRect(); window.scrollBy(0, r.top - Math.max(0,(innerHeight - r.height)/2))}")
    await asyncio.sleep(1.2)
    r = await pg.evaluate("()=>{const r=document.querySelector('.iso-stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]}")
    cdp = await ctx.new_cdp_session(pg); frames = []
    tmp = os.path.join(OUT, '_frames', d); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    async def on_frame(ev):
        frames.append((ev['metadata']['timestamp'], ev['data'], ev['metadata']))
        try: await cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
        except Exception: pass
    cdp.on('Page.screencastFrame', lambda ev: asyncio.ensure_future(on_frame(ev)))
    await cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 95, 'maxWidth': VW, 'maxHeight': VH, 'everyNthFrame': 1})
    await asyncio.sleep(WARM + SECS + 0.4)
    await cdp.send('Page.stopScreencast'); await asyncio.sleep(0.3)
    await ctx.close()
    frames.sort(key=lambda f: f[0]); t_first = frames[0][0]
    keep = [(t - t_first - WARM, data, md) for t, data, md in frames if WARM - 0.05 <= t - t_first <= WARM + SECS + 0.05]
    lines = []
    for i, (t, data, md) in enumerate(keep):
        fn = os.path.join(tmp, f'{i:05d}.jpg'); open(fn, 'wb').write(base64.b64decode(data))
        nxt = keep[i + 1][0] if i + 1 < len(keep) else SECS
        lines.append(f"file '{fn}'\nduration {max(0.001, nxt - t):.4f}")
    lines.append(f"file '{os.path.join(tmp, f'{len(keep) - 1:05d}.jpg')}'")
    lst = os.path.join(tmp, 'list.txt'); open(lst, 'w').write('\n'.join(lines))
    from PIL import Image
    first = Image.open(os.path.join(tmp, '00000.jpg')).convert('RGB'); fw, fh = first.size; k = fw / VW
    x, y, w, h = [round(v * k) for v in r]; x, y = max(0, x), max(0, y); w = min(w, fw - x); h = min(h, fh - y); w -= w % 2; h -= h % 2
    # pad colour = the frame's own background just inside the stage's top-left corner
    px = first.getpixel((x + 4, y + 4)); hexbg = '#%02x%02x%02x' % px
    pw = max(w, round(h * OW / OH)); ph = round(pw * OH / OW)
    if ph < h: ph = h; pw = round(ph * OW / OH)
    pw += pw % 2; ph += ph % 2
    L = (pw - w) // 2; T = (ph - h) // 2; Rr = pw - w - L; B = ph - h - T
    # Margin to 4:5: the stage's own edge pixels smeared outward (no seam at the edge), fading into the flat stage
    # colour over ~50 px (so a shadow that touches the edge softens instead of streaking to the frame).
    import math
    mask = Image.new('L', (pw, ph)); mp_ = mask.load()
    for yy in range(ph):
        dy = max(0, T - yy, yy - (T + h - 1))
        for xx in range(pw):
            dx = max(0, L - xx, xx - (L + w - 1))
            mp_[xx, yy] = 255 if dx == 0 and dy == 0 else int(255 * math.exp(-math.hypot(dx, dy) / 50))
    mask_png = os.path.join(tmp, 'mask.png'); mask.save(mask_png)
    fc = (f'[0]crop={w}:{h}:{x}:{y},split[s1][s2];'
          f'[s1]pad={pw}:{ph}:{L}:{T}:color={hexbg},fillborders=left={L}:right={Rr}:top={T}:bottom={B}:mode=smear,format=gbrp[sm];'
          f'[s2]pad={pw}:{ph}:{L}:{T}:color={hexbg},format=gbrp[fl];'
          f'[1]format=gray,format=gbrp[m];'
          f'[fl][sm][m]maskedmerge,scale={OW}:{OH}:flags=lanczos,fps=30,format=yuv420p')
    mp4 = os.path.join(OUT, f'{d}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-loop', '1', '-i', mask_png, '-filter_complex', fc, '-t', f'{SECS}', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', mp4], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    dest = os.path.join(ROOT, 'figures', d, 'assets'); os.makedirs(dest, exist_ok=True)
    xf = "[0]split[a][b];[a]trim=0.5:6,setpts=PTS-STARTPTS[x];[b]trim=0:0.5,setpts=PTS-STARTPTS[y];[x][y]xfade=transition=fade:duration=0.5:offset=5.0,format=yuv420p"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-filter_complex', xf, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', os.path.join(dest, 'preview.mp4')], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '2.0', '-i', os.path.join(dest, 'preview.mp4'), '-frames:v', '1', '-q:v', '2', os.path.join(dest, 'preview.jpg')], check=True)
    return {'bg': hexbg, 'stage': [round(v) for v in r], 'frames': len(keep), 'frame': [fw, fh]}

async def main():
    mp = os.path.join(OUT, 'meta.json'); meta = json.load(open(mp)) if os.path.exists(mp) else {}
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='chrome', args=os.environ.get('GPUARGS', '--use-angle=metal --enable-gpu --ignore-gpu-blocklist --enable-gpu-rasterization').split())
        for d in dirs:
            meta[d] = await one(b, d); print(d, meta[d], flush=True)
            json.dump(meta, open(mp, 'w'), indent=1)
        await b.close()
asyncio.run(main()); srv.shutdown()
