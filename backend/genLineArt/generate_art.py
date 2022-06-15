from curses import start_color
from PIL import Image, ImageDraw, ImageChops
import random
import colorsys
import sys

def generate_random_color():
    h = random.random()
    s = 1
    v = 1
    float_rgb = colorsys.hsv_to_rgb(h,s,v)
    rgb = [int(x * 255) for x in float_rgb]
    return tuple (rgb)

def color_interpolate(start_color, end_color, factor: float):
    # Find the color that is exactly factor (0.0 - 1.0) between the two colors.
    new_color_rgb = []
    for i in range(3):
        new_color_value = factor * end_color[i] + (1 - factor) * start_color[i]
        new_color_rgb.append(int(new_color_value))

    return tuple(new_color_rgb)

def generate_art():
    image_size_px = 1500
    padding_px = 120
    image_bg_color = (0,0,0)
    start_color = generate_random_color()
    end_color = generate_random_color()

    image = Image.new(
        "RGB", 
        size=(image_size_px, image_size_px), 
        color=image_bg_color)
    # Draw some lines

    draw = ImageDraw.Draw(image)
    points = []

    # Generate The points
    for _ in range(15):
        random_point= (
            random.randint(padding_px, image_size_px - padding_px),
            random.randint(padding_px, image_size_px - padding_px))
        points.append(random_point)

    # Center image.
    # Find the bounding box.
    min_x = min([p[0] for p in points])
    max_x = max([p[0] for p in points])
    min_y = min([p[1] for p in points])
    max_y = max([p[1] for p in points])

    # Find offsets.
    x_offset = (min_x - padding_px) - (image_size_px - padding_px - max_x)
    y_offset = (min_y - padding_px) - (image_size_px - padding_px - max_y)

    # Move all points by offset.
    for i, point in enumerate(points):
        points[i] = (point[0] - x_offset // 2, point[1] - y_offset // 2)


    # Draw the lines
    thickness = 0
    n_point = len(points) - 1
    for i, point in enumerate(points):
        
        # Overlay canvas
        overlay_image = Image.new("RGB", size=(image_size_px, image_size_px), color=image_bg_color)
        overlay_draw = ImageDraw.Draw(overlay_image)

        p1 = point
        if i == n_point:
            p2 = points[0]
        else:
            p2 = points[i-1]
            
        line_xy = (p1,p2)
        color_factor = i /n_point
        line_color = color_interpolate(start_color, end_color, color_factor)
        thickness = random.randint(5,5*i+5)
        overlay_draw.line(line_xy, fill= line_color, width=thickness)
        image = ImageChops.add(image, overlay_image)

    image.save("test.png")

generate_art()