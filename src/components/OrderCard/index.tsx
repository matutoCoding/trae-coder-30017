import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { CustomOrder } from '@/types/umbrella'
import { getTypeText, getStatusText } from '@/data/mockOrders'
import classnames from 'classnames'

interface OrderCardProps {
  order: CustomOrder
  onClick?: () => void
}

const getStatusClass = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'error',
    producing: 'warning',
    completed: 'success',
    delivered: 'info',
  }
  return map[status] || 'info'
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const typeText = getTypeText(order.type)
  const statusText = getStatusText(order.status)
  const statusClass = getStatusClass(order.status)

  return (
    <View className={styles.orderCard} onClick={onClick}>
      <View className={styles.cardHeader}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <View>
          <Text className={styles.orderType} style={{ marginRight: '16rpx' }}>{typeText}</Text>
          <Text className={classnames('tag', statusClass)}>{statusText}</Text>
        </View>
      </View>

      <View className={styles.customerInfo}>
        <View className={styles.customerAvatar}>
          <Text>{order.customerName.charAt(0)}</Text>
        </View>
        <View className={styles.customerDetail}>
          <Text className={styles.customerName}>{order.customerName}</Text>
          <Text className={styles.customerPhone}>{order.customerPhone}</Text>
        </View>
      </View>

      <View className={styles.orderDetail}>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>伞型：</Text>
          <Text className={styles.detailValue}>{order.umbrellaStyle}</Text>
        </View>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>颜色：</Text>
          <Text className={styles.detailValue}>{order.umbrellaColor}</Text>
        </View>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>图案：</Text>
          <Text className={styles.detailValue}>{order.pattern}</Text>
        </View>
        <View className={styles.detailRow}>
          <Text className={styles.detailLabel}>数量：</Text>
          <Text className={styles.detailValue}>{order.quantity} 把</Text>
        </View>
        {order.remark && (
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>备注：</Text>
            <Text className={styles.detailValue}>{order.remark}</Text>
          </View>
        )}
      </View>

      <View className={styles.orderFooter}>
        <View className={styles.priceInfo}>
          <View className={styles.totalPrice}>
            <Text className={styles.unit}>¥</Text>
            <Text>{order.price}</Text>
          </View>
          {order.deposit > 0 && (
            <Text className={styles.depositInfo}>已收定金 ¥{order.deposit}</Text>
          )}
        </View>
        <View className={styles.expectDate}>
          <Text className={styles.dateLabel}>预计交付</Text>
          <Text>{'\n'}{order.expectDate}</Text>
        </View>
      </View>
    </View>
  )
}

export default OrderCard
