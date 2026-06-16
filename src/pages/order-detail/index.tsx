import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { mockOrders, getTypeText, getStatusText } from '@/data/mockOrders'
import { CustomOrder } from '@/types/umbrella'
import classnames from 'classnames'

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const [order, setOrder] = useState<CustomOrder | null>(null)

  useEffect(() => {
    const orderId = router.params.id || 'o001'
    const found = mockOrders.find(o => o.id === orderId) || mockOrders[0]
    setOrder(found)
    console.log('[OrderDetail] 加载订单:', orderId)
  }, [router.params.id])

  if (!order) {
    return (
      <View className={styles.detailPage}>
        <Text style={{ padding: '32rpx' }}>加载中...</Text>
      </View>
    )
  }

  const handleCall = () => {
    console.log('[OrderDetail] 拨打电话:', order.customerPhone)
    Taro.makePhoneCall({ phoneNumber: order.customerPhone.replace(/\*/g, '0') })
  }

  const handleEdit = () => {
    console.log('[OrderDetail] 编辑订单:', order.id)
    Taro.showToast({ title: '编辑订单', icon: 'none' })
  }

  const handleUpdateStatus = () => {
    console.log('[OrderDetail] 更新订单状态:', order.id)
    Taro.showActionSheet({
      itemList: ['确认订单', '开始制作', '制作完成', '已交付'],
      success: (res) => {
        console.log('选择状态:', res.tapIndex)
        Taro.showToast({ title: '状态已更新', icon: 'success' })
      }
    })
  }

  const getTypeIcon = (type: string): string => {
    const map: Record<string, string> = {
      wedding: '💒',
      cultural: '🎨',
      custom: '✂️',
      retail: '🛒',
    }
    return map[type] || '📦'
  }

  const getStatusColor = (status: string): string => {
    const map: Record<string, string> = {
      pending: '#FFF3E0',
      producing: '#E3F2FD',
      completed: '#E8F5E9',
      delivered: '#F3E5F5',
    }
    return map[status] || '#FFF3E0'
  }

  const remaining = order.price - order.deposit

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.orderHeader}>
        <View className={styles.typeRow}>
          <Text className={styles.typeIcon}>{getTypeIcon(order.type)}</Text>
          <Text className={styles.typeName}>{getTypeText(order.type)}</Text>
          <Text className={styles.statusTag} style={{ backgroundColor: getStatusColor(order.status), color: '#8B4513' }}>
            {getStatusText(order.status)}
          </Text>
        </View>
        <Text className={styles.orderNo}>订单编号：{order.orderNo}</Text>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>订单金额</Text>
          <Text className={styles.price}>
            <Text className={styles.symbol}>¥</Text>{order.price}
          </Text>
          <Text className={styles.quantity}>x{order.quantity}件</Text>
        </View>
      </View>

      <View className={styles.customerSection}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.customerInfo}>
          <View className={styles.avatar}>
            <Text>{order.customerName.charAt(0)}</Text>
          </View>
          <View className={styles.info}>
            <Text className={styles.name}>{order.customerName}</Text>
            <Text className={styles.phone}>{order.customerPhone}</Text>
          </View>
          <View className={styles.contactBtn} onClick={handleCall}>
            <Text>📞</Text>
          </View>
        </View>
      </View>

      <View className={styles.customSection}>
        <Text className={styles.sectionTitle}>定制要求</Text>
        <View className={styles.specGrid}>
          <View className={styles.specItem}>
            <Text className={styles.label}>伞型款式</Text>
            <Text className={styles.value}>{order.umbrellaStyle}</Text>
          </View>
          <View className={styles.specItem}>
            <Text className={styles.label}>伞面颜色</Text>
            <Text className={styles.value}>{order.umbrellaColor}</Text>
          </View>
        </View>

        <View className={styles.patternBox}>
          <Text className={styles.patternTitle}>
            <Text className={styles.icon}>🎨</Text>图案设计
          </Text>
          <Text className={styles.patternName}>{order.pattern}</Text>
          {order.patternDesc && (
            <Text className={styles.patternDesc}>{order.patternDesc}</Text>
          )}
        </View>

        <View className={styles.dateRow}>
          <View className={styles.dateItem}>
            <Text className={styles.label}>下单时间</Text>
            <Text className={styles.value}>{order.createTime}</Text>
          </View>
          <View className={styles.dateItem}>
            <Text className={styles.label}>预计交付</Text>
            <Text className={classnames(styles.value, styles.highlight)}>{order.expectDate}</Text>
          </View>
        </View>
      </View>

      <View className={styles.paymentSection}>
        <Text className={styles.sectionTitle}>款项明细</Text>
        <View className={styles.paymentRow}>
          <Text className={styles.label}>订单总额</Text>
          <Text className={styles.value}>¥{order.price}</Text>
        </View>
        <View className={styles.paymentRow}>
          <Text className={styles.label}>已收定金</Text>
          <Text className={classnames(styles.value, styles.paid)}>¥{order.deposit}</Text>
        </View>
        <View className={styles.paymentRow}>
          <Text className={styles.label}>待收尾款</Text>
          <Text className={classnames(styles.value, styles.unpaid)}>¥{remaining}</Text>
        </View>
        <View className={classnames(styles.paymentRow, styles.totalRow)}>
          <Text className={styles.label}>单价/数量</Text>
          <Text className={styles.value}>
            ¥{Math.floor(order.price / order.quantity)} × {order.quantity}件
          </Text>
        </View>
      </View>

      {order.remark && (
        <View className={styles.remarkSection}>
          <Text className={styles.sectionTitle}>备注信息</Text>
          <Text className={styles.remarkText}>📝 {order.remark}</Text>
        </View>
      )}

      <View style={{ height: '140rpx' }}></View>

      <View className={styles.actionBar}>
        <View className={classnames(styles.btn, styles.secondary)} onClick={handleEdit}>
          编辑订单
        </View>
        <View className={classnames(styles.btn, styles.primary)} onClick={handleUpdateStatus}>
          更新状态
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderDetailPage
