import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { mockFrames, getStatusText } from '@/data/mockProcess'
import classnames from 'classnames'

const processSteps = [
  { icon: '✂️', type: 'cut', name: '削制伞骨', desc: '将选好的竹料劈削成伞骨形状，要求大小均匀、厚薄一致。' },
  { icon: '🔥', type: 'bake', name: '火烤定型', desc: '用火烘烤伞骨，使其弯曲定型，增加韧性和耐用性。' },
  { icon: '🔧', type: 'drill', name: '精确钻孔', desc: '在伞骨上精确钻孔，孔位需对齐，确保穿线顺畅。' },
  { icon: '🧵', type: 'thread', name: '穿线连接', desc: '用蚕丝线或棉线将伞骨连接起来，使伞骨可灵活开合。' },
  { icon: '✨', type: 'polish', name: '打磨光滑', desc: '将伞骨打磨光滑，防止刮破伞纸，确保手感舒适。' },
]

const FramePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handlePullDownRefresh = () => {
    console.log('[Frame] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleFrameClick = (id: string) => {
    console.log('[Frame] 点击伞骨:', id)
    Taro.showToast({ title: '查看详情', icon: 'none' })
  }

  const getCheckText = (check: string): string => {
    const map: Record<string, string> = {
      passed: '质检通过',
      pending: '待质检',
      failed: '质检未过',
    }
    return map[check] || check
  }

  return (
    <ScrollView
      className={styles.framePage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.pageHeader}>
        <View className={styles.headerCard}>
          <Text className={styles.title}>伞骨钻孔穿线</Text>
          <Text className={styles.desc}>
            伞骨是油纸伞的骨架，决定了伞的结构稳定性。需经过削制、烘烤、钻孔、穿线、打磨五道工序，每一步都要求精益求精。
          </Text>
        </View>
      </View>

      <View className={styles.processSteps}>
        <Text className={styles.stepsTitle}>制作工序</Text>
        {processSteps.map((step, index) => (
          <View key={index} className={styles.stepCard}>
            <View className={classnames(styles.stepIcon, styles[step.type])}>
              <Text>{step.icon}</Text>
            </View>
            <View className={styles.stepContent}>
              <Text className={styles.stepName}>{index + 1}. {step.name}</Text>
              <Text className={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.frameList}>
        <View className={styles.listTitle}>
          <View className={styles.titleLeft}>
            <Text>制作记录</Text>
          </View>
          <Text className={styles.count}>
            共 <Text className={styles.num}>{mockFrames.length}</Text> 件
          </Text>
        </View>
        {mockFrames.map((frame) => (
          <View
            key={frame.id}
            className={styles.frameItem}
            onClick={() => handleFrameClick(frame.id)}
          >
            <View className={styles.frameHeader}>
              <Text className={styles.frameId}>伞骨 #{frame.id}</Text>
              <Text className={classnames(styles.statusTag, styles[frame.status])}>
                {getStatusText(frame.status)}
              </Text>
            </View>
            <View className={styles.frameInfo}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>伞骨数</Text>
                <Text className={styles.infoValue}>{frame.ribCount}根</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>钻孔数</Text>
                <Text className={styles.infoValue}>{frame.drillHoles}个</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>线材</Text>
                <Text className={styles.infoValue}>{frame.threadType}</Text>
              </View>
            </View>
            <View className={styles.frameFooter}>
              <Text className={styles.craftsman}>匠人：{frame.craftsman}</Text>
              <Text className={classnames(styles.checkTag, styles[frame.qualityCheck])}>
                {getCheckText(frame.qualityCheck)}
              </Text>
            </View>
            <Text style={{ fontSize: '22rpx', color: '#8D6E63', marginTop: '16rpx' }}>
              创建时间：{frame.createTime}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default FramePage
