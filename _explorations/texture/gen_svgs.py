import math
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg") + "/"
FIELD, RING, SLATE, CURSOR, INK = "#B7C1C7", "#82909A", "#77838E", "#2867E1", "#192228"

def write(name, w, h, body):
    open(OUT + name, "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>\n')

# Fine fractal noise, tinted ink, mostly transparent.
write("noise.svg", 200, 200,
    '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/>'
    '<feColorMatrix values="0 0 0 0 .1  0 0 0 0 .13  0 0 0 0 .16  0 0 0 .6 0"/></filter>'
    '<rect width="100%" height="100%" filter="url(#n)"/>')

# Art Deco overlapping fans (seigaiha). Width is a multiple of the period, so it tiles horizontally.
# `fill` must match the page background so nearer fans hide the ones behind.
def fans(name, fill, arcs, dot):
    R, W, H, step = 24, 480, 200, 12
    parts = []
    row = 0
    y = R
    while y - R < H:
        off = 0 if row % 2 == 0 else R
        x = -R + off
        while x <= W + R:
            parts.append(f'<path d="M{x-R} {y}A{R} {R} 0 0 1 {x+R} {y}Z" fill="{fill}" stroke="{FIELD}" stroke-width="1"/>')
            for r in arcs:
                parts.append(f'<path d="M{x-r} {y}A{r} {r} 0 0 1 {x+r} {y}" fill="none" stroke="{FIELD}" stroke-width=".8"/>')
            if dot:
                parts.append(f'<circle cx="{x}" cy="{y-3}" r="1.2" fill="{RING}"/>')
            x += 2 * R
        y += step
        row += 1
    write(name, W, H, "".join(parts))

fans("fans.svg", "#fff", (17, 10), dot=True)
# Blend variant: warm paper fill, and a third small arc instead of the dot.
fans("fans-warm.svg", "#fbfaf7", (17, 10, 4), dot=False)

# Coarser, stronger noise for the Blend variant (the fine one barely shows).
write("noise-coarse.svg", 240, 240,
    '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" stitchTiles="stitch"/>'
    '<feColorMatrix values="0 0 0 0 .22  0 0 0 0 .2  0 0 0 0 .16  0 0 0 .9 -.12"/></filter>'
    '<rect width="100%" height="100%" filter="url(#n)"/>')

# Sunburst: rays and concentric arcs radiating from the bottom centre.
W, H = 1440, 520
cx, cy = W / 2, H
rays = []
for i in range(0, 49):
    a = math.pi + i * math.pi / 48
    rays.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + 1600*math.cos(a):.1f}" y2="{cy + 1600*math.sin(a):.1f}"/>')
