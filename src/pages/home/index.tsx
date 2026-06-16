import React, { useState } from 'react'
import { View, Text, ScrollView, Swiper, SwiperItem, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import UmbrellaCard from '@/components/UmbrellaCard'
import { useUmbrellaStore } from '@/store/umbrellaStore'
import { mockProcessSteps, getStatusText, getStatusColor } from '@/data/mockProcess'
import { mockCrafts } from '@/data/mockCrafts'
import classnames from 'classnames'

const HomePage: React.FC = () => {
  const { stats, products, processSteps } = useUmbrellaStore()
  const [refreshing, setRefreshing] = useState(false)

  const quickEntries = [
    { name: '竹料管理', icon: '🎋', type: 'bamboo', path: '/pages/bamboo/index' },
    { name: '伞骨制作', icon: '⚙️', type: 'frame', path: '/pages/frame/index' },
    { name: '糊伞绘画', icon: '🎨', type: 'painting', path: '/pages/painting/index' },
    { name: '桐油浸制', icon: '🛢️', type: 'oiling', path: '/pages/oiling/index' },
    { name: '成品档案', icon: '📦', type: 'product', path: '/pages/products/index' },
    { name: '定制订单', icon: '📝', type: 'order', path: '/pages/order-detail/index' },
    { name: '销售台账', icon: '💰', type: 'sales', path: '/pages/sales-record/index' },
    { name: '工艺展示', icon: '🪄', type: 'craft', path: '/pages/production/index' },
  ]

  const handleEntryClick = (path: string) => {
    console.log('[Home] 点击功能入口:', path)
    Taro.navigateTo({ url: path }).catch((err) => {
      console.error('[Home] 页面跳转失败:', err)
    })
  }

  const handlePullDownRefresh = () => {
    console.log('[Home] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleViewAllProcess = () => {
    console.log('[Home] 查看全部工艺流程')
    Taro.switchTab({ url: '/pages/production/index' }).catch((err) => {
      console.error('[Home] 跳转制伞流程页失败:', err)
    })
  }

  const handleViewAllProducts = () => {
    console.log('[Home] 查看全部成品')
    Taro.switchTab({ url: '/pages/products/index' }).catch((err) => {
      console.error('[Home] 跳转成品档案页失败:', err)
    })
  }

  const handleProductClick = (id: string) => {
    console.log('[Home] 点击成品:', id)
    Taro.navigateTo({ url: `/pages/product-detail/index?id=${id}` }).catch((err) => {
      console.error('[Home] 跳转成品详情失败:', err)
    })
  }

  const handleBannerClick = () => {
    console.log('[Home] 点击Banner')
    Taro.switchTab({ url: '/pages/production/index' }).catch((err) => {
      console.error('[Home] 跳转制伞流程页失败:', err)
    })
  }

  return (
    <ScrollView
      className={styles.homePage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.bannerSection}>
        <View className={styles.banner} onClick={handleBannerClick}>
          <View className={styles.bannerContent}>
            <Text className={styles.bannerTitle}>千年传统 · 匠心传承</Text>
            <Text className={styles.bannerSubtitle}>国家级非物质文化遗产 · 传统油纸伞制作技艺</Text>
            <Text className={styles.bannerDecoration}>☂️</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickEntry}>
        <View className={styles.entryGrid}>
          {quickEntries.map((entry) => (
            <View
              key={entry.name}
              className={styles.entryItem}
              onClick={() => handleEntryClick(entry.path)}
            >
              <View className={classnames(styles.entryIcon, styles[entry.type])}>
                <Text>{entry.icon}</Text>
              </View>
              <Text className={styles.entryName}>{entry.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.sectionTitle}>今日概览</View>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <StatCard
              value={stats.todayProduction}
              label="今日产量"
              unit="把"
              icon="📊"
              iconType="success"
            />
          </View>
          <View className={styles.statItem}>
            <StatCard
              value={stats.monthProduction}
              label="本月产量"
              unit="把"
              icon="📈"
              iconType="primary"
            />
          </View>
          <View className={styles.statItem}>
            <StatCard
              value={stats.pendingOrders}
              label="待处理订单"
              unit="单"
              icon="📋"
              iconType="warning"
            />
          </View>
          <View className={styles.statItem}>
            <StatCard
              value={'¥' + stats.totalSales.toLocaleString()}
              label="本月销售额"
              icon="💰"
              iconType="error"
            />
          </View>
        </View>
      </View>

      <View className={styles.processSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>制伞进度</Text>
          <Text className={styles.viewAll} onClick={handleViewAllProcess}>查看全部</Text>
        </View>
        <View className={styles.processTimeline}>
          {mockProcessSteps.slice(0, 3).map((step, index) => (
            <View key={step.id} className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, styles[step.status])} />
              <View className={styles.timelineContent}>
                <View className={styles.timelineTitle}>
                  <Text>{step.name}</Text>
                  <Text className={classnames('tag', getStatusColor(step.status), styles.statusTag)}>
                    {getStatusText(step.status)}
                  </Text>
                </View>
                <Text className={styles.timelineDesc}>{step.description}</Text>
                {step.startTime && (
                  <Text className={styles.timelineTime}>
                    伞匠：{step.craftsman} · 开始于 {step.startTime}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.productsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最新成品</Text>
          <Text className={styles.viewAll} onClick={handleViewAllProducts}>查看全部</Text>
        </View>
        <ScrollView scrollX className={styles.productsScroll}>
          {products.slice(0, 5).map((product) => (
            <View key={product.id} className={styles.productCard}>
              <UmbrellaCard
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default HomePage
