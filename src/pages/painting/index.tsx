import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { mockPaintings, getStatusText } from '@/data/mockProcess'
import classnames from 'classnames'

const processSteps = [
  { icon: '📜', type: 'paste', name: '伞面裱糊', desc: '将裁剪好的宣纸或皮纸裱糊在伞骨上，要求平整无褶皱，边缘对齐。' },
  { icon: '☀️', type: 'dry', name: '阴干定型', desc: '将糊好的伞置于阴凉通风处阴干，避免阳光直射，防止纸面开裂。' },
  { icon: '✏️', type: 'draw', name: '起稿描线', desc: '根据设计图案，用毛笔在伞面上轻轻勾勒轮廓线条。' },
  { icon: '🎨', type: 'color', name: '手绘彩绘', desc: '根据图案要求，调配颜料进行手绘上色，注意色彩层次和过渡。' },
  { icon: '✨', type: 'fix', name: '固色修整', desc: '彩绘完成后进行固色处理，修整细节，确保图案完整美观。' },
]

const PaintingPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handlePullDownRefresh = () => {
    console.log('[Painting] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handlePaintingClick = (id: string) => {
    console.log('[Painting] 点击绘画记录:', id)
    Taro.showToast({ title: '查看详情', icon: 'none' })
  }

  const handleAction = (action: string) => {
    console.log('[Painting] 快捷操作:', action)
    Taro.showToast({ title: `开始${action}`, icon: 'none' })
  }

  const handleAdd = () => {
    console.log('[Painting] 新增糊伞记录')
    Taro.showToast({ title: '新增糊伞记录', icon: 'none' })
  }

  return (
    <ScrollView
      className={styles.paintingPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.pageHeader}>
        <View className={styles.headerCard}>
          <Text className={styles.title}>伞面裱糊 · 手绘彩绘</Text>
          <Text className={styles.desc}>
            糊伞绘画是油纸伞的灵魂所在。选用优质宣纸或皮纸，经裱糊、阴干、手绘多道工序，在伞面上绘制传统图案，展现东方美学神韵。
          </Text>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionBtn} onClick={() => handleAction('裱糊')}>
          <Text className={styles.icon}>📜</Text>
          <Text className={styles.text}>开始裱糊</Text>
        </View>
        <View className={styles.actionBtn} onClick={() => handleAction('绘画')}>
          <Text className={styles.icon}>🎨</Text>
          <Text className={styles.text}>开始绘画</Text>
        </View>
        <View className={styles.actionBtn} onClick={() => handleAction('阴干')}>
          <Text className={styles.icon}>☀️</Text>
          <Text className={styles.text}>阴干上架</Text>
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

      <View className={styles.paintingList}>
        <View className={styles.listTitle}>
          <View className={styles.titleLeft}>
            <Text>糊伞绘画记录</Text>
          </View>
          <Text className={styles.count}>
            共 <Text className={styles.num}>{mockPaintings.length}</Text> 件
          </Text>
        </View>
        {mockPaintings.map((painting) => (
          <View
            key={painting.id}
            className={styles.paintingItem}
            onClick={() => handlePaintingClick(painting.id)}
          >
            <View className={styles.paintingHeader}>
              <Text className={styles.paintingId}>绘画 #{painting.id}</Text>
              <Text className={classnames(styles.statusTag, styles[painting.status])}>
                {getStatusText(painting.status)}
              </Text>
            </View>
            <View className={styles.paintingInfo}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>纸张类型</Text>
                <Text className={styles.infoValue}>{painting.paperType}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>绘画风格</Text>
                <Text className={styles.infoValue}>{painting.paintStyle}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>图案主题</Text>
                <Text className={styles.infoValue}>{painting.pattern}</Text>
              </View>
            </View>
            <View className={styles.paintingFooter}>
              <Text className={styles.painter}>
                画匠：<Text className={styles.name}>{painting.painter}</Text>
              </Text>
              <Text className={styles.patternTag}>#{painting.pattern}</Text>
            </View>
            <Text style={{ fontSize: '22rpx', color: '#8D6E63', marginTop: '16rpx' }}>
              创建时间：{painting.createTime}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.addBtn} onClick={handleAdd}>
        + 新增糊伞绘画记录
      </View>
    </ScrollView>
  )
}

export default PaintingPage
