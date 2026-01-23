from PIL import Image, ImageDraw
import os

# Create a black image
width, height = 800, 600
image = Image.new('RGB', (width, height), color='black')
draw = ImageDraw.Draw(image)

# Coordinates
cw, ch = width // 2, height // 2

# Draw text (simulating the Manim scene)
# Note: Using default font since we might not have specific ttf paths, 
# but attempting to size it up if possible or just drawing clearly.

# We will just draw simple lines to represent the text if we can't load a huge font,
# but usually PIL has a default.

text_lines = [
    ("x + 3 = 7", "white", -50),
    ("- 3     - 3", "red", 0),
    ("-----------", "white", 20),
    ("x     = 4", "green", 50)
]

# Simple "font scaling" by mere position spacing (since loading fonts is brittle without paths)
# Actually, let's try to find a system font if possible, otherwise default is tiny.
# MacOS usually has Arial.
try:
    from PIL import ImageFont
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 60)
except:
    font = None # Default

for text, color, y_offset in text_lines:
    # Basic centering logic
    if font:
        left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
        w = right - left
        h = bottom - top
        draw.text((cw - w / 2, ch + y_offset - h / 2), text, font=font, fill=color)
    else:
        # Fallback for default font (tiny)
        draw.text((cw, ch + y_offset), text, fill=color)

# Save
output_path = "manim_preview_fallback.png"
image.save(output_path)
print(f"Generated preview at {os.path.abspath(output_path)}")
