import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import classnames from 'classnames'

interface StatCardProps {
  value: number | string
  label: string
  unit?: string
  icon?: string
  iconType?: 'primary' | 'success' | 'warning' | 'error'
  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  unit,
  icon,
  iconType = 'primary',
  onClick,
}) => {
  return (
    <View className={styles.statCard} onClick={onClick}>
      {icon && (
        <View className={classnames(styles.statIcon, styles[iconType])}>
          <Text>{icon}</Text>
        </View>
      )}
      <View className={styles.statValue}>
        <Text>{value}</Text>
        {unit && <Text className={styles.statUnit}>{unit}</Text>}
      </View>
      <Text className={styles.statLabel}>{label}</Text>
    </View>
  )
}

export default StatCard
