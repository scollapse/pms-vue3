import { ref } from 'vue'

export function useLoading() {
  // 加载状态
  const chartLoading = ref(false)
  const historyLoading = ref(false)
  const analysisLoading = ref(false)
  const pageLoading = ref(true)

  // 设置加载状态
  const setLoading = (type, value) => {
    switch (type) {
      case 'chart':
        chartLoading.value = value
        break
      case 'history':
        historyLoading.value = value
        break
      case 'analysis':
        analysisLoading.value = value
        break
      case 'page':
        pageLoading.value = value
        break
      default:
        console.warn(`未知的加载类型: ${type}`)
    }
  }

  return {
    chartLoading,
    historyLoading,
    analysisLoading,
    pageLoading,
    setLoading
  }
} 