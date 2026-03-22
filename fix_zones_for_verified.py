#!/usr/bin/env python3
"""
Auto-adjust zone centers and radii to encompass all their POIs.
Calculates the centroid of all POIs in each zone and finds the minimum radius.
"""
import json, math

with open('/home/user/workspace/beijing-metro-tod/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

zones_start = content.index('const OPPORTUNITY_ZONES = [')
zones_json_start = content.index('[', zones_start)
depth = 0
i = zones_json_start
while i < len(content):
    if content[i] == '[': depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            zones_json_end = i + 1
            break
    i += 1

zones = json.loads(content[zones_json_start:zones_json_end])
rest_of_file = content[zones_json_end:]
header = content[:zones_json_start]

def haversine(lon1, lat1, lon2, lat2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

for zone in zones:
    if 'pois' not in zone:
        continue
    
    # Collect all POI coordinates
    all_coords = []
    for cat, pois in zone['pois'].items():
        for poi in pois:
            all_coords.append(poi['coords'])
    
    if not all_coords:
        continue
    
    # Calculate centroid
    avg_lng = sum(c[0] for c in all_coords) / len(all_coords)
    avg_lat = sum(c[1] for c in all_coords) / len(all_coords)
    
    # Find max distance from centroid to any POI
    max_dist = 0
    farthest_poi = ""
    for cat, pois in zone['pois'].items():
        for poi in pois:
            d = haversine(avg_lng, avg_lat, poi['coords'][0], poi['coords'][1])
            if d > max_dist:
                max_dist = d
                farthest_poi = poi['name']
    
    # Set radius to max_dist + 10% buffer, rounded to nearest 100
    new_radius = int(math.ceil((max_dist * 1.10) / 100) * 100)
    new_center = [round(avg_lng, 4), round(avg_lat, 4)]
    
    old_center = zone['center']
    old_radius = zone['radius']
    
    # Check if any POIs are outside current zone
    outside = 0
    for cat, pois in zone['pois'].items():
        for poi in pois:
            d = haversine(zone['center'][0], zone['center'][1], poi['coords'][0], poi['coords'][1])
            if d > zone['radius']:
                outside += 1
    
    if outside > 0:
        zone['center'] = new_center
        zone['radius'] = new_radius
        print(f"{'⚠️' if outside > 0 else '✅'} {zone['name']}: center {old_center}->{new_center}, radius {old_radius}->{new_radius} (max={max_dist:.0f}m to {farthest_poi})")
    else:
        print(f"✅ {zone['name']}: OK (max={max_dist:.0f}m, radius={zone['radius']})")

# Write back
new_content = header + json.dumps(zones, ensure_ascii=False, indent=2) + rest_of_file
with open('/home/user/workspace/beijing-metro-tod/data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("\ndata.js updated")
