import struct
import zlib
import os

def create_png(width, height, output_path):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk: width, height, 8-bit depth, color type 6 (RGBA), compression 0, filter 0, interlace 0
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Generate image data (Temple warm saffron / amber background with gold pagoda silhouette)
    raw_data = bytearray()
    cx, cy = width / 2, height / 2
    radius = width * 0.45
    
    for y in range(height):
        raw_data.append(0)  # Filter type: None
        for x in range(width):
            # Distance from center for rounded container
            dx = abs(x - cx)
            dy = abs(y - cy)
            
            # Rounded rect mask
            corner_r = width * 0.22
            in_shape = False
            if dx <= cx - corner_r and dy <= cy:
                in_shape = True
            elif dy <= cy - corner_r and dx <= cx:
                in_shape = True
            elif (dx - (cx - corner_r))**2 + (dy - (cy - corner_r))**2 <= corner_r**2:
                in_shape = True
                
            if not in_shape:
                raw_data.extend((0, 0, 0, 0))
                continue
                
            # Background gradient: Amber-800 to Amber-950
            t = (y / height)
            bg_r = int(154 * (1 - t) + 120 * t)
            bg_g = int(52 * (1 - t) + 53 * t)
            bg_b = int(18 * (1 - t) + 15 * t)
            
            # Gold border
            border_dist = min(cx - dx, cy - dy)
            is_border = abs(border_dist - width * 0.04) < (width * 0.015)
            
            # Central pagoda / temple silhouette calculation
            rel_x = (x - cx) / (width * 0.5)
            rel_y = (y - cy) / (height * 0.5)
            
            is_temple = False
            is_gold_accent = False
            
            # Pagoda tiers
            if -0.75 <= rel_y <= -0.55 and abs(rel_x) <= 0.08 * (1 - (rel_y + 0.75)/0.2): # spire
                is_temple = True
                is_gold_accent = True
            elif -0.55 <= rel_y <= -0.3 and abs(rel_x) <= 0.25 * (1 + (rel_y + 0.55)/0.25 * 0.5): # roof 1
                is_temple = True
            elif -0.3 <= rel_y <= 0.05 and abs(rel_x) <= 0.55 * (1 + (rel_y + 0.3)/0.35 * 0.4): # roof 2
                is_temple = True
            elif 0.05 <= rel_y <= 0.5 and abs(rel_x) <= 0.45: # body & pillars
                # Pillars
                pillar_pos = abs(rel_x)
                if 0.1 <= pillar_pos <= 0.18 or 0.3 <= pillar_pos <= 0.38:
                    is_temple = True
                    is_gold_accent = True
                elif rel_y >= 0.4: # base
                    is_temple = True
                elif -0.15 <= rel_y <= 0.3 and abs(rel_x) <= 0.15: # door
                    is_gold_accent = True
                else:
                    is_temple = True
            
            # Compass / Navigation Indicator in corner
            nav_dx = x - (width * 0.76)
            nav_dy = y - (height * 0.76)
            in_nav_circle = (nav_dx**2 + nav_dy**2) <= (width * 0.12)**2
            
            if in_nav_circle:
                raw_data.extend((21, 128, 61, 255)) # Green-700
            elif is_gold_accent:
                raw_data.extend((254, 240, 138, 255)) # Light gold
            elif is_temple:
                raw_data.extend((245, 158, 11, 255)) # Amber gold
            elif is_border:
                raw_data.extend((251, 191, 36, 180)) # Subtle gold border
            else:
                raw_data.extend((bg_r, bg_g, bg_b, 255))
    
    # IDAT chunk
    compressed_data = zlib.compress(bytes(raw_data), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    png += struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    with open(output_path, 'wb') as f:
        f.write(png)
    print(f"Generated {output_path} ({width}x{height})")

if __name__ == '__main__':
    os.makedirs('public', exist_ok=True)
    create_png(192, 192, 'public/pwa-192x192.png')
    create_png(512, 512, 'public/pwa-512x512.png')
    create_png(512, 512, 'public/pwa-maskable-512x512.png')
    create_png(180, 180, 'public/apple-touch-icon.png')
    create_png(64, 64, 'public/favicon.ico')
