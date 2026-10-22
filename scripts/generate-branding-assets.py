import os
import math
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# Helper for rounded rectangles
def draw_rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

# Helper to draw a 4-point sparkle star
def draw_sparkle(draw, center, size, fill):
    cx, cy = center
    r = size
    inner_r = size * 0.28
    points = [
        (cx, cy - r),
        (cx + inner_r, cy - inner_r),
        (cx + r, cy),
        (cx + inner_r, cy + inner_r),
        (cx, cy + r),
        (cx - inner_r, cy + inner_r),
        (cx - r, cy),
        (cx - inner_r, cy - inner_r),
    ]
    draw.polygon(points, fill=fill)

def generate_logo():
    print("Generating logo.png (512x512)...")
    img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Base rounded tile
    draw_rounded_rect(draw, (24, 24, 488, 488), radius=108, fill=(255, 248, 237, 255), outline=(230, 215, 198, 255), width=4)

    # Inner decorative glow
    draw_rounded_rect(draw, (36, 36, 476, 476), radius=96, outline=(255, 255, 255, 200), width=3)

    # Center circle badge
    draw.ellipse((146, 110, 366, 330), fill=(189, 75, 42, 255))
    draw.ellipse((154, 118, 358, 322), outline=(255, 255, 255, 90), width=3)

    # Sparkle inside circle badge
    draw_sparkle(draw, (256, 220), 65, fill=(255, 248, 237, 255))
    draw_sparkle(draw, (200, 160), 18, fill=(255, 230, 210, 240))
    draw_sparkle(draw, (312, 160), 18, fill=(255, 230, 210, 240))

    # Text rendering using fallback / basic lines if TTF is not available
    # Bottom brand label banner
    draw_rounded_rect(draw, (96, 360, 416, 440), radius=22, fill=(31, 27, 24, 255))
    
    # Text placeholder / typography
    draw.text((120, 385), "DSALoop by campusloop.space", fill=(255, 248, 237, 255))

    img.save(os.path.join(PUBLIC_DIR, "logo.png"), "PNG")
    print("✓ Saved logo.png")

def generate_pwa_icons():
    print("Generating PWA icons (512x512, 192x192, 180x180)...")
    
    # 512
    img512 = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d512 = ImageDraw.Draw(img512)
    draw_rounded_rect(d512, (16, 16, 496, 496), radius=110, fill=(189, 75, 42, 255))
    draw_sparkle(d512, (256, 256), 140, fill=(255, 248, 237, 255))
    draw_sparkle(d512, (160, 150), 32, fill=(255, 230, 210, 220))
    draw_sparkle(d512, (352, 150), 32, fill=(255, 230, 210, 220))
    img512.save(os.path.join(PUBLIC_DIR, "icon-512.png"), "PNG")

    # 192
    img192 = img512.resize((192, 192), Image.Resampling.LANCZOS)
    img192.save(os.path.join(PUBLIC_DIR, "icon-192.png"), "PNG")

    # apple touch icon 180
    img180 = Image.new("RGBA", (180, 180), (255, 248, 237, 255))
    d180 = ImageDraw.Draw(img180)
    draw_rounded_rect(d180, (8, 8, 172, 172), radius=38, fill=(189, 75, 42, 255))
    draw_sparkle(d180, (90, 90), 50, fill=(255, 248, 237, 255))
    img180.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")

    # Favicon 32 & 64
    img64 = img512.resize((64, 64), Image.Resampling.LANCZOS)
    img64.save(os.path.join(PUBLIC_DIR, "favicon.png"), "PNG")

    img32 = img512.resize((32, 32), Image.Resampling.LANCZOS)
    img32.save(os.path.join(PUBLIC_DIR, "favicon.ico"), format="ICO", sizes=[(32, 32), (16, 16)])

    print("✓ Saved icon-512.png, icon-192.png, apple-touch-icon.png, favicon.png, favicon.ico")

def generate_og_image():
    print("Generating og-image.png (1200x630)...")
    w, h = 1200, 630
    img = Image.new("RGBA", (w, h), (255, 248, 237, 255))
    draw = ImageDraw.Draw(img)

    # Subtle background gradient simulation
    for y in range(h):
        alpha = int(255 - (y / h) * 18)
        color = (255, int(248 - (y / h) * 10), int(237 - (y / h) * 15), 255)
        draw.line([(0, y), (w, y)], fill=color)

    # Top border decorative accent
    draw.rectangle([(0, 0), (w, 6)], fill=(189, 75, 42, 255))

    # Outer decorative frame
    draw_rounded_rect(draw, (32, 32, w - 32, h - 32), radius=28, outline=(230, 215, 198, 255), width=2)

    # Brand pill badge top left
    draw_rounded_rect(draw, (64, 64, 390, 112), radius=24, fill=(189, 75, 42, 25), outline=(189, 75, 42, 60), width=1)
    draw_sparkle(draw, (92, 88), 12, fill=(189, 75, 42, 255))
    draw.text((115, 80), "DSALoop by campusloop.space", fill=(189, 75, 42, 255))

    # Main Headline & Subheadline
    draw.text((64, 150), "DSALoop", fill=(31, 27, 24, 255))
    draw.text((64, 230), "Full Online Compiler + LeetCode Practice Workspace + DSA Judge", fill=(70, 65, 58, 255))

    # Feature cards row
    features = [
        ("Python 3.12", "C++20 GCC", "Java 21"),
        ("Node.js 20", "Go 1.23", "Rust 1.82"),
        ("2,000+ Questions", "185 Company Sets", "28 System Design Chapters")
    ]

    card_x = 64
    card_y = 310
    draw_rounded_rect(draw, (card_x, card_y, card_x + 520, card_y + 190), radius=20, fill=(255, 255, 255, 220), outline=(230, 215, 198, 255), width=1)

    draw_sparkle(draw, (card_x + 30, card_y + 35), 10, fill=(189, 75, 42, 255))
    draw.text((card_x + 50, card_y + 26), "Interactive IDE & Competitive Judge Engine", fill=(31, 27, 24, 255))
    draw.text((card_x + 30, card_y + 70), "- CodeMirror 6 with dark & light themes\n- Standard Input (stdin) & custom test cases\n- Authoritative hidden test case evaluations\n- Real-time runtime ms & memory benchmarking", fill=(90, 85, 75, 255))

    # Right side code preview card
    code_x = 620
    draw_rounded_rect(draw, (code_x, card_y, w - 64, card_y + 190), radius=20, fill=(22, 19, 18, 255), outline=(50, 44, 40, 255), width=1)
    
    # Terminal dots
    draw.ellipse((code_x + 24, card_y + 18, code_x + 34, card_y + 28), fill=(244, 122, 85, 255))
    draw.ellipse((code_x + 42, card_y + 18, code_x + 52, card_y + 28), fill=(212, 139, 56, 255))
    draw.ellipse((code_x + 60, card_y + 18, code_x + 70, card_y + 28), fill=(34, 197, 94, 255))
    draw.text((code_x + 90, card_y + 16), "dsaloop-judge.py", fill=(140, 130, 120, 255))

    draw.text((code_x + 24, card_y + 55), "class Solution:\n    def twoSum(self, nums, target):\n        lookup = {}\n        for i, n in enumerate(nums):\n            if target - n in lookup:\n                return [lookup[target - n], i]\n            lookup[n] = i\n\n# Verdict: ACCEPTED (5/5 tests passed)", fill=(234, 220, 206, 255))

    # Footer Watermark
    draw.text((64, 550), "https://dsaloop.campusloop.space/  |  Free student learning platform by https://campusloop.space/", fill=(120, 110, 100, 255))

    img.save(os.path.join(PUBLIC_DIR, "og-image.png"), "PNG")
    print("✓ Saved og-image.png")

if __name__ == "__main__":
    generate_logo()
    generate_pwa_icons()
    generate_og_image()
