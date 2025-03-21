import { ref } from 'vue'
import { 
  SunIcon, 
  FireIcon, 
  MoonIcon, 
  CakeIcon
} from '@heroicons/vue/24/outline'

export default function useDietUtils() {
  // 格式化日期
  const formatDate = (date) => {
    if (!date) return ''
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('zh-CN', options)
  }
  
  // 获取膳食图标
  const getMealIcon = (mealType) => {
    switch (mealType) {
      case '早餐': return SunIcon
      case '午餐': return FireIcon
      case '晚餐': return MoonIcon
      case '加餐': return CakeIcon
      default: return SunIcon
    }
  }
  
  // 获取膳食图标背景色
  const getMealIconBg = (mealType) => {
    switch (mealType) {
      case '早餐': return 'bg-amber-500'
      case '午餐': return 'bg-red-500'
      case '晚餐': return 'bg-indigo-500'
      case '加餐': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }
  
  // 获取标签样式类
  const getTagClass = (tag) => {
    switch (tag) {
      case '蛋白质': return 'bg-red-100 text-red-800'
      case '碳水': return 'bg-amber-100 text-amber-800'
      case '全麦': 
      case '全谷物': return 'bg-amber-100 text-amber-800'
      case '低碳水': return 'bg-green-100 text-green-800'
      case '纤维素': 
      case '维生素': return 'bg-emerald-100 text-emerald-800'
      case '益生菌': return 'bg-blue-100 text-blue-800'
      case '抗氧化': 
      case '水果': return 'bg-purple-100 text-purple-800'
      case '瘦肉': 
      case '高脂鱼': return 'bg-red-100 text-red-800'
      case '钙质': return 'bg-blue-100 text-blue-800'
      case '低热量': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 计算营养进度比例
  const calculateProgress = (consumed, goal) => {
    const progress = Math.min(Math.round((consumed / goal) * 100), 100)
    return `${progress}%`
  }
  
  // 通知状态
  const notification = ref({
    show: false,
    title: '',
    message: '',
    type: 'success'
  })
  
  // 显示通知
  const showNotification = (title, message, type = 'success') => {
    notification.value = {
      show: true,
      title,
      message,
      type
    }
    
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }

  return {
    formatDate,
    getMealIcon,
    getMealIconBg,
    getTagClass,
    calculateProgress,
    notification,
    showNotification
  }
} 