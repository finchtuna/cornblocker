"""Generate CornBlocker extension icons.

Draws a corn emoji with a red prohibition circle overlay on a transparent
background. Outputs 16x16, 48x48, 128x128, and 256x256 PNGs.

Usage: python scripts/generate-icons.py
Requires: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

SIZES = [16, 48, 128, 256]
ICON_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'icons')


def draw_corn(draw, size):
    """Draw a stylized corn cob."""
    cx, cy = size / 2, size / 2
    margin = size * 0.12

    # Corn body — yellow oval
    body_top = margin + size * 0.05
    body_bottom = size - margin - size * 0.1
    body_left = cx - size * 0.22
    body_right = cx + size * 0.22
    draw.ellipse([body_left, body_top, body_right, body_bottom], fill='#F5C542')

    # Darker kernel rows — vertical lines on the corn body
    kernel_color = '#D4A017'
    line_width = max(1, int(size * 0.02))
    for offset in [-0.1, 0, 0.1]:
        x = cx + size * offset
        draw.line(
            [(x, body_top + size * 0.08), (x, body_bottom - size * 0.08)],
            fill=kernel_color,
            width=line_width
        )

    # Husk leaves — two green triangles at the bottom
    husk_color = '#4CAF50'
    husk_top = body_bottom - size * 0.15
    husk_bottom = size - margin * 0.5

    # Left husk
    draw.polygon([
        (cx - size * 0.05, husk_top),
        (cx - size * 0.25, husk_bottom),
        (cx - size * 0.02, husk_bottom - size * 0.05)
    ], fill=husk_color)

    # Right husk
    draw.polygon([
        (cx + size * 0.05, husk_top),
        (cx + size * 0.25, husk_bottom),
        (cx + size * 0.02, husk_bottom - size * 0.05)
    ], fill=husk_color)


def draw_prohibition(draw, size):
    """Draw a red circle with diagonal slash."""
    margin = size * 0.05
    line_width = max(2, int(size * 0.07))

    bbox = [margin, margin, size - margin, size - margin]

    # Red circle outline
    draw.ellipse(bbox, outline='#E53935', width=line_width)

    # Diagonal slash (top-right to bottom-left)
    inset = size * 0.15
    draw.line(
        [(size - inset, inset), (inset, size - inset)],
        fill='#E53935',
        width=line_width
    )


def generate_icon(size):
    """Generate a single icon at the given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw_corn(draw, size)
    draw_prohibition(draw, size)

    return img


def main():
    os.makedirs(ICON_DIR, exist_ok=True)

    for size in SIZES:
        img = generate_icon(size)
        path = os.path.join(ICON_DIR, f'icon{size}.png')
        img.save(path, 'PNG')
        print(f'Generated {path} ({size}x{size})')

    print('Done!')


if __name__ == '__main__':
    main()
