from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

FONT = 'src/fonts/anton-latin-400-normal.woff'
font = TTFont(FONT)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
hmtx = font['hmtx']

def line_path(text, x0=0.0, y0=0.0, scale=1.0, tracking=0.0):
    """Outline one line of text; returns (path, advance width) in scaled units."""
    parts, x = [], 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            x += upm * 0.3
            continue
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        d = pen.getCommands()
        if d:
            parts.append((d, x))
        x += hmtx[name][0] + tracking
    # flip Y and place
    out = []
    for d, dx in parts:
        out.append(
            f'<path transform="translate({x0 + dx*scale:.2f} {y0:.2f}) scale({scale:.5f} {-scale:.5f})" d="{d}"/>'
        )
    return '\n    '.join(out), x * scale

TARGET_CAP = 200.0            # cap height in svg units per line
cap = font['OS/2'].sCapHeight if hasattr(font['OS/2'], 'sCapHeight') and font['OS/2'].sCapHeight else upm*0.72
scale = TARGET_CAP / cap

l1, w1 = line_path('FUCK', 0, TARGET_CAP, scale)
l2, w2 = line_path('YOU.', 0, TARGET_CAP*2 + 22, scale)
w = max(w1, w2)
h = TARGET_CAP*2 + 22
pad_x, pad_y = 34, 30
vb_w, vb_h = w + pad_x*2, h + pad_y*2

swatch = (
    f'<path d="M{pad_x*0.30:.1f} {pad_y*0.55:.1f}'
    f'C{vb_w*0.25:.1f} {pad_y*0.12:.1f} {vb_w*0.62:.1f} {pad_y*0.05:.1f} {vb_w-pad_x*0.28:.1f} {pad_y*0.30:.1f}'
    f'c{vb_w*0.02:.1f} {vb_h*0.26:.1f} {vb_w*0.015:.1f} {vb_h*0.60:.1f} {vb_w*0.006:.1f} {vb_h*0.86:.1f}'
    f'C{vb_w*0.66:.1f} {vb_h-pad_y*0.16:.1f} {vb_w*0.32:.1f} {vb_h-pad_y*0.05:.1f} {pad_x*0.42:.1f} {vb_h-pad_y*0.35:.1f}'
    f'c-{vb_w*0.018:.1f} -{vb_h*0.24:.1f} -{vb_w*0.02:.1f} -{vb_h*0.58:.1f} -{vb_w*0.004:.1f} -{vb_h*0.86:.1f}Z" fill="#d8f32b"/>'
)

def wrap(inner, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w:.0f} {vb_h:.0f}" '
            f'width="{vb_w:.0f}" height="{vb_h:.0f}" role="img" aria-label="{title}">\n  {inner}\n</svg>\n')

text_g = lambda fill: f'<g fill="{fill}" transform="translate({pad_x} {pad_y}) rotate(-1.6 {w/2:.0f} {h/2:.0f})">\n    {l1}\n    {l2}\n  </g>'

open('brand/logo/logo-primary.svg','w').write(wrap(swatch + '\n  ' + text_g('#121110'), 'FUCK YOU'))
open('brand/logo/logo-mono-black.svg','w').write(wrap(text_g('#121110'), 'FUCK YOU'))
open('brand/logo/logo-mono-paper.svg','w').write(wrap(text_g('#efebe3'), 'FUCK YOU'))

# one-line lockup for banners
l1b, w1b = line_path('FUCK YOU.', 0, TARGET_CAP, scale)
vb2_w, vb2_h = w1b + pad_x*2, TARGET_CAP + pad_y*2
one = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb2_w:.0f} {vb2_h:.0f}" '
       f'width="{vb2_w:.0f}" height="{vb2_h:.0f}" role="img" aria-label="FUCK YOU">\n'
       f'  <path d="M{pad_x*0.3:.1f} {pad_y*0.5:.1f}C{vb2_w*0.3:.1f} {pad_y*0.1:.1f} {vb2_w*0.7:.1f} {pad_y*0.06:.1f} {vb2_w-pad_x*0.3:.1f} {pad_y*0.3:.1f}'
       f'c{vb2_w*0.006:.1f} {vb2_h*0.3:.1f} {vb2_w*0.004:.1f} {vb2_h*0.6:.1f} {vb2_w*0.002:.1f} {vb2_h*0.84:.1f}'
       f'C{vb2_w*0.7:.1f} {vb2_h-pad_y*0.12:.1f} {vb2_w*0.3:.1f} {vb2_h-pad_y*0.05:.1f} {pad_x*0.4:.1f} {vb2_h-pad_y*0.3:.1f}'
       f'c-{vb2_w*0.005:.1f} -{vb2_h*0.28:.1f} -{vb2_w*0.006:.1f} -{vb2_h*0.58:.1f} -{vb2_w*0.001:.1f} -{vb2_h*0.84:.1f}Z" fill="#d8f32b"/>\n'
       f'  <g fill="#121110" transform="translate({pad_x} {pad_y})">\n    {l1b}\n  </g>\n</svg>\n')
open('brand/logo/logo-horizontal.svg','w').write(one)
print('wordmarks written', round(vb_w), round(vb_h))
