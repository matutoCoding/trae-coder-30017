import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { mockProducts, getStyleText, getStatusText } from '@/data/mockProducts'
import { UmbrellaProduct } from '@/types/umbrella'
import classnames from 'classnames'

const ProductDetailPage: React.FC = () => {
  const router = useRouter()
  const [product, setProduct] = useState<UmbrellaProduct | null>(null)

  useEffect(() => {
    const productId = router.params.id || 'p001'
    const found = mockProducts.find(p => p.id === productId) || mockProducts[0]
    setProduct(found)
    console.log('[ProductDetail] 加载产品:', productId)
  }, [router.params.id])

  if (!product) {
    return (
      <View className={styles.detailPage}>
        <Text style={{ padding: '32rpx' }}>加载中...</Text>
      </View>
    )
  }

  const handleEdit = () => {
    console.log('[ProductDetail] 编辑产品:', product.id)
    Taro.showToast({ title: '编辑产品', icon: 'none' })
  }

  const handleSell = () => {
    console.log('[ProductDetail] 销售产品:', product.id)
    Taro.showToast({ title: '创建销售单', icon: 'none' })
  }

  const getStyleIcon = (style: string): string => {
    const map: Record<string, string> = {
      wedding: '💒',
      cultural: '🎨',
      traditional: '🏮',
      custom: '✂️',
    }
    return map[style] || '☂️'
  }

  const traceSteps = [
    { name: '伞骨制作', info: `伞骨 #${product.frameId} | 匠人：${product.craftsman}` },
    { name: '糊伞绘画', info: `绘画 #${product.paintingId} | 图案：${product.pattern}` },
    { name: '桐油浸制', info: `浸制 #${product.oilingId} | 天然桐油` },
    { name: '成品入库', info: `完成日期：${product.finishDate}` },
  ]

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.heroSection}>
        <Text className={styles.heroIcon}>{getStyleIcon(product.style)}</Text>
        <Text className={styles.heroPattern}>#{product.pattern}</Text>
      </View>

      <View className={styles.basicInfo}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{product.name}</Text>
          <Text className={classnames(styles.statusTag, styles[product.status])}>
            {getStatusText(product.status)}
          </Text>
        </View>
        <Text className={styles.productNo}>产品编号：{product.productNo}</Text>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>售价</Text>
          <Text className={styles.price}>
            <Text className={styles.symbol}>¥</Text>{product.price}
          </Text>
        </View>
      </View>

      <View className={styles.infoGrid}>
        <Text className={styles.sectionTitle}>产品信息</Text>
        <View className={styles.grid}>
          <View className={styles.gridItem}>
            <Text className={styles.label}>产品类型</Text>
            <Text className={styles.value}>{getStyleText(product.style)}</Text>
          </View>
          <View className={styles.gridItem}>
            <Text className={styles.label}>伞面颜色</Text>
            <Text className={styles.value}>{product.color}</Text>
          </View>
          <View className={styles.gridItem}>
            <Text className={styles.label}>图案主题</Text>
            <Text className={styles.value}>{product.pattern}</Text>
          </View>
          <View className={styles.gridItem}>
            <Text className={styles.label}>伞面尺寸</Text>
            <Text className={styles.value}>{product.size}cm</Text>
          </View>
          <View className={styles.gridItem}>
            <Text className={styles.label}>制伞匠人</Text>
            <Text className={styles.value}>{product.craftsman}</Text>
          </View>
          <View className={styles.gridItem}>
            <Text className={styles.label}>完成日期</Text>
            <Text className={styles.value}>{product.finishDate}</Text>
          </View>
        </View>
      </View>

      <View className={styles.processTrace}>
        <Text className={styles.sectionTitle}>工艺追溯</Text>
        <View className={styles.timeline}>
          {traceSteps.map((step, index) => (
            <View key={index} className={styles.timelineItem}>
              <View className={styles.dot}></View>
              <Text className={styles.stepName}>{step.name}</Text>
              <Text className={styles.stepInfo}>{step.info}</Text>
            </View>
          ))}
        </View>
      </View>

      {product.description && (
        <View className={styles.description}>
          <Text className={styles.sectionTitle}>产品描述</Text>
          <Text className={styles.descText}>{product.description}</Text>
        </View>
      )}

      <View style={{ height: '140rpx' }}></View>

      <View className={styles.actionBar}>
        <View className={classnames(styles.btn, styles.secondary)} onClick={handleEdit}>
          编辑档案
        </View>
        <View className={classnames(styles.btn, styles.primary)} onClick={handleSell}>
          发起销售
        </View>
      </View>
    </ScrollView>
  )
}

export default ProductDetailPage
