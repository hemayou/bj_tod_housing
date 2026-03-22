#!/usr/bin/env python3
"""
Apply verified OSM coordinates to data.js.
Only applies coords where OSM result is clearly correct:
1. Distance < 500m (close enough to trust)
2. Distance < 3000m AND display_name contains expected district
For bigger distances, we apply corrections only for specific well-known landmarks.
"""
import json, math

with open('/home/user/workspace/beijing-metro-tod/geocode_progress.json', 'r') as f:
    geocoded = json.load(f)

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

district_map = {
    '回龙观-西三旗': '昌平',
    '天通苑': '昌平',
    '上地-马连洼': '海淀',
    '丽泽-草桥': '丰台',
    '鲁谷': '石景山',
    '园博园': '丰台',
    '高碑店': '朝阳',
    '金盏': '朝阳',
    '管庄': '朝阳',
    '运河商务区': '通州',
    'CBD-百子湾': '朝阳',
    '工体-三里屯': '朝阳',
    '十里河-十八里店': '朝阳',
    '苹果园-金安桥': '石景山',
    '清河-小营': '海淀',
    '大红门-南苑': '丰台',
    '大兴黄村': '大兴',
    '亦庄经开区': '大兴',
    '霍营-北苑': '昌平',
}

# Well-known landmarks where OSM is definitely correct regardless of distance
WELL_KNOWN = {
    "新工人体育场", "丽泽SOHO", "华贸中心", "三里屯太古里",
    "国贸中心/中国尊", "百度科技园", "生命科学园", "中国传媒大学",
    "北京园博园", "同仁医院亦庄院区", "莲花池公园", "东小口森林公园",
    "潘家园旧货市场", "龙泽苑", "融泽嘉园", "天通苑龙德广场",
    "天通苑北区", "天通苑南区", "天通中苑", "百旺公园",
    "马连洼社区", "中国传媒大学", "南苑森林湿地公园",
    "北京印刷学院", "回龙观体育公园", "首钢医院",
    "中关村石景山园", "天通艺园", "金顶街社区",
    "北大附中石景山学校", "长辛店镇社区", "北京园博园",
    "陈经纶中学", "庆丰公园（西段）", "百子湾公园",
    "定福庄小学", "东升八家郊野公园",
    "上地公园", "上地西里", "上地实验小学",
    "大红门社区", "团结湖公园", "甘露园南里",
    "高碑店东区", "兴隆家园", "管庄产业园",
    "劲松社区", "劲松职业高中", "万泉寺社区",
    "平安金融中心", "丰益花园", "鑫福里小区",
    "朝阳公园（北区）", "十里河居然之家", "管庄西里",
    "天通苑南区", "马连洼郊野公园",
    "园博湖", "南苑西路社区", "十八里店小武基公园",
}

# Also trust specific well-known results even at larger distances
# These are major landmarks that Nominatim is likely correct about
FORCE_TRUST_RESULTS = {
    "石景山医院": [116.207166, 39.905037],  # OSM correct, in 石景山
    "庆丰公园": [116.457525, 39.901638],  # This is near 东大桥
    "大运河森林公园": [116.7107, 39.9078],  # Keep closer to current
    "城市绿心公园": [116.7060, 39.8990],  # Keep closer to current
    "北京市行政办公区": [116.7147, 39.9078], # In Tongzhou副中心
}

applied = 0
skipped = 0

for zone in zones:
    if 'pois' not in zone:
        continue
    zone_name = zone['name']
    expected_district = district_map.get(zone_name, '')
    
    for cat, pois in zone['pois'].items():
        for poi in pois:
            key = f"{zone['id']}|{poi['name']}"
            if key not in geocoded:
                continue
            
            g = geocoded[key]
            if g['status'] != 'found':
                continue
            
            dist = g.get('distance_m', 0)
            display = g.get('osm_display', '')
            osm_coords = g['osm_coords']
            
            should_apply = False
            reason = ""
            
            # Rule 1: Very close - trust OSM
            if dist <= 500:
                should_apply = True
                reason = f"close ({dist}m)"
            # Rule 2: Within 3km and correct district
            elif dist < 3000 and expected_district and expected_district in display:
                should_apply = True
                reason = f"district match ({dist}m)"
            # Rule 3: Well-known landmark
            elif poi['name'] in WELL_KNOWN and dist < 5000:
                should_apply = True
                reason = f"well-known ({dist}m)"
            # Rule 4: Force trust specific results
            elif poi['name'] in FORCE_TRUST_RESULTS:
                osm_coords = FORCE_TRUST_RESULTS[poi['name']]
                should_apply = True
                reason = "manual override"
            
            if should_apply:
                old = poi['coords']
                poi['coords'] = osm_coords
                applied += 1
                if dist > 200:
                    print(f"  UPDATE {zone_name}/{poi['name']}: {old} -> {osm_coords} ({reason})")
            else:
                skipped += 1

print(f"\nApplied: {applied}, Skipped: {skipped}")

# Write back
new_content = header + json.dumps(zones, ensure_ascii=False, indent=2) + rest_of_file
with open('/home/user/workspace/beijing-metro-tod/data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("data.js updated")
