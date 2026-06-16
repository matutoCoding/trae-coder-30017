export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`
}

export const formatDate = (dateStr: string): string => {
  return dateStr
}

export const formatDateTime = (dateTimeStr: string): string => {
  return dateTimeStr
}

export const formatPhone = (phone: string): string => {
  if (phone.length >= 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return phone
}

export const generateId = (prefix: string = ''): string => {
  const random = Math.random().toString(36).substring(2, 9)
  const timestamp = Date.now().toString(36)
  return `${prefix}${timestamp}${random}`
}

export const generateBatchNo = (prefix: string = 'BATCH'): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${year}-${month}${day}-${random}`
}

export const formatQuality = (quality: string): string => {
  const map: Record<string, string> = {
    excellent: '特选',
    good: '优良',
    normal: '合格',
    poor: '不合格',
  }
  return map[quality] || quality
}

export const formatStatus = (status: string): string => {
  const map: Record<string, string> = {
    available: '可用',
    used: '已使用',
    reserved: '已预留',
    pending: '待处理',
    doing: '进行中',
    done: '已完成',
    inventory: '在库',
    sold: '已售出',
    custom: '定制中',
  }
  return map[status] || status
}
