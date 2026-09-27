#!/usr/bin/env python3
"""Regenerate the site's derived image assets.

Usage (from the project root):

    python scripts/prepare_images.py

Two jobs, both writing committed files on purpose — the Vercel build runs Node
only and has no Pillow, so neither can happen during `npm run build`.

1. Project screenshots: `public/images/*.png` -> `.webp`. They are four large UI
   captures and the single biggest chunk of page weight. WebP at quality 90 is
   visually indistinguishable on flat UI colours and text, and roughly a quarter
   of the PNG size. The HTML points straight at the `.webp` files: WebP has been
   supported by every browser this site targets for years, so no PNG fallback is
   committed (a fallback would double the repo and never be requested).

2. `public/apple-touch-icon.png` — iOS ignores SVG favicons and substitutes a
   screenshot of the page. This redraws the mark from `favicon.svg` at 180x180.
   Drawn full-bleed with no transparency: iOS applies its own corner mask, and
   transparent corners surface as black.

Requires Pillow (`pip install pillow`).
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover - environment guard
    sys.exit("Pillow is required: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
IMAGE_DIR = ROOT / "public" / "images"
TOUCH_ICON = ROOT / "public" / "apple-touch-icon.png"

# Lossy quality for the screenshots. High enough that antialiased UI text stays
# crisp; dropping to the usual 80 starts to fringe small text on these captures.
WEBP_QUALITY = 90

SCREENSHOTS = ["Ticketsystem.png", "Ticketsystem2.png", "Retail-Pos.png", "Retail-Pos2.png"]

# --- mark tokens, mirrored from favicon.svg and src/styles.css -----------
ICON_SIZE = 180
ACCENT = "#6ee7b7"  # --accent (dark theme)
ON_ACCENT = "#062019"  # --on-accent
SUPERSAMPLE = 4  # drawn large, downscaled once, so edges stay clean

BOLD_FONTS = [
    "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]


def bold_font(size):
    """First available bold font, else Pillow's bundled default."""
    for path in BOLD_FONTS:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10
        return ImageFont.load_default()


def convert_screenshots():
    for name in SCREENSHOTS:
        source = IMAGE_DIR / name
        target = source.with_suffix(".webp")
        if not source.exists():
            if target.exists():
                print(f"skip   {target.name} (source PNG already converted)")
                continue
            sys.exit(f"missing source image: {source.relative_to(ROOT)}")

        with Image.open(source) as img:
            img.convert("RGBA").save(target, "WEBP", quality=WEBP_QUALITY, method=6)
        before = source.stat().st_size / 1024
        after = target.stat().st_size / 1024
        print(
            f"wrote  {target.relative_to(ROOT)}  {before:6.1f} -> {after:6.1f} kB "
            f"({after / before * 100:.0f}%)"
        )


def build_touch_icon():
    size = ICON_SIZE * SUPERSAMPLE
    canvas = Image.new("RGB", (size, size), ACCENT)
    draw = ImageDraw.Draw(canvas)

    # 26px on favicon.svg's 64px canvas, scaled up; weight 800 maps to Arial Bold.
    fnt = bold_font(round(26 * size / 64))
    text = "LJ"

    # Centre the drawn ink rather than the nominal line box, which sits optically
    # high because of the descender space below the baseline.
    left, top, right, bottom = draw.textbbox((0, 0), text, font=fnt)
    draw.text(
        ((size - (right - left)) / 2 - left, (size - (bottom - top)) / 2 - top),
        text,
        font=fnt,
        fill=ON_ACCENT,
    )

    canvas.resize((ICON_SIZE, ICON_SIZE), Image.LANCZOS).save(TOUCH_ICON, "PNG", optimize=True)
    print(f"wrote  {TOUCH_ICON.relative_to(ROOT)}  {ICON_SIZE}x{ICON_SIZE}")


if __name__ == "__main__":
    convert_screenshots()
    build_touch_icon()
