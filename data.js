// ========================================
// 北京轨道交通TOD数据 — v4
// 运营线路: citylines.co + 18号线(uploaded)
// 在建线路: uploaded GeoJSON (new_uc_lines.json)
// 微中心: uploaded xlsx (micro_centers.json)
// v4新增: 5个新机遇区 + 就业数据 + POI数据
// ========================================

// ========================================
// TOD 重点机遇区 (16个: 原11个 + 新增5个)
// ========================================
const OPPORTUNITY_ZONES = [
  {
    "id": "huilongguan",
    "name": "回龙观-西三旗",
    "center": [
      116.3228,
      40.0668
    ],
    "radius": 3400,
    "relatedLines": [
      {
        "name": "13号线扩能",
        "color": "#f4da40",
        "status": "在建"
      },
      {
        "name": "昌平线",
        "color": "#d986ba",
        "status": "运营中"
      }
    ],
    "description": "构建北部新城与中心城区通勤骨干廊道，支撑科技创新中心建设，提升北部地区横向职住平衡",
    "stats": {
      "population": "82万",
      "commuters": "38万/日",
      "housingDensity": "高密度",
      "avgCommute": "52分钟",
      "jobs": "约18万"
    },
    "industries": [
      "科技创新",
      "互联网/IT",
      "人工智能",
      "生物医药"
    ],
    "housingStatus": {
      "current": "以大型居住社区为主，职住分离严重",
      "supply": "保障性住房占比约15%",
      "opportunity": "增加产业配套住房、优化通勤效率、提升社区商业配套"
    },
    "opportunities": [
      {
        "icon": "🏗",
        "title": "站城一体化",
        "desc": "围绕西二旗、回龙观等站点，打造综合开发示范区"
      },
      {
        "icon": "🏠",
        "title": "住房优化",
        "desc": "增加人才公寓和保障性租赁住房，缓解职住分离"
      },
      {
        "icon": "🚊",
        "title": "通勤提效",
        "desc": "13号线扩能后通勤时间将缩短约15分钟"
      },
      {
        "icon": "🏪",
        "title": "配套升级",
        "desc": "补充社区商业、教育、医疗等公共服务设施"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 65,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 35,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 55,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 85,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "生命科学园",
          "type": "employment",
          "coords": [
            116.3043,
            40.0928
          ],
          "desc": "国家级生物医药基地，入驻企业600+"
        },
        {
          "name": "TBD云集中心",
          "type": "employment",
          "coords": [
            116.3378,
            40.0512
          ],
          "desc": "科技与文创产业孵化平台"
        },
        {
          "name": "龙域中心",
          "type": "employment",
          "coords": [
            116.3318,
            40.0485
          ],
          "desc": "集办公、商业于一体的综合体"
        },
        {
          "name": "智汇大厦",
          "type": "employment",
          "coords": [
            116.3405,
            40.0545
          ],
          "desc": "互联网企业集聚办公区"
        }
      ],
      "residential": [
        {
          "name": "回龙观社区",
          "type": "residential",
          "coords": [
            116.3252,
            40.0693
          ],
          "desc": "超大型居住社区，约30万人，建于2000年前后"
        },
        {
          "name": "龙泽苑",
          "type": "residential",
          "coords": [
            116.3228,
            40.0735
          ],
          "desc": "2002年建成，大型经济适用房社区"
        },
        {
          "name": "融泽嘉园",
          "type": "residential",
          "coords": [
            116.3128,
            40.0583
          ],
          "desc": "较新建成社区，品质较高"
        },
        {
          "name": "金域华府",
          "type": "residential",
          "coords": [
            116.3388,
            40.0518
          ],
          "desc": "2010年代商品房，存量商办可改租赁公寓"
        }
      ],
      "publicSpace": [
        {
          "name": "回龙观体育公园",
          "type": "publicSpace",
          "coords": [
            116.3302,
            40.0755
          ],
          "desc": "回天地区重要的体育休闲公园"
        },
        {
          "name": "回龙观滨水绿道",
          "type": "publicSpace",
          "coords": [
            116.3182,
            40.0585
          ],
          "desc": "东小口沟沿线滨水空间，可进一步提升"
        },
        {
          "name": "回龙观文化公园",
          "type": "publicSpace",
          "coords": [
            116.3228,
            40.0638
          ],
          "desc": "社区级公园，承载居民日常休闲"
        }
      ],
      "publicService": [
        {
          "name": "积水潭医院回龙观院区",
          "type": "publicService",
          "coords": [
            116.3335,
            40.0713
          ],
          "desc": "三甲医院分院，骨科专长"
        },
        {
          "name": "清华附小昌平学校",
          "type": "publicService",
          "coords": [
            116.3265,
            40.0615
          ],
          "desc": "优质教育资源引入回天地区"
        },
        {
          "name": "北京人大附中昌平学校",
          "type": "publicService",
          "coords": [
            116.3365,
            40.0565
          ],
          "desc": "名校办学，提升区域教育配套"
        }
      ]
    }
  },
  {
    "id": "tiantongyuan",
    "name": "天通苑",
    "center": [
      116.42,
      40.058
    ],
    "radius": 2200,
    "relatedLines": [
      {
        "name": "5号线",
        "color": "#aa0061",
        "status": "运营中"
      },
      {
        "name": "17号线",
        "color": "#00abab",
        "status": "全线运营"
      },
      {
        "name": "13号线扩能",
        "color": "#f4da40",
        "status": "在建"
      }
    ],
    "description": "亚洲最大社区之一，承接中关村居住需求外溢，提升回天地区地铁沿线价值",
    "stats": {
      "population": "70万",
      "commuters": "32万/日",
      "housingDensity": "超高密度",
      "avgCommute": "55分钟",
      "jobs": "约6万"
    },
    "industries": [
      "居住配套",
      "社区商业",
      "教育培训",
      "文化娱乐"
    ],
    "housingStatus": {
      "current": "全国最大规模经济适用房社区，高层住宅集中",
      "supply": "住房总量充足但品质参差不齐",
      "opportunity": "推进老旧小区改造、优化公共空间、提升居住品质"
    },
    "opportunities": [
      {
        "icon": "🔄",
        "title": "城市更新",
        "desc": "老旧社区改造，提升居住品质和公共空间"
      },
      {
        "icon": "🛤",
        "title": "多线换乘",
        "desc": "17号线全线贯通，大幅改善南北通勤"
      },
      {
        "icon": "🏬",
        "title": "商业升级",
        "desc": "站点周边商业综合体开发，补充消费功能"
      },
      {
        "icon": "🌳",
        "title": "绿色社区",
        "desc": "完善绿道系统，建设15分钟生活圈"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 60,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 28,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 45,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 80,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "天通苑龙德广场",
          "type": "employment",
          "coords": [
            116.4215,
            40.0535
          ],
          "desc": "区域最大商业综合体，提供约5000就业岗位"
        },
        {
          "name": "天通科技园",
          "type": "employment",
          "coords": [
            116.4283,
            40.0628
          ],
          "desc": "中小企业科技孵化基地"
        },
        {
          "name": "北方明珠大厦",
          "type": "employment",
          "coords": [
            116.4168,
            40.0563
          ],
          "desc": "商务办公楼，存量商办可改青年公寓"
        }
      ],
      "residential": [
        {
          "name": "天通苑北区",
          "type": "residential",
          "coords": [
            116.4198,
            40.0748
          ],
          "desc": "1999-2004年建成，最大经适房片区，约10万套"
        },
        {
          "name": "天通苑南区",
          "type": "residential",
          "coords": [
            116.4175,
            40.0455
          ],
          "desc": "建成年代较早，部分楼龄超25年"
        },
        {
          "name": "天通中苑",
          "type": "residential",
          "coords": [
            116.4188,
            40.0598
          ],
          "desc": "核心区域，高层住宅密集"
        }
      ],
      "publicSpace": [
        {
          "name": "东小口森林公园",
          "type": "publicSpace",
          "coords": [
            116.4035,
            40.0438
          ],
          "desc": "大型城市森林公园，面积约248公顷"
        },
        {
          "name": "天通艺园",
          "type": "publicSpace",
          "coords": [
            116.4232,
            40.0645
          ],
          "desc": "社区公园，回天行动改造提升"
        },
        {
          "name": "天通苑体育中心",
          "type": "publicSpace",
          "coords": [
            116.4155,
            40.0605
          ],
          "desc": "回天三年行动新建体育设施"
        }
      ],
      "publicService": [
        {
          "name": "清华长庚医院",
          "type": "publicService",
          "coords": [
            116.4078,
            40.0665
          ],
          "desc": "三甲综合医院，2014年开院"
        },
        {
          "name": "北京师范大学昌平附属学校",
          "type": "publicService",
          "coords": [
            116.4255,
            40.0548
          ],
          "desc": "名校办学，改善教育供给"
        },
        {
          "name": "天通苑社区卫生服务中心",
          "type": "publicService",
          "coords": [
            116.4195,
            40.0575
          ],
          "desc": "基层医疗服务覆盖"
        }
      ]
    }
  },
  {
    "id": "shangdi",
    "name": "上地-马连洼",
    "center": [
      116.2868,
      40.0348
    ],
    "radius": 2500,
    "relatedLines": [
      {
        "name": "13号线",
        "color": "#f4da40",
        "status": "运营中"
      },
      {
        "name": "16号线",
        "color": "#6ba539",
        "status": "运营中"
      },
      {
        "name": "昌平线",
        "color": "#d986ba",
        "status": "运营中"
      }
    ],
    "description": "中关村科学城核心区域，全国最密集的科技企业集聚地",
    "stats": {
      "population": "35万",
      "commuters": "28万/日",
      "housingDensity": "中等",
      "avgCommute": "45分钟",
      "jobs": "约52万"
    },
    "industries": [
      "互联网科技",
      "人工智能",
      "半导体芯片",
      "软件研发"
    ],
    "housingStatus": {
      "current": "以科技园区和产业办公为主，住房需求外溢至回龙观",
      "supply": "人才公寓需求旺盛，供应不足",
      "opportunity": "结合轨道站点增加人才住房供给、打造15分钟产城融合圈"
    },
    "opportunities": [
      {
        "icon": "🏢",
        "title": "产城融合",
        "desc": "科技园区配建人才公寓，实现就近居住"
      },
      {
        "icon": "🔬",
        "title": "创新集群",
        "desc": "围绕站点打造科技创新综合服务中心"
      },
      {
        "icon": "🚶",
        "title": "慢行系统",
        "desc": "打通站点到园区的最后一公里慢行通道"
      },
      {
        "icon": "📐",
        "title": "空间优化",
        "desc": "低效用地再开发，提升容积率和空间效率"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 70,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 42,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 60,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 88,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "百度科技园",
          "type": "employment",
          "coords": [
            116.2958,
            40.0488
          ],
          "desc": "百度总部，员工约4万人"
        },
        {
          "name": "新浪总部大厦",
          "type": "employment",
          "coords": [
            116.2765,
            40.0498
          ],
          "desc": "新浪/微博总部办公区"
        },
        {
          "name": "腾讯北京总部",
          "type": "employment",
          "coords": [
            116.2755,
            40.0408
          ],
          "desc": "后厂村路科技企业核心区"
        },
        {
          "name": "网易北京研发中心",
          "type": "employment",
          "coords": [
            116.2998,
            40.0388
          ],
          "desc": "网易游戏等研发团队驻地"
        },
        {
          "name": "联想全球总部",
          "type": "employment",
          "coords": [
            116.2868,
            40.0285
          ],
          "desc": "IT巨头全球总部，中关村环保园"
        }
      ],
      "residential": [
        {
          "name": "马连洼社区",
          "type": "residential",
          "coords": [
            116.2875,
            40.0202
          ],
          "desc": "1990年代建成，部分楼龄30年+，改造需求强烈"
        },
        {
          "name": "唐家岭新城",
          "type": "residential",
          "coords": [
            116.2728,
            40.0345
          ],
          "desc": "回迁安置房社区，职住较近"
        },
        {
          "name": "上地西里",
          "type": "residential",
          "coords": [
            116.2932,
            40.0338
          ],
          "desc": "2000年前后建成，紧邻地铁上地站"
        },
        {
          "name": "上地东里社区",
          "type": "residential",
          "coords": [
            116.2938,
            40.0308
          ],
          "desc": "上地地区成熟住宅社区"
        }
      ],
      "publicSpace": [
        {
          "name": "百旺公园",
          "type": "publicSpace",
          "coords": [
            116.2645,
            40.0215
          ],
          "desc": "海淀北部较大的城市公园"
        },
        {
          "name": "马连洼郊野公园",
          "type": "publicSpace",
          "coords": [
            116.2808,
            40.0318
          ],
          "desc": "海淀区马连洼地区生态绿地"
        },
        {
          "name": "上地公园",
          "type": "publicSpace",
          "coords": [
            116.2992,
            40.0378
          ],
          "desc": "科技人员日常休憩空间"
        }
      ],
      "publicService": [
        {
          "name": "北京市海淀医院（西院区）",
          "type": "publicService",
          "coords": [
            116.2868,
            40.0258
          ],
          "desc": "海淀区综合医疗服务中心"
        },
        {
          "name": "上地实验小学",
          "type": "publicService",
          "coords": [
            116.2978,
            40.0295
          ],
          "desc": "海淀区优质小学"
        },
        {
          "name": "中关村第二小学百旺校区",
          "type": "publicService",
          "coords": [
            116.2815,
            40.0245
          ],
          "desc": "名校分校，优质教育资源"
        }
      ]
    }
  },
  {
    "id": "lize",
    "name": "丽泽-草桥",
    "center": [
      116.3188,
      39.8698
    ],
    "radius": 2700,
    "relatedLines": [
      {
        "name": "14号线",
        "color": "#ca9a8e",
        "status": "运营中"
      },
      {
        "name": "16号线",
        "color": "#6ba539",
        "status": "运营中"
      },
      {
        "name": "大兴机场线北延",
        "color": "#0049a5",
        "status": "在建"
      }
    ],
    "description": "丽泽金融商务区将迎\"一站五轨\"，建设\"立体城市\"，成为京津冀协同发展桥头堡",
    "stats": {
      "population": "12万",
      "commuters": "8万/日",
      "housingDensity": "开发中",
      "avgCommute": "35分钟",
      "jobs": "约15万"
    },
    "industries": [
      "金融科技",
      "数字经济",
      "专业服务",
      "国际商务"
    ],
    "housingStatus": {
      "current": "新兴商务区，住房配套正在建设中",
      "supply": "规划商品住宅、人才公寓和服务式公寓",
      "opportunity": "大兴机场线北延引入城市航站楼，强化区域品质提升"
    },
    "opportunities": [
      {
        "icon": "✈️",
        "title": "航站楼TOD",
        "desc": "城市航站楼落地丽泽，20分钟直达大兴机场"
      },
      {
        "icon": "🏦",
        "title": "金融集聚",
        "desc": "打造第二金融街，配套高品质商务住宅"
      },
      {
        "icon": "🔗",
        "title": "五线换乘",
        "desc": "14号线+16号线+11号线+丽金线+新机场线"
      },
      {
        "icon": "🌆",
        "title": "立体城市",
        "desc": "地上地下互联互通，站城深度融合"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 55,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 50,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 40,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 92,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "丽泽SOHO",
          "type": "employment",
          "coords": [
            116.3218,
            39.8695
          ],
          "desc": "扎哈·哈迪德设计，新兴商务地标"
        },
        {
          "name": "丽泽金融商务区",
          "type": "employment",
          "coords": [
            116.3148,
            39.8725
          ],
          "desc": "规划总建面约500万㎡，已入驻企业800+"
        },
        {
          "name": "中国华能总部",
          "type": "employment",
          "coords": [
            116.3098,
            39.8688
          ],
          "desc": "央企总部入驻丽泽"
        },
        {
          "name": "平安金融中心",
          "type": "employment",
          "coords": [
            116.3258,
            39.8738
          ],
          "desc": "金融机构集聚办公区"
        }
      ],
      "residential": [
        {
          "name": "万泉寺社区",
          "type": "residential",
          "coords": [
            116.3275,
            39.8628
          ],
          "desc": "1990年代建成，紧邻丽泽商务区"
        },
        {
          "name": "丰益花园",
          "type": "residential",
          "coords": [
            116.3128,
            39.8678
          ],
          "desc": "2005年前后建成，中等品质"
        },
        {
          "name": "草桥欣园",
          "type": "residential",
          "coords": [
            116.3405,
            39.8528
          ],
          "desc": "大型居住区，距草桥站步行可达"
        }
      ],
      "publicSpace": [
        {
          "name": "莲花池公园",
          "type": "publicSpace",
          "coords": [
            116.3205,
            39.8935
          ],
          "desc": "城市历史公园，面积约47公顷"
        },
        {
          "name": "丽泽城市运动公园",
          "type": "publicSpace",
          "coords": [
            116.3135,
            39.8765
          ],
          "desc": "新建城市运动公园"
        },
        {
          "name": "丰草河滨水绿道",
          "type": "publicSpace",
          "coords": [
            116.3188,
            39.8615
          ],
          "desc": "滨水空间可进一步提升"
        }
      ],
      "publicService": [
        {
          "name": "北京丰台医院",
          "type": "publicService",
          "coords": [
            116.3228,
            39.8708
          ],
          "desc": "丰台区属综合医院"
        },
        {
          "name": "丰台区实验学校",
          "type": "publicService",
          "coords": [
            116.3215,
            39.8655
          ],
          "desc": "区级重点学校"
        },
        {
          "name": "丽泽国际学校（规划）",
          "type": "publicService",
          "coords": [
            116.3168,
            39.8708
          ],
          "desc": "配合金融商务区的国际化教育配套"
        }
      ]
    }
  },
  {
    "id": "lugu",
    "name": "鲁谷",
    "center": [
      116.2508,
      39.9038
    ],
    "radius": 1800,
    "relatedLines": [
      {
        "name": "1号线",
        "color": "#a4343a",
        "status": "运营中"
      },
      {
        "name": "6号线",
        "color": "#b58500",
        "status": "运营中"
      },
      {
        "name": "1号线支线",
        "color": "#a4343a",
        "status": "在建"
      }
    ],
    "description": "石景山鲁谷片区，老工业基地转型升级，1号线支线建设带动区域更新，中关村丰台园北区科技产业聚集",
    "stats": {
      "population": "18万",
      "commuters": "7万/日",
      "housingDensity": "中密度",
      "avgCommute": "40分钟",
      "jobs": "约6万"
    },
    "industries": [
      "航天科技",
      "新材料",
      "数字创意",
      "高端装备"
    ],
    "housingStatus": {
      "current": "以鲁谷社区等1980年代老旧住宅为主，改造需求迫切",
      "supply": "1号线支线沿线规划新增住宅用地，衙门口棚改安置房在建",
      "opportunity": "依托中关村丰台园和首钢经验，打造产城融合的科技社区"
    },
    "opportunities": [
      {
        "icon": "🏗",
        "title": "工业转型",
        "desc": "首钢园区改造经验推广，存量工业用地更新"
      },
      {
        "icon": "🚇",
        "title": "轨道引导",
        "desc": "1号线支线沿线新站带动周边综合开发"
      },
      {
        "icon": "🏠",
        "title": "住房更新",
        "desc": "老旧小区改造+新增保障性住房供应"
      },
      {
        "icon": "💼",
        "title": "科技园区",
        "desc": "中关村丰台园北区扩容，就近就业机会增加"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 45,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 58,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 40,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 75,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "中关村丰台园",
          "type": "employment",
          "coords": [
            116.2658,
            39.9088
          ],
          "desc": "丰台区最大产业园，入驻企业1万+"
        },
        {
          "name": "中关村科技园石景山园（鲁谷）",
          "type": "employment",
          "coords": [
            116.2558,
            39.9068
          ],
          "desc": "鲁谷地区高新技术产业聚集区"
        },
        {
          "name": "总装备部科研基地",
          "type": "employment",
          "coords": [
            116.2498,
            39.8988
          ],
          "desc": "航天科技产业集群"
        }
      ],
      "residential": [
        {
          "name": "鲁谷社区",
          "type": "residential",
          "coords": [
            116.2525,
            39.9058
          ],
          "desc": "1980年代建成，大量老旧住宅，改造需求迫切"
        },
        {
          "name": "衙门口棚改区",
          "type": "residential",
          "coords": [
            116.2418,
            39.9008
          ],
          "desc": "棚户区改造项目，新建安置房在建"
        },
        {
          "name": "卢沟桥南里",
          "type": "residential",
          "coords": [
            116.2568,
            39.9008
          ],
          "desc": "90年代老旧小区，距地铁较近"
        }
      ],
      "publicSpace": [
        {
          "name": "鲁谷大街商圈",
          "type": "publicSpace",
          "coords": [
            116.2538,
            39.9078
          ],
          "desc": "鲁谷地区主要商业街区"
        },
        {
          "name": "鲁谷滨河公园",
          "type": "publicSpace",
          "coords": [
            116.2478,
            39.9018
          ],
          "desc": "永定河引水渠沿线休闲空间"
        }
      ],
      "publicService": [
        {
          "name": "北京朝阳医院京西院区",
          "type": "publicService",
          "coords": [
            116.2518,
            39.9098
          ],
          "desc": "北京朝阳医院石景山分院区"
        },
        {
          "name": "北京九中",
          "type": "publicService",
          "coords": [
            116.2335,
            39.9108
          ],
          "desc": "石景山区重点中学"
        },
        {
          "name": "石景山医院",
          "type": "publicService",
          "coords": [
            116.2488,
            39.9058
          ],
          "desc": "石景山区属三级综合医院"
        }
      ]
    }
  },
  {
    "id": "yuanboyuan",
    "name": "园博园",
    "center": [
      116.2095,
      39.8618
    ],
    "radius": 2500,
    "relatedLines": [
      {
        "name": "14号线",
        "color": "#ca9a8e",
        "status": "运营中"
      },
      {
        "name": "1号线支线",
        "color": "#a4343a",
        "status": "在建"
      }
    ],
    "description": "丰台区永定河西岸，园博园站微中心，以北京园博园267公顷生态资源为核心，探索生态+居住+文旅融合的TOD新模式",
    "stats": {
      "population": "8万",
      "commuters": "3万/日",
      "housingDensity": "低密度",
      "avgCommute": "45分钟",
      "jobs": "约2万"
    },
    "industries": [
      "文化旅游",
      "生态康养",
      "会展服务",
      "体育休闲"
    ],
    "housingStatus": {
      "current": "周边以村改社区和零散住宅为主，居住配套不足",
      "supply": "园博园站周边规划新增居住用地，微中心建设启动",
      "opportunity": "依托园博园生态优势，打造永定河西岸生态宜居新城"
    },
    "opportunities": [
      {
        "icon": "🌿",
        "title": "生态融合",
        "desc": "园博园267公顷生态资源与TOD开发有机结合"
      },
      {
        "icon": "🏗",
        "title": "微中心建设",
        "desc": "园博园站微中心启动，站城一体化开发"
      },
      {
        "icon": "🏠",
        "title": "新增住房",
        "desc": "永定河西岸规划新建居住社区，填补供给缺口"
      },
      {
        "icon": "🎭",
        "title": "文旅激活",
        "desc": "园博园从静态公园升级为文旅产业综合体"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 25,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 35,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 25,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 82,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "北京园博园管理中心",
          "type": "employment",
          "coords": [
            116.2128,
            39.8638
          ],
          "desc": "园博园运营管理及文旅服务"
        },
        {
          "name": "园博园文创产业园",
          "type": "employment",
          "coords": [
            116.2108,
            39.8658
          ],
          "desc": "北京园博园内文化创意产业聚集区"
        }
      ],
      "residential": [
        {
          "name": "长辛店镇社区",
          "type": "residential",
          "coords": [
            116.1832,
            39.8655
          ],
          "desc": "城中村改造中，规划新建社区"
        },
        {
          "name": "王佐镇安置房",
          "type": "residential",
          "coords": [
            116.1968,
            39.8508
          ],
          "desc": "回迁安置住宅区"
        }
      ],
      "publicSpace": [
        {
          "name": "北京园博园",
          "type": "publicSpace",
          "coords": [
            116.2095,
            39.8618
          ],
          "desc": "大型城市公园，面积约267公顷，亟需激活"
        },
        {
          "name": "永定河滨水空间（南段）",
          "type": "publicSpace",
          "coords": [
            116.1892,
            39.8648
          ],
          "desc": "永定河丰台段生态廊道"
        },
        {
          "name": "园博湖",
          "type": "publicSpace",
          "coords": [
            116.1968,
            39.8698
          ],
          "desc": "人工湖景观，生态休闲节点"
        }
      ],
      "publicService": [
        {
          "name": "长辛店卫生院",
          "type": "publicService",
          "coords": [
            116.1848,
            39.8618
          ],
          "desc": "基层医疗机构，覆盖周边社区"
        },
        {
          "name": "北京十中",
          "type": "publicService",
          "coords": [
            116.2248,
            39.8718
          ],
          "desc": "丰台区中学"
        }
      ]
    }
  },
  {
    "id": "gaobeidian",
    "name": "高碑店",
    "center": [
      116.515,
      39.913
    ],
    "radius": 1900,
    "relatedLines": [
      {
        "name": "1号线/八通线",
        "color": "#a4343a",
        "status": "运营中"
      },
      {
        "name": "22号线",
        "color": "#CB6A43",
        "status": "在建"
      }
    ],
    "description": "位于CBD东部延伸带，文化创意产业与居住功能融合发展",
    "stats": {
      "population": "18万",
      "commuters": "8万/日",
      "housingDensity": "中密度",
      "avgCommute": "38分钟",
      "jobs": "约5万"
    },
    "industries": [
      "文化创意",
      "传媒影视",
      "艺术设计",
      "古典家具"
    ],
    "housingStatus": {
      "current": "传统居住区与文化产业混合，部分区域待更新",
      "supply": "22号线开通将提升通勤便利性",
      "opportunity": "发挥文化产业优势，打造创意产业社区"
    },
    "opportunities": [
      {
        "icon": "🎨",
        "title": "文创产业",
        "desc": "利用高碑店文化优势，打造创意产业集群"
      },
      {
        "icon": "🏘",
        "title": "社区升级",
        "desc": "改善居住环境，引入品质商业配套"
      },
      {
        "icon": "🚆",
        "title": "交通提升",
        "desc": "22号线连接CBD和燕郊，增强区域可达性"
      },
      {
        "icon": "🏛",
        "title": "文化保护",
        "desc": "传统文化元素融入TOD开发设计"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 50,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 60,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 50,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 72,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "高碑店文化产业园",
          "type": "employment",
          "coords": [
            116.5178,
            39.9128
          ],
          "desc": "古典家具、艺术品集散中心"
        },
        {
          "name": "传媒大学文创基地",
          "type": "employment",
          "coords": [
            116.5318,
            39.9108
          ],
          "desc": "传媒影视相关创意产业"
        },
        {
          "name": "北花园产业园",
          "type": "employment",
          "coords": [
            116.5082,
            39.9158
          ],
          "desc": "中小文创企业孵化"
        }
      ],
      "residential": [
        {
          "name": "高碑店东区",
          "type": "residential",
          "coords": [
            116.5218,
            39.9138
          ],
          "desc": "传统村落改造区域，居住品质待提升"
        },
        {
          "name": "兴隆家园",
          "type": "residential",
          "coords": [
            116.5128,
            39.9098
          ],
          "desc": "2005年前后建成，品质中等"
        },
        {
          "name": "甘露园南里",
          "type": "residential",
          "coords": [
            116.5018,
            39.9128
          ],
          "desc": "1990年代建成，改造空间大"
        }
      ],
      "publicSpace": [
        {
          "name": "庆丰公园",
          "type": "publicSpace",
          "coords": [
            116.4978,
            39.9088
          ],
          "desc": "通惠河沿线公园，滨水休闲空间"
        },
        {
          "name": "通惠河滨水绿道",
          "type": "publicSpace",
          "coords": [
            116.5158,
            39.9118
          ],
          "desc": "通惠河两岸空间，可打造文化漫步带"
        },
        {
          "name": "高碑店漕运遗址公园",
          "type": "publicSpace",
          "coords": [
            116.5238,
            39.9145
          ],
          "desc": "历史文化遗产空间"
        }
      ],
      "publicService": [
        {
          "name": "高碑店社区卫生服务中心",
          "type": "publicService",
          "coords": [
            116.5128,
            39.9138
          ],
          "desc": "高碑店地区基层医疗机构"
        },
        {
          "name": "中国传媒大学",
          "type": "publicService",
          "coords": [
            116.5348,
            39.9068
          ],
          "desc": "全国知名高校，传媒领域领先"
        },
        {
          "name": "定福庄小学",
          "type": "publicService",
          "coords": [
            116.5258,
            39.9098
          ],
          "desc": "社区基础教育"
        }
      ]
    }
  },
  {
    "id": "jingai",
    "name": "金盏",
    "center": [
      116.55,
      39.955
    ],
    "radius": 3000,
    "relatedLines": [
      {
        "name": "3号线",
        "color": "#e91414",
        "status": "运营/在建"
      },
      {
        "name": "12号线",
        "color": "#7e4f27",
        "status": "运营中"
      }
    ],
    "description": "第四使馆区所在地，国际商务和文化交流的重要节点",
    "stats": {
      "population": "15万",
      "commuters": "6万/日",
      "housingDensity": "低密度",
      "avgCommute": "40分钟",
      "jobs": "约4万"
    },
    "industries": [
      "国际商务",
      "外交服务",
      "高端酒店",
      "文化交流"
    ],
    "housingStatus": {
      "current": "以别墅和低密度住宅为主，国际社区特色",
      "supply": "规划增加国际人才公寓和配套住房",
      "opportunity": "打造高品质国际化TOD社区"
    },
    "opportunities": [
      {
        "icon": "🌏",
        "title": "国际枢纽",
        "desc": "结合第四使馆区，打造国际化服务中心"
      },
      {
        "icon": "🏨",
        "title": "高端配套",
        "desc": "国际学校、医疗等高品质公共服务设施"
      },
      {
        "icon": "🛤",
        "title": "轨道新城",
        "desc": "3号线和12号线为区域带来全新发展机遇"
      },
      {
        "icon": "🏡",
        "title": "国际社区",
        "desc": "规划建设高品质国际化居住社区"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 25,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 45,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 35,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 82,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "金盏国际合作服务区",
          "type": "employment",
          "coords": [
            116.5518,
            39.9578
          ],
          "desc": "第四使馆区配套国际商务区"
        },
        {
          "name": "金盏文化中心",
          "type": "employment",
          "coords": [
            116.5428,
            39.9515
          ],
          "desc": "文化创意产业集聚区"
        },
        {
          "name": "黑桥艺术区",
          "type": "employment",
          "coords": [
            116.5248,
            39.9648
          ],
          "desc": "当代艺术家工作室集群"
        }
      ],
      "residential": [
        {
          "name": "温榆河别墅区",
          "type": "residential",
          "coords": [
            116.5598,
            39.9715
          ],
          "desc": "低密度国际社区，高端住宅"
        },
        {
          "name": "金盏嘉园",
          "type": "residential",
          "coords": [
            116.5478,
            39.9488
          ],
          "desc": "回迁安置社区，居住品质待提升"
        },
        {
          "name": "皮村社区",
          "type": "residential",
          "coords": [
            116.5618,
            39.9465
          ],
          "desc": "城中村区域，城市更新机遇"
        }
      ],
      "publicSpace": [
        {
          "name": "温榆河公园",
          "type": "publicSpace",
          "coords": [
            116.5528,
            39.9808
          ],
          "desc": "超大城市公园，面积约30平方公里"
        },
        {
          "name": "金盏郊野公园",
          "type": "publicSpace",
          "coords": [
            116.5518,
            39.9588
          ],
          "desc": "郊野公园，生态空间"
        },
        {
          "name": "坝河滨水带",
          "type": "publicSpace",
          "coords": [
            116.5428,
            39.9458
          ],
          "desc": "滨水空间改造提升机遇"
        }
      ],
      "publicService": [
        {
          "name": "中日友好医院（东院区）",
          "type": "publicService",
          "coords": [
            116.5388,
            39.9538
          ],
          "desc": "三甲医院东部分院（规划）"
        },
        {
          "name": "北京国际学校（ISB）",
          "type": "publicService",
          "coords": [
            116.5448,
            39.9675
          ],
          "desc": "国际教育学校"
        },
        {
          "name": "金盏学校",
          "type": "publicService",
          "coords": [
            116.5488,
            39.9508
          ],
          "desc": "区域基础教育"
        }
      ]
    }
  },
  {
    "id": "guanzhuang",
    "name": "管庄",
    "center": [
      116.5588,
      39.9208
    ],
    "radius": 1800,
    "relatedLines": [
      {
        "name": "1号线/八通线",
        "color": "#a4343a",
        "status": "运营中"
      },
      {
        "name": "12号线",
        "color": "#7e4f27",
        "status": "运营中"
      }
    ],
    "description": "朝阳区东部重要的产居融合区域",
    "stats": {
      "population": "20万",
      "commuters": "9万/日",
      "housingDensity": "中高密度",
      "avgCommute": "40分钟",
      "jobs": "约7万"
    },
    "industries": [
      "商贸物流",
      "文化教育",
      "社区服务",
      "科技研发"
    ],
    "housingStatus": {
      "current": "大型居住区集中，12号线提升了区域通达性",
      "supply": "住房供应相对充足，品质提升空间大",
      "opportunity": "利用双线优势，打造东部城市副中心配套区"
    },
    "opportunities": [
      {
        "icon": "🔀",
        "title": "双线联动",
        "desc": "1号线+12号线双轨驱动，提升换乘效率"
      },
      {
        "icon": "🏘",
        "title": "社区更新",
        "desc": "老旧社区改造，提升居住品质"
      },
      {
        "icon": "📚",
        "title": "教育配套",
        "desc": "完善教育资源，吸引年轻家庭"
      },
      {
        "icon": "🛒",
        "title": "商业活力",
        "desc": "站点周边商业综合开发"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 60,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 50,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 48,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 70,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "管庄产业园",
          "type": "employment",
          "coords": [
            116.5618,
            39.9218
          ],
          "desc": "中小企业办公园区"
        },
        {
          "name": "朝阳经济开发区（东区）",
          "type": "employment",
          "coords": [
            116.5728,
            39.9228
          ],
          "desc": "科技与商贸企业集聚"
        },
        {
          "name": "杨闸环岛商圈",
          "type": "employment",
          "coords": [
            116.5498,
            39.9195
          ],
          "desc": "区域商业服务中心"
        }
      ],
      "residential": [
        {
          "name": "管庄西里",
          "type": "residential",
          "coords": [
            116.5558,
            39.9208
          ],
          "desc": "1980-90年代建成，建筑老化明显"
        },
        {
          "name": "京通苑",
          "type": "residential",
          "coords": [
            116.5688,
            39.9188
          ],
          "desc": "2000年代经适房项目，规模较大"
        },
        {
          "name": "华龙美树",
          "type": "residential",
          "coords": [
            116.5738,
            39.9245
          ],
          "desc": "较新商品房社区"
        }
      ],
      "publicSpace": [
        {
          "name": "管庄公园",
          "type": "publicSpace",
          "coords": [
            116.5598,
            39.9228
          ],
          "desc": "社区公园，服务周边居民"
        },
        {
          "name": "杨闸河绿地",
          "type": "publicSpace",
          "coords": [
            116.5508,
            39.9175
          ],
          "desc": "河道两侧绿地，可提升为线性公园"
        }
      ],
      "publicService": [
        {
          "name": "民航总医院",
          "type": "publicService",
          "coords": [
            116.5628,
            39.9148
          ],
          "desc": "三甲医院，综合医疗服务"
        },
        {
          "name": "管庄学校",
          "type": "publicService",
          "coords": [
            116.5578,
            39.9238
          ],
          "desc": "九年一贯制学校"
        },
        {
          "name": "二外附中朝阳学校",
          "type": "publicService",
          "coords": [
            116.5668,
            39.9218
          ],
          "desc": "区域优质中学"
        }
      ]
    }
  },
  {
    "id": "yunhe",
    "name": "运河商务区",
    "center": [
      116.6578,
      39.9008
    ],
    "radius": 3200,
    "relatedLines": [
      {
        "name": "6号线",
        "color": "#b58500",
        "status": "运营中"
      },
      {
        "name": "M101线",
        "color": "#7F7F7F",
        "status": "在建"
      }
    ],
    "description": "北京城市副中心核心区，承接非首都功能疏解的重要承载地",
    "stats": {
      "population": "28万",
      "commuters": "12万/日",
      "housingDensity": "开发中",
      "avgCommute": "45分钟",
      "jobs": "约12万"
    },
    "industries": [
      "总部经济",
      "金融服务",
      "文化旅游",
      "科技创新"
    ],
    "housingStatus": {
      "current": "新城开发中，大量住房项目在建",
      "supply": "规划各类住房约2000万平方米",
      "opportunity": "高标准规划建设，打造职住平衡的现代化新城"
    },
    "opportunities": [
      {
        "icon": "🏙",
        "title": "副中心建设",
        "desc": "承接市级行政办公和企业总部迁入"
      },
      {
        "icon": "🌊",
        "title": "运河文化",
        "desc": "大运河文化带与TOD开发深度融合"
      },
      {
        "icon": "🚇",
        "title": "M101加持",
        "desc": "M101线加密副中心内部轨道网络"
      },
      {
        "icon": "🏗",
        "title": "产城一体",
        "desc": "高标准规划产业、居住、公共服务配套"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 40,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 58,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 45,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 90,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "运河商务区",
          "type": "employment",
          "coords": [
            116.6628,
            39.9128
          ],
          "desc": "副中心金融商务核心区，规划约300万㎡"
        },
        {
          "name": "北京市行政办公区",
          "type": "employment",
          "coords": [
            116.6712,
            39.9058
          ],
          "desc": "市级行政机关新址，约4万公务员"
        },
        {
          "name": "张家湾设计小镇",
          "type": "employment",
          "coords": [
            116.6508,
            39.8738
          ],
          "desc": "设计产业集聚区，城市更新示范"
        }
      ],
      "residential": [
        {
          "name": "通州北苑社区",
          "type": "residential",
          "coords": [
            116.6528,
            39.9188
          ],
          "desc": "2005-2015年建成，副中心早期居住区"
        },
        {
          "name": "新华联家园",
          "type": "residential",
          "coords": [
            116.6618,
            39.9078
          ],
          "desc": "大型居住社区，距运河较近"
        },
        {
          "name": "行政办公区配套住房",
          "type": "residential",
          "coords": [
            116.6728,
            39.8998
          ],
          "desc": "公务员周转住房和配套社区"
        }
      ],
      "publicSpace": [
        {
          "name": "大运河森林公园",
          "type": "publicSpace",
          "coords": [
            116.6698,
            39.9248
          ],
          "desc": "大型滨水森林公园，面积约713公顷"
        },
        {
          "name": "城市绿心公园",
          "type": "publicSpace",
          "coords": [
            116.6358,
            39.8868
          ],
          "desc": "副中心城市级公园，面积约11平方公里"
        },
        {
          "name": "北运河沿线绿道",
          "type": "publicSpace",
          "coords": [
            116.6618,
            39.9218
          ],
          "desc": "运河两岸景观步道系统"
        }
      ],
      "publicService": [
        {
          "name": "首都医科大学附属北京友谊医院通州院区",
          "type": "publicService",
          "coords": [
            116.6508,
            39.9028
          ],
          "desc": "三甲医院分院"
        },
        {
          "name": "北京学校",
          "type": "publicService",
          "coords": [
            116.6678,
            39.9108
          ],
          "desc": "十二年制公办学校，高标准建设"
        },
        {
          "name": "国家大剧院副中心剧院",
          "type": "publicService",
          "coords": [
            116.6388,
            39.8908
          ],
          "desc": "文化地标，三座剧场"
        }
      ]
    }
  },
  {
    "id": "cbd_baiziwan",
    "name": "CBD-百子湾",
    "center": [
      116.475,
      39.9
    ],
    "radius": 2200,
    "relatedLines": [
      {
        "name": "1号线",
        "color": "#a4343a",
        "status": "运营中"
      },
      {
        "name": "10号线",
        "color": "#0092bc",
        "status": "运营中"
      },
      {
        "name": "17号线",
        "color": "#00abab",
        "status": "全线运营"
      },
      {
        "name": "28号线",
        "color": "#3E6DB5",
        "status": "在建"
      }
    ],
    "description": "国际化商务中心区，28号线加密轨道服务，加强就业和居住的空间联系",
    "stats": {
      "population": "45万",
      "commuters": "35万/日",
      "housingDensity": "超高密度",
      "avgCommute": "38分钟",
      "jobs": "约85万"
    },
    "industries": [
      "国际金融",
      "跨国总部",
      "专业服务",
      "高端商业"
    ],
    "housingStatus": {
      "current": "国贸商圈核心，商务办公密集，百子湾为居住组团",
      "supply": "28号线将连通CBD和百子湾居住区",
      "opportunity": "优化CBD职住联系，提升百子湾居住品质和交通便利性"
    },
    "opportunities": [
      {
        "icon": "🏢",
        "title": "CBD升级",
        "desc": "28号线加密CBD轨道网，提升商务效率"
      },
      {
        "icon": "🏠",
        "title": "百子湾优化",
        "desc": "改善百子湾居住配套，缩短CBD通勤距离"
      },
      {
        "icon": "🔗",
        "title": "四线交汇",
        "desc": "1号线+10号线+17号线+28号线多线换乘"
      },
      {
        "icon": "🌐",
        "title": "国际化",
        "desc": "对标世界级商务区，完善国际化配套"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 80,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 40,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 72,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 85,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "国贸中心/中国尊",
          "type": "employment",
          "coords": [
            116.4618,
            39.9088
          ],
          "desc": "CBD核心，北京最高建筑群，就业超10万人"
        },
        {
          "name": "SK大厦/建外SOHO",
          "type": "employment",
          "coords": [
            116.4528,
            39.9068
          ],
          "desc": "国际企业和创业公司集聚"
        },
        {
          "name": "华贸中心",
          "type": "employment",
          "coords": [
            116.4758,
            39.9118
          ],
          "desc": "高端商务综合体"
        },
        {
          "name": "百子湾西区",
          "type": "employment",
          "coords": [
            116.4868,
            39.8978
          ],
          "desc": "文化创意和设计产业集聚"
        }
      ],
      "residential": [
        {
          "name": "百子湾家园",
          "type": "residential",
          "coords": [
            116.4938,
            39.8948
          ],
          "desc": "大型保障性住房社区，服务CBD就业人群"
        },
        {
          "name": "沿海赛洛城",
          "type": "residential",
          "coords": [
            116.4878,
            39.9008
          ],
          "desc": "2008年前后建成，CBD通勤社区"
        },
        {
          "name": "后现代城",
          "type": "residential",
          "coords": [
            116.4778,
            39.8968
          ],
          "desc": "2004年建成，存量商办可改青年公寓"
        },
        {
          "name": "金泰城丽湾",
          "type": "residential",
          "coords": [
            116.4678,
            39.8948
          ],
          "desc": "靠近CBD的居住组团"
        }
      ],
      "publicSpace": [
        {
          "name": "百子湾路口街心公园",
          "type": "publicSpace",
          "coords": [
            116.4818,
            39.8998
          ],
          "desc": "百子湾地区城市绿地"
        },
        {
          "name": "庆丰公园（西段）",
          "type": "publicSpace",
          "coords": [
            116.4828,
            39.9038
          ],
          "desc": "通惠河沿线休闲空间"
        },
        {
          "name": "百子湾公园",
          "type": "publicSpace",
          "coords": [
            116.4948,
            39.8918
          ],
          "desc": "社区公园，居民日常休闲"
        }
      ],
      "publicService": [
        {
          "name": "北京朝阳医院（本部）",
          "type": "publicService",
          "coords": [
            116.4628,
            39.9148
          ],
          "desc": "三甲综合医院，CBD核心医疗"
        },
        {
          "name": "朝阳外国语学校",
          "type": "publicService",
          "coords": [
            116.4808,
            39.9028
          ],
          "desc": "双语教育特色学校"
        },
        {
          "name": "芳草地国际学校",
          "type": "publicService",
          "coords": [
            116.4538,
            39.9068
          ],
          "desc": "知名国际化公办小学"
        }
      ]
    }
  },
  {
    "id": "gongti_sanlitun",
    "name": "工体-三里屯",
    "center": [
      116.451,
      39.933
    ],
    "radius": 2000,
    "relatedLines": [
      {
        "name": "6号线",
        "color": "#b58500",
        "status": "运营中"
      },
      {
        "name": "10号线",
        "color": "#0092bc",
        "status": "运营中"
      },
      {
        "name": "17号线",
        "color": "#00abab",
        "status": "全线运营"
      },
      {
        "name": "3号线",
        "color": "#FF6347",
        "status": "在建"
      }
    ],
    "description": "北京核心活力商圈，新工体落成+三里屯太古里+朝阳公园，17号线与3号线交汇激活城市消费中心",
    "stats": {
      "population": "28万",
      "commuters": "18万/日",
      "housingDensity": "高密度",
      "avgCommute": "28分钟",
      "jobs": "约22万"
    },
    "industries": [
      "文体娱乐",
      "时尚消费",
      "国际商务",
      "餐饮服务"
    ],
    "housingStatus": {
      "current": "成熟城区，团结湖等1980年代住宅老化严重，外交公寓和高端住宅并存",
      "supply": "17号线工体站TOD综合开发，地下空间商业+地上住宅更新",
      "opportunity": "围绕新工体打造国际消费中心，推动团结湖等老旧社区更新"
    },
    "opportunities": [
      {
        "icon": "⚽",
        "title": "工体再生",
        "desc": "6.8万座新工体落成，带动周边商业和文化复兴"
      },
      {
        "icon": "🛍",
        "title": "消费升级",
        "desc": "三里屯太古里+工体商圈，国际时尚消费中心"
      },
      {
        "icon": "🔄",
        "title": "社区更新",
        "desc": "团结湖等老旧社区改造与站点开发同步推进"
      },
      {
        "icon": "🎭",
        "title": "文化地标",
        "desc": "三里屯-工体-朝阳公园文化带融合发展"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 85,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 50,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 78,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 75,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "三里屯太古里",
          "type": "employment",
          "coords": [
            116.4558,
            39.9358
          ],
          "desc": "国际时尚消费中心，就业约2万人"
        },
        {
          "name": "新工人体育场",
          "type": "employment",
          "coords": [
            116.4432,
            39.9302
          ],
          "desc": "6.8万座专业足球场，2023年落成"
        },
        {
          "name": "北京电视台（新址）",
          "type": "employment",
          "coords": [
            116.4528,
            39.9238
          ],
          "desc": "朝阳门外传媒文化产业"
        }
      ],
      "residential": [
        {
          "name": "团结湖社区",
          "type": "residential",
          "coords": [
            116.4608,
            39.9268
          ],
          "desc": "1980年代建成，外交部宿舍片区，楼龄40年+"
        },
        {
          "name": "幸福村社区",
          "type": "residential",
          "coords": [
            116.4478,
            39.9365
          ],
          "desc": "工体北路成熟社区，配套完善"
        },
        {
          "name": "白家庄社区",
          "type": "residential",
          "coords": [
            116.4628,
            39.9288
          ],
          "desc": "朝阳门外老社区，邻近CBD"
        }
      ],
      "publicSpace": [
        {
          "name": "朝阳公园（北区）",
          "type": "publicSpace",
          "coords": [
            116.4738,
            39.9368
          ],
          "desc": "城市核心公园北部入口区域"
        },
        {
          "name": "团结湖公园",
          "type": "publicSpace",
          "coords": [
            116.4618,
            39.9285
          ],
          "desc": "经典社区公园，需提质改造"
        },
        {
          "name": "三里屯街头绿地",
          "type": "publicSpace",
          "coords": [
            116.4548,
            39.9398
          ],
          "desc": "三里屯商圈公共活动空间"
        }
      ],
      "publicService": [
        {
          "name": "北京和睦家医院",
          "type": "publicService",
          "coords": [
            116.4578,
            39.9378
          ],
          "desc": "三里屯地区国际化综合医院"
        },
        {
          "name": "北京八十中学",
          "type": "publicService",
          "coords": [
            116.4648,
            39.9278
          ],
          "desc": "朝阳区重点中学"
        },
        {
          "name": "陈经纶中学",
          "type": "publicService",
          "coords": [
            116.4548,
            39.9228
          ],
          "desc": "朝阳区知名中学"
        }
      ]
    }
  },
  {
    "id": "shilihe_shibali",
    "name": "十里河-十八里店",
    "center": [
      116.462,
      39.867
    ],
    "radius": 2200,
    "relatedLines": [
      {
        "name": "10号线",
        "color": "#0092bc",
        "status": "运营中"
      },
      {
        "name": "17号线",
        "color": "#00abab",
        "status": "全线运营"
      },
      {
        "name": "亦庄线联络线",
        "color": "#2F4F4F",
        "status": "在建"
      }
    ],
    "description": "东南三环十里河-十八里店区域，建材家居产业转型升级，17号线南延贯通，大量存量工业用地待更新",
    "stats": {
      "population": "27万",
      "commuters": "12万/日",
      "housingDensity": "中高密度",
      "avgCommute": "38分钟",
      "jobs": "约8万"
    },
    "industries": [
      "建材家居",
      "物流商贸",
      "文化创意",
      "城市更新"
    ],
    "housingStatus": {
      "current": "劲松、潘家园等1970-90年代老旧社区集中，农光里改造需求迫切",
      "supply": "十八里店大量棚改腾退用地，可新增住房供应",
      "opportunity": "17号线贯通+存量用地更新，打造南城职住平衡示范区"
    },
    "opportunities": [
      {
        "icon": "🔄",
        "title": "产业转型",
        "desc": "十里河建材市场疏解转型，释放优质用地"
      },
      {
        "icon": "🏠",
        "title": "住房增量",
        "desc": "十八里店棚改区域可新增大量保障性住房"
      },
      {
        "icon": "🚇",
        "title": "南北贯通",
        "desc": "17号线南延串联十里河与亦庄经开区"
      },
      {
        "icon": "🏙",
        "title": "城市更新",
        "desc": "老旧社区改造+工业用地更新，提升城市品质"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 60,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 52,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 55,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 80,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "十里河居然之家",
          "type": "employment",
          "coords": [
            116.4698,
            39.8668
          ],
          "desc": "建材家居龙头企业总部"
        },
        {
          "name": "十八里店产业园",
          "type": "employment",
          "coords": [
            116.4738,
            39.8558
          ],
          "desc": "城市更新产业孵化基地"
        },
        {
          "name": "潘家园旧货市场",
          "type": "employment",
          "coords": [
            116.4618,
            39.8728
          ],
          "desc": "文化创意与古玩交易集散地"
        }
      ],
      "residential": [
        {
          "name": "农光里社区",
          "type": "residential",
          "coords": [
            116.4578,
            39.8788
          ],
          "desc": "1970-80年代建成，改造需求迫切"
        },
        {
          "name": "劲松社区",
          "type": "residential",
          "coords": [
            116.4498,
            39.8778
          ],
          "desc": "北京最早的老旧小区改造试点"
        },
        {
          "name": "潘家园社区",
          "type": "residential",
          "coords": [
            116.4608,
            39.8698
          ],
          "desc": "1990年代建成，品质中等"
        },
        {
          "name": "十八里店安置房",
          "type": "residential",
          "coords": [
            116.4798,
            39.8528
          ],
          "desc": "棚改回迁安置区，新建住宅"
        }
      ],
      "publicSpace": [
        {
          "name": "十里河桥周边",
          "type": "publicSpace",
          "coords": [
            116.4658,
            39.8648
          ],
          "desc": "城南河沿线空间待优化"
        },
        {
          "name": "横街子公园",
          "type": "publicSpace",
          "coords": [
            116.4768,
            39.8538
          ],
          "desc": "十八里店地区社区公园"
        },
        {
          "name": "十八里店小武基公园",
          "type": "publicSpace",
          "coords": [
            116.4738,
            39.8628
          ],
          "desc": "十八里店地区新建城市公园"
        }
      ],
      "publicService": [
        {
          "name": "三环肿瘤医院",
          "type": "publicService",
          "coords": [
            116.4658,
            39.8688
          ],
          "desc": "十里河地区综合医疗机构"
        },
        {
          "name": "劲松职业高中",
          "type": "publicService",
          "coords": [
            116.4538,
            39.8798
          ],
          "desc": "朝阳区职业教育基地"
        },
        {
          "name": "十八里店社区卫生中心",
          "type": "publicService",
          "coords": [
            116.4728,
            39.8558
          ],
          "desc": "基层医疗服务"
        }
      ]
    }
  },
  {
    "id": "pingguoyuan",
    "name": "苹果园-金安桥",
    "center": [
      116.168,
      39.923
    ],
    "radius": 2000,
    "relatedLines": [
      {
        "name": "1号线",
        "color": "#a4343a",
        "status": "运营中"
      },
      {
        "name": "6号线",
        "color": "#b58500",
        "status": "运营中"
      },
      {
        "name": "S1线",
        "color": "#d4a76a",
        "status": "运营中"
      },
      {
        "name": "11号线",
        "color": "#2ca02c",
        "status": "运营中"
      }
    ],
    "description": "京西最大综合交通枢纽2025年底投用，四线换乘引领首钢-石景山城市更新，苹果园商务区TOD示范区",
    "stats": {
      "population": "22万",
      "commuters": "15万/日",
      "housingDensity": "中密度",
      "avgCommute": "38分钟",
      "jobs": "约10万"
    },
    "industries": [
      "科幻+科技",
      "冰雪运动",
      "工业遗产文旅",
      "人工智能"
    ],
    "housingStatus": {
      "current": "石景山老城区，大量1970-90年代老旧住宅，首钢工人宿舍待改造",
      "supply": "苹果园枢纽商务区规划R2居住用地+托幼用地已核发许可",
      "opportunity": "枢纽TOD示范+首钢模式2.0城市更新+存量商办改青年公寓"
    },
    "opportunities": [
      {
        "icon": "🚇",
        "title": "四线换乘枢纽",
        "desc": "北京规模最大城市客运枢纽，1/6/S1/11号线换乘"
      },
      {
        "icon": "🏗",
        "title": "首钢2.0更新",
        "desc": "首钢北区东部建设+工业遗产保护利用，全国城市更新典型案例"
      },
      {
        "icon": "🏠",
        "title": "住房机遇",
        "desc": "枢纽商务区新增居住用地，周边老旧宿舍区改造潜力大"
      },
      {
        "icon": "🏔",
        "title": "京西魅力廊道",
        "desc": "联动模式口历史街区，构建京西文化消费大廊道"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 85,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 52,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 55,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 93,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "首钢园",
          "type": "employment",
          "coords": [
            116.1868,
            39.9228
          ],
          "desc": "城市更新标杆，SoReal科幻乐园+冬奥遗产+服贸会场馆"
        },
        {
          "name": "苹果园交通枢纽商务区",
          "type": "employment",
          "coords": [
            116.1718,
            39.9258
          ],
          "desc": "2026年投用，交通换乘+商业+就业一体化"
        },
        {
          "name": "中关村石景山园",
          "type": "employment",
          "coords": [
            116.1808,
            39.9248
          ],
          "desc": "人工智能产业园，科技企业300+"
        },
        {
          "name": "北方工业大学科技园",
          "type": "employment",
          "coords": [
            116.1748,
            39.9118
          ],
          "desc": "产学研一体化基地"
        }
      ],
      "residential": [
        {
          "name": "苹果园街道老旧小区",
          "type": "residential",
          "coords": [
            116.1758,
            39.9268
          ],
          "desc": "1970-80年代首钢工人宿舍，楼龄40-50年，改造需求迫切"
        },
        {
          "name": "金顶街社区",
          "type": "residential",
          "coords": [
            116.1598,
            39.9348
          ],
          "desc": "首钢配套居住区，建成年代久远"
        },
        {
          "name": "苹果园南路社区",
          "type": "residential",
          "coords": [
            116.1738,
            39.9198
          ],
          "desc": "苹果园交通枢纽周边居住社区"
        },
        {
          "name": "苹果园枢纽配套住房（规划）",
          "type": "residential",
          "coords": [
            116.1728,
            39.9238
          ],
          "desc": "枢纽商务区规划新建R2居住用地"
        }
      ],
      "publicSpace": [
        {
          "name": "模式口大街商业区",
          "type": "publicSpace",
          "coords": [
            116.1628,
            39.9348
          ],
          "desc": "苹果园地区历史文化商业街区"
        },
        {
          "name": "永定河滨水带",
          "type": "publicSpace",
          "coords": [
            116.1738,
            39.9158
          ],
          "desc": "永定河石景山段，滨水休闲空间"
        },
        {
          "name": "模式口历史文化街区",
          "type": "publicSpace",
          "coords": [
            116.1608,
            39.9368
          ],
          "desc": "京西古道驼铃古道，保护性更新"
        },
        {
          "name": "首钢滑雪大跳台",
          "type": "publicSpace",
          "coords": [
            116.1878,
            39.9198
          ],
          "desc": "冬奥遗产，新城市地标"
        }
      ],
      "publicService": [
        {
          "name": "首钢医院",
          "type": "publicService",
          "coords": [
            116.1908,
            39.9268
          ],
          "desc": "综合医院，服务京西居民"
        },
        {
          "name": "北大附中石景山学校",
          "type": "publicService",
          "coords": [
            116.1758,
            39.9298
          ],
          "desc": "名校办学，优质教育资源"
        },
        {
          "name": "北方工业大学",
          "type": "publicService",
          "coords": [
            116.1758,
            39.9138
          ],
          "desc": "理工类本科院校"
        }
      ]
    }
  },
  {
    "id": "qinghe",
    "name": "清河-小营",
    "center": [
      116.35,
      40.025
    ],
    "radius": 2000,
    "relatedLines": [
      {
        "name": "8号线",
        "color": "#00a070",
        "status": "运营中"
      },
      {
        "name": "13号线",
        "color": "#f4da40",
        "status": "运营中"
      },
      {
        "name": "昌平线",
        "color": "#d986ba",
        "status": "运营中"
      },
      {
        "name": "13号线扩能",
        "color": "#f4da40",
        "status": "在建"
      }
    ],
    "description": "清河交通枢纽（高铁+地铁）辐射区域，五道口-学院路知识经济带南延，大量1980年代科研院所宿舍亟待更新",
    "stats": {
      "population": "45万",
      "commuters": "22万/日",
      "housingDensity": "高密度",
      "avgCommute": "40分钟",
      "jobs": "约25万"
    },
    "industries": [
      "高等教育",
      "科研院所",
      "数字经济",
      "文化创意"
    ],
    "housingStatus": {
      "current": "科研院所和高校集中，大量1980年代筒子楼和宿舍区楼龄达40年",
      "supply": "清河枢纽周边有待入市土地，13号线扩能提升通达性",
      "opportunity": "科研院所老旧宿舍改造+清河枢纽TOD+青年人才租赁住房"
    },
    "opportunities": [
      {
        "icon": "🚄",
        "title": "高铁+地铁枢纽",
        "desc": "清河站高铁直达雄安/张家口，三线地铁换乘"
      },
      {
        "icon": "🏫",
        "title": "科教融合",
        "desc": "学院路高校群+科研院所，知识经济辐射带"
      },
      {
        "icon": "🏠",
        "title": "宿舍区更新",
        "desc": "中科院等科研院所老旧宿舍改造为现代社区"
      },
      {
        "icon": "👷",
        "title": "青年住房",
        "desc": "面向科技从业者的保障性租赁住房需求旺盛"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 75,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 48,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 58,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 86,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "中关村东升科技园",
          "type": "employment",
          "coords": [
            116.3498,
            40.0235
          ],
          "desc": "海淀北部重要科技园区"
        },
        {
          "name": "小米科技园（二期）",
          "type": "employment",
          "coords": [
            116.3278,
            40.0275
          ],
          "desc": "小米集团第二总部"
        },
        {
          "name": "五彩城/华润凤凰汇",
          "type": "employment",
          "coords": [
            116.3488,
            40.0355
          ],
          "desc": "区域商业综合体，商业就业中心"
        },
        {
          "name": "学院路科研院所群",
          "type": "employment",
          "coords": [
            116.3598,
            40.0098
          ],
          "desc": "中科院力学所、计算所等聚集"
        }
      ],
      "residential": [
        {
          "name": "毛纺厂路社区",
          "type": "residential",
          "coords": [
            116.3418,
            40.0258
          ],
          "desc": "1980年代毛纺厂宿舍，楼龄40年+，典型待改造社区"
        },
        {
          "name": "小营西路社区",
          "type": "residential",
          "coords": [
            116.3575,
            40.0238
          ],
          "desc": "科研院所宿舍区，建成年代1980-90年代"
        },
        {
          "name": "清河新城",
          "type": "residential",
          "coords": [
            116.3428,
            40.0368
          ],
          "desc": "2010年代新建住宅，品质较好"
        },
        {
          "name": "西三旗科研宿舍",
          "type": "residential",
          "coords": [
            116.3568,
            40.0378
          ],
          "desc": "中科院等单位老旧宿舍，改造需求强"
        }
      ],
      "publicSpace": [
        {
          "name": "清河滨水绿道",
          "type": "publicSpace",
          "coords": [
            116.3458,
            40.0318
          ],
          "desc": "清河沿线，可建设高品质滨水公园"
        },
        {
          "name": "东升八家郊野公园",
          "type": "publicSpace",
          "coords": [
            116.3398,
            40.0198
          ],
          "desc": "城市郊野公园，面积较大"
        },
        {
          "name": "西小口公园",
          "type": "publicSpace",
          "coords": [
            116.3688,
            40.0148
          ],
          "desc": "社区公园，服务周边居民"
        }
      ],
      "publicService": [
        {
          "name": "海淀医院",
          "type": "publicService",
          "coords": [
            116.3565,
            40.0178
          ],
          "desc": "区级综合医院"
        },
        {
          "name": "北京二十中学",
          "type": "publicService",
          "coords": [
            116.3508,
            40.0218
          ],
          "desc": "清河地区重点中学"
        },
        {
          "name": "北京语言大学",
          "type": "publicService",
          "coords": [
            116.3588,
            40.0128
          ],
          "desc": "国际化高校，留学生聚集"
        }
      ]
    }
  },
  {
    "id": "dahongmen",
    "name": "大红门-南苑",
    "center": [
      116.3908,
      39.8288
    ],
    "radius": 3000,
    "relatedLines": [
      {
        "name": "8号线",
        "color": "#00a070",
        "status": "运营中"
      },
      {
        "name": "10号线",
        "color": "#0092bc",
        "status": "运营中"
      },
      {
        "name": "18号线",
        "color": "#C09FD5",
        "status": "运营中"
      },
      {
        "name": "新机场线北延",
        "color": "#0049a5",
        "status": "在建"
      }
    ],
    "description": "南中轴国际文化科技轴核心节点，原批发市场疏解后释放大量土地，南苑机场搬迁后开发新区域，大红门城市级微中心",
    "stats": {
      "population": "35万",
      "commuters": "18万/日",
      "housingDensity": "中高密度",
      "avgCommute": "40分钟",
      "jobs": "约12万"
    },
    "industries": [
      "博物馆文化群",
      "时尚设计",
      "数字经济",
      "文化消费"
    ],
    "housingStatus": {
      "current": "原批发市场疏解后大量存量商办楼宇空置，南苑地区老旧平房和楼房集中",
      "supply": "南中轴沿线待入市土地充裕，大红门微中心规划新增住房",
      "opportunity": "存量商办改青年租赁公寓+待入市土地新建住房+南苑地区城市更新"
    },
    "opportunities": [
      {
        "icon": "🏛",
        "title": "博物馆群",
        "desc": "南中轴大红门博物馆群一期加速落地"
      },
      {
        "icon": "🏢",
        "title": "商办转住",
        "desc": "原批发市场商办楼宇改造为青年租赁公寓"
      },
      {
        "icon": "🌿",
        "title": "南苑新城",
        "desc": "南苑森林湿地公园+新机场线引导新区开发"
      },
      {
        "icon": "🛤",
        "title": "多轨交汇",
        "desc": "8号线+10号线+18号线+新机场线北延四线交汇"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 60,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 45,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 38,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 90,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "大红门服装城转型园区",
          "type": "employment",
          "coords": [
            116.3958,
            39.8348
          ],
          "desc": "原批发市场疏解转型为设计+文化产业园"
        },
        {
          "name": "南中轴博物馆群（规划）",
          "type": "employment",
          "coords": [
            116.3908,
            39.8468
          ],
          "desc": "国家级博物馆集群，文化就业中心"
        },
        {
          "name": "大红门国际时尚创意园",
          "type": "employment",
          "coords": [
            116.3878,
            39.8318
          ],
          "desc": "时尚设计和文创产业"
        },
        {
          "name": "南苑数字经济区",
          "type": "employment",
          "coords": [
            116.3958,
            39.8128
          ],
          "desc": "数字经济+科技创新产业"
        }
      ],
      "residential": [
        {
          "name": "角门西社区",
          "type": "residential",
          "coords": [
            116.3738,
            39.8508
          ],
          "desc": "1990年代建成，紧邻地铁10号线"
        },
        {
          "name": "大红门社区",
          "type": "residential",
          "coords": [
            116.3918,
            39.8368
          ],
          "desc": "原批发市场配套居住区，品质待提升"
        },
        {
          "name": "南苑西路社区",
          "type": "residential",
          "coords": [
            116.3858,
            39.8198
          ],
          "desc": "老旧平房+筒子楼，楼龄40-50年，亟需改造"
        },
        {
          "name": "鑫福里小区",
          "type": "residential",
          "coords": [
            116.3978,
            39.8398
          ],
          "desc": "2000年代建成，品质中等"
        }
      ],
      "publicSpace": [
        {
          "name": "南苑森林湿地公园",
          "type": "publicSpace",
          "coords": [
            116.3888,
            39.8028
          ],
          "desc": "规划面积约16平方公里，北京南部最大生态空间"
        },
        {
          "name": "大红门街心花园",
          "type": "publicSpace",
          "coords": [
            116.3938,
            39.8368
          ],
          "desc": "疏解后城市公共空间，需进一步设计"
        },
        {
          "name": "凉水河沿线",
          "type": "publicSpace",
          "coords": [
            116.3958,
            39.8258
          ],
          "desc": "河道治理后滨水空间可提升"
        }
      ],
      "publicService": [
        {
          "name": "北京大学第一医院南院",
          "type": "publicService",
          "coords": [
            116.3845,
            39.8438
          ],
          "desc": "三甲医院分院"
        },
        {
          "name": "北京十八中学",
          "type": "publicService",
          "coords": [
            116.3908,
            39.8318
          ],
          "desc": "丰台区重点中学"
        },
        {
          "name": "丰台五小",
          "type": "publicService",
          "coords": [
            116.3878,
            39.8378
          ],
          "desc": "区级优质小学"
        }
      ]
    }
  },
  {
    "id": "daxing_huangcun",
    "name": "大兴黄村",
    "center": [
      116.3408,
      39.7208
    ],
    "radius": 2600,
    "relatedLines": [
      {
        "name": "4号线/大兴线",
        "color": "#088545",
        "status": "运营中"
      },
      {
        "name": "亦庄线联络线",
        "color": "#2F4F4F",
        "status": "在建"
      }
    ],
    "description": "大兴区核心城区，黄村站和大兴新城站双核驱动，大兴新城配套日趋成熟，住房供地活跃",
    "stats": {
      "population": "28万",
      "commuters": "12万/日",
      "housingDensity": "中等",
      "avgCommute": "48分钟",
      "jobs": "约12万"
    },
    "industries": [
      "商贸服务",
      "生物医药",
      "新媒体",
      "教育培训"
    ],
    "housingStatus": {
      "current": "黄村老城区部分楼龄30年+，新城住宅供应增加",
      "supply": "大兴新城核心区供地活跃，保障性住房比例较高",
      "opportunity": "亦庄联络线串联黄村与亦庄，提升区域通勤可达性"
    },
    "opportunities": [
      {
        "icon": "🏙",
        "title": "新城中心",
        "desc": "大兴新城核心区建设，完善城市功能配套"
      },
      {
        "icon": "🚇",
        "title": "轨道连通",
        "desc": "亦庄线联络线建成后串联黄村火车站与亦庄"
      },
      {
        "icon": "🏠",
        "title": "住房供应",
        "desc": "新城供地活跃，保障性住房+商品住房双轨供给"
      },
      {
        "icon": "🏥",
        "title": "公服提升",
        "desc": "三甲医院、优质学校等公共服务设施引入"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 45,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 42,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 45,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 80,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "中关村大兴生物医药基地",
          "type": "employment",
          "coords": [
            116.3318,
            39.7028
          ],
          "desc": "生物医药产业集群"
        },
        {
          "name": "大兴新城商务区",
          "type": "employment",
          "coords": [
            116.3498,
            39.7268
          ],
          "desc": "大兴区行政商务中心"
        },
        {
          "name": "大兴高米店产业园",
          "type": "employment",
          "coords": [
            116.3508,
            39.7428
          ],
          "desc": "新媒体与科技企业聚集区"
        }
      ],
      "residential": [
        {
          "name": "黄村西大街社区",
          "type": "residential",
          "coords": [
            116.3408,
            39.7308
          ],
          "desc": "大兴老城区，部分楼龄30年+"
        },
        {
          "name": "枣园社区",
          "type": "residential",
          "coords": [
            116.3238,
            39.7378
          ],
          "desc": "大兴新城居住片区，距地铁4号线较近"
        },
        {
          "name": "清源路新社区",
          "type": "residential",
          "coords": [
            116.3368,
            39.7378
          ],
          "desc": "新建住宅，配套较完善"
        }
      ],
      "publicSpace": [
        {
          "name": "大兴黄村公园",
          "type": "publicSpace",
          "coords": [
            116.3388,
            39.7228
          ],
          "desc": "城市综合公园"
        },
        {
          "name": "念坛公园",
          "type": "publicSpace",
          "coords": [
            116.3428,
            39.7098
          ],
          "desc": "大兴区大型滨水公园"
        }
      ],
      "publicService": [
        {
          "name": "大兴一中",
          "type": "publicService",
          "coords": [
            116.3498,
            39.7318
          ],
          "desc": "大兴区重点中学"
        },
        {
          "name": "大兴区人民医院",
          "type": "publicService",
          "coords": [
            116.3498,
            39.7248
          ],
          "desc": "区级综合医院"
        },
        {
          "name": "北京印刷学院",
          "type": "publicService",
          "coords": [
            116.3468,
            39.7338
          ],
          "desc": "高等院校"
        }
      ]
    }
  },
  {
    "id": "yizhuang_bda",
    "name": "亦庄经开区",
    "center": [
      116.5068,
      39.7838
    ],
    "radius": 3000,
    "relatedLines": [
      {
        "name": "亦庄线",
        "color": "#e31c79",
        "status": "运营中"
      },
      {
        "name": "亦庄线联络线",
        "color": "#2F4F4F",
        "status": "在建"
      },
      {
        "name": "17号线",
        "color": "#00abab",
        "status": "全线运营"
      }
    ],
    "description": "北京经济技术开发区核心区，225平方公里产业新城，小米汽车、京东总部等龙头企业聚集，青年就业人口激增",
    "stats": {
      "population": "35万",
      "commuters": "20万/日",
      "housingDensity": "中低密度",
      "avgCommute": "42分钟",
      "jobs": "约35万"
    },
    "industries": [
      "新能源汽车",
      "集成电路",
      "智能制造",
      "生物医药"
    ],
    "housingStatus": {
      "current": "大量青年科技工人，住房多在黄村/旧宫，通勤依赖公交",
      "supply": "亦嘉新青年小镇等保障性租赁住房已投用，存量商办改建中",
      "opportunity": "保租房扩容+存量商办改青年公寓+亦庄联络线改善通勤"
    },
    "opportunities": [
      {
        "icon": "🔋",
        "title": "产业引擎",
        "desc": "小米汽车+京东方+北京奔驰，制造业就业超20万"
      },
      {
        "icon": "🏠",
        "title": "青年安居",
        "desc": "亦嘉新青年小镇阶梯式安居政策（求职免费/实习免租/就业折扣）"
      },
      {
        "icon": "🚇",
        "title": "轨道加密",
        "desc": "亦庄联络线+17号线，双线串联经开区核心与外部组团"
      },
      {
        "icon": "🏗",
        "title": "城市配套",
        "desc": "同仁医院亦庄院区+人大附中+南海子公园，公服能级跃升"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 55,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 35,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 45,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 90,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "小米汽车工厂",
          "type": "employment",
          "coords": [
            116.5058,
            39.7638
          ],
          "desc": "智能电动汽车制造基地"
        },
        {
          "name": "京东方科技集团",
          "type": "employment",
          "coords": [
            116.5148,
            39.7878
          ],
          "desc": "全球显示面板龙头企业"
        },
        {
          "name": "北京经济技术开发区核心区",
          "type": "employment",
          "coords": [
            116.5068,
            39.7848
          ],
          "desc": "225平方公里产业新城，就业约45万"
        },
        {
          "name": "京东总部（亦庄）",
          "type": "employment",
          "coords": [
            116.5078,
            39.8038
          ],
          "desc": "电商巨头华北总部"
        }
      ],
      "residential": [
        {
          "name": "亦嘉·新青年小镇",
          "type": "residential",
          "coords": [
            116.5148,
            39.7648
          ],
          "desc": "保障性租赁住房，2000套，青年人阶梯式安居"
        },
        {
          "name": "亦庄泰河园",
          "type": "residential",
          "coords": [
            116.4998,
            39.7698
          ],
          "desc": "2008年建成，经开区通勤社区"
        },
        {
          "name": "亦庄金茂悦",
          "type": "residential",
          "coords": [
            116.5128,
            39.7898
          ],
          "desc": "新建商品住宅社区"
        }
      ],
      "publicSpace": [
        {
          "name": "南海子公园",
          "type": "publicSpace",
          "coords": [
            116.4888,
            39.7838
          ],
          "desc": "北京最大湿地公园，面积约743公顷"
        },
        {
          "name": "亦庄凉水河滨水公园",
          "type": "publicSpace",
          "coords": [
            116.5098,
            39.7798
          ],
          "desc": "产业区内的生态廊道"
        },
        {
          "name": "博大公园",
          "type": "publicSpace",
          "coords": [
            116.5028,
            39.7718
          ],
          "desc": "经开区中心绿地"
        }
      ],
      "publicService": [
        {
          "name": "同仁医院亦庄院区",
          "type": "publicService",
          "coords": [
            116.5218,
            39.7798
          ],
          "desc": "三甲医院分院"
        },
        {
          "name": "北京儿童医院亦庄院区（在建）",
          "type": "publicService",
          "coords": [
            116.5028,
            39.7578
          ],
          "desc": "优质儿科医疗资源引入"
        },
        {
          "name": "人大附中经开区学校",
          "type": "publicService",
          "coords": [
            116.5098,
            39.7718
          ],
          "desc": "名校办学，12年制"
        }
      ]
    }
  },
  {
    "id": "huoying",
    "name": "霍营-北苑",
    "center": [
      116.3708,
      40.0428
    ],
    "radius": 2700,
    "relatedLines": [
      {
        "name": "8号线",
        "color": "#00a070",
        "status": "运营中"
      },
      {
        "name": "13号线",
        "color": "#f4da40",
        "status": "运营中"
      },
      {
        "name": "13号线扩能",
        "color": "#f4da40",
        "status": "在建"
      }
    ],
    "description": "回天地区东部门户，霍营城市级微中心+新龙泽城市级微中心双核驱动，13号线扩能提升换乘能力",
    "stats": {
      "population": "30万",
      "commuters": "16万/日",
      "housingDensity": "高密度",
      "avgCommute": "48分钟",
      "jobs": "约8万"
    },
    "industries": [
      "智能制造",
      "信息技术",
      "生活服务",
      "电商物流"
    ],
    "housingStatus": {
      "current": "大型居住社区为主，部分2000年前后建成住宅老化加速",
      "supply": "13号线扩能提升出行效率，微中心规划增加配套",
      "opportunity": "霍营+新龙泽双微中心TOD开发+回天行动升级+老旧社区改造"
    },
    "opportunities": [
      {
        "icon": "🏗",
        "title": "双微中心",
        "desc": "霍营+新龙泽两个城市级微中心协同开发"
      },
      {
        "icon": "🚊",
        "title": "13号线扩能",
        "desc": "拆分为A/B线后通勤效率大幅提升"
      },
      {
        "icon": "🔄",
        "title": "回天升级",
        "desc": "回天行动计划三期，持续投入公共设施"
      },
      {
        "icon": "🏘",
        "title": "社区焕新",
        "desc": "2000年前后建成社区老化加速，提前规划更新"
      }
    ],
    "progressData": [
      {
        "label": "轨道覆盖率",
        "value": 70,
        "type": ""
      },
      {
        "label": "职住平衡指数",
        "value": 32,
        "type": "fill-accent"
      },
      {
        "label": "配套完善度",
        "value": 50,
        "type": "fill-warning"
      },
      {
        "label": "TOD开发潜力",
        "value": 83,
        "type": "fill-success"
      }
    ],
    "pois": {
      "employment": [
        {
          "name": "回龙观科技产业园（东区）",
          "type": "employment",
          "coords": [
            116.3618,
            40.0448
          ],
          "desc": "科技中小企业集聚区"
        },
        {
          "name": "龙域中心东区",
          "type": "employment",
          "coords": [
            116.3758,
            40.0278
          ],
          "desc": "综合商务办公区"
        },
        {
          "name": "霍营地铁商圈",
          "type": "employment",
          "coords": [
            116.3718,
            40.0458
          ],
          "desc": "换乘站周边商业就业"
        }
      ],
      "residential": [
        {
          "name": "霍营社区",
          "type": "residential",
          "coords": [
            116.3728,
            40.0438
          ],
          "desc": "2005年前后建成，大型居住区"
        },
        {
          "name": "龙锦苑",
          "type": "residential",
          "coords": [
            116.3548,
            40.0548
          ],
          "desc": "2003年建成经适房，楼龄超20年"
        },
        {
          "name": "新龙城社区",
          "type": "residential",
          "coords": [
            116.3438,
            40.0538
          ],
          "desc": "2006年建成，靠近新龙泽站"
        },
        {
          "name": "蓬莱公寓",
          "type": "residential",
          "coords": [
            116.3808,
            40.0388
          ],
          "desc": "2002年建成，老旧小区改造需求"
        }
      ],
      "publicSpace": [
        {
          "name": "霍营公园",
          "type": "publicSpace",
          "coords": [
            116.3698,
            40.0418
          ],
          "desc": "回天行动新建社区公园"
        },
        {
          "name": "回龙观东部绿道",
          "type": "publicSpace",
          "coords": [
            116.3588,
            40.0488
          ],
          "desc": "自行车专用路东延线"
        },
        {
          "name": "华龙苑南里绿地",
          "type": "publicSpace",
          "coords": [
            116.3678,
            40.0378
          ],
          "desc": "社区绿地，可进一步提升"
        }
      ],
      "publicService": [
        {
          "name": "昌平区中西医结合医院",
          "type": "publicService",
          "coords": [
            116.3768,
            40.0468
          ],
          "desc": "区级医院"
        },
        {
          "name": "霍营中心小学",
          "type": "publicService",
          "coords": [
            116.3708,
            40.0438
          ],
          "desc": "社区基础教育"
        },
        {
          "name": "北京市昌平一中",
          "type": "publicService",
          "coords": [
            116.3618,
            40.0348
          ],
          "desc": "昌平区重点中学"
        }
      ]
    }
  }
];
