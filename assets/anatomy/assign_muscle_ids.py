#!/usr/bin/env python3
"""
assign_muscle_ids.py
--------------------
Reads the raw source SVGs (front torso.svg / rear torso.svg) that were
generated with flat colour-coded muscle regions, and outputs annotated
versions (front-muscle-map.svg / rear-muscle-map.svg) where every muscle
path has:

  id="pectoralis_major_left"         # stable, unique element ID
  data-muscle="pectoralis_major"     # base muscle name for React lookups
  data-side="left"                   # "left" | "right" | "centre"

Non-muscle paths (body silhouette, skin, neutral areas) are left unchanged.

Usage:
  python3 assets/anatomy/assign_muscle_ids.py

Output:
  assets/anatomy/front-muscle-map.svg
  assets/anatomy/rear-muscle-map.svg

Run this ONCE before asking Codex to build the React components.
The output SVGs are the files Codex should work from.
"""

import re
import os
import xml.etree.ElementTree as ET

# ---------------------------------------------------------------------------
# Colour → muscle mappings
# Each entry: (target_hex, muscle_base_id, is_bilateral)
# is_bilateral=True  → paths get _left / _right based on centroid x
# is_bilateral=False → paths all share the base id with a numeric suffix
# ---------------------------------------------------------------------------

FRONT_COLOUR_MAP = [
    ('#FF4444', 'pectoralis_major',    True),
    ('#4477FF', 'anterior_deltoid',    True),
    ('#2255CC', 'lateral_deltoid',     True),
    ('#44BB44', 'biceps_brachii',      True),
    ('#228822', 'forearm_flexors',     True),
    ('#FFDD00', 'rectus_abdominis',    False),  # 8 segments, not strictly L/R
    ('#FF8800', 'external_obliques',   True),
    ('#00CCCC', 'quadriceps',          True),
    ('#9944CC', 'front_lower_leg',     True),
]

REAR_COLOUR_MAP = [
    ('#FF4444', 'upper_trapezius',              True),
    ('#4477FF', 'posterior_deltoid',            True),
    ('#44BB44', 'latissimus_dorsi',             True),
    ('#FF8800', 'middle_trapezius_rhomboids',   False),  # central, not L/R
    ('#FFDD00', 'erector_spinae',               True),
    ('#00CCCC', 'triceps_brachii',              True),
    ('#228822', 'forearm_extensors',            True),
    ('#9944CC', 'gluteus_maximus',              True),
    ('#CC5500', 'hamstrings',                   True),
    ('#2255CC', 'gastrocnemius',                True),
]

