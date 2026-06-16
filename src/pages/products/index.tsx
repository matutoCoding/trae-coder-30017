import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import UmbrellaCard from '@/components/UmbrellaCard'
import { useUmbrellaStore } from '@/store/umbrellaStore'
import classnames from 'classnames'

type FilterType = 'all' | 'wedding' | 'cultural' | 'traditional' | 'custom' | 'inventory' | 'sold'

const ProductsPage: React.FC = () => {
  const { products } = useUmbrellaStore()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [refreshing, setRefreshing] = useState(false)

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'wedding', label: '婚庆礼伞' },
    { key: 'cultural', label: '文创伞' },
    { key: 'traditional', label: '传统伞' },
    { key: 'custom', label: '定制伞' },
    { key: 'inventory', label: '在库' },
    { key: 'sold', label: '已售出' },
  ]

  const handlePullDownRefresh = () => {
    console.log('[Products] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleProductClick = (id: string) => {
    console.log('[Products] 点击成品:', id)
    Taro.navigateTo({ url: `/pages/product-detail/index?id=${id}` }).catch((err) => {
      console.error('[Products] 跳转详情页失败:', err)
    })
  }

  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'inventory') return product.status === 'inventory'
    if (activeFilter === 'sold') return product.status === 'sold'
    return product.style === activeFilter
  })

  const inventoryCount = products.filter(p => p.status === 'inventory').length
  const soldCount = products.filter(p => p.status === 'sold').length
  const totalValue = products
    .filter(p => p.status === 'inventory')
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <ScrollView
      className={styles.productsPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.filterSection}>
        <ScrollView scrollX className={styles.filterBar}>
          {filters.map((filter) => (
            <View
              key={filter.key}
              className={classnames(
                styles.filterItem,
                activeFilter === filter.key && styles.active
              )}
              onClick={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text>{filter.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.statsSummary}>
        <View className={styles.summaryCard}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{products.length}</Text>
            <Text className={styles.summaryLabel}>总成品数</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{inventoryCount}</Text>
            <Text className={styles.summaryLabel}>在库数量</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{soldCount}</Text>
            <Text className={styles.summaryLabel}>已售出</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>¥{totalValue.toLocaleString()}</Text>
            <Text className={styles.summaryLabel}>库存价值</Text>
          </View>
        </View>
      </View>

      <View className={styles.productsList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <UmbrellaCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product.id)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无相关成品</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ProductsPage
