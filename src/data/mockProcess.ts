import { ProcessStep, UmbrellaFrame, UmbrellaPainting, UmbrellaOiling } from '@/types/umbrella'

export const mockProcessSteps: ProcessStep[] = [
  {
    id: 'ps001',
    name: '选竹备料',
    description: '选用三年以上的优质楠竹，根据伞的尺寸要求截取合适长度',
    duration: 48,
    craftsman: '李师傅',
    startTime: '2026-06-10 08:00',
    endTime: '2026-06-10 17:00',
    status: 'done',
  },
  {
    id: 'ps002',
    name: '伞骨制作',
    description: '竹料晾晒后，进行伞骨的削制、钻孔、穿线等工序',
    duration: 72,
    craftsman: '王师傅',
    startTime: '2026-06-11 08:00',
    endTime: '2026-06-13 17:00',
    status: 'done',
  },
  {
    id: 'ps003',
    name: '糊伞绘画',
    description: '将宣纸裱糊在伞骨上，晾干后进行手绘彩绘',
    duration: 96,
    craftsman: '张大伞匠',
    startTime: '2026-06-14 08:00',
    status: 'doing',
  },
  {
    id: 'ps004',
    name: '桐油浸制',
    description: '在伞面上反复刷桐油，每次刷完后需充分晾晒',
    duration: 120,
    craftsman: '李师傅',
    status: 'pending',
  },
  {
    id: 'ps005',
    name: '开合校验',
    description: '检验伞的开合流畅度，检查整体结构是否牢固',
    duration: 24,
    craftsman: '王师傅',
    status: 'pending',
  },
]

export const mockFrames: UmbrellaFrame[] = [
  {
    id: 'f001',
    bambooId: 'b001',
    ribCount: 32,
    drillHoles: 64,
    threadType: '蚕丝线',
    craftsman: '王师傅',
    createTime: '2026-06-12 15:30',
    status: 'done',
    qualityCheck: 'passed',
  },
  {
    id: 'f002',
    bambooId: 'b002',
    ribCount: 28,
    drillHoles: 56,
    threadType: '蚕丝线',
    craftsman: '王师傅',
    createTime: '2026-06-13 10:00',
    status: 'done',
    qualityCheck: 'passed',
  },
  {
    id: 'f003',
    bambooId: 'b004',
    ribCount: 32,
    drillHoles: 64,
    threadType: '棉线',
    craftsman: '李师傅',
    createTime: '2026-06-13 16:45',
    status: 'done',
    qualityCheck: 'passed',
  },
  {
    id: 'f004',
    bambooId: 'b003',
    ribCount: 36,
    drillHoles: 72,
    threadType: '金线',
    craftsman: '王师傅',
    createTime: '2026-06-14 09:00',
    status: 'doing',
    qualityCheck: 'pending',
  },
  {
    id: 'f005',
    bambooId: 'b005',
    ribCount: 28,
    drillHoles: 56,
    threadType: '蚕丝线',
    craftsman: '李师傅',
    createTime: '2026-06-14 14:30',
    status: 'pending',
    qualityCheck: 'pending',
  },
]

export const mockPaintings: UmbrellaPainting[] = [
  {
    id: 'pa001',
    frameId: 'f001',
    paperType: '皮纸',
    paintStyle: '工笔重彩',
    pattern: '龙凤呈祥',
    painter: '张大伞匠',
    createTime: '2026-06-14 10:00',
    status: 'doing',
  },
  {
    id: 'pa002',
    frameId: 'f002',
    paperType: '宣纸',
    paintStyle: '水墨写意',
    pattern: '山水意境',
    painter: '李丹青',
    createTime: '2026-06-13 08:00',
    status: 'done',
  },
  {
    id: 'pa003',
    frameId: 'f003',
    paperType: '皮纸',
    paintStyle: '工笔花鸟',
    pattern: '梅花傲雪',
    painter: '王美绘',
    createTime: '2026-06-12 14:00',
    status: 'done',
  },
  {
    id: 'pa004',
    frameId: 'f004',
    paperType: '皮纸',
    paintStyle: '工笔重彩',
    pattern: '百年好合',
    painter: '张大伞匠',
    createTime: '2026-06-15 08:00',
    status: 'pending',
  },
]

export const mockOilings: UmbrellaOiling[] = [
  {
    id: 'o001',
    paintingId: 'pa001',
    oilType: '天然桐油',
    oilCoatCount: 3,
    dryTime: 72,
    oilingTime: '2026-06-15',
    status: 'doing',
    openCloseCheck: 'pending',
  },
  {
    id: 'o002',
    paintingId: 'pa002',
    oilType: '天然桐油',
    oilCoatCount: 3,
    dryTime: 72,
    oilingTime: '2026-06-14',
    status: 'done',
    openCloseCheck: 'passed',
  },
  {
    id: 'o003',
    paintingId: 'pa003',
    oilType: '天然桐油',
    oilCoatCount: 2,
    dryTime: 48,
    oilingTime: '2026-06-13',
    status: 'done',
    openCloseCheck: 'passed',
  },
]

export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待开始',
    doing: '进行中',
    done: '已完成',
  }
  return map[status] || status
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'error',
    doing: 'warning',
    done: 'success',
  }
  return map[status] || 'info'
}
