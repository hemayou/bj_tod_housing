// ========================================
// OPC社区数据 — v5.0
// ========================================

const OPC_COMMUNITIES = [
  {
    id: 'shangdi_opc',
    name: '海淀上地·AI北纬OPC社区',
    subtitle: '综合评分 ★★★★★',
    center: [116.3058, 40.0388],
    radius: 2000,
    status: 'active',
    statusLabel: '已运营',
    metroAccess: '16号线上地站',
    area: '800㎡共享服务空间',
    focus: 'AI技术开发 · AIGC内容 · 数字营销',
    currentFeatures: [
      '北京首个AI OPC服务计划（2025年12月发布）',
      '上地街道2.3万家企业、密度超2000家/km²',
      '10家"友好社区"单位形成核心矩阵',
      '尚东数字山谷、中关村e谷、中关村软件园等',
      '800㎡共享空间（会议室、茶水间、餐饮吧）'
    ],
    futurePlan: [
      '全市首个人工智能OPC友好创新街区（2026年3月启动）',
      '植入"OPC邻里社交站"：白天展示洽谈 / 晚上垂类"攒局"',
      'AI Agent/Prompt工程 → AIGC内容 → 数字营销 → SaaS变现全产业链',
      '打造分时运营的咖啡/轻食/展示综合空间'
    ],
    color: '#00D4FF'
  },
  {
    id: 'jiuxianqiao_opc',
    name: '朝阳酒仙桥·极客部落OPC社区',
    subtitle: '综合评分 ★★★★☆',
    center: [116.4958, 39.9788],
    radius: 1800,
    status: 'active',
    statusLabel: '已运营',
    metroAccess: '14号线将台站',
    area: 'ITEC电子城科技园',
    focus: '内容创意 · 品牌设计 · 传媒科技',
    currentFeatures: [
      '朝阳区首个OPC社区"极客部落·AI应用生态园"',
      '2026年2月在ITEC（电子城科技园）亮相',
      '设有"青年人才会客厅"，聚焦投融资对接',
      '紧邻798艺术区、751时尚设计广场',
      'WeWork酒仙桥150㎡会客厅支持活动和讲座'
    ],
    futurePlan: [
      '2026年启动OPC创业者招募计划',
      '打造"内容创作者交流俱乐部"，配备影音录制设备',
      '短视频/播客 → 品牌设计 → 广告投放 → 艺术IP孵化产业链',
      '利用798/751文化氛围建立"非正式社群展示空间"'
    ],
    color: '#00D4FF'
  },
  {
    id: 'yizhuang_opc',
    name: '亦庄·模数OPC社区',
    subtitle: '综合评分 ★★★★☆',
    center: [116.5188, 39.7658],
    radius: 1500,
    status: 'active',
    statusLabel: '已运营',
    metroAccess: '亦庄线',
    area: '首期3000㎡（远期1万㎡）',
    focus: 'AI硬件 · 工业AI · 医药数据',
    currentFeatures: [
      '北京目前规模最大的OPC专属社区',
      '首期3000㎡（远期1万㎡），通明湖信息城',
      '播客录音棚、绿幕摄影棚、小型路演厅',
      '硬件展示区、高桌协作区等"快闪式洽谈"设施',
      '首批20余家OPC（AIGC视觉生成、软件开发、AI硬件）'
    ],
    futurePlan: [
      '扩展至1万㎡全功能OPC产业社区',
      '补充"展示+交流式第三空间"（AI产品Demo + 硬件展示）',
      'AI硬件 → 工业AI → 医药数据分析 → 内容工具全链条',
      '依托医药健康、具身智能、工业制造数据场景'
    ],
    color: '#00D4FF'
  },
  {
    id: 'zhangjiawan_opc',
    name: '通州张家湾·设计小镇OPC社区',
    subtitle: '综合评分 ★★★☆☆',
    center: [116.7182, 39.8509],
    radius: 1500,
    status: 'planned',
    statusLabel: '规划中',
    metroAccess: '规划M102线',
    area: '张家湾设计小镇',
    focus: '工业设计 · 品牌视觉 · 文创IP',
    currentFeatures: [
      '北京城市副中心"十四五"特色小镇',
      '已引进440余家设计/科技类企业',
      '北京国际设计周永久会址',
      '浓厚的创意独立工作者文化底色',
      '首个区域时尚产业专项方案（2025年）'
    ],
    futurePlan: [
      '利用老工厂改造空间打造"设计师共享工作室"',
      '作品库+洽谈卡座+快闪式展览模型',
      '工业设计 → 品牌视觉 → 设计IP → 文创消费品产业链',
      '通过"攒局"活动联结设计师OPC与采购方'
    ],
    color: '#00AADD'
  },
  {
    id: 'fengtai_opc',
    name: '丰台科技园·9号线OPC社区',
    subtitle: '综合评分 ★★★☆☆',
    center: [116.2868, 39.8468],
    radius: 1500,
    status: 'planned',
    statusLabel: '规划中',
    metroAccess: '9号线丰台科技园站',
    area: '华夏幸福创新中心',
    focus: 'AI+轨道交通 · AI+应急 · AI+环保',
    currentFeatures: [
      '中关村丰台科技园核心区',
      '毗邻丽泽金融商务区',
      '华夏幸福创新中心"144智能产业集群"',
      '10号/19号/大兴机场线多轨道交汇',
      '已有商务洽谈功能区'
    ],
    futurePlan: [
      '补充低成本、灵活高频的多对多OPC交流空间',
      '应用开发 → 数据分析 → 工程咨询 → 销售代理产业链',
      '利用丽泽金融属性提供投资人可达性',
      '打造AI+垂直行业的OPC协作据点'
    ],
    color: '#00AADD'
  }
];
