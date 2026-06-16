import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { mockOrders, getTypeText, getStatusText } from '@/data/mockOrders'
import { CustomOrder } from '@/types/umbrella'
import classnames from 'classnames'

type OrderTypeFilter = 'all' | 'wedding' | 'cultural' | 'custom' | 'retail'

const typeTabs = [
  { key: 'all', name: '全部' },
  { key: 'wedding', name: '婚庆礼伞' },
  { key: 'cultural', name: '文创伞' },
  { key: 'custom', name: '定制伞' },
  { key: 'retail', name: '零售' },
]

const OrdersListPage: React.FC = () => {
  const router = useRouter()
  const [activeType, setActiveType] = useState<OrderTypeFilter>('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const typeParam = router.params.type as OrderTypeFilter
    if (typeParam && ['all', 'wedding', 'cultural', 'custom', 'retail'].includes(typeParam)) {
      setActiveType(typeParam)
      console.log('[OrdersList] 从URL参数加载类型:', typeParam)
    }
  }, [router.params.type])

  const handlePullDownRefresh = () => {
    console.log('[OrdersList] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const filteredOrders = useMemo(() => {
    if (activeType === 'all') return mockOrders
    return mockOrders.filter(o => o.type === activeType)
  }, [activeType])

  const stats = useMemo(() => {
    const totalAmount = mockOrders.reduce((sum, o) => sum + o.price, 0)
    const pendingCount = mockOrders.filter(o => o.status === 'pending' || o.status === 'producing').length
    return {
      orderCount: mockOrders.length,
      totalAmount,
      pendingCount,
      filterCount: filteredOrders.length,
    }
  }, [filteredOrders])

  const handleOrderClick = (id: string) => {
    console.log('[OrdersList] 点击订单:', id)
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${id}` }).catch(console.error)
  }

  const handleTabChange = (key: OrderTypeFilter) => {
    setActiveType(key)
    console.log('[OrdersList] 切换类型:', key)
  }

  const getTypeIcon = (type: string): string => {
    const map: Record<string, string> = {
      wedding: '🏮',
      cultural: '🎨',
      custom: '✨',
      retail: '🛒',
    }
    return map[type] || '📦'
  }

  const getActiveTypeName = (): string => {
    const tab = typeTabs.find(t => t.key === activeType)
    return tab ? tab.name : '全部'
  }

  return (
    <ScrollView
      className={styles.listPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.headerSection}>
        <Text className={styles.title}>{getActiveTypeName()}订单</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.filterCount}</Text>
            <Text className={styles.label}>当前类型</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.pendingCount}</Text>
            <Text className={styles.label}>处理中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>¥{Math.floor(stats.totalAmount / 10000)}万</Text>
            <Text className={styles.label}>总金额</Text>
          </View>
        </View>
      </View>

      <View className={styles.typeTabs}>
        {typeTabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, { [styles.active]: activeType === tab.key })}
            onClick={() => handleTabChange(tab.key as OrderTypeFilter)}
          >
            <Text>{tab.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.orderList}>
        <View className={styles.listHeader}>
          <Text className={styles.title}>
            {activeType === 'all' ? '全部订单' : `${getActiveTypeName()}订单`}
          </Text>
          <Text className={styles.count}>
            共 <Text className={styles.num}>{filteredOrders.length}</Text> 条
          </Text>
        </View>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: CustomOrder) => (
            <View
              key={order.id}
              className={styles.orderItem}
              onClick={() => handleOrderClick(order.id)}
            >
              <View className={styles.orderHeader}>
                <Text className={styles.orderNo}>{order.orderNo}</Text>
                <Text className={classnames(styles.typeTag, styles[order.type])}>
                  {getTypeText(order.type)}
                </Text>
              </View>

              <View className={styles.orderContent}>
                <View className={classnames(styles.orderIcon, styles[order.type])}>
                  <Text>{getTypeIcon(order.type)}</Text>
                </View>
                <View className={styles.orderDetail}>
                  <Text className={styles.patternName}>{order.pattern} · {order.umbrellaColor}</Text>
                  <Text className={styles.customer}>客户：{order.customerName} · {order.customerPhone}</Text>
                </View>
              </View>

              <View className={styles.orderFooter}>
                <View className={styles.orderInfo}>
                  <View className={styles.infoItem}>
                    <Text>数量：</Text>
                    <Text className={styles.value}>×{order.quantity}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text>定金：</Text>
                    <Text className={styles.value}>¥{order.deposit}</Text>
                  </View>
                </View>
                <Text className={styles.totalAmount}>
                  <Text className={styles.symbol}>¥</Text>{order.price.toLocaleString()}
                </Text>
              </View>

              <View className={styles.statusRow}>
                <Text className={classnames(styles.statusTag, styles[order.status])}>
                  {getStatusText(order.status)}
                </Text>
                <Text className={styles.expectDate}>预计交付：{order.expectDate}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.icon}>📝</Text>
            <Text className={styles.text}>暂无{getActiveTypeName()}订单</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default OrdersListPage
