#!/usr/bin/env python3
"""Split 3 zones into 6 zones in data.js"""
import json, re

# Read data.js
with open('/home/user/workspace/beijing-metro-tod/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the OPPORTUNITY_ZONES array
# Find the start
zones_start = content.index('const OPPORTUNITY_ZONES = [')
zones_json_start = content.index('[', zones_start)

# Find matching closing bracket
depth = 0
i = zones_json_start
while i < len(content):
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            zones_json_end = i + 1
            break
    i += 1

zones_json = content[zones_json_start:zones_json_end]
zones = json.loads(zones_json)

# Find the rest after the zones array
rest_of_file = content[zones_json_end:]

new_zones = []
for zone in zones:
    # =============================================
    # 1. Split "鲁谷-园博园" → "鲁谷" + "园博园"
    # =============================================
    if zone['id'] == 'lugu_garden':
        # 鲁谷 zone - focused on 鲁谷/石景山区
        lugu = {
            "id": "lugu",
            "name": "鲁谷",
            "center": [116.253, 39.912],
            "radius": 1800,
            "relatedLines": [
                {"name": "1号线", "color": "#a4343a", "status": "运营中"},
                {"name": "6号线", "color": "#b58500", "status": "运营中"},
                {"name": "1号线支线", "color": "#a4343a", "status": "在建"}
            ],
            "description": "石景山鲁谷片区，老工业基地转型升级，1号线支线建设带动区域更新，中关村丰台园北区科技产业聚集",
            "stats": {
                "population": "18万",
                "commuters": "7万/日",
                "housingDensity": "中密度",
                "avgCommute": "40分钟",
                "jobs": "约6万"
            },
            "industries": ["航天科技", "新材料", "数字创意", "高端装备"],
            "housingStatus": {
                "current": "以鲁谷社区等1980年代老旧住宅为主，改造需求迫切",
                "supply": "1号线支线沿线规划新增住宅用地，衙门口棚改安置房在建",
                "opportunity": "依托中关村丰台园和首钢经验，打造产城融合的科技社区"
            },
            "opportunities": [
                {"icon": "🏗", "title": "工业转型", "desc": "首钢园区改造经验推广，存量工业用地更新"},
                {"icon": "🚇", "title": "轨道引导", "desc": "1号线支线沿线新站带动周边综合开发"},
                {"icon": "🏠", "title": "住房更新", "desc": "老旧小区改造+新增保障性住房供应"},
                {"icon": "💼", "title": "科技园区", "desc": "中关村丰台园北区扩容，就近就业机会增加"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 45, "type": ""},
                {"label": "职住平衡指数", "value": 58, "type": "fill-accent"},
                {"label": "配套完善度", "value": 40, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 75, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "中关村丰台园", "type": "employment", "coords": [116.253, 39.918], "desc": "丰台区最大产业园，入驻企业1万+"},
                    {"name": "首钢园区", "type": "employment", "coords": [116.187, 39.922], "desc": "城市更新标杆项目，文创+科技+体育"},
                    {"name": "总装备部科研基地", "type": "employment", "coords": [116.235, 39.89], "desc": "航天科技产业集群"}
                ],
                "residential": [
                    {"name": "鲁谷社区", "type": "residential", "coords": [116.25, 39.91], "desc": "1980年代建成，大量老旧住宅，改造需求迫切"},
                    {"name": "衙门口棚改区", "type": "residential", "coords": [116.228, 39.902], "desc": "棚户区改造项目，新建安置房在建"},
                    {"name": "卢沟桥南里", "type": "residential", "coords": [116.262, 39.895], "desc": "90年代老旧小区，距地铁较近"}
                ],
                "publicSpace": [
                    {"name": "石景山游乐园", "type": "publicSpace", "coords": [116.222, 39.906], "desc": "老牌游乐场，城市更新改造中"},
                    {"name": "永定河滨水空间（北段）", "type": "publicSpace", "coords": [116.195, 39.92], "desc": "首钢段永定河两岸生态休闲空间"}
                ],
                "publicService": [
                    {"name": "北京朝阳医院石景山院区", "type": "publicService", "coords": [116.224, 39.913], "desc": "三甲医院分院，综合医疗"},
                    {"name": "北京九中", "type": "publicService", "coords": [116.232, 39.908], "desc": "石景山区重点中学"},
                    {"name": "首钢医院", "type": "publicService", "coords": [116.192, 39.925], "desc": "综合医院，服务首钢片区"}
                ]
            }
        }
        
        # 园博园 zone - 丰台区永定河西岸, 地铁园博园站周边
        yuanboyuan = {
            "id": "yuanboyuan",
            "name": "园博园",
            "center": [116.208, 39.893],
            "radius": 1600,
            "relatedLines": [
                {"name": "14号线", "color": "#ca9a8e", "status": "运营中"},
                {"name": "1号线支线", "color": "#a4343a", "status": "在建"}
            ],
            "description": "丰台区永定河西岸，园博园站微中心，以北京园博园267公顷生态资源为核心，探索生态+居住+文旅融合的TOD新模式",
            "stats": {
                "population": "8万",
                "commuters": "3万/日",
                "housingDensity": "低密度",
                "avgCommute": "45分钟",
                "jobs": "约2万"
            },
            "industries": ["文化旅游", "生态康养", "会展服务", "体育休闲"],
            "housingStatus": {
                "current": "周边以村改社区和零散住宅为主，居住配套不足",
                "supply": "园博园站周边规划新增居住用地，微中心建设启动",
                "opportunity": "依托园博园生态优势，打造永定河西岸生态宜居新城"
            },
            "opportunities": [
                {"icon": "🌿", "title": "生态融合", "desc": "园博园267公顷生态资源与TOD开发有机结合"},
                {"icon": "🏗", "title": "微中心建设", "desc": "园博园站微中心启动，站城一体化开发"},
                {"icon": "🏠", "title": "新增住房", "desc": "永定河西岸规划新建居住社区，填补供给缺口"},
                {"icon": "🎭", "title": "文旅激活", "desc": "园博园从静态公园升级为文旅产业综合体"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 25, "type": ""},
                {"label": "职住平衡指数", "value": 35, "type": "fill-accent"},
                {"label": "配套完善度", "value": 25, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 82, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "北京园博园管理中心", "type": "employment", "coords": [116.208, 39.893], "desc": "园博园运营管理及文旅服务"},
                    {"name": "丰台科技园西区", "type": "employment", "coords": [116.22, 39.885], "desc": "科技企业孵化基地"}
                ],
                "residential": [
                    {"name": "长辛店镇社区", "type": "residential", "coords": [116.195, 39.885], "desc": "城中村改造中，规划新建社区"},
                    {"name": "王佐镇安置房", "type": "residential", "coords": [116.21, 39.88], "desc": "回迁安置住宅区"}
                ],
                "publicSpace": [
                    {"name": "北京园博园", "type": "publicSpace", "coords": [116.208, 39.893], "desc": "大型城市公园，面积约267公顷，亟需激活"},
                    {"name": "永定河滨水空间（南段）", "type": "publicSpace", "coords": [116.195, 39.89], "desc": "永定河丰台段生态廊道"},
                    {"name": "园博湖", "type": "publicSpace", "coords": [116.2, 39.898], "desc": "人工湖景观，生态休闲节点"}
                ],
                "publicService": [
                    {"name": "长辛店卫生院", "type": "publicService", "coords": [116.2, 39.883], "desc": "基层医疗机构，覆盖周边社区"},
                    {"name": "北京十中", "type": "publicService", "coords": [116.215, 39.89], "desc": "丰台区中学"}
                ]
            }
        }
        new_zones.append(lugu)
        new_zones.append(yuanboyuan)
        
    # =============================================
    # 2. Split "工体-十里河" → "工体-三里屯" + "十里河-十八里店"
    # =============================================
    elif zone['id'] == 'gongtishilihe':
        # 工体-三里屯 zone
        gongti_sanlitun = {
            "id": "gongti_sanlitun",
            "name": "工体-三里屯",
            "center": [116.451, 39.933],
            "radius": 1500,
            "relatedLines": [
                {"name": "6号线", "color": "#b58500", "status": "运营中"},
                {"name": "10号线", "color": "#0092bc", "status": "运营中"},
                {"name": "17号线", "color": "#00abab", "status": "全线运营"},
                {"name": "3号线", "color": "#FF6347", "status": "在建"}
            ],
            "description": "北京核心活力商圈，新工体落成+三里屯太古里+朝阳公园，17号线与3号线交汇激活城市消费中心",
            "stats": {
                "population": "28万",
                "commuters": "18万/日",
                "housingDensity": "高密度",
                "avgCommute": "28分钟",
                "jobs": "约22万"
            },
            "industries": ["文体娱乐", "时尚消费", "国际商务", "餐饮服务"],
            "housingStatus": {
                "current": "成熟城区，团结湖等1980年代住宅老化严重，外交公寓和高端住宅并存",
                "supply": "17号线工体站TOD综合开发，地下空间商业+地上住宅更新",
                "opportunity": "围绕新工体打造国际消费中心，推动团结湖等老旧社区更新"
            },
            "opportunities": [
                {"icon": "⚽", "title": "工体再生", "desc": "6.8万座新工体落成，带动周边商业和文化复兴"},
                {"icon": "🛍", "title": "消费升级", "desc": "三里屯太古里+工体商圈，国际时尚消费中心"},
                {"icon": "🔄", "title": "社区更新", "desc": "团结湖等老旧社区改造与站点开发同步推进"},
                {"icon": "🎭", "title": "文化地标", "desc": "三里屯-工体-朝阳公园文化带融合发展"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 85, "type": ""},
                {"label": "职住平衡指数", "value": 50, "type": "fill-accent"},
                {"label": "配套完善度", "value": 78, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 75, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "三里屯太古里", "type": "employment", "coords": [116.454, 39.937], "desc": "国际时尚消费中心，就业约2万人"},
                    {"name": "新工人体育场", "type": "employment", "coords": [116.449, 39.93], "desc": "6.8万座专业足球场，2023年落成"},
                    {"name": "北京电视台（新址）", "type": "employment", "coords": [116.445, 39.92], "desc": "朝阳门外传媒文化产业"}
                ],
                "residential": [
                    {"name": "团结湖社区", "type": "residential", "coords": [116.453, 39.928], "desc": "1980年代建成，外交部宿舍片区，楼龄40年+"},
                    {"name": "幸福村社区", "type": "residential", "coords": [116.445, 39.935], "desc": "工体北路成熟社区，配套完善"},
                    {"name": "白家庄社区", "type": "residential", "coords": [116.46, 39.928], "desc": "朝阳门外老社区，邻近CBD"}
                ],
                "publicSpace": [
                    {"name": "朝阳公园（北区）", "type": "publicSpace", "coords": [116.47, 39.93], "desc": "城市核心公园北部入口区域"},
                    {"name": "团结湖公园", "type": "publicSpace", "coords": [116.452, 39.927], "desc": "经典社区公园，需提质改造"},
                    {"name": "三里屯街头绿地", "type": "publicSpace", "coords": [116.455, 39.94], "desc": "三里屯商圈公共活动空间"}
                ],
                "publicService": [
                    {"name": "中日友好医院", "type": "publicService", "coords": [116.428, 39.938], "desc": "三甲综合医院"},
                    {"name": "北京八十中学", "type": "publicService", "coords": [116.458, 39.928], "desc": "朝阳区重点中学"},
                    {"name": "陈经纶中学", "type": "publicService", "coords": [116.448, 39.922], "desc": "朝阳区知名中学"}
                ]
            }
        }
        
        # 十里河-十八里店 zone
        shilihe = {
            "id": "shilihe_shibali",
            "name": "十里河-十八里店",
            "center": [116.462, 39.867],
            "radius": 1800,
            "relatedLines": [
                {"name": "10号线", "color": "#0092bc", "status": "运营中"},
                {"name": "17号线", "color": "#00abab", "status": "全线运营"},
                {"name": "亦庄线联络线", "color": "#2F4F4F", "status": "在建"}
            ],
            "description": "东南三环十里河-十八里店区域，建材家居产业转型升级，17号线南延贯通，大量存量工业用地待更新",
            "stats": {
                "population": "27万",
                "commuters": "12万/日",
                "housingDensity": "中高密度",
                "avgCommute": "38分钟",
                "jobs": "约8万"
            },
            "industries": ["建材家居", "物流商贸", "文化创意", "城市更新"],
            "housingStatus": {
                "current": "劲松、潘家园等1970-90年代老旧社区集中，农光里改造需求迫切",
                "supply": "十八里店大量棚改腾退用地，可新增住房供应",
                "opportunity": "17号线贯通+存量用地更新，打造南城职住平衡示范区"
            },
            "opportunities": [
                {"icon": "🔄", "title": "产业转型", "desc": "十里河建材市场疏解转型，释放优质用地"},
                {"icon": "🏠", "title": "住房增量", "desc": "十八里店棚改区域可新增大量保障性住房"},
                {"icon": "🚇", "title": "南北贯通", "desc": "17号线南延串联十里河与亦庄经开区"},
                {"icon": "🏙", "title": "城市更新", "desc": "老旧社区改造+工业用地更新，提升城市品质"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 60, "type": ""},
                {"label": "职住平衡指数", "value": 52, "type": "fill-accent"},
                {"label": "配套完善度", "value": 55, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 80, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "十里河居然之家", "type": "employment", "coords": [116.458, 39.87], "desc": "建材家居龙头企业总部"},
                    {"name": "十八里店产业园", "type": "employment", "coords": [116.47, 39.858], "desc": "城市更新产业孵化基地"},
                    {"name": "潘家园旧货市场", "type": "employment", "coords": [116.462, 39.873], "desc": "文化创意与古玩交易集散地"}
                ],
                "residential": [
                    {"name": "农光里社区", "type": "residential", "coords": [116.457, 39.876], "desc": "1970-80年代建成，改造需求迫切"},
                    {"name": "劲松社区", "type": "residential", "coords": [116.46, 39.88], "desc": "北京最早的老旧小区改造试点"},
                    {"name": "潘家园社区", "type": "residential", "coords": [116.462, 39.873], "desc": "1990年代建成，品质中等"},
                    {"name": "十八里店安置房", "type": "residential", "coords": [116.475, 39.855], "desc": "棚改回迁安置区，新建住宅"}
                ],
                "publicSpace": [
                    {"name": "十里河桥周边", "type": "publicSpace", "coords": [116.455, 39.872], "desc": "城南河沿线空间待优化"},
                    {"name": "横街子公园", "type": "publicSpace", "coords": [116.468, 39.86], "desc": "十八里店地区社区公园"},
                    {"name": "朝阳公园（南区）", "type": "publicSpace", "coords": [116.472, 39.875], "desc": "公园南部延伸区域"}
                ],
                "publicService": [
                    {"name": "东方医院", "type": "publicService", "coords": [116.465, 39.875], "desc": "二级综合医院"},
                    {"name": "劲松职业高中", "type": "publicService", "coords": [116.458, 39.878], "desc": "朝阳区职业教育基地"},
                    {"name": "十八里店社区卫生中心", "type": "publicService", "coords": [116.472, 39.858], "desc": "基层医疗服务"}
                ]
            }
        }
        new_zones.append(gongti_sanlitun)
        new_zones.append(shilihe)
        
    # =============================================
    # 3. Split "黄村-亦庄" → "大兴黄村" + "亦庄经开区"
    # =============================================
    elif zone['id'] == 'huangcun_yizhuang':
        # 大兴黄村 zone
        huangcun = {
            "id": "daxing_huangcun",
            "name": "大兴黄村",
            "center": [116.345, 39.728],
            "radius": 1800,
            "relatedLines": [
                {"name": "4号线/大兴线", "color": "#088545", "status": "运营中"},
                {"name": "亦庄线联络线", "color": "#2F4F4F", "status": "在建"}
            ],
            "description": "大兴区核心城区，黄村站和大兴新城站双核驱动，大兴新城配套日趋成熟，住房供地活跃",
            "stats": {
                "population": "28万",
                "commuters": "12万/日",
                "housingDensity": "中等",
                "avgCommute": "48分钟",
                "jobs": "约12万"
            },
            "industries": ["商贸服务", "生物医药", "新媒体", "教育培训"],
            "housingStatus": {
                "current": "黄村老城区部分楼龄30年+，新城住宅供应增加",
                "supply": "大兴新城核心区供地活跃，保障性住房比例较高",
                "opportunity": "亦庄联络线串联黄村与亦庄，提升区域通勤可达性"
            },
            "opportunities": [
                {"icon": "🏙", "title": "新城中心", "desc": "大兴新城核心区建设，完善城市功能配套"},
                {"icon": "🚇", "title": "轨道连通", "desc": "亦庄线联络线建成后串联黄村火车站与亦庄"},
                {"icon": "🏠", "title": "住房供应", "desc": "新城供地活跃，保障性住房+商品住房双轨供给"},
                {"icon": "🏥", "title": "公服提升", "desc": "三甲医院、优质学校等公共服务设施引入"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 45, "type": ""},
                {"label": "职住平衡指数", "value": 42, "type": "fill-accent"},
                {"label": "配套完善度", "value": 45, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 80, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "中关村大兴生物医药基地", "type": "employment", "coords": [116.34, 39.72], "desc": "生物医药产业集群"},
                    {"name": "大兴新城商务区", "type": "employment", "coords": [116.35, 39.735], "desc": "大兴区行政商务中心"},
                    {"name": "大兴高米店产业园", "type": "employment", "coords": [116.355, 39.75], "desc": "新媒体与科技企业聚集区"}
                ],
                "residential": [
                    {"name": "黄村西大街社区", "type": "residential", "coords": [116.35, 39.73], "desc": "大兴老城区，部分楼龄30年+"},
                    {"name": "枣园社区", "type": "residential", "coords": [116.335, 39.735], "desc": "大兴新城居住片区，距地铁4号线较近"},
                    {"name": "清源路新社区", "type": "residential", "coords": [116.34, 39.74], "desc": "新建住宅，配套较完善"}
                ],
                "publicSpace": [
                    {"name": "大兴黄村公园", "type": "publicSpace", "coords": [116.345, 39.728], "desc": "城市综合公园"},
                    {"name": "念坛公园", "type": "publicSpace", "coords": [116.34, 39.718], "desc": "大兴区大型滨水公园"}
                ],
                "publicService": [
                    {"name": "大兴一中", "type": "publicService", "coords": [116.345, 39.735], "desc": "大兴区重点中学"},
                    {"name": "大兴区人民医院", "type": "publicService", "coords": [116.35, 39.725], "desc": "区级综合医院"},
                    {"name": "北京印刷学院", "type": "publicService", "coords": [116.355, 39.73], "desc": "高等院校"}
                ]
            }
        }
        
        # 亦庄经开区 zone
        yizhuang = {
            "id": "yizhuang_bda",
            "name": "亦庄经开区",
            "center": [116.41, 39.755],
            "radius": 2200,
            "relatedLines": [
                {"name": "亦庄线", "color": "#e31c79", "status": "运营中"},
                {"name": "亦庄线联络线", "color": "#2F4F4F", "status": "在建"},
                {"name": "17号线", "color": "#00abab", "status": "全线运营"}
            ],
            "description": "北京经济技术开发区核心区，225平方公里产业新城，小米汽车、京东总部等龙头企业聚集，青年就业人口激增",
            "stats": {
                "population": "35万",
                "commuters": "20万/日",
                "housingDensity": "中低密度",
                "avgCommute": "42分钟",
                "jobs": "约35万"
            },
            "industries": ["新能源汽车", "集成电路", "智能制造", "生物医药"],
            "housingStatus": {
                "current": "大量青年科技工人，住房多在黄村/旧宫，通勤依赖公交",
                "supply": "亦嘉新青年小镇等保障性租赁住房已投用，存量商办改建中",
                "opportunity": "保租房扩容+存量商办改青年公寓+亦庄联络线改善通勤"
            },
            "opportunities": [
                {"icon": "🔋", "title": "产业引擎", "desc": "小米汽车+京东方+北京奔驰，制造业就业超20万"},
                {"icon": "🏠", "title": "青年安居", "desc": "亦嘉新青年小镇阶梯式安居政策（求职免费/实习免租/就业折扣）"},
                {"icon": "🚇", "title": "轨道加密", "desc": "亦庄联络线+17号线，双线串联经开区核心与外部组团"},
                {"icon": "🏗", "title": "城市配套", "desc": "同仁医院亦庄院区+人大附中+南海子公园，公服能级跃升"}
            ],
            "progressData": [
                {"label": "轨道覆盖率", "value": 55, "type": ""},
                {"label": "职住平衡指数", "value": 35, "type": "fill-accent"},
                {"label": "配套完善度", "value": 45, "type": "fill-warning"},
                {"label": "TOD开发潜力", "value": 90, "type": "fill-success"}
            ],
            "pois": {
                "employment": [
                    {"name": "小米汽车工厂", "type": "employment", "coords": [116.42, 39.74], "desc": "智能电动汽车制造基地"},
                    {"name": "京东方科技集团", "type": "employment", "coords": [116.41, 39.75], "desc": "全球显示面板龙头企业"},
                    {"name": "北京经济技术开发区核心区", "type": "employment", "coords": [116.405, 39.76], "desc": "225平方公里产业新城，就业约45万"},
                    {"name": "京东总部（亦庄）", "type": "employment", "coords": [116.415, 39.77], "desc": "电商巨头华北总部"}
                ],
                "residential": [
                    {"name": "亦嘉·新青年小镇", "type": "residential", "coords": [116.415, 39.735], "desc": "保障性租赁住房，2000套，青年人阶梯式安居"},
                    {"name": "亦庄泰河园", "type": "residential", "coords": [116.4, 39.745], "desc": "2008年建成，经开区通勤社区"},
                    {"name": "亦庄金茂悦", "type": "residential", "coords": [116.42, 39.76], "desc": "新建商品住宅社区"}
                ],
                "publicSpace": [
                    {"name": "南海子公园", "type": "publicSpace", "coords": [116.42, 39.77], "desc": "北京最大湿地公园，面积约743公顷"},
                    {"name": "亦庄凉水河滨水公园", "type": "publicSpace", "coords": [116.41, 39.755], "desc": "产业区内的生态廊道"},
                    {"name": "博大公园", "type": "publicSpace", "coords": [116.405, 39.75], "desc": "经开区中心绿地"}
                ],
                "publicService": [
                    {"name": "同仁医院亦庄院区", "type": "publicService", "coords": [116.408, 39.765], "desc": "三甲医院分院"},
                    {"name": "北京儿童医院亦庄院区（在建）", "type": "publicService", "coords": [116.405, 39.74], "desc": "优质儿科医疗资源引入"},
                    {"name": "人大附中经开区学校", "type": "publicService", "coords": [116.41, 39.75], "desc": "名校办学，12年制"}
                ]
            }
        }
        new_zones.append(huangcun)
        new_zones.append(yizhuang)
    else:
        new_zones.append(zone)

print(f"Original zones: {len(zones)}")
print(f"New zones: {len(new_zones)}")

# Rebuild data.js
header = content[:zones_json_start]
zones_json_new = json.dumps(new_zones, ensure_ascii=False, indent=2)
new_content = header + zones_json_new + rest_of_file

with open('/home/user/workspace/beijing-metro-tod/data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("data.js updated successfully!")
for z in new_zones:
    print(f"  - {z['id']}: {z['name']}")
