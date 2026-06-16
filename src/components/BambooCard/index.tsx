import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { Bamboo } from '@/types/umbrella'
import { getQualityText, getStatusText } from '@/data/mockBamboo'
import classnames from 'classnames'

interface BambooCardProps {
  bamboo: Bamboo
  onClick?: () => void
}

const BambooCard: React.FC<BambooCardProps> = ({ bamboo, onClick }) => {
  const qualityText = getQualityText(bamboo.quality)
  const statusText = getStatusText(bamboo.status)

  return (
    <View className={styles.bambooCard} onClick={onClick}>
      <View className={styles.cardHeader}>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Text className={styles.batchNo}>{bamboo.batchNo}</Text>
          <Text className={classnames(styles.statusBadge, styles[bamboo.status])}>
            {statusText}
          </Text>
        </View>
        <Text className={classnames(styles.qualityTag, styles[bamboo.quality])}>
          {qualityText}
        </Text>
      </View>

      <View className={styles.bambooInfo}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>直径</Text>
          <View className={styles.infoValue}>
            <Text>{bamboo.diameter}</Text>
            <Text className={styles.unit}>cm</Text>
          </View>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>长度</Text>
          <View className={styles.infoValue}>
            <Text>{bamboo.length}</Text>
            <Text className={styles.unit}>m</Text>
          </View>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>数量</Text>
          <View className={styles.infoValue}>
            <Text>{bamboo.quantity}</Text>
            <Text className={styles.unit}>根</Text>
          </View>
        </View>
      </View>

      <View className={styles.sourceInfo}>
        <Text className={styles.sourceIcon}>📍</Text>
        <Text>{bamboo.source}</Text>
      </View>

      {bamboo.remark && (
        <View style={{ marginBottom: '24rpx', fontSize: '24rpx', color: '#8D6E63' }}>
          <Text>备注：{bamboo.remark}</Text>
        </View>
      )}

      <View className={styles.cardFooter}>
        <Text className={styles.purchaseDate}>购入日期：{bamboo.purchaseDate}</Text>
        <Text className={styles.inspector}>检验员：{bamboo.inspector}</Text>
      </View>
    </View>
  )
}

export default BambooCard
