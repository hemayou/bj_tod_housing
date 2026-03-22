#!/usr/bin/env python3
"""Fix remaining 13 mild outliers with targeted adjustments."""
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

def replace_poi(zone_id, old_name, new_name, new_coords, new_desc=None):
    cat, poi = find_poi(zone_id, old_name)
    if poi:
        poi['name'] = new_name
        poi['coords'] = new_coords
        if new_desc:
            poi['desc'] = new_desc
        print(f"  REPLACE: {old_name} -> {new_name}")

def move_poi(zone_id, poi_name, new_coords):
    cat, poi = find_poi(zone_id, poi_name)
    if poi:
        poi['coords'] = new_coords
        print(f"  MOVE: {poi_name} -> {new_coords}")

# 1. 大兴黄村: 中关村大兴生物医药基地 1.37x
# Move center south slightly to better encompass biotech base
print("大兴黄村:")
z = find_zone("daxing_huangcun")
z['center'] = [116.3408, 39.7208]  # Shift center slightly south
z['radius'] = 2400
print(f"  Center -> {z['center']}, radius -> {z['radius']}")

# 2. 回龙观-西三旗: 生命科学园 1.30x
# This is a KEY employment center, shift center north a bit
print("回龙观-西三旗:")
z = find_zone("huilongguan")
z['center'] = [116.3228, 40.0668]  # North shift
z['radius'] = 3200
print(f"  Center -> {z['center']}, radius -> {z['radius']}")

# 3. 大红门-南苑: 南苑森林湿地公园 1.28x
# Shift center south slightly
print("大红门-南苑:")
z = find_zone("dahongmen")
z['center'] = [116.3908, 39.8288]
z['radius'] = 2800
print(f"  Center -> {z['center']}, radius -> {z['radius']}")

# 4. 运河商务区: 张家湾设计小镇 1.26x, 城市绿心公园 1.05x
# These are important副中心 landmarks. Shift center south a bit
print("运河商务区:")
z = find_zone("yunhe")
z['center'] = [116.6578, 39.9008]  # Shift south and slightly west
z['radius'] = 3200
print(f"  Center -> {z['center']}, radius -> {z['radius']}")

# 5. 丽泽-草桥: 草桥欣园 1.20x, 莲花池公园 1.20x
# Zone spans north-south, need slight expansion  
print("丽泽-草桥:")
z = find_zone("lize")
z['radius'] = 2500
print(f"  Radius -> {z['radius']}")

# 6. 霍营-北苑: 新龙城社区 1.18x
print("霍营-北苑:")
z = find_zone("huoying")
z['radius'] = 2400
print(f"  Radius -> {z['radius']}")

# 7. 金盏: 温榆河公园 1.15x
print("金盏:")
z = find_zone("jingai")
z['radius'] = 2800
print(f"  Radius -> {z['radius']}")

# 8. 工体-三里屯: 朝阳公园（北区）1.11x
print("工体-三里屯:")
z = find_zone("gongti_sanlitun")
z['radius'] = 2000
print(f"  Radius -> {z['radius']}")

# 9. 十里河-十八里店: 十八里店安置房 1.10x
print("十里河-十八里店:")
z = find_zone("shilihe_shibali")
z['radius'] = 2200
print(f"  Radius -> {z['radius']}")

# 10. 上地-马连洼: 百旺公园 1.09x
print("上地-马连洼:")
z = find_zone("shangdi")
z['radius'] = 2400
print(f"  Radius -> {z['radius']}")

# 11. 高碑店: 中国传媒大学 1.01x - barely out
print("高碑店:")
z = find_zone("gaobeidian")
z['radius'] = 1900
print(f"  Radius -> {z['radius']}")

# Write back
new_content = header + json.dumps(zones, ensure_ascii=False, indent=2) + rest_of_file
with open('/home/user/workspace/beijing-metro-tod/data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\nDone! data.js updated.")
