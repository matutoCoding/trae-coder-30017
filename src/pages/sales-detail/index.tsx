import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import { mockSalesRecords, getChannelText } from '@/data/mockOrders'
import { SalesRecord } from '@/types/umbrella'
import classnames from 'classnames'

const SalesDetailPage: React.FC = () => {
  const router = useRouter()
  const [record, setRecord] = useState<SalesRecord | null>(null)

  useEffect(() => {
    const recordId = router.params.id
    if (recordId) {
      const found = mockSalesRecords.find(r => r.id === recordId)
      if (found) {
        setRecord(found)
        console.log('[SalesDetail] 加载销售记录:', recordId, found)
      } else {
        console.log('[SalesDetail] 未找到记录:', recordId, '使用第一条')
        setRecord(mockSalesRecords[0])
        Taro.showToast({ title: '记录不存在，显示最新', icon: 'none' })
      }
    } else {
      setRecord(mockSalesRecords[0])
      console.log('[SalesDetail] 无ID参数，使用第一条')
    }
  }, [router.params.id])

  if (!record) {
    return (
      <View className={styles.detailPage}>
        <Text style={{ padding: '32rpx' }}>加载中...</Text>
      </View>
    )
  }

  const handleBack = () => {
    console.log('[SalesDetail] 返回')
    Taro.navigateBack().catch(() => {
      Taro.switchTab({ url: '/pages/sales/index' })
    })
  }

  const handleEdit = () => {
    console.log('[SalesDetail] 编辑记录:', record.id)
    Taro.showToast({ title: '编辑销售记录', icon: 'none' })
  }

  const handlePrint = () => {
    console.log('[SalesDetail] 打印单据:', record.id)
    Taro.showToast({ title: '打印销售单据', icon: 'none' })
  }

  const getChannelIcon = (channel: string): string => {
    const map: Record<string, string> = {
      online: '🌐',
      offline: '🏪',
      wholesale: '📦',
    }
    return map[channel] || '🛒'
  }

  const getChannelColor = (channel: string): string => {
    const map: Record<string, string> = {
      online: '#1565C0',
      offline: '#8B4513',
      wholesale: '#7B1FA2',
    }
    return map[channel] || '#8B4513'
  }

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.detailHeader}>
        <View className={styles.channelRow}>
          <Text className={styles.channelIcon}>{getChannelIcon(record.channel)}</Text>
          <Text className={styles.channelName}>{getChannelText(record.channel)}</Text>
        </View>
        <Text className={styles.recordNo}>销售单号：{record.recordNo}</Text>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>成交金额</Text>
          <Text className={styles.price}>
            <Text className={styles.symbol}>¥</Text>{record.totalAmount.toLocaleString()}
          </Text>
          <Text className={styles.quantity}>共{record.quantity}件</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.customerInfo}>
          <View className={styles.avatar}>
            <Text>{record.customerName.charAt(0)}</Text>
          </View>
          <View className={styles.info}>
            <Text className={styles.name}>{record.customerName}</Text>
            <Text className={styles.label}>购买客户</Text>
          </View>
          <View className={styles.contactBtn} onClick={handleBack}>
            <Text>👤</Text>
          </View>
        </View>
      </View>

      <View className={classnames(styles.section, styles.productSection)}>
        <Text className={styles.sectionTitle}>商品信息</Text>
        <View className={styles.productCard}>
          <View className={styles.productIcon}>
            <Text>☂️</Text>
          </View>
          <View className={styles.productInfo}>
            <Text className={styles.productName}>{record.productName}</Text>
            <View className={styles.specRow}>
              <Text>单价：¥{record.unitPrice}</Text>
              <Text>数量：×{record.quantity}</Text>
            </View>
          </View>
        </View>
        <View className={styles.priceGrid}>
          <View className={styles.priceItem}>
            <Text className={styles.label}>商品单价</Text>
            <Text className={styles.value}>¥{record.unitPrice}</Text>
          </View>
          <View className={styles.priceItem}>
            <Text className={styles.label}>购买数量</Text>
            <Text className={styles.value}>{record.quantity}件</Text>
          </View>
          <View className={classnames(styles.priceItem, styles.highlight)} style={{ width: '100%' }}>
            <Text className={styles.label}>商品合计</Text>
            <Text className={styles.value}>
              ¥{record.unitPrice} × {record.quantity} = ¥{record.totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className={classnames(styles.section, styles.paymentSection)}>
        <Text className={styles.sectionTitle}>款项明细</Text>
        <View className={styles.paymentRow}>
          <Text className={styles.label}>商品总额</Text>
          <Text className={styles.value}>¥{(record.unitPrice * record.quantity).toLocaleString()}</Text>
        </View>
        <View className={styles.paymentRow}>
          <Text className={styles.label}>优惠金额</Text>
          <Text className={styles.value}>¥0.00</Text>
        </View>
        <View className={classnames(styles.paymentRow, styles.totalRow)}>
          <Text className={styles.label}>实收金额</Text>
          <Text className={styles.value}>
            <Text className={styles.symbol}>¥</Text>{record.totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      <View className={classnames(styles.section, styles.saleInfo)}>
        <Text className={styles.sectionTitle}>销售信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.label}>销售单号</Text>
          <Text className={styles.value}>{record.recordNo}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.label}>销售渠道</Text>
          <Text className={styles.value} style={{ color: getChannelColor(record.channel) }}>
            {getChannelText(record.channel)}
          </Text>
        </View>
        {record.productId && (
          <View className={styles.infoRow}>
            <Text className={styles.label}>关联产品</Text>
            <Text className={styles.value}>产品 #{record.productId}</Text>
          </View>
        )}
        <View className={styles.infoRow}>
          <Text className={styles.label}>销售日期</Text>
          <Text className={styles.value}>{record.saleDate}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.label}>登记时间</Text>
          <Text className={styles.value}>{record.saleDate} 10:30</Text>
        </View>
      </View>

      {record.remark && (
        <View className={classnames(styles.section, styles.remarkSection)}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.icon}>📝</Text>备注信息
          </Text>
          <Text className={styles.remarkText}>{record.remark}</Text>
        </View>
      )}

      <View style={{ height: '140rpx' }}></View>

      <View className={styles.actionBar}>
        <View className={classnames(styles.btn, styles.secondary)} onClick={handleEdit}>
          编辑记录
        </View>
        <View className={classnames(styles.btn, styles.primary)} onClick={handlePrint}>
          打印单据
        </View>
      </View>
    </ScrollView>
  )
}

export default SalesDetailPage
