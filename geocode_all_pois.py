#!/usr/bin/env python3
"""
Geocode ALL 240 POIs using OSM Nominatim to get verified coordinates.
Outputs a JSON file mapping POI names to verified [lng, lat] coordinates.
Rate-limited to 1 request per second per Nominatim policy.
"""
import json, time, urllib.request, urllib.parse, sys, os

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "BeijingTODApp/2.0 (academic research project; hemayou@gmail.com)"}

# Beijing bounding box
BJ_BOUNDS = {
    "min_lat": 39.4, "max_lat": 41.0,
    "min_lng": 115.5, "max_lng": 117.5
}

def nominatim_search(query, limit=3):
    """Search Nominatim and return results."""
    params = urllib.parse.urlencode({
        "q": query,
        "format": "json",
        "limit": limit,
        "countrycodes": "cn",
        "viewbox": "115.5,41.0,117.5,39.4",
        "bounded": 1
    })
    url = f"{NOMINATIM_URL}?{params}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            results = []
            for item in data:
                lat = float(item["lat"])
                lon = float(item["lon"])
                if BJ_BOUNDS["min_lat"] <= lat <= BJ_BOUNDS["max_lat"] and \
                   BJ_BOUNDS["min_lng"] <= lon <= BJ_BOUNDS["max_lng"]:
                    results.append({
                        "coords": [round(lon, 6), round(lat, 6)],
                        "display": item.get("display_name", ""),
                        "type": item.get("type", ""),
                        "class": item.get("class", "")
                    })
            return results
    except Exception as e:
        print(f"  ERROR: {e}", file=sys.stderr)
        return []

def geocode_poi(name, zone_name):
    """Try multiple search strategies for a POI."""
    strategies = [
        f"{name} 北京",
        f"{name}",
        f"{name.split('（')[0].split('(')[0].strip()} 北京",
    ]
    
    # For zone-specific hints
    area_hints = {
        "回龙观-西三旗": "昌平",
        "天通苑": "昌平 天通苑",
        "上地-马连洼": "海淀",
        "丽泽-草桥": "丰台",
        "鲁谷": "石景山",
        "园博园": "丰台 园博园",
        "高碑店": "朝阳 高碑店",
        "金盏": "朝阳 金盏",
        "管庄": "朝阳 管庄",
        "运河商务区": "通州",
        "CBD-百子湾": "朝阳",
        "工体-三里屯": "朝阳 三里屯",
        "十里河-十八里店": "朝阳 十里河",
        "苹果园-金安桥": "石景山 苹果园",
        "清河-小营": "海淀 清河",
        "大红门-南苑": "丰台 大红门",
        "大兴黄村": "大兴",
        "亦庄经开区": "大兴 亦庄",
        "霍营-北苑": "昌平 霍营",
    }
    
    if zone_name in area_hints:
        strategies.insert(1, f"{name} {area_hints[zone_name]}")
    
    for strategy in strategies:
        results = nominatim_search(strategy)
        if results:
            return results[0]
        time.sleep(1.1)  # Rate limit
    
    return None

# Load current data
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

# Extract all POIs with their current coordinates
all_pois = []
for zone in zones:
    if 'pois' not in zone:
        continue
    for cat, pois in zone['pois'].items():
        for poi in pois:
            all_pois.append({
                "name": poi['name'],
                "zone": zone['name'],
                "zone_id": zone['id'],
                "category": cat,
                "current_coords": poi['coords']
            })

print(f"Total POIs to geocode: {len(all_pois)}")

# Check for existing progress file
progress_file = '/home/user/workspace/beijing-metro-tod/geocode_progress.json'
if os.path.exists(progress_file):
    with open(progress_file, 'r', encoding='utf-8') as f:
        verified = json.load(f)
    print(f"Resuming from {len(verified)} already verified POIs")
else:
    verified = {}

# Geocode each POI
for idx, poi in enumerate(all_pois):
    key = f"{poi['zone_id']}|{poi['name']}"
    if key in verified:
        continue
    
    print(f"\n[{idx+1}/{len(all_pois)}] {poi['zone']}: {poi['name']}")
    result = geocode_poi(poi['name'], poi['zone'])
    
    if result:
        verified[key] = {
            "name": poi['name'],
            "zone": poi['zone'],
            "zone_id": poi['zone_id'],
            "category": poi['category'],
            "current_coords": poi['current_coords'],
            "osm_coords": result['coords'],
            "osm_display": result['display'],
            "osm_type": result['type'],
            "osm_class": result['class'],
            "status": "found"
        }
        
        # Calculate distance between current and OSM coords
        import math
        def haversine(lon1, lat1, lon2, lat2):
            R = 6371000
            phi1, phi2 = math.radians(lat1), math.radians(lat2)
            dphi = math.radians(lat2 - lat1)
            dlam = math.radians(lon2 - lon1)
            a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
            return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        dist = haversine(
            poi['current_coords'][0], poi['current_coords'][1],
            result['coords'][0], result['coords'][1]
        )
        verified[key]['distance_m'] = round(dist)
        
        flag = "✅" if dist < 500 else ("⚠️" if dist < 2000 else "🔴")
        print(f"  {flag} OSM: {result['coords']} (dist={dist:.0f}m)")
        print(f"     Current: {poi['current_coords']}")
        print(f"     Name: {result['display'][:80]}")
    else:
        verified[key] = {
            "name": poi['name'],
            "zone": poi['zone'],
            "zone_id": poi['zone_id'],
            "category": poi['category'],
            "current_coords": poi['current_coords'],
            "osm_coords": None,
            "status": "not_found"
        }
        print(f"  ❌ Not found in OSM")
    
    # Save progress after each POI
    with open(progress_file, 'w', encoding='utf-8') as f:
        json.dump(verified, f, ensure_ascii=False, indent=2)
    
    time.sleep(1.1)  # Rate limit

# Final summary
found = sum(1 for v in verified.values() if v['status'] == 'found')
not_found = sum(1 for v in verified.values() if v['status'] == 'not_found')
big_diff = sum(1 for v in verified.values() if v['status'] == 'found' and v.get('distance_m', 0) > 500)

print(f"\n\n{'='*60}")
print(f"GEOCODING SUMMARY")
print(f"{'='*60}")
print(f"Total: {len(verified)}")
print(f"Found in OSM: {found}")
print(f"Not found: {not_found}")
print(f"Distance > 500m from current: {big_diff}")

# List biggest discrepancies
print(f"\nBiggest coordinate discrepancies (>500m):")
discreps = [(k, v) for k, v in verified.items() if v['status'] == 'found' and v.get('distance_m', 0) > 500]
discreps.sort(key=lambda x: -x[1]['distance_m'])
for key, v in discreps[:50]:
    print(f"  {v['zone']}/{v['name']}: {v['distance_m']}m (current={v['current_coords']}, osm={v['osm_coords']})")

print(f"\nProgress saved to {progress_file}")
