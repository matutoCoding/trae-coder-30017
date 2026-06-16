export type BambooQuality = 'excellent' | 'good' | 'normal' | 'poor'

export interface Bamboo {
  id: string
  batchNo: string
  source: string
  diameter: number
  length: number
  quality: BambooQuality
  purchaseDate: string
  quantity: number
  status: 'available' | 'used' | 'reserved'
  inspector: string
  remark?: string
}

export type ProcessStatus = 'pending' | 'doing' | 'done'

export interface ProcessStep {
  id: string
  name: string
  description: string
  duration: number
  craftsman: string
  startTime?: string
  endTime?: string
  status: ProcessStatus
  remark?: string
}

export interface UmbrellaFrame {
  id: string
  bambooId: string
  ribCount: number
  drillHoles: number
  threadType: string
  craftsman: string
  createTime: string
  status: ProcessStatus
  qualityCheck: 'pending' | 'passed' | 'failed'
}

export interface UmbrellaPainting {
  id: string
  frameId: string
  paperType: string
  paintStyle: string
  pattern: string
  painter: string
  createTime: string
  status: ProcessStatus
}

export interface UmbrellaOiling {
  id: string
  paintingId: string
  oilType: string
  oilCoatCount: number
  dryTime: number
  oilingTime: string
  status: ProcessStatus
  openCloseCheck: 'pending' | 'passed' | 'failed'
}

export type UmbrellaStyle = 'wedding' | 'cultural' | 'traditional' | 'custom'

export interface UmbrellaProduct {
  id: string
  productNo: string
  name: string
  style: UmbrellaStyle
  color: string
  pattern: string
  size: number
  frameId: string
  paintingId: string
  oilingId: string
  finishDate: string
  price: number
  status: 'inventory' | 'sold' | 'reserved' | 'custom'
  craftsman: string
  description?: string
}

export type OrderType = 'wedding' | 'cultural' | 'custom' | 'retail'

export type OrderStatus = 'pending' | 'producing' | 'completed' | 'delivered'

export interface CustomOrder {
  id: string
  orderNo: string
  type: OrderType
  customerName: string
  customerPhone: string
  umbrellaStyle: string
  umbrellaColor: string
  pattern: string
  patternDesc?: string
  quantity: number
  price: number
  deposit: number
  createTime: string
  expectDate: string
  status: OrderStatus
  remark?: string
}

export interface SalesRecord {
  id: string
  recordNo: string
  productId?: string
  productName: string
  customerName: string
  quantity: number
  unitPrice: number
  totalAmount: number
  saleDate: string
  channel: 'online' | 'offline' | 'wholesale'
  remark?: string
}

export interface CraftInfo {
  id: string
  title: string
  description: string
  imageUrl: string
  steps: string[]
  craftsman: string
}

export interface DashboardStats {
  todayProduction: number
  monthProduction: number
  pendingOrders: number
  totalSales: number
  bambooStock: number
  inProgress: number
}
