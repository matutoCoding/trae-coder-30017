import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { UmbrellaProduct } from '@/types/umbrella'
import { getStyleText, getStatusText } from '@/data/mockProducts'
import classnames from 'classnames'

interface UmbrellaCardProps {
  product: UmbrellaProduct
  onClick?: () => void
}

const getUmbrellaEmoji = (style: string): string => {
  const map: Record<string, string> = {
    wedding: '🏮',
    cultural: '🎨',
    traditional: '☂️',
    custom: '✨',
  }
  return map[style] || '☂️'
}

const getStatusClass = (status: string): string => {
  const map: Record<string, string> = {
    inventory: 'success',
    sold: 'info',
    reserved: 'warning',
    custom: 'error',
  }
  return map[status] || 'info'
}

const UmbrellaCard: React.FC<UmbrellaCardProps> = ({ product, onClick }) => {
  const styleText = getStyleText(product.style)
  const statusText = getStatusText(product.status)
  const statusClass = getStatusClass(product.status)
  const umbrellaEmoji = getUmbrellaEmoji(product.style)

  return (
    <View className={styles.umbrellaCard} onClick={onClick}>
      <View className={styles.cardImage}>
        <Text className={styles.umbrellaIcon}>{umbrellaEmoji}</Text>
        <Text className={classnames('tag', 'primary', styles.styleTag)}>{styleText}</Text>
        <Text className={classnames('tag', statusClass, styles.statusTag)}>{statusText}</Text>
      </View>
      <View className={styles.cardContent}>
        <Text className={styles.productName}>{product.name}</Text>
        <View className={styles.productMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>颜色：</Text>
            <Text>{product.color}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>图案：</Text>
            <Text>{product.pattern}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>尺寸：</Text>
            <Text>{product.size}cm</Text>
          </View>
        </View>
        <View className={styles.productFooter}>
          <View className={styles.price}>
            <Text className={styles.priceUnit}>¥</Text>
            <Text>{product.price}</Text>
          </View>
          <Text className={styles.craftsman}>匠人：{product.craftsman}</Text>
        </View>
      </View>
    </View>
  )
}

export default UmbrellaCard
