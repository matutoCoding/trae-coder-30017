import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import OrderCard from '@/components/OrderCard'
import { useUmbrellaStore } from '@/store/umbrellaStore'
import { getChannelText } from '@/data/mockOrders'
import classnames from 'classnames'

type TabType = 'orders' | 'sales'

const SalesPage: React.FC = () => {
  const { orders, salesRecords, stats } = useUmbrellaStore()
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [refreshing, setRefreshing] = useState(false)

  const tabs = [
    { key: 'orders', label: '定制订单' },
    { key: 'sales', label: '销售台账' },
  ]

  const handlePullDownRefresh = () => {
    console.log('[Sales] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleQuickAction = (type: string) => {
    console.log('[Sales] 点击快捷操作:', type)
    const pathMap: Record<string, string> = {
      wedding: '/pages/orders-list/index?type=wedding',
      cultural: '/pages/orders-list/index?type=cultural',
      custom: '/pages/orders-list/index?type=custom',
      record: '/pages/sales-record/index',
    }
    Taro.navigateTo({ url: pathMap[type] }).catch(console.error)
  }

  const handleOrderClick = (id: string) => {
    console.log('[Sales] 点击订单:', id)
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${id}` }).catch(console.error)
  }

  const handleSalesRecordClick = (id: string) => {
    console.log('[Sales] 点击销售记录:', id)
    Taro.navigateTo({ url: `/pages/sales-detail/index?id=${id}` }).catch(console.error)
  }

  const handleViewAllOrders = () => {
    console.log('[Sales] 查看全部订单')
    Taro.navigateTo({ url: '/pages/orders-list/index?type=all' }).catch(console.error)
  }

  const handleViewAllSales = () => {
    console.log('[Sales] 查看全部销售记录')
    Taro.navigateTo({ url: '/pages/sales-record/index' }).catch(console.error)
  }

  const getChannelClass = (channel: string): string => {
    const map: Record<string, string> = {
      online: 'online',
      offline: 'offline',
      wholesale: 'wholesale',
    }
    return map[channel] || 'info'
  }

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'producing')
  const monthSales = salesRecords
    .filter(s => s.saleDate.startsWith('2026-06'))
    .reduce((sum, s) => sum + s.totalAmount, 0)

  return (
    <ScrollView
      className={styles.salesPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.tabSection}>
        <View className={styles.tabBar}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
              onClick={() => setActiveTab(tab.key as TabType)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionGrid}>
          <View className={styles.actionItem} onClick={() => handleQuickAction('wedding')}>
            <View className={classnames(styles.actionIcon, styles.wedding)}>
              <Text>🏮</Text>
            </View>
            <Text className={styles.actionName}>婚庆礼伞</Text>
            <Text className={styles.actionDesc}>定制下单</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('cultural')}>
            <View className={classnames(styles.actionIcon, styles.cultural)}>
              <Text>🎨</Text>
            </View>
            <Text className={styles.actionName}>文创伞</Text>
            <Text className={styles.actionDesc}>批量定制</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('custom')}>
            <View className={classnames(styles.actionIcon, styles.custom)}>
              <Text>✨</Text>
            </View>
            <Text className={styles.actionName}>定制伞</Text>
            <Text className={styles.actionDesc}>个性定制</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('record')}>
            <View className={classnames(styles.actionIcon, styles.record)}>
              <Text>📋</Text>
            </View>
            <Text className={styles.actionName}>销售记录</Text>
            <Text className={styles.actionDesc}>登记台账</Text>
          </View>
        </View>
      </View>

      <View className={styles.salesStats}>
        <View className={styles.statsCard}>
          <Text className={styles.statsTitle}>本月销售概览</Text>
          <View className={styles.statsContent}>
            <View className={styles.statsItem}>
              <View className={styles.statsValue}>
                <Text className={styles.unit}>¥</Text>
                <Text>{monthSales.toLocaleString()}</Text>
              </View>
              <Text className={styles.statsLabel}>销售额</Text>
            </View>
            <View className={styles.statsItem}>
              <View className={styles.statsValue}>
                <Text>{salesRecords.filter(s => s.saleDate.startsWith('2026-06')).length}</Text>
                <Text className={styles.unit}>笔</Text>
              </View>
              <Text className={styles.statsLabel}>订单数</Text>
            </View>
            <View className={styles.statsItem}>
              <View className={styles.statsValue}>
                <Text>{pendingOrders.length}</Text>
                <Text className={styles.unit}>单</Text>
              </View>
              <Text className={styles.statsLabel}>待处理</Text>
            </View>
          </View>
        </View>
      </View>

      {activeTab === 'orders' && (
        <View className={styles.ordersSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>定制订单</Text>
            <Text className={styles.viewAll} onClick={handleViewAllOrders}>查看全部</Text>
          </View>
          {orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无订单</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'sales' && (
        <View className={styles.salesRecordsSection}>
          <View className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24rpx' }}>
            <Text className={styles.sectionTitle}>销售台账</Text>
            <Text className={styles.viewAll} onClick={handleViewAllSales}>查看全部</Text>
          </View>
          <View className={styles.recordList}>
            {salesRecords.slice(0, 5).map((record) => (
              <View
                key={record.id}
                className={styles.recordItem}
                onClick={() => handleSalesRecordClick(record.id)}
              >
                <View className={styles.recordHeader}>
                  <Text className={styles.recordNo}>{record.recordNo}</Text>
                  <Text className={classnames(styles.channelTag, styles[getChannelClass(record.channel)])}>
                    {getChannelText(record.channel)}
                  </Text>
                </View>
                <View className={styles.recordContent}>
                  <Text className={styles.productName}>{record.productName}</Text>
                  <Text className={styles.customerInfo}>客户：{record.customerName}</Text>
                </View>
                <View className={styles.recordFooter}>
                  <Text className={styles.quantity}>数量：{record.quantity} × ¥{record.unitPrice}</Text>
                  <View className={styles.amount}>
                    <Text className={styles.unit}>¥</Text>
                    <Text>{record.totalAmount}</Text>
                  </View>
                </View>
                <Text className={styles.saleDate}>销售日期：{record.saleDate}</Text>
                {record.remark && (
                  <Text style={{ fontSize: '22rpx', color: '#8D6E63', marginTop: '8rpx' }}>
                    备注：{record.remark}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default SalesPage
