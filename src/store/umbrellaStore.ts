import { create } from 'zustand'
import { Bamboo, UmbrellaProduct, CustomOrder, SalesRecord, ProcessStep, DashboardStats } from '@/types/umbrella'
import { mockBambooList } from '@/data/mockBamboo'
import { mockProducts } from '@/data/mockProducts'
import { mockOrders, mockSalesRecords } from '@/data/mockOrders'
import { mockProcessSteps } from '@/data/mockProcess'
import { mockDashboardStats } from '@/data/mockCrafts'

interface UmbrellaStore {
  bambooList: Bamboo[]
  products: UmbrellaProduct[]
  orders: CustomOrder[]
  salesRecords: SalesRecord[]
  processSteps: ProcessStep[]
  stats: DashboardStats
  addBamboo: (bamboo: Bamboo) => void
  updateBamboo: (id: string, bamboo: Partial<Bamboo>) => void
  addProduct: (product: UmbrellaProduct) => void
  addOrder: (order: CustomOrder) => void
  updateOrderStatus: (id: string, status: string) => void
  addSalesRecord: (record: SalesRecord) => void
  updateProcessStep: (id: string, step: Partial<ProcessStep>) => void
}

export const useUmbrellaStore = create<UmbrellaStore>((set) => ({
  bambooList: mockBambooList,
  products: mockProducts,
  orders: mockOrders,
  salesRecords: mockSalesRecords,
  processSteps: mockProcessSteps,
  stats: mockDashboardStats,

  addBamboo: (bamboo) =>
    set((state) => ({
      bambooList: [bamboo, ...state.bambooList],
      stats: {
        ...state.stats,
        bambooStock: state.stats.bambooStock + bamboo.quantity,
      },
    })),

  updateBamboo: (id, bamboo) =>
    set((state) => ({
      bambooList: state.bambooList.map((b) =>
        b.id === id ? { ...b, ...bamboo } : b
      ),
    })),

  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
      stats: {
        ...state.stats,
        todayProduction: state.stats.todayProduction + 1,
        monthProduction: state.stats.monthProduction + 1,
      },
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      stats: {
        ...state.stats,
        pendingOrders: state.stats.pendingOrders + 1,
      },
    })),

  updateOrderStatus: (id, status) =>
    set((state) => {
      const oldOrder = state.orders.find((o) => o.id === id)
      const wasPending = oldOrder?.status === 'pending' || oldOrder?.status === 'producing'
      const isCompleted = status === 'completed' || status === 'delivered'
      return {
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, status } : o
        ),
        stats: {
          ...state.stats,
          pendingOrders: isCompleted && wasPending
            ? state.stats.pendingOrders - 1
            : state.stats.pendingOrders,
        },
      }
    }),

  addSalesRecord: (record) =>
    set((state) => ({
      salesRecords: [record, ...state.salesRecords],
      stats: {
        ...state.stats,
        totalSales: state.stats.totalSales + record.totalAmount,
      },
    })),

  updateProcessStep: (id, step) =>
    set((state) => ({
      processSteps: state.processSteps.map((s) =>
        s.id === id ? { ...s, ...step } : s
      ),
    })),
}))
