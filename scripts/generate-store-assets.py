"""Generate Chrome Web Store assets for CornBlocker.

Creates:
- store-icon-128.png (128x128, no alpha, dark background)
- screenshot-1-blocked.png (1280x800, blocked page mockup)
- screenshot-2-popup.png (640x400, popup mockup)
- screenshot-3-message.png (1280x800, different message)
- screenshot-4-stats.png (1280x800, stats focus)

Usage: python scripts/generate-store-assets.py
Requires: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'store-assets')

# Colors
BG = '#0f0f1a'
GOLD = '#f5c542'
GOLD_DARK = '#e8a020'
TEXT = '#f0f0f0'
SUBTLE = '#a0a0b0'
CARD_BG = '#1a1a2e'
CARD_BORDER = '#2a2a3e'
GREEN = '#4ade80'
RED = '#e53935'

def rgb(hex_color):
    h = hex_color.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def try_font(size):
    """Try to load a nice font, fall back to default."""
    font_paths = [
        'C:/Windows/Fonts/segoeui.ttf',
        'C:/Windows/Fonts/arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    for fp in font_paths:
        try:
            return ImageFont.truetype(fp, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()

def try_bold_font(size):
    font_paths = [
        'C:/Windows/Fonts/segoeuib.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    ]
    for fp in font_paths:
        try:
            return ImageFont.truetype(fp, size)
        except (OSError, IOError):
            continue
    return try_font(size)

def try_emoji_font(size):
    font_paths = [
        'C:/Windows/Fonts/seguiemj.ttf',
    ]
    for fp in font_paths:
        try:
            return ImageFont.truetype(fp, size)
        except (OSError, IOError):
            continue
    return None

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_corn_icon(draw, cx, cy, size):
    """Draw the corn + prohibition icon."""
    margin = size * 0.12
    body_top = cy - size * 0.35
    body_bottom = cy + size * 0.25
    body_left = cx - size * 0.22
    body_right = cx + size * 0.22
    draw.ellipse([body_left, body_top, body_right, body_bottom], fill=rgb(GOLD))

    kernel_color = rgb(GOLD_DARK)
    lw = max(1, int(size * 0.02))
    for offset in [-0.1, 0, 0.1]:
        x = cx + size * offset
        draw.line([(x, body_top + size * 0.08), (x, body_bottom - size * 0.08)],
                  fill=kernel_color, width=lw)

    husk_color = rgb('#4CAF50')
    husk_top = body_bottom - size * 0.1
    husk_bottom = cy + size * 0.4
    draw.polygon([(cx - size * 0.05, husk_top), (cx - size * 0.22, husk_bottom),
                  (cx - size * 0.02, husk_bottom - size * 0.05)], fill=husk_color)
    draw.polygon([(cx + size * 0.05, husk_top), (cx + size * 0.22, husk_bottom),
                  (cx + size * 0.02, husk_bottom - size * 0.05)], fill=husk_color)

    line_width = max(2, int(size * 0.07))
    r = size * 0.45
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=rgb(RED), width=line_width)
    inset = size * 0.15
    draw.line([(cx + r - inset, cy - r + inset), (cx - r + inset, cy + r - inset)],
              fill=rgb(RED), width=line_width)


def generate_store_icon():
    """128x128 store icon with solid dark background (no alpha)."""
    size = 128
    img = Image.new('RGB', (size, size), rgb(BG))
    draw = ImageDraw.Draw(img)
    draw_corn_icon(draw, size / 2, size / 2, size)
    path = os.path.join(OUT_DIR, 'store-icon-128.png')
    img.save(path, 'PNG')
    print(f'Generated {path}')


def draw_blocked_page(img, draw, w, h, message, category):
    """Draw the blocked page UI onto an image."""
    font_title = try_bold_font(42)
    font_subtitle = try_font(20)
    font_msg = try_font(22)
    font_small = try_font(14)
    font_btn = try_bold_font(16)
    font_tag = try_bold_font(12)
    font_stat_val = try_bold_font(36)
    font_stat_label = try_font(11)
    font_footer = try_font(13)
    emoji_font = try_emoji_font(64)

    cx = w // 2
    y = 60

    # Corn emoji
    if emoji_font:
        draw.text((cx, y), '\U0001F33D', font=emoji_font, fill=rgb(GOLD), anchor='mt')
    else:
        draw.text((cx, y), '[corn]', font=try_bold_font(48), fill=rgb(GOLD), anchor='mt')
    y += 90

    # Title
    draw.text((cx, y), 'CornBlocked', font=font_title, fill=rgb(GOLD), anchor='mt')
    y += 55

    # Subtitle
    draw.text((cx, y), 'This site has been husked.', font=font_subtitle, fill=rgb(SUBTLE), anchor='mt')
    y += 45

    # Category tag
    tag_text = category.upper()
    tag_bbox = draw.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0] + 24
    tag_h = 26
    tag_x = cx - tag_w // 2
    draw_rounded_rect(draw, [tag_x, y, tag_x + tag_w, y + tag_h], 13,
                      fill=rgb('#2a2518'), outline=rgb('#3d3520'))
    draw.text((cx, y + tag_h // 2), tag_text, font=font_tag, fill=rgb(GOLD), anchor='mm')
    y += 45

    # Message card
    card_w = min(520, w - 80)
    card_x = cx - card_w // 2
    card_h = 100
    draw_rounded_rect(draw, [card_x, y, card_x + card_w, y + card_h], 12,
                      fill=rgb(CARD_BG), outline=rgb(CARD_BORDER))

    # Word wrap message
    words = message.split()
    lines = []
    line = ''
    for word in words:
        test = f'{line} {word}'.strip()
        bbox = draw.textbbox((0, 0), test, font=font_msg)
        if bbox[2] - bbox[0] > card_w - 40:
            lines.append(line)
            line = word
        else:
            line = test
    if line:
        lines.append(line)

    msg_y = y + card_h // 2 - len(lines) * 15
    for l in lines:
        draw.text((cx, msg_y), l, font=font_msg, fill=rgb('#e0e0e8'), anchor='mt')
        msg_y += 30
    y += card_h + 20

    # Urge timer
    bar_w = card_w
    bar_x = card_x
    draw.text((bar_x, y), 'URGE INTENSITY', font=font_small, fill=rgb(SUBTLE))
    draw.text((bar_x + bar_w, y), '67%', font=font_small, fill=rgb(GOLD), anchor='rt')
    y += 22
    draw_rounded_rect(draw, [bar_x, y, bar_x + bar_w, y + 8], 4, fill=rgb('#1a1a2e'))
    fill_w = int(bar_w * 0.67)
    draw_rounded_rect(draw, [bar_x, y, bar_x + fill_w, y + 8], 4, fill=rgb(GOLD))
    y += 25

    # Stats cards
    stat_w = (card_w - 12) // 2
    for i, (val, label) in enumerate([(str(5), 'BLOCKED TODAY'), (str(142), 'ALL TIME')]):
        sx = card_x + i * (stat_w + 12)
        draw_rounded_rect(draw, [sx, y, sx + stat_w, y + 70], 10,
                          fill=rgb(CARD_BG), outline=rgb(CARD_BORDER))
        draw.text((sx + stat_w // 2, y + 28), val, font=font_stat_val, fill=rgb(GOLD), anchor='mm')
        draw.text((sx + stat_w // 2, y + 55), label, font=font_stat_label, fill=rgb(SUBTLE), anchor='mm')
    y += 85

    # Buttons
    btn_h = 40
    btn_w1 = 140
    btn_w2 = 160
    gap = 12
    total_w = btn_w1 + btn_w2 + gap
    bx = cx - total_w // 2

    # Secondary button
    draw_rounded_rect(draw, [bx, y, bx + btn_w1, y + btn_h], 8,
                      fill=rgb('#1f1f30'), outline=rgb('#3a3a4e'))
    draw.text((bx + btn_w1 // 2, y + btn_h // 2), 'New message', font=font_btn,
              fill=rgb('#e0e0e8'), anchor='mm')

    # Primary button
    bx2 = bx + btn_w1 + gap
    draw_rounded_rect(draw, [bx2, y, bx2 + btn_w2, y + btn_h], 8, fill=rgb(GOLD))
    draw.text((bx2 + btn_w2 // 2, y + btn_h // 2), 'Do something else', font=font_btn,
              fill=rgb(BG), anchor='mm')
    y += btn_h + 25

    # Footer
    draw.text((cx, y), 'CornBlocker — your prefrontal cortex, finally getting a word in.',
              font=font_footer, fill=rgb('#555568'), anchor='mt')


def generate_screenshot_blocked(filename, message, category):
    """Generate a 1280x800 blocked page screenshot."""
    w, h = 1280, 800
    img = Image.new('RGB', (w, h), rgb(BG))
    draw = ImageDraw.Draw(img)

    # Floating corn emojis (subtle circles as placeholder)
    import random
    random.seed(42)
    for _ in range(12):
        x = random.randint(0, w)
        y_pos = random.randint(0, h)
        r = random.randint(8, 16)
        draw.ellipse([x-r, y_pos-r, x+r, y_pos+r], fill=rgb('#14142a'))

    draw_blocked_page(img, draw, w, h, message, category)

    path = os.path.join(OUT_DIR, filename)
    img.save(path, 'PNG')
    print(f'Generated {path}')


def generate_screenshot_popup():
    """Generate a 640x400 screenshot showing the popup."""
    w, h = 640, 400
    img = Image.new('RGB', (w, h), rgb(BG))
    draw = ImageDraw.Draw(img)

    font_title = try_bold_font(20)
    font_status = try_font(15)
    font_stat_val = try_bold_font(28)
    font_stat_label = try_font(10)
    font_footer = try_font(11)
    font_small = try_bold_font(12)

    # Center a popup card
    pw, ph = 280, 260
    px = (w - pw) // 2
    py = (h - ph) // 2

    # Popup background
    draw_rounded_rect(draw, [px, py, px + pw, py + ph], 12,
                      fill=rgb('#111122'), outline=rgb('#2a2a3e'), width=2)

    cx = px + pw // 2
    y = py + 20

    # Header
    draw.text((cx - 50, y), '\U0001F33D', font=try_font(24), fill=rgb(GOLD))
    draw.text((cx - 25, y + 2), 'CornBlocker', font=font_title, fill=rgb(GOLD))
    y += 40

    # Status row
    draw_rounded_rect(draw, [px + 16, y, px + pw - 16, y + 42], 10,
                      fill=rgb(CARD_BG), outline=rgb(CARD_BORDER))
    # Green dot
    draw.ellipse([px + 28, y + 16, px + 38, y + 26], fill=rgb(GREEN))
    draw.text((px + 45, y + 21), 'Protection ON', font=font_status, fill=rgb(TEXT), anchor='lm')

    # Toggle (on state)
    tx = px + pw - 56
    ty = y + 10
    draw_rounded_rect(draw, [tx, ty, tx + 40, ty + 22], 11, fill=rgb(GOLD))
    draw.ellipse([tx + 20, ty + 3, tx + 36, ty + 19], fill='white')
    y += 55

    # Stats
    sw = (pw - 44) // 2
    for i, (val, label) in enumerate([('5', 'TODAY'), ('142', 'ALL TIME')]):
        sx = px + 16 + i * (sw + 12)
        draw_rounded_rect(draw, [sx, y, sx + sw, y + 60], 8,
                          fill=rgb(CARD_BG), outline=rgb(CARD_BORDER))
        draw.text((sx + sw // 2, y + 24), val, font=font_stat_val, fill=rgb(GOLD), anchor='mm')
        draw.text((sx + sw // 2, y + 48), label, font=font_stat_label, fill=rgb(SUBTLE), anchor='mm')
    y += 75

    # Footer
    draw.text((cx, y), 'Block the corn. Reclaim your brain.',
              font=font_footer, fill=rgb('#555568'), anchor='mt')

    # Chrome toolbar mockup at top
    draw_rounded_rect(draw, [0, 0, w, 40], 0, fill=rgb('#202030'))
    draw.text((w // 2, 20), 'chrome-extension://cornblocker/popup.html',
              font=try_font(12), fill=rgb(SUBTLE), anchor='mm')

    path = os.path.join(OUT_DIR, 'screenshot-2-popup.png')
    img.save(path, 'PNG')
    print(f'Generated {path}')


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    generate_store_icon()

    generate_screenshot_blocked(
        'screenshot-1-blocked.png',
        "Your future self just mass-texted your brain cells a thank you.",
        'humor'
    )

    generate_screenshot_popup()

    generate_screenshot_blocked(
        'screenshot-3-message.png',
        "You're not fighting something. You're becoming someone.",
        'identity'
    )

    generate_screenshot_blocked(
        'screenshot-4-science.png',
        "Your prefrontal cortex just overrode your limbic system. That's literally evolution.",
        'science'
    )

    print(f'\nAll assets saved to {OUT_DIR}')


if __name__ == '__main__':
    main()
