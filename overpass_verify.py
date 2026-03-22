#!/usr/bin/env python3
"""
Use Overpass API to verify key landmarks that Nominatim missed.
Overpass lets us search by exact name tags within bounding boxes.
"""
import json, time, urllib.request, urllib.parse, math

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

def overpass_query(name, bbox, types="node way relation"):
    """Search Overpass for a named feature in a bounding box."""
    # bbox format: south,west,north,east
    type_list = types.split()
    union_parts = []
    for t in type_list:
        union_parts.append(f'{t}["name"="{name}"]({bbox});')
        union_parts.append(f'{t}["name:zh"="{name}"]({bbox});')
    
    query = f"""[out:json][timeout:10];
(
  {"".join(union_parts)}
);
out center 1;"""
    
    data = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=data)
    req.add_header("User-Agent", "BeijingTODApp/2.0")
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode())
            if result.get("elements"):
                el = result["elements"][0]
                if "center" in el:
                    return [round(el["center"]["lon"], 6), round(el["center"]["lat"], 6)]
                elif "lon" in el:
                    return [round(el["lon"], 6), round(el["lat"], 6)]
    except Exception as e:
        print(f"  Overpass error: {e}")
    return None

# Key landmarks to verify via Overpass
# Format: (name, search_bbox "south,west,north,east", zone_id)
LANDMARKS = [
    # 运河商务区 area (Tongzhou)
    ("运河商务区", "39.88,116.62,39.95,116.75", "yunhe"),
    ("大运河森林公园", "39.86,116.66,39.96,116.76", "yunhe"),
    ("城市绿心森林公园", "39.86,116.68,39.92,116.74", "yunhe"),
    ("北京市人民政府", "39.88,116.68,39.93,116.74", "yunhe"),  # 市行政办公区
    ("北京学校", "39.88,116.66,39.94,116.74", "yunhe"),
    ("张家湾设计小镇", "39.84,116.64,39.90,116.72", "yunhe"),
    
    # 亦庄经开区
    ("京东方科技集团", "39.75,116.48,39.82,116.55", "yizhuang_bda"),
    ("小米汽车工厂", "39.72,116.47,39.80,116.53", "yizhuang_bda"),
    ("南海子公园", "39.75,116.42,39.82,116.50", "yizhuang_bda"),
    ("博大公园", "39.75,116.48,39.80,116.53", "yizhuang_bda"),
    
    # 鲁谷 area
    ("石景山医院", "39.88,116.18,39.93,116.26", "lugu"),
    ("北京九中", "39.89,116.18,39.94,116.25", "lugu"),
    
    # 苹果园-金安桥
    ("首钢园", "39.88,116.16,39.94,116.22", "pingguoyuan"),
    ("首钢滑雪大跳台", "39.89,116.16,39.93,116.22", "pingguoyuan"),
    ("模式口", "39.92,116.14,39.95,116.18", "pingguoyuan"),
    ("北方工业大学", "39.90,116.16,39.93,116.22", "pingguoyuan"),
    
    # 大红门-南苑
    ("南苑森林湿地公园", "39.78,116.36,39.84,116.42", "dahongmen"),
    
    # 大兴黄村
    ("中关村大兴生物医药基地", "39.68,116.32,39.74,116.40", "daxing_huangcun"),
    ("念坛公园", "39.68,116.30,39.74,116.38", "daxing_huangcun"),
    ("大兴黄村公园", "39.70,116.32,39.75,116.38", "daxing_huangcun"),
    ("北京印刷学院", "39.72,116.30,39.76,116.36", "daxing_huangcun"),
    
    # 园博园
    ("北京园博园", "39.84,116.18,39.90,116.24", "yuanboyuan"),
    ("园博湖", "39.85,116.18,39.90,116.22", "yuanboyuan"),
    
    # 清河-小营
    ("小米科技园", "39.99,116.28,40.06,116.36", "qinghe"),
    ("五彩城", "40.01,116.33,40.05,116.38", "qinghe"),
    ("北京语言大学", "39.98,116.33,40.02,116.38", "qinghe"),
    
    # 丽泽-草桥
    ("丽泽金融商务区", "39.85,116.29,39.89,116.35", "lize"),
    ("丽泽SOHO", "39.85,116.31,39.88,116.34", "lize"),
    ("中国华能集团", "39.85,116.29,39.89,116.35", "lize"),
    ("莲花池公园", "39.88,116.30,39.91,116.33", "lize"),
    
    # 金盏
    ("温榆河公园", "39.95,116.48,40.01,116.60", "jingai"),
    
    # 高碑店
    ("中国传媒大学", "39.89,116.53,39.93,116.57", "gaobeidian"),
    ("庆丰公园", "39.89,116.43,39.92,116.48", "gaobeidian"),
    
    # CBD area
    ("国贸大厦", "39.90,116.44,39.92,116.48", "cbd_baiziwan"),
    ("中国尊", "39.90,116.45,39.92,116.48", "cbd_baiziwan"),
    ("建外SOHO", "39.90,116.44,39.92,116.47", "cbd_baiziwan"),
    ("朝阳公园", "39.92,116.46,39.96,116.50", "cbd_baiziwan"),
    
    # 工体三里屯
    ("北京工人体育场", "39.92,116.43,39.94,116.45", "gongti_sanlitun"),
    ("三里屯太古里", "39.93,116.44,39.94,116.46", "gongti_sanlitun"),
    ("团结湖公园", "39.92,116.45,39.93,116.47", "gongti_sanlitun"),
]

print("Querying Overpass API for key landmarks...")
results = {}
for name, bbox, zone_id in LANDMARKS:
    print(f"\n  Searching: {name}...")
    coords = overpass_query(name, bbox)
    if coords:
        results[f"{zone_id}|{name}"] = coords
        print(f"  ✅ Found: {coords}")
    else:
        print(f"  ❌ Not found")
    time.sleep(2)  # Rate limit for Overpass

# Save results
with open('/home/user/workspace/beijing-metro-tod/overpass_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n\nFound {len(results)}/{len(LANDMARKS)} landmarks")
print("Results saved to overpass_results.json")
