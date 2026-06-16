import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { mockSalesRecords, getChannelText } from '@/data/mockOrders'
import { SalesRecord } from '@/types/umbrella'
import classnames from 'classnames'

type ChannelType = 'all' | 'online' | 'offline' | 'wholesale'

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'online', name: '线上销售' },
  { key: 'offline', name: '线下门店' },
  { key: 'wholesale', name: '批发' },
]

const SalesRecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChannelType>('all')
  const [refreshing, setRefreshing] = useState(false)

  const handlePullDownRefresh = () => {
    console.log('[SalesRecord] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const filteredRecords = useMemo(() => {
    if (activeTab === 'all') return mockSalesRecords
    return mockSalesRecords.filter(r => r.channel === activeTab)
  }, [activeTab])

  const stats = useMemo(() => {
    const totalAmount = mockSalesRecords.reduce((sum, r) => sum + r.totalAmount, 0)
    const totalQuantity = mockSalesRecords.reduce((sum, r) => sum + r.quantity, 0)
    const onlineAmount = mockSalesRecords
      .filter(r => r.channel === 'online')
      .reduce((sum, r) => sum + r.totalAmount, 0)
    return { totalAmount, totalQuantity, onlineAmount, orderCount: mockSalesRecords.length }
  }, [])

  const handleRecordClick = (id: string) => {
    console.log('[SalesRecord] 点击销售记录:', id)
    const record = mockSalesRecords.find(r => r.id === id)
    if (record) {
      console.log('[SalesRecord] 记录信息:', record.recordNo, record.customerName, record.totalAmount)
    }
    Taro.navigateTo({ url: `/pages/sales-detail/index?id=${id}` }).catch(console.error)
  }

  const handleAdd = () => {
    console.log('[SalesRecord] 新增销售记录')
    Taro.showActionSheet({
      itemList: ['新增零售', '新增批发', '新增线上订单'],
      success: (res) => {
        console.log('选择类型:', res.tapIndex)
        Taro.showToast({ title: '新增销售记录', icon: 'none' })
      }
    })
  }

  const handleTabChange = (key: ChannelType) => {
    setActiveTab(key)
    console.log('[SalesRecord] 切换渠道:', key)
  }

  const getChannelIcon = (channel: string): string => {
    const map: Record<string, string> = {
      online: '🌐',
      offline: '🏪',
      wholesale: '📦',
    }
    return map[channel] || '🛒'
  }

  return (
    <ScrollView
      className={styles.recordPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.summarySection}>
        <Text className={styles.title}>销售概览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.value}>
              <Text className={styles.symbol}>¥</Text>{stats.totalAmount.toLocaleString()}
            </Text>
            <Text className={styles.label}>总销售额</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.orderCount}</Text>
            <Text className={styles.label}>销售订单</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.value}>{stats.totalQuantity}</Text>
            <Text className={styles.label}>销售数量</Text>
          </View>
        </View>
      </View>

      <View className={styles.channelTabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
            onClick={() => handleTabChange(tab.key as ChannelType)}
          >
            <Text>{tab.name}</Text>
          </View>
        ))}
      </View>

      <View className={styles.recordList}>
        <View className={styles.listHeader}>
          <Text className={styles.title}>
            {activeTab === 'all' ? '销售台账' : getChannelText(activeTab)}
          </Text>
          <Text className={styles.count}>
            共 <Text className={styles.num}>{filteredRecords.length}</Text> 条
          </Text>
        </View>

        {filteredRecords.length > 0 ? (
          filteredRecords.map((record: SalesRecord) => (
            <View
              key={record.id}
              className={styles.recordItem}
              onClick={() => handleRecordClick(record.id)}
            >
              <View className={styles.recordHeader}>
                <Text className={styles.recordNo}>{record.recordNo}</Text>
                <Text className={classnames(styles.channelTag, styles[record.channel])}>
                  {getChannelText(record.channel)}
                </Text>
              </View>

              <View className={styles.productInfo}>
                <View className={styles.productIcon}>
                  <Text>{getChannelIcon(record.channel)}</Text>
                </View>
                <View className={styles.productDetail}>
                  <Text className={styles.productName}>{record.productName}</Text>
                  <Text className={styles.customer}>客户：{record.customerName}</Text>
                </View>
              </View>

              <View className={styles.recordFooter}>
                <View className={styles.saleInfo}>
                  <View className={styles.infoItem}>
                    <Text>单价：</Text>
                    <Text className={styles.value}>¥{record.unitPrice}</Text>
                  </View>
                  <View className={styles.infoItem}>
                    <Text>数量：</Text>
                    <Text className={styles.value}>×{record.quantity}</Text>
                  </View>
                </View>
                <Text className={styles.totalAmount}>
                  <Text className={styles.symbol}>¥</Text>{record.totalAmount.toLocaleString()}
                </Text>
              </View>

              {record.remark && (
                <Text className={styles.remark}>📝 {record.remark}</Text>
              )}

              <Text style={{ fontSize: '22rpx', color: '#8D6E63', marginTop: '16rpx' }}>
                销售日期：{record.saleDate}
              </Text>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.icon}>📋</Text>
            <Text className={styles.text}>暂无销售记录</Text>
          </View>
        )}
      </View>

      <View style={{ height: '120rpx' }}></View>

      <View className={styles.addBtn} onClick={handleAdd}>
        +
      </View>
    </ScrollView>
  )
}

export default SalesRecordPage
