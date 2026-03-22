#!/usr/bin/env python3
"""Final pass: fix remaining 10 marginal outliers."""
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

def find_zone(zone_id):
    for z in zones:
        if z['id'] == zone_id:
            return z
    return None

def find_poi(zone_id, poi_name):
    z = find_zone(zone_id)
    if not z or 'pois' not in z:
        return None, None
    for cat, pois in z['pois'].items():
        for poi in pois:
            if poi['name'] == poi_name:
                return cat, poi
    return None, None

# 1. 运河商务区: 北运河沿线绿道 1.20x - move POI coords closer
cat, poi = find_poi("yunhe", "北运河沿线绿道")
poi['coords'] = [116.6618, 39.9218]  # Move south along the river
print(f"Moved 北运河沿线绿道 to {poi['coords']}")

# 2. 丽泽-草桥: 草桥欣园 1.06x, 莲花池公园 1.06x
# Both are edge cases, minor radius bump
z = find_zone("lize")
z['radius'] = 2700
print(f"丽泽-草桥 radius -> {z['radius']}")

# 3. 大兴黄村: 大兴高米店产业园 1.08x  
z = find_zone("daxing_huangcun")
z['radius'] = 2600
print(f"大兴黄村 radius -> {z['radius']}")

# 4. 霍营-北苑: 新龙城社区 1.08x
z = find_zone("huoying")
z['radius'] = 2600
print(f"霍营-北苑 radius -> {z['radius']}")

# 5. 回龙观-西三旗: 生命科学园 1.03x
z = find_zone("huilongguan")
z['radius'] = 3400
print(f"回龙观-西三旗 radius -> {z['radius']}")

# 6. 金盏: 温榆河公园 1.03x
z = find_zone("jingai")
z['radius'] = 3000
print(f"金盏 radius -> {z['radius']}")

# 7. 大红门-南苑: 南苑森林湿地公园 1.03x, 角门西社区 1.02x
z = find_zone("dahongmen")
z['radius'] = 3000
print(f"大红门-南苑 radius -> {z['radius']}")

# 8. 上地-马连洼: 百旺公园 1.00x - barely out
z = find_zone("shangdi")
z['radius'] = 2500
print(f"上地-马连洼 radius -> {z['radius']}")

# Write back
new_content = header + json.dumps(zones, ensure_ascii=False, indent=2) + rest_of_file
with open('/home/user/workspace/beijing-metro-tod/data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\nDone!")
