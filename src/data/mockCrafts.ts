import { CraftInfo, DashboardStats } from '@/types/umbrella'

export const mockCrafts: CraftInfo[] = [
  {
    id: 'c001',
    title: '选竹备料',
    description: '选用三年以上的优质楠竹，要求竹节均匀、质地坚硬、无虫蛀。是制作优质油纸伞的基础。',
    imageUrl: 'https://picsum.photos/id/1080/750/500',
    steps: [
      '挑选三年生以上楠竹',
      '检查竹质，剔除虫蛀、开裂者',
      '按尺寸要求锯断竹料',
      '晾晒脱水，约需15-30天',
      '再次筛选，分类存放',
    ],
    craftsman: '李师傅',
  },
  {
    id: 'c002',
    title: '伞骨制作',
    description: '伞骨是油纸伞的骨架，决定了伞的结构稳定性。需经过削制、烘烤、钻孔、穿线等多道工序。',
    imageUrl: 'https://picsum.photos/id/1036/750/500',
    steps: [
      '将竹料劈削成伞骨形状',
      '火烤定型，增加韧性',
      '精确钻孔，确保孔位对齐',
      '穿线连接，使伞骨可灵活开合',
      '打磨光滑，防止刮纸',
    ],
    craftsman: '王师傅',
  },
  {
    id: 'c003',
    title: '糊伞绘画',
    description: '将宣纸裱糊在伞骨上，晾干后由画师进行手绘。这道工序赋予了油纸伞独特的艺术价值。',
    imageUrl: 'https://picsum.photos/id/1015/750/500',
    steps: [
      '裁剪合适大小的皮纸/宣纸',
      '刷上特制糨糊',
      '将纸裱糊在伞骨上，注意平整无皱',
      '阴干48小时以上',
      '画师手绘图案，晾干固色',
    ],
    craftsman: '张大伞匠',
  },
  {
    id: 'c004',
    title: '桐油浸制',
    description: '反复刷上天然桐油，使伞面防水、防蛀、增加韧性。这是油纸伞经久耐用的关键工序。',
    imageUrl: 'https://picsum.photos/id/1039/750/500',
    steps: [
      '选用优质天然桐油',
      '第一遍刷油，薄涂均匀',
      '阴干24-48小时',
      '第二遍刷油，注意边角',
      '第三遍刷油，充分晾晒',
    ],
    craftsman: '李师傅',
  },
  {
    id: 'c005',
    title: '开合校验',
    description: '最后一道质量检验，确保伞开合顺畅、结构牢固、无漏水现象。',
    imageUrl: 'https://picsum.photos/id/1044/750/500',
    steps: [
      '测试伞的开合流畅度',
      '检查伞骨是否牢固',
      '淋水测试防水性能',
      '检查伞面是否平整',
      '安装伞柄、伞头配件',
    ],
    craftsman: '王师傅',
  },
]

export const mockDashboardStats: DashboardStats = {
  todayProduction: 8,
  monthProduction: 156,
  pendingOrders: 5,
  totalSales: 32680,
  bambooStock: 480,
  inProgress: 12,
}

export const productionBatchData = [
  { month: '1月', output: 120 },
  { month: '2月', output: 98 },
  { month: '3月', output: 145 },
  { month: '4月', output: 167 },
  { month: '5月', output: 189 },
  { month: '6月', output: 156 },
]
