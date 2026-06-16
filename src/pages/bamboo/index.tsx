import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import BambooCard from '@/components/BambooCard'
import { useUmbrellaStore } from '@/store/umbrellaStore'
import { generateId, generateBatchNo } from '@/utils/format'
import { BambooQuality } from '@/types/umbrella'
import classnames from 'classnames'

type FilterType = 'all' | 'available' | 'used' | 'reserved'

const BambooPage: React.FC = () => {
  const { bambooList, addBamboo, stats } = useUmbrellaStore()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    diameter: '',
    length: '',
    quality: 'good' as BambooQuality,
    quantity: '',
    inspector: '',
    remark: '',
  })

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'available', label: '可用' },
    { key: 'used', label: '已使用' },
    { key: 'reserved', label: '已预留' },
  ]

  const qualityOptions = [
    { key: 'excellent', label: '特选' },
    { key: 'good', label: '优良' },
    { key: 'normal', label: '合格' },
  ]

  const handlePullDownRefresh = () => {
    console.log('[Bamboo] 下拉刷新')
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const handleBambooClick = (id: string) => {
    console.log('[Bamboo] 点击竹料:', id)
    Taro.showToast({ title: '查看详情', icon: 'none' })
  }

  const handleAddBamboo = () => {
    console.log('[Bamboo] 打开新增竹料弹窗')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      source: '',
      diameter: '',
      length: '',
      quality: 'good',
      quantity: '',
      inspector: '',
      remark: '',
    })
  }

  const handleSubmit = () => {
    console.log('[Bamboo] 提交新增竹料:', formData)
    if (!formData.source || !formData.diameter || !formData.length || !formData.quantity) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    const newBamboo = {
      id: generateId('b'),
      batchNo: generateBatchNo('BAM'),
      source: formData.source,
      diameter: parseFloat(formData.diameter),
      length: parseFloat(formData.length),
      quality: formData.quality,
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: parseInt(formData.quantity),
      status: 'available' as const,
      inspector: formData.inspector || '李师傅',
      remark: formData.remark || undefined,
    }

    addBamboo(newBamboo)
    Taro.showToast({ title: '登记成功', icon: 'success' })
    handleCloseModal()
  }

  const filteredBamboo = bambooList.filter((bamboo) => {
    if (activeFilter === 'all') return true
    return bamboo.status === activeFilter
  })

  const availableCount = bambooList.filter(b => b.status === 'available').length
  const usedCount = bambooList.filter(b => b.status === 'used').length

  return (
    <ScrollView
      className={styles.bambooPage}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handlePullDownRefresh}
    >
      <View className={styles.pageHeader}>
        <View className={styles.headerCard}>
          <Text className={styles.title}>楠竹竹料登记</Text>
          <View className={styles.stats}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.bambooStock}</Text>
              <Text className={styles.statLabel}>总库存</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{availableCount}</Text>
              <Text className={styles.statLabel}>可用</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{usedCount}</Text>
              <Text className={styles.statLabel}>已使用</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        <ScrollView scrollX className={styles.filterBar}>
          {filters.map((filter) => (
            <View
              key={filter.key}
              className={classnames(
                styles.filterItem,
                activeFilter === filter.key && styles.active
              )}
              onClick={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text>{filter.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.bambooList}>
        {filteredBamboo.length > 0 ? (
          filteredBamboo.map((bamboo) => (
            <BambooCard
              key={bamboo.id}
              bamboo={bamboo}
              onClick={() => handleBambooClick(bamboo.id)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎋</Text>
            <Text className={styles.emptyText}>暂无相关竹料</Text>
          </View>
        )}
      </View>

      <View className={styles.actionBar}>
        <Button className={styles.addBtn} onClick={handleAddBamboo}>
          <Text className={styles.icon}>+</Text>
          <Text>楠竹登记</Text>
        </Button>
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={handleCloseModal}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>楠竹竹料登记</Text>
              <View className={styles.closeBtn} onClick={handleCloseModal}>
                <Text>✕</Text>
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>竹料产地</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入产地，如：福建武夷山楠竹基地"
                value={formData.source}
                onInput={(e) => setFormData({ ...formData, source: e.detail.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <View className={styles.formRow}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>直径 (cm)</Text>
                  <Input
                    className={styles.formInput}
                    type="digit"
                    placeholder="请输入直径"
                    value={formData.diameter}
                    onInput={(e) => setFormData({ ...formData, diameter: e.detail.value })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>长度 (m)</Text>
                  <Input
                    className={styles.formInput}
                    type="digit"
                    placeholder="请输入长度"
                    value={formData.length}
                    onInput={(e) => setFormData({ ...formData, length: e.detail.value })}
                  />
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.formRow}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>数量 (根)</Text>
                  <Input
                    className={styles.formInput}
                    type="number"
                    placeholder="请输入数量"
                    value={formData.quantity}
                    onInput={(e) => setFormData({ ...formData, quantity: e.detail.value })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>检验员</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="请输入检验员"
                    value={formData.inspector}
                    onInput={(e) => setFormData({ ...formData, inspector: e.detail.value })}
                  />
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>竹料品质</Text>
              <View className={styles.qualityOptions}>
                {qualityOptions.map((option) => (
                  <View
                    key={option.key}
                    className={classnames(
                      styles.qualityOption,
                      formData.quality === option.key && styles.active
                    )}
                    onClick={() => setFormData({ ...formData, quality: option.key as BambooQuality })}
                  >
                    <Text>{option.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>备注</Text>
              <Input
                className={styles.formInput}
                placeholder="选填"
                value={formData.remark}
                onInput={(e) => setFormData({ ...formData, remark: e.detail.value })}
              />
            </View>

            <Button className={styles.submitBtn} onClick={handleSubmit}>
              <Text>确认登记</Text>
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default BambooPage
