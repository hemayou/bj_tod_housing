#!/usr/bin/env python3
"""Check all POIs against their zone boundaries and identify outliers."""
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

def haversine(lon1, lat1, lon2, lat2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

print("="*80)
print("POI OUTLIER DETECTION - All POIs outside zone radius")
print("="*80)

total_pois = 0
outliers = []

for zone in zones:
    if 'pois' not in zone:
        continue
    cx, cy = zone['center']
    radius = zone['radius']
    
    for cat, pois in zone['pois'].items():
        for poi in pois:
            total_pois += 1
            px, py = poi['coords']
            dist = haversine(cx, cy, px, py)
            ratio = dist / radius
            
            if ratio > 1.0:
                outliers.append({
                    'zone': zone['name'],
                    'zone_id': zone['id'],
                    'poi': poi['name'],
                    'cat': cat,
                    'dist': dist,
                    'radius': radius,
                    'ratio': ratio,
                    'coords': poi['coords'],
                    'zone_center': zone['center']
                })

# Sort by ratio (worst first)
outliers.sort(key=lambda x: -x['ratio'])

print(f"\nTotal POIs: {total_pois}")
print(f"Outliers (outside zone radius): {len(outliers)}")
print()

for o in outliers:
    flag = "🔴" if o['ratio'] > 1.5 else "🟡"
    print(f"{flag} {o['zone']} | {o['poi']} ({o['cat']})")
    print(f"   Distance: {o['dist']:.0f}m / Radius: {o['radius']}m = {o['ratio']:.2f}x")
    print(f"   POI: [{o['coords'][0]}, {o['coords'][1]}]  Zone center: [{o['zone_center'][0]}, {o['zone_center'][1]}]")
    print()

# Also show all zone summaries
print("\n" + "="*80)
print("ZONE SUMMARY")
print("="*80)
for zone in zones:
    if 'pois' not in zone:
        continue
    cx, cy = zone['center']
    radius = zone['radius']
    poi_count = sum(len(pois) for pois in zone['pois'].values())
    
    dists = []
    for cat, pois in zone['pois'].items():
        for poi in pois:
            px, py = poi['coords']
            d = haversine(cx, cy, px, py)
            dists.append((poi['name'], d))
    
    dists.sort(key=lambda x: -x[1])
    max_d = dists[0][1] if dists else 0
    avg_d = sum(d for _, d in dists) / len(dists) if dists else 0
    outside = sum(1 for _, d in dists if d > radius)
    
    status = "✅" if outside == 0 else f"⚠️ {outside} outside"
    print(f"{zone['name']} (r={radius}m): {poi_count} POIs, avg={avg_d:.0f}m, max={max_d:.0f}m {status}")
    if outside > 0:
        for name, d in dists[:3]:
            if d > radius:
                print(f"   - {name}: {d:.0f}m ({d/radius:.2f}x)")