SVG_MIDPOINT_X = 512  # both SVGs use viewBox "0 0 1024 1536"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def colour_distance(a, b):
    ar, ag, ab = hex_to_rgb(a)
    br, bg, bb = hex_to_rgb(b)
    return ((ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2) ** 0.5


def is_muscle_colour(hex_colour):
    """Return True if the colour is saturated enough to be a muscle region."""
    r, g, b = hex_to_rgb(hex_colour)
    brightness = (r + g + b) / 3
    mx = max(r, g, b)
    mn = min(r, g, b)
    saturation = 0 if mx == 0 else (mx - mn) / mx
    return saturation > 0.15 and brightness < 230


def path_centroid_x(d_attr):
    """
    Approximate the horizontal centroid of an SVG path by averaging all
    numeric x-coordinates found in the path data.  We extract every pair of
    numbers that appear after M, L, C, Q, S, T commands (treating the first
    number of each pair as x).  Good enough for left/right discrimination.
    """
    # Pull out all coordinate-like numbers from the d string
    numbers = re.findall(r'[-+]?\d+\.?\d*', d_attr)
    floats = list(map(float, numbers))
    if len(floats) < 2:
        return SVG_MIDPOINT_X
    # Take every other value starting at index 0 as an x-coordinate
    xs = floats[0::2]
    return sum(xs) / len(xs)


def match_muscle(fill_hex, colour_map, threshold=45):
    """
    Return (muscle_base_id, is_bilateral) for the closest colour in the map,
    or None if no colour is within threshold distance.
    """
    if not is_muscle_colour(fill_hex):
        return None
    best_dist = float('inf')
    best_entry = None
    for target_hex, muscle_id, bilateral in colour_map:
        d = colour_distance(fill_hex, target_hex)
        if d < best_dist:
            best_dist = d
            best_entry = (muscle_id, bilateral)
    if best_dist <= threshold:
        return best_entry
    return None


# ---------------------------------------------------------------------------
# Core processing
# ---------------------------------------------------------------------------

def process_svg(source_path, output_path, colour_map, label):
    print(f'\n=== Processing {label} ===')
    print(f'  Source : {source_path}')
    print(f'  Output : {output_path}')

    with open(source_path, 'r', encoding='utf-8') as f:
        raw = f.read()

    # Use regex-based processing to preserve the exact original formatting
    # (ET.parse re-serialises and loses whitespace / attribute order).

    # Step 1: collect all <path … /> blocks with their fill colours
    path_pattern = re.compile(
        r'(<path\b[^>]*fill="(#[0-9A-Fa-f]{6})"[^>]*/?>)',
        re.DOTALL
    )

    # Group matched paths by muscle
    muscle_paths = {}  # muscle_id → list of (full_match_string, d_attr, centroid_x)
    for m in path_pattern.finditer(raw):
        full_tag = m.group(1)
        fill_hex = m.group(2)
        result = match_muscle(fill_hex, colour_map)
        if result is None:
            continue
        muscle_id, bilateral = result
        d_match = re.search(r'\bd="([^"]*)"', full_tag, re.DOTALL)
        d_attr = d_match.group(1) if d_match else ''
        cx = path_centroid_x(d_attr)
        muscle_paths.setdefault(muscle_id, []).append(
            (full_tag, bilateral, cx)
        )

    print(f'  Muscle groups found: {sorted(muscle_paths.keys())}')

    # Step 2: build replacement map — old tag → new tag with id + data attrs
    replacements = {}

    for muscle_id, entries in muscle_paths.items():
        bilateral = entries[0][1]

        if bilateral:
            # Sort by centroid x; lower x = anatomical right (viewer's left)
            # SVG x increases left→right; figure's right arm is on viewer's left
            # Convention used here: data-side tracks the FIGURE's side, so:
            #   centroid_x < SVG_MIDPOINT_X → figure's right → data-side="right"
            #   centroid_x >= SVG_MIDPOINT_X → figure's left  → data-side="left"
            sorted_entries = sorted(entries, key=lambda e: e[2])

            # Handle muscles with >2 paths (e.g. forearms with 4 paths)
            # Split into two halves by position
            half = max(1, len(sorted_entries) // 2)
            right_group = sorted_entries[:half]   # smaller x = figure's right
            left_group  = sorted_entries[half:]   # larger x  = figure's left

            for i, (tag, _, _) in enumerate(right_group):
                suffix = '' if len(right_group) == 1 else f'_{i+1}'
                elem_id = f'{muscle_id}_right{suffix}'
                replacements[tag] = _inject_attrs(tag, elem_id, muscle_id, 'right')

            for i, (tag, _, _) in enumerate(left_group):
                suffix = '' if len(left_group) == 1 else f'_{i+1}'
                elem_id = f'{muscle_id}_left{suffix}'
                replacements[tag] = _inject_attrs(tag, elem_id, muscle_id, 'left')

        else:
            # Non-bilateral (abs, central traps): number them sequentially
            for i, (tag, _, _) in enumerate(entries):
                elem_id = f'{muscle_id}_{i+1}'
                replacements[tag] = _inject_attrs(tag, elem_id, muscle_id, 'centre')

    # Step 3: apply replacements to the raw SVG string
    output = raw
    for old_tag, new_tag in replacements.items():
        output = output.replace(old_tag, new_tag, 1)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f'  ✅ Written — {len(replacements)} paths annotated')

    # Step 4: verification report
    print('\n  ID assignment summary:')
    for muscle_id in sorted(muscle_paths.keys()):
        assigned_ids = [v for k, v in replacements.items()
                        if f'data-muscle="{muscle_id}"' in v]
        ids_found = re.findall(r'id="([^"]+)"', ' '.join(assigned_ids))
        print(f'    {muscle_id}: {ids_found}')


def _inject_attrs(tag, elem_id, muscle_id, side):
    """
    Insert id, data-muscle, and data-side attributes into a <path> tag.
    Removes any existing id attribute first to avoid duplicates.
    """
    # Remove existing id if present
    tag = re.sub(r'\s+id="[^"]*"', '', tag)
    # Insert after <path
    return tag.replace(
        '<path',
        f'<path id="{elem_id}" data-muscle="{muscle_id}" data-side="{side}"',
        1
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    # Script lives at assets/anatomy/ — go up 3 levels to reach project root
    base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    assets = os.path.join(base, 'assets')
    out = os.path.join(assets, 'anatomy')

    process_svg(
        source_path=os.path.join(assets, 'front torso.svg'),
        output_path=os.path.join(out, 'front-muscle-map.svg'),
        colour_map=FRONT_COLOUR_MAP,
        label='Front torso',
    )

    process_svg(
        source_path=os.path.join(assets, 'rear torso.svg'),
        output_path=os.path.join(out, 'rear-muscle-map.svg'),
        colour_map=REAR_COLOUR_MAP,
        label='Rear torso',
    )

    print('\n✅ Both SVGs processed. Ready for Codex.')
    print('   Output: assets/anatomy/front-muscle-map.svg')
    print('   Output: assets/anatomy/rear-muscle-map.svg')
