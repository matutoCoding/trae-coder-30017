import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { ProcessStep } from '@/types/umbrella'
import { getStatusText, getStatusColor } from '@/data/mockProcess'
import classnames from 'classnames'

interface ProcessCardProps {
  step: ProcessStep
  index: number
  onClick?: () => void
}

const ProcessCard: React.FC<ProcessCardProps> = ({ step, index, onClick }) => {
  const statusColor = getStatusColor(step.status)
  const statusText = getStatusText(step.status)

  return (
    <View className={styles.processCard} onClick={onClick}>
      <View className={styles.cardHeader}>
        <View className={styles.stepIndex}>
          <Text>{index + 1}</Text>
        </View>
        <View className={styles.stepInfo}>
          <View className={styles.stepName}>
            <Text>{step.name}</Text>
            <Text className={classnames('tag', statusColor)} style={{ marginLeft: '16rpx' }}>
              {statusText}
            </Text>
          </View>
          <Text className={styles.stepCraftsman}>伞匠：{step.craftsman}</Text>
        </View>
      </View>

      <Text className={styles.stepDesc}>{step.description}</Text>

      <View className={styles.stepMeta}>
        <Text className={styles.duration}>
          <Text className={styles.icon}>⏱</Text>
          预计 {step.duration} 小时
        </Text>
        {step.startTime && (
          <Text className={styles.timeInfo}>
            开始于 {step.startTime}
          </Text>
        )}
      </View>
    </View>
  )
}

export default ProcessCard
