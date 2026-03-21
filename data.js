// ========================================
// 北京轨道交通TOD数据 — v3
// 运营线路: citylines.co + 18号线(uploaded)
// 在建线路: uploaded GeoJSON (new_uc_lines.json)
// 微中心: uploaded xlsx (micro_centers.json)
// ========================================

// ========================================
// TOD 重点机遇区
// ========================================
const OPPORTUNITY_ZONES = [
  {
    id: 'huilongguan',
    name: '回龙观-西三旗',
    center: [116.3280, 40.0600],
    radius: 2800,
    relatedLines: [
      { name: '13号线扩能', color: '#f4da40', status: '在建' },
      { name: '昌平线', color: '#d986ba', status: '运营中' }
    ],
    description: '构建北部新城与中心城区通勤骨干廊道，支撑科技创新中心建设，提升北部地区横向职住平衡',
    stats: { population: '82万', commuters: '38万/日', housingDensity: '高密度', avgCommute: '52分钟' },
    industries: ['科技创新', '互联网/IT', '人工智能', '生物医药'],
    housingStatus: {
      current: '以大型居住社区为主，职住分离严重',
      supply: '保障性住房占比约15%',
      opportunity: '增加产业配套住房、优化通勤效率、提升社区商业配套'
    },
    opportunities: [
      { icon: '🏗', title: '站城一体化', desc: '围绕西二旗、回龙观等站点，打造综合开发示范区' },
      { icon: '🏠', title: '住房优化', desc: '增加人才公寓和保障性租赁住房，缓解职住分离' },
      { icon: '🚊', title: '通勤提效', desc: '13号线扩能后通勤时间将缩短约15分钟' },
      { icon: '🏪', title: '配套升级', desc: '补充社区商业、教育、医疗等公共服务设施' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 65, type: '' },
      { label: '职住平衡指数', value: 35, type: 'fill-accent' },
      { label: '配套完善度', value: 55, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 85, type: 'fill-success' }
    ]
  },
  {
    id: 'tiantongyuan',
    name: '天通苑',
    center: [116.4200, 40.0580],
    radius: 2200,
    relatedLines: [
      { name: '5号线', color: '#aa0061', status: '运营中' },
      { name: '17号线', color: '#00abab', status: '全线运营' },
      { name: '13号线扩能', color: '#f4da40', status: '在建' }
    ],
    description: '亚洲最大社区之一，承接中关村居住需求外溢，提升回天地区地铁沿线价值',
    stats: { population: '70万', commuters: '32万/日', housingDensity: '超高密度', avgCommute: '55分钟' },
    industries: ['居住配套', '社区商业', '教育培训', '文化娱乐'],
    housingStatus: {
      current: '全国最大规模经济适用房社区，高层住宅集中',
      supply: '住房总量充足但品质参差不齐',
      opportunity: '推进老旧小区改造、优化公共空间、提升居住品质'
    },
    opportunities: [
      { icon: '🔄', title: '城市更新', desc: '老旧社区改造，提升居住品质和公共空间' },
      { icon: '🛤', title: '多线换乘', desc: '17号线全线贯通，大幅改善南北通勤' },
      { icon: '🏬', title: '商业升级', desc: '站点周边商业综合体开发，补充消费功能' },
      { icon: '🌳', title: '绿色社区', desc: '完善绿道系统，建设15分钟生活圈' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 60, type: '' },
      { label: '职住平衡指数', value: 28, type: 'fill-accent' },
      { label: '配套完善度', value: 45, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 80, type: 'fill-success' }
    ]
  },
  {
    id: 'shangdi',
    name: '上地-马连洼',
    center: [116.2900, 40.0280],
    radius: 2000,
    relatedLines: [
      { name: '13号线', color: '#f4da40', status: '运营中' },
      { name: '16号线', color: '#6ba539', status: '运营中' },
      { name: '昌平线', color: '#d986ba', status: '运营中' }
    ],
    description: '中关村科学城核心区域，全国最密集的科技企业集聚地',
    stats: { population: '35万', commuters: '28万/日', housingDensity: '中等', avgCommute: '45分钟' },
    industries: ['互联网科技', '人工智能', '半导体芯片', '软件研发'],
    housingStatus: {
      current: '以科技园区和产业办公为主，住房需求外溢至回龙观',
      supply: '人才公寓需求旺盛，供应不足',
      opportunity: '结合轨道站点增加人才住房供给、打造15分钟产城融合圈'
    },
    opportunities: [
      { icon: '🏢', title: '产城融合', desc: '科技园区配建人才公寓，实现就近居住' },
      { icon: '🔬', title: '创新集群', desc: '围绕站点打造科技创新综合服务中心' },
      { icon: '🚶', title: '慢行系统', desc: '打通站点到园区的最后一公里慢行通道' },
      { icon: '📐', title: '空间优化', desc: '低效用地再开发，提升容积率和空间效率' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 70, type: '' },
      { label: '职住平衡指数', value: 42, type: 'fill-accent' },
      { label: '配套完善度', value: 60, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 88, type: 'fill-success' }
    ]
  },
  {
    id: 'lize',
    name: '丽泽-草桥',
    center: [116.3200, 39.8700],
    radius: 2000,
    relatedLines: [
      { name: '14号线', color: '#ca9a8e', status: '运营中' },
      { name: '16号线', color: '#6ba539', status: '运营中' },
      { name: '大兴机场线北延', color: '#0049a5', status: '在建' }
    ],
    description: '丽泽金融商务区将迎"一站五轨"，建设"立体城市"，成为京津冀协同发展桥头堡',
    stats: { population: '12万', commuters: '8万/日', housingDensity: '开发中', avgCommute: '35分钟' },
    industries: ['金融科技', '数字经济', '专业服务', '国际商务'],
    housingStatus: {
      current: '新兴商务区，住房配套正在建设中',
      supply: '规划商品住宅、人才公寓和服务式公寓',
      opportunity: '大兴机场线北延引入城市航站楼，强化区域品质提升'
    },
    opportunities: [
      { icon: '✈️', title: '航站楼TOD', desc: '城市航站楼落地丽泽，20分钟直达大兴机场' },
      { icon: '🏦', title: '金融集聚', desc: '打造第二金融街，配套高品质商务住宅' },
      { icon: '🔗', title: '五线换乘', desc: '14号线+16号线+11号线+丽金线+新机场线' },
      { icon: '🌆', title: '立体城市', desc: '地上地下互联互通，站城深度融合' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 55, type: '' },
      { label: '职住平衡指数', value: 50, type: 'fill-accent' },
      { label: '配套完善度', value: 40, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 92, type: 'fill-success' }
    ]
  },
  {
    id: 'lugu_garden',
    name: '鲁谷-园博园',
    center: [116.2450, 39.9050],
    radius: 2200,
    relatedLines: [
      { name: '1号线支线', color: '#a4343a', status: '在建' },
      { name: '14号线', color: '#ca9a8e', status: '运营中' }
    ],
    description: '串联新首钢高端产业服务区、中关村丰台园等重要产业集聚区',
    stats: { population: '25万', commuters: '10万/日', housingDensity: '中低密度', avgCommute: '42分钟' },
    industries: ['航天科技', '新材料', '高端装备', '数字创意'],
    housingStatus: {
      current: '老工业区转型，存量住房以老旧社区为主',
      supply: '1号线支线沿线规划新增住宅供应',
      opportunity: '结合产业升级，打造产城融合的航天产业新城'
    },
    opportunities: [
      { icon: '🚀', title: '航天产业', desc: '依托云岗航天基地，打造航天产业矩阵' },
      { icon: '🏗', title: '工业转型', desc: '首钢园区改造经验推广，存量工业用地更新' },
      { icon: '🚇', title: '轨道引导', desc: '1号线支线带动沿线8座新站周边开发' },
      { icon: '🌿', title: '生态融合', desc: '园博园生态资源与站点开发有机结合' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 30, type: '' },
      { label: '职住平衡指数', value: 55, type: 'fill-accent' },
      { label: '配套完善度', value: 35, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 78, type: 'fill-success' }
    ]
  },
  {
    id: 'gaobeidian',
    name: '高碑店',
    center: [116.5150, 39.9130],
    radius: 1500,
    relatedLines: [
      { name: '1号线/八通线', color: '#a4343a', status: '运营中' },
      { name: '22号线', color: '#CB6A43', status: '在建' }
    ],
    description: '位于CBD东部延伸带，文化创意产业与居住功能融合发展',
    stats: { population: '18万', commuters: '8万/日', housingDensity: '中密度', avgCommute: '38分钟' },
    industries: ['文化创意', '传媒影视', '艺术设计', '古典家具'],
    housingStatus: {
      current: '传统居住区与文化产业混合，部分区域待更新',
      supply: '22号线开通将提升通勤便利性',
      opportunity: '发挥文化产业优势，打造创意产业社区'
    },
    opportunities: [
      { icon: '🎨', title: '文创产业', desc: '利用高碑店文化优势，打造创意产业集群' },
      { icon: '🏘', title: '社区升级', desc: '改善居住环境，引入品质商业配套' },
      { icon: '🚆', title: '交通提升', desc: '22号线连接CBD和燕郊，增强区域可达性' },
      { icon: '🏛', title: '文化保护', desc: '传统文化元素融入TOD开发设计' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 50, type: '' },
      { label: '职住平衡指数', value: 60, type: 'fill-accent' },
      { label: '配套完善度', value: 50, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 72, type: 'fill-success' }
    ]
  },
  {
    id: 'jingai',
    name: '金盏',
    center: [116.5500, 39.9550],
    radius: 2000,
    relatedLines: [
      { name: '3号线', color: '#e91414', status: '运营/在建' },
      { name: '12号线', color: '#7e4f27', status: '运营中' }
    ],
    description: '第四使馆区所在地，国际商务和文化交流的重要节点',
    stats: { population: '15万', commuters: '6万/日', housingDensity: '低密度', avgCommute: '40分钟' },
    industries: ['国际商务', '外交服务', '高端酒店', '文化交流'],
    housingStatus: {
      current: '以别墅和低密度住宅为主，国际社区特色',
      supply: '规划增加国际人才公寓和配套住房',
      opportunity: '打造高品质国际化TOD社区'
    },
    opportunities: [
      { icon: '🌏', title: '国际枢纽', desc: '结合第四使馆区，打造国际化服务中心' },
      { icon: '🏨', title: '高端配套', desc: '国际学校、医疗等高品质公共服务设施' },
      { icon: '🛤', title: '轨道新城', desc: '3号线和12号线为区域带来全新发展机遇' },
      { icon: '🏡', title: '国际社区', desc: '规划建设高品质国际化居住社区' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 25, type: '' },
      { label: '职住平衡指数', value: 45, type: 'fill-accent' },
      { label: '配套完善度', value: 35, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 82, type: 'fill-success' }
    ]
  },
  {
    id: 'guanzhuang',
    name: '管庄',
    center: [116.5400, 39.9300],
    radius: 1500,
    relatedLines: [
      { name: '1号线/八通线', color: '#a4343a', status: '运营中' },
      { name: '12号线', color: '#7e4f27', status: '运营中' }
    ],
    description: '朝阳区东部重要的产居融合区域',
    stats: { population: '20万', commuters: '9万/日', housingDensity: '中高密度', avgCommute: '40分钟' },
    industries: ['商贸物流', '文化教育', '社区服务', '科技研发'],
    housingStatus: {
      current: '大型居住区集中，12号线提升了区域通达性',
      supply: '住房供应相对充足，品质提升空间大',
      opportunity: '利用双线优势，打造东部城市副中心配套区'
    },
    opportunities: [
      { icon: '🔀', title: '双线联动', desc: '1号线+12号线双轨驱动，提升换乘效率' },
      { icon: '🏘', title: '社区更新', desc: '老旧社区改造，提升居住品质' },
      { icon: '📚', title: '教育配套', desc: '完善教育资源，吸引年轻家庭' },
      { icon: '🛒', title: '商业活力', desc: '站点周边商业综合开发' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 60, type: '' },
      { label: '职住平衡指数', value: 50, type: 'fill-accent' },
      { label: '配套完善度', value: 48, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 70, type: 'fill-success' }
    ]
  },
  {
    id: 'yunhe',
    name: '运河商务区',
    center: [116.6400, 39.9100],
    radius: 2200,
    relatedLines: [
      { name: '6号线', color: '#b58500', status: '运营中' },
      { name: 'M101线', color: '#7F7F7F', status: '在建' }
    ],
    description: '北京城市副中心核心区，承接非首都功能疏解的重要承载地',
    stats: { population: '28万', commuters: '12万/日', housingDensity: '开发中', avgCommute: '45分钟' },
    industries: ['总部经济', '金融服务', '文化旅游', '科技创新'],
    housingStatus: {
      current: '新城开发中，大量住房项目在建',
      supply: '规划各类住房约2000万平方米',
      opportunity: '高标准规划建设，打造职住平衡的现代化新城'
    },
    opportunities: [
      { icon: '🏙', title: '副中心建设', desc: '承接市级行政办公和企业总部迁入' },
      { icon: '🌊', title: '运河文化', desc: '大运河文化带与TOD开发深度融合' },
      { icon: '🚇', title: 'M101加持', desc: 'M101线加密副中心内部轨道网络' },
      { icon: '🏗', title: '产城一体', desc: '高标准规划产业、居住、公共服务配套' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 40, type: '' },
      { label: '职住平衡指数', value: 58, type: 'fill-accent' },
      { label: '配套完善度', value: 45, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 90, type: 'fill-success' }
    ]
  },
  {
    id: 'cbd_baiziwan',
    name: 'CBD-百子湾',
    center: [116.4750, 39.9000],
    radius: 2000,
    relatedLines: [
      { name: '1号线', color: '#a4343a', status: '运营中' },
      { name: '10号线', color: '#0092bc', status: '运营中' },
      { name: '17号线', color: '#00abab', status: '全线运营' },
      { name: '28号线', color: '#3E6DB5', status: '在建' }
    ],
    description: '国际化商务中心区，28号线加密轨道服务，加强就业和居住的空间联系',
    stats: { population: '45万', commuters: '35万/日', housingDensity: '超高密度', avgCommute: '38分钟' },
    industries: ['国际金融', '跨国总部', '专业服务', '高端商业'],
    housingStatus: {
      current: '国贸商圈核心，商务办公密集，百子湾为居住组团',
      supply: '28号线将连通CBD和百子湾居住区',
      opportunity: '优化CBD职住联系，提升百子湾居住品质和交通便利性'
    },
    opportunities: [
      { icon: '🏢', title: 'CBD升级', desc: '28号线加密CBD轨道网，提升商务效率' },
      { icon: '🏠', title: '百子湾优化', desc: '改善百子湾居住配套，缩短CBD通勤距离' },
      { icon: '🔗', title: '四线交汇', desc: '1号线+10号线+17号线+28号线多线换乘' },
      { icon: '🌐', title: '国际化', desc: '对标世界级商务区，完善国际化配套' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 80, type: '' },
      { label: '职住平衡指数', value: 40, type: 'fill-accent' },
      { label: '配套完善度', value: 72, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 85, type: 'fill-success' }
    ]
  },
  {
    id: 'gongtishilihe',
    name: '工体-十里河',
    center: [116.4500, 39.9250],
    radius: 2200,
    relatedLines: [
      { name: '6号线', color: '#b58500', status: '运营中' },
      { name: '10号线', color: '#0092bc', status: '运营中' },
      { name: '17号线', color: '#00abab', status: '全线运营' }
    ],
    description: '17号线全线贯通，串联工体商圈到十里河的南北通道，激活城市活力',
    stats: { population: '55万', commuters: '25万/日', housingDensity: '高密度', avgCommute: '32分钟' },
    industries: ['文体娱乐', '时尚消费', '餐饮服务', '建材家居'],
    housingStatus: {
      current: '成熟城区，住房存量大但更新需求强烈',
      supply: '17号线贯通改善南北通勤效率',
      opportunity: '围绕工体改造，打造城市活力消费中心'
    },
    opportunities: [
      { icon: '⚽', title: '工体再生', desc: '新工体落成，带动周边商业和文化复兴' },
      { icon: '🛍', title: '消费升级', desc: '17号线串联多个商圈，构建消费走廊' },
      { icon: '🔄', title: '城市更新', desc: '老旧社区改造与站点开发同步推进' },
      { icon: '🎭', title: '文化地标', desc: '三里屯-工体-朝阳公园文化带融合发展' }
    ],
    progressData: [
      { label: '轨道覆盖率', value: 75, type: '' },
      { label: '职住平衡指数', value: 55, type: 'fill-accent' },
      { label: '配套完善度', value: 70, type: 'fill-warning' },
      { label: 'TOD开发潜力', value: 78, type: 'fill-success' }
    ]
  }
];
