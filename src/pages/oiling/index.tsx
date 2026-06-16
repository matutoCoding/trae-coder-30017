import React, { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { mockOilings, getStatusText } from '@/data/mockProcess'
import classnames from 'classnames'

const processSteps = [
  { icon: '🛢️', type: 'prepare', name: '桐油准备', desc: '选用优质天然桐油，过滤杂质，调配至适当浓度，确保油质纯净。' },
  { icon: '🖌️', type: 'brush', name: '刷油浸润', desc: '用毛刷均匀涂刷桐油于伞面，确保每个部位都充分浸润，不遗漏。' },
  { icon: '☀️', type: 'dry', name: '晾晒阴干', desc: '将刷好油的伞悬挂于通风阴凉处阴干，避免阳光直射和雨淋。' },
  { icon: '🔄', type: 'repeat', name: '反复上油', desc: '待第一层油干透后，再次刷油晾晒，通常需反复3-5次，直至伞面光亮。' },
  { icon: '✅', type: 'check', name: '开合校验', desc: '油层完全干透后，反复开合测试伞的灵活性，检查整体结构是否牢固。' },
]

const OilingPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handlePullDownRefresh = () => {
    console.log('[Oiling] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleOilingClick = (id: string) => {
    console.log('[Oiling] 点击浸制记录:', id)
    Taro.showToast({ title: '查看详情', icon: 'none' })
  }

  const handleAction = (action: string) => {
    console.log('[Oiling] 快捷操作:', action)
    Taro.showToast({ title: `开始${action}`, icon: 'none' })
  }

  const handleAdd = () => {
    console.log('[Oiling] 新增浸制记录')
    Taro.showToast({ title: '新增浸制记录', icon: 'none' })
  }

  const getCheckText = (check: string): string => {
    const map: Record<string, string> = {
      passed: '开合校验通过',
      pending: '待校验',
      failed: '校验未过',
    }
    return map[check] || check
  }

  return (
    <ScrollView
      className={styles.oilingPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.pageHeader}>
        <View className={styles.headerCard}>
          <Text className={styles.title}>桐油浸刷 · 开合校验</Text>
          <Text className={styles.desc}>
            桐油浸制是油纸伞防水耐用的关键。反复刷涂天然桐油并充分晾晒，使伞面形成坚韧的保护膜，最后进行开合校验，确保伞的品质。
          </Text>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionBtn} onClick={() => handleAction('刷油')}>
          <Text className={styles.icon}>🖌️</Text>
          <Text className={styles.text}>开始刷油</Text>
        </View>
        <View className={styles.actionBtn} onClick={() => handleAction('晾晒')}>
          <Text className={styles.icon}>☀️</Text>
          <Text className={styles.text}>上架晾晒</Text>
        </View>
        <View className={styles.actionBtn} onClick={() => handleAction('校验')}>
          <Text className={styles.icon}>✅</Text>
          <Text className={styles.text}>开合校验</Text>
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

      <View className={styles.oilingList}>
        <View className={styles.listTitle}>
          <View className={styles.titleLeft}>
            <Text>桐油浸制记录</Text>
          </View>
          <Text className={styles.count}>
            共 <Text className={styles.num}>{mockOilings.length}</Text> 件
          </Text>
        </View>
        {mockOilings.map((oiling) => (
          <View
            key={oiling.id}
            className={styles.oilingItem}
            onClick={() => handleOilingClick(oiling.id)}
          >
            <View className={styles.oilingHeader}>
              <Text className={styles.oilingId}>浸制 #{oiling.id}</Text>
              <Text className={classnames(styles.statusTag, styles[oiling.status])}>
                {getStatusText(oiling.status)}
              </Text>
            </View>
            <View className={styles.oilingInfo}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>桐油种类</Text>
                <Text className={styles.infoValue}>{oiling.oilType}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>刷油次数</Text>
                <Text className={styles.infoValue}>{oiling.oilCoatCount}次</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>晾干时间</Text>
                <Text className={styles.infoValue}>{oiling.dryTime}h</Text>
              </View>
            </View>
            <View className={styles.oilingFooter}>
              <Text className={styles.oilDate}>
                浸制日期：{oiling.oilingTime}
              </Text>
              <Text className={classnames(styles.checkTag, styles[oiling.openCloseCheck])}>
                {getCheckText(oiling.openCloseCheck)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.addBtn} onClick={handleAdd}>
        + 新增桐油浸制记录
      </View>
    </ScrollView>
  )
}

export default OilingPage