arcs = "".join(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>' for r in (140, 260, 380, 500))
write("sunburst.svg", W, H,
    f'<g stroke="{FIELD}" stroke-width="1" fill="none">{"".join(rays)}{arcs}</g>')

# Diamond lattice tile (seamless) with a dot at each centre.
write("lattice.svg", 24, 24,
    f'<path d="M12 0L24 12L12 24L0 12Z" fill="none" stroke="{FIELD}" stroke-width=".8"/>'
    f'<circle cx="12" cy="12" r="1" fill="{RING}"/>')

# Zigzag chevrons tile (seamless).
write("chevron.svg", 16, 10, f'<path d="M0 8L8 2L16 8" fill="none" stroke="{FIELD}" stroke-width=".8"/>')

# Isometric (triangular) grid tile.
s = 12 * math.sqrt(3)
write("isometric.svg", f"{2*s:.3f}", 24,
    f'<path d="M0 0L{2*s:.3f} 24M{2*s:.3f} 0L0 24M0 12L{s:.3f} 0M{s:.3f} 24L{2*s:.3f} 12M0 12L{s:.3f} 24M{s:.3f} 0L{2*s:.3f} 12" '
    f'fill="none" stroke="{FIELD}" stroke-width=".7"/>')

# Tesseract: 4D hypercube, rotated, projected 4D -> 3D (perspective) -> 2D.
def tesseract(size, rot):
    verts = [[(i >> k & 1) * 2 - 1 for k in range(4)] for i in range(16)]
    def rotate(v, a, b, t):
        v = v[:]
        v[a], v[b] = v[a]*math.cos(t) - v[b]*math.sin(t), v[a]*math.sin(t) + v[b]*math.cos(t)
        return v
    pts = []
    for v in verts:
        v = rotate(v, 0, 3, rot[0]); v = rotate(v, 1, 2, rot[1]); v = rotate(v, 2, 3, rot[2])
        k = 2.4 / (2.4 - v[3] * 0.9)
        x, y, z = v[0]*k, v[1]*k, v[2]*k
        x, z = x*math.cos(.6) - z*math.sin(.6), x*math.sin(.6) + z*math.cos(.6)
        y, z = y*math.cos(.45) - z*math.sin(.45), y*math.sin(.45) + z*math.cos(.45)
        pts.append((x, y, verts.index(verts[len(pts)]) ))
    scale = size / 7.4
    c = size / 2
    lines_back, lines_front = [], []
    for i in range(16):
        for j in range(i + 1, 16):
            if bin(i ^ j).count("1") == 1:
                x1, y1 = c + pts[i][0]*scale, c + pts[i][1]*scale
                x2, y2 = c + pts[j][0]*scale, c + pts[j][1]*scale
                inner = not (i >> 3 & 1) and not (j >> 3 & 1)
                ln = f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>'
                (lines_front if inner else lines_back).append(ln)
    dots = "".join(f'<circle cx="{c + p[0]*scale:.1f}" cy="{c + p[1]*scale:.1f}" r="1.6"/>' for p in pts)
    return (f'<g fill="none" stroke-linecap="round"><g stroke="{RING}" stroke-width="1">{"".join(lines_back)}</g>'
            f'<g stroke="{CURSOR}" stroke-width="1.2">{"".join(lines_front)}</g></g><g fill="{INK}">{dots}</g>')
write("tesseract.svg", 320, 320, tesseract(320, (0.18, 0.0, 0.0)))

# Divider ornaments.
fan = [f'<path d="M4 30A28 28 0 0 1 60 30" fill="none" stroke="{RING}"/>',
       f'<path d="M12 30A20 20 0 0 1 52 30" fill="none" stroke="{RING}"/>']
for i in range(1, 8):
    a = math.pi + i * math.pi / 8
    fan.append(f'<line x1="{32 + 9*math.cos(a):.1f}" y1="{30 + 9*math.sin(a):.1f}" x2="{32 + 28*math.cos(a):.1f}" y2="{30 + 28*math.sin(a):.1f}" stroke="{RING}" stroke-width=".8"/>')
fan.append(f'<path d="M24 30A8 8 0 0 1 40 30Z" fill="{CURSOR}"/>')
write("rule-fan.svg", 64, 32, "".join(fan))

write("rule-arcs.svg", 96, 24,
    "".join(f'<path d="M{48-r} 22A{r} {r} 0 0 1 {48+r} 22" fill="none" stroke="{RING}" stroke-width=".9"/>' for r in (6, 12, 18))
    + f'<circle cx="48" cy="22" r="2.2" fill="{CURSOR}"/>')

write("rule-diamonds.svg", 72, 14,
    f'<path d="M8 7L14 1L20 7L14 13Z M52 7L58 1L64 7L58 13Z" fill="none" stroke="{RING}"/>'
    f'<path d="M28 7L36 -1L44 7L36 15Z" fill="{CURSOR}" transform="translate(0 0) scale(1 .93)"/>')

write("rule-cube.svg", 28, 28,
    f'<g fill="none" stroke="{RING}" stroke-linejoin="round"><path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5Z"/>'
    f'<path d="M4 8.5L14 14L24 8.5M14 14V25"/></g><path d="M14 3L24 8.5L14 14L4 8.5Z" fill="{CURSOR}" opacity=".9"/>')
print("ok")
