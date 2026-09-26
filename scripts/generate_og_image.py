#!/usr/bin/env python3
"""Generate `public/og-image.png` — the 1200x630 social preview card.

The card reuses the exact colour tokens from `src/styles.css` (:root, dark
theme) so the link preview matches the site itself.

Usage (from the project root):

    python scripts/generate_og_image.py

Requires Pillow (`pip install pillow`). The generated PNG is committed to the
repo on purpose: the deploy build on Vercel runs Node only and has no Pillow,
so the image cannot be produced during `npm run build`. The build does verify
the file exists — see `vite.config.js`.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH, HEIGHT = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "og-image.png"

# --- design tokens, mirrored from src/styles.css -------------------------
BG = "#080b14"
SURFACE = "#111827"
TEXT = "#f8fafc"
TEXT_SOFT = "#cbd5e1"
LINE = (255, 255, 255, 26)  # rgba(255,255,255,.10)
GRID = (255, 255, 255, 5)  # rgba(255,255,255,.018)
ACCENT = "#6ee7b7"
ACCENT_2 = "#60a5fa"
OUTPUT_TEXT = "#8fa0b7"
BODY_TEXT = "#b8c0cf"
SUCCESS = "#86efac"
CHIP_TEXT = "#a7f3d0"
TERMINAL_DOT = "#334155"

SANS = ["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
SANS_SEMI = ["C:/Windows/Fonts/seguisb.ttf", "C:/Windows/Fonts/segoeuib.ttf"]
SANS_BOLD = ["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
MONO = ["C:/Windows/Fonts/consola.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]
MONO_BOLD = ["C:/Windows/Fonts/consolab.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"]

NAME = "Leo Jasper V. Ladica"
ROLE = "IT Staff  ·  Sta. Lucia Mall Davao"
KICKER = "IT PORTFOLIO"
CHIPS = ["IT Support", "Active Directory", "Network Monitoring", "Full-Stack Development"]
BODY = [
    "Hands-on IT support, Active Directory and network operations,",
    "backed by full-stack development experience.",
]
EMAIL = "leojasperladica0@gmail.com"
LOCATION = "Davao City, Philippines"
SITE = "jasper-portfolio-puce.vercel.app"
TERMINAL = [
    ("prompt", "$ cat expertise.txt"),
    ("output", "Active Directory"),
    ("output", "Network Maintenance"),
    ("output", "Endpoint Support"),
    ("prompt", "$ status --career"),
    ("success", "supporting · learning · improving"),
]


def font(candidates, size):
    """First available font in `candidates`, else Pillow's bundled default."""
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10
        return ImageFont.load_default()


def tracked(draw, x, y, text, fnt, fill, tracking):
    """Draw text with extra letter-spacing; returns the advance width."""
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        x += draw.textlength(char, font=fnt) + tracking
    return x


def chip_width(draw, text, fnt):
    """Measured pill width, so callers can wrap *before* drawing anything."""
    return draw.textlength(text, font=fnt) + 32


def chip(draw, x, y, text, fnt):
    """Draw one outlined pill."""
    pad_x, pad_y = 16, 10
    w = draw.textlength(text, font=fnt)
    h = fnt.size + pad_y * 2
    draw.rounded_rectangle([x, y, x + w + pad_x * 2, y + h], radius=h // 2, outline=(110, 231, 183, 70), width=2)
    draw.text((x + pad_x, y + pad_y - 1), text, font=fnt, fill=CHIP_TEXT)


def build():
    base = Image.new("RGBA", (WIDTH, HEIGHT), BG)

    # Grid + two soft brand glows, matching the site's background treatment.
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for x in range(0, WIDTH, 56):
        gd.line([(x, 0), (x, HEIGHT)], fill=GRID)
    for y in range(0, HEIGHT, 56):
        gd.line([(0, y), (WIDTH, y)], fill=GRID)
    gd.ellipse([WIDTH - 620, -280, WIDTH + 120, 360], fill=(110, 231, 183, 40))
    gd.ellipse([-280, HEIGHT - 260, 420, HEIGHT + 240], fill=(96, 165, 250, 28))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(110)))

    draw = ImageDraw.Draw(base)
    f_kicker = font(MONO, 21)
    f_name = font(SANS_SEMI, 78)
    f_role = font(SANS, 31)
    f_chip = font(SANS, 20)
    f_body = font(SANS, 23)
    f_mono = font(MONO, 19)
    f_mono_bold = font(MONO_BOLD, 19)

    # --- headline block ---
    tracked(draw, 84, 66, KICKER, f_kicker, ACCENT, 5)
    draw.text((84, 104), NAME, font=f_name, fill=TEXT)
    draw.text((84, 206), ROLE, font=f_role, fill=TEXT_SOFT)
    draw.line([(84, 274), (WIDTH - 84, 274)], fill=LINE, width=2)

    # --- chips, copy and contact, left column ---
    chip_right_edge = 620  # never run under the terminal card
    x, y = 84, 300
    for label in CHIPS:
        w = chip_width(draw, label, f_chip)
        if x + w > chip_right_edge:
            x, y = 84, y + f_chip.size + 26
        chip(draw, x, y, label, f_chip)
        x += w + 12
    for i, line in enumerate(BODY):
        draw.text((84, 430 + i * 31), line, font=f_body, fill=BODY_TEXT)
    draw.text((84, HEIGHT - 132), EMAIL, font=f_mono, fill=OUTPUT_TEXT)
    draw.text((84, HEIGHT - 100), LOCATION, font=f_mono, fill=OUTPUT_TEXT)
    tracked(draw, 84, HEIGHT - 64, SITE, f_mono, ACCENT, 0.6)

    # --- terminal card, right column (height derived from its content) ---
    line_h, header_h, pad_top, pad_bottom = 32, 60, 18, 22
    cx1, cx2, cy1 = 676, WIDTH - 84, 300
    cy2 = cy1 + header_h + pad_top + len(TERMINAL) * line_h + pad_bottom
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=20, fill=(17, 24, 39, 232), outline=(255, 255, 255, 30), width=2)
    for i, dot in enumerate([ACCENT_2, ACCENT, TERMINAL_DOT]):
        dx = cx1 + 28 + i * 22
        draw.ellipse([dx, cy1 + 24, dx + 12, cy1 + 36], fill=dot)
    draw.line([(cx1, cy1 + header_h), (cx2, cy1 + header_h)], fill=(255, 255, 255, 22), width=2)
    tx, ty = cx1 + 30, cy1 + header_h + pad_top
    for kind, text in TERMINAL:
        if kind == "prompt":
            draw.text((tx, ty), "$", font=f_mono_bold, fill=ACCENT)
            draw.text((tx + 20, ty), text[1:].strip(), font=f_mono_bold, fill=TEXT_SOFT)
        else:
            draw.text((tx + 20, ty), text, font=f_mono, fill=SUCCESS if kind == "success" else OUTPUT_TEXT)
        ty += line_h

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(OUTPUT, "PNG", optimize=True)
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"wrote {OUTPUT.relative_to(ROOT)}  {WIDTH}x{HEIGHT}  {size_kb:.1f} kB")


if __name__ == "__main__":
    build()
