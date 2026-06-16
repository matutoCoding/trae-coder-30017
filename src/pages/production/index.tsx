import React, { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import ProcessCard from '@/components/ProcessCard'
import { useUmbrellaStore } from '@/store/umbrellaStore'
import { mockProcessSteps, mockFrames, mockPaintings, mockOilings } from '@/data/mockProcess'
import { mockCrafts, productionBatchData } from '@/data/mockCrafts'
import classnames from 'classnames'

type TabType = 'process' | 'craft' | 'batch'

const ProductionPage: React.FC = () => {
  const { bambooList, stats } = useUmbrellaStore()
  const [activeTab, setActiveTab] = useState<TabType>('process')
  const [refreshing, setRefreshing] = useState(false)

  const tabs = [
    { key: 'process', label: '工艺流程' },
    { key: 'craft', label: '工艺展示' },
    { key: 'batch', label: '批次产量' },
  ]

  const doneCount = mockProcessSteps.filter(s => s.status === 'done').length
  const doingCount = mockProcessSteps.filter(s => s.status === 'doing').length
  const pendingCount = mockProcessSteps.filter(s => s.status === 'pending').length

  const handlePullDownRefresh = () => {
    console.log('[Production] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleProcessClick = (stepId: string) => {
    console.log('[Production] 点击工序:', stepId)
    const step = mockProcessSteps.find(s => s.id === stepId)
    if (step?.name === '选竹备料') {
      Taro.navigateTo({ url: '/pages/bamboo/index' }).catch(console.error)
    } else if (step?.name === '伞骨制作') {
      Taro.navigateTo({ url: '/pages/frame/index' }).catch(console.error)
    } else if (step?.name === '糊伞绘画') {
      Taro.navigateTo({ url: '/pages/painting/index' }).catch(console.error)
    } else if (step?.name === '桐油浸制') {
      Taro.navigateTo({ url: '/pages/oiling/index' }).catch(console.error)
    }
  }

  const handleQuickAction = (type: string) => {
    console.log('[Production] 点击快捷操作:', type)
    const pathMap: Record<string, string> = {
      bamboo: '/pages/bamboo/index',
      frame: '/pages/frame/index',
      painting: '/pages/painting/index',
      oiling: '/pages/oiling/index',
    }
    Taro.navigateTo({ url: pathMap[type] }).catch(console.error)
  }

  const handleCraftClick = (craftId: string) => {
    console.log('[Production] 点击工艺:', craftId)
  }

  const maxOutput = Math.max(...productionBatchData.map(d => d.output))

  return (
    <ScrollView
      className={styles.productionPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.tabSection}>
        <View className={styles.tabBar}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
              onClick={() => setActiveTab(tab.key as TabType)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionGrid}>
          <View className={styles.actionItem} onClick={() => handleQuickAction('bamboo')}>
            <View className={classnames(styles.actionIcon, styles.bamboo)}>
              <Text>🎋</Text>
            </View>
            <Text className={styles.actionName}>竹料管理</Text>
            <Text className={styles.actionCount}>
              库存 <Text className={styles.countNum}>{stats.bambooStock}</Text> 根
            </Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('frame')}>
            <View className={classnames(styles.actionIcon, styles.frame)}>
              <Text>⚙️</Text>
            </View>
            <Text className={styles.actionName}>伞骨制作</Text>
            <Text className={styles.actionCount}>
              待制作 <Text className={styles.countNum}>{mockFrames.filter(f => f.status === 'pending').length}</Text> 件
            </Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('painting')}>
            <View className={classnames(styles.actionIcon, styles.painting)}>
              <Text>🎨</Text>
            </View>
            <Text className={styles.actionName}>糊伞绘画</Text>
            <Text className={styles.actionCount}>
              进行中 <Text className={styles.countNum}>{mockPaintings.filter(p => p.status === 'doing').length}</Text> 件
            </Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('oiling')}>
            <View className={classnames(styles.actionIcon, styles.oiling)}>
              <Text>🛢️</Text>
            </View>
            <Text className={styles.actionName}>桐油浸制</Text>
            <Text className={styles.actionCount}>
              待上油 <Text className={styles.countNum}>{mockOilings.filter(o => o.status === 'pending').length}</Text> 件
            </Text>
          </View>
        </View>
      </View>

      {activeTab === 'process' && (
        <View className={styles.processStepsSection}>
          <View className={styles.processHeader}>
            <Text className="sectionTitle">工艺流程</Text>
            <View className={styles.statsInfo}>
              <View className={styles.statsItem}>
                <View className={classnames(styles.statsDot, styles.done)} />
                <Text className={styles.statsText}>
                  <Text className={styles.statsNum}>{doneCount}</Text>已完成
                </Text>
              </View>
              <View className={styles.statsItem}>
                <View className={classnames(styles.statsDot, styles.doing)} />
                <Text className={styles.statsText}>
                  <Text className={styles.statsNum}>{doingCount}</Text>进行中
                </Text>
              </View>
              <View className={styles.statsItem}>
                <View className={classnames(styles.statsDot, styles.pending)} />
                <Text className={styles.statsText}>
                  <Text className={styles.statsNum}>{pendingCount}</Text>待开始
                </Text>
              </View>
            </View>
          </View>

          {mockProcessSteps.map((step, index) => (
            <ProcessCard
              key={step.id}
              step={step}
              index={index}
              onClick={() => handleProcessClick(step.id)}
            />
          ))}
        </View>
      )}

      {activeTab === 'craft' && (
        <View className={styles.craftSection}>
          <Text className="sectionTitle">工艺展示</Text>
          {mockCrafts.map((craft) => (
            <View
              key={craft.id}
              className={styles.craftCard}
              onClick={() => handleCraftClick(craft.id)}
            >
              <View className={styles.craftImage}>
                <Image
                  src={craft.imageUrl}
                  mode="aspectFill"
                  style={{ width: '100%', height: '100%' }}
                  onError={(e) => console.error('[Production] 图片加载失败:', e)}
                />
                <View className={styles.craftOverlay}>
                  <Text className={styles.craftTitle}>{craft.title}</Text>
                  <Text className={styles.craftCraftsman}>匠人：{craft.craftsman}</Text>
                </View>
              </View>
              <View className={styles.craftContent}>
                <Text className={styles.craftDesc}>{craft.description}</Text>
                <View className={styles.craftSteps}>
                  <Text className={styles.stepsTitle}>制作步骤</Text>
                  <View className={styles.stepList}>
                    {craft.steps.map((step, index) => (
                      <View key={index} className={styles.stepItem}>
                        <View className={styles.stepNum}>
                          <Text>{index + 1}</Text>
                        </View>
                        <Text className={styles.stepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'batch' && (
        <View className={styles.batchSection}>
          <Text className="sectionTitle">批次产量</Text>
          <View className={styles.batchCard}>
            <View className={styles.batchHeader}>
              <Text className={styles.batchTitle}>近6个月产量</Text>
              <Text className={styles.batchTotal}>
                总计 <Text className={styles.totalNum}>{productionBatchData.reduce((sum, d) => sum + d.output, 0)}</Text> 把
              </Text>
            </View>
            <View className={styles.batchChart}>
              {productionBatchData.map((data) => (
                <View key={data.month} className={styles.chartItem}>
                  <View
                    className={styles.chartBar}
                    style={{ height: `${(data.output / maxOutput) * 140 + 20}rpx` }}
                  />
                  <Text className={styles.chartLabel}>{data.month}</Text>
                  <Text className={styles.chartValue}>{data.output}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ marginTop: '32rpx' }}>
            <View className={styles.batchCard}>
              <View className={styles.batchHeader}>
                <Text className={styles.batchTitle}>制作中批次</Text>
              </View>
              <View style={{ gap: '16rpx', display: 'flex', flexDirection: 'column' }}>
                {mockFrames.filter(f => f.status !== 'done').slice(0, 3).map((frame) => (
                  <View
                    key={frame.id}
                    style={{
                      padding: '24rpx',
                      background: '#FAF8F5',
                      borderRadius: '12rpx',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: '28rpx', color: '#2C1810', fontWeight: 500 }}>
                        伞骨制作 #{frame.id}
                      </Text>
                      <Text style={{ fontSize: '24rpx', color: '#8D6E63', marginTop: '4rpx' }}>
                        {frame.ribCount}根伞骨 · {frame.threadType} · {frame.craftsman}
                      </Text>
                    </View>
                    <Text
                      className={classnames(
                        'tag',
                        frame.status === 'doing' ? 'warning' : 'error'
                      )}
                    >
                      {frame.status === 'doing' ? '制作中' : '待开始'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ProductionPage
