import { ref } from 'vue'

export function useNotification() {
  // 通知提示
  const notification = ref({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  // 显示成功通知
  const showSuccess = (message, title = '成功') => {
    notification.value = {
      show: true,
      type: 'success',
      title,
      message
    }
    
    // 自动关闭
    setTimeout(() => {
      notification.value.show = false
    }, 3000)
  }
  
  // 显示错误通知
  const showError = (message, title = '错误') => {
    notification.value = {
      show: true,
      type: 'error',
      title,
      message
    }
    
    // 自动关闭
    setTimeout(() => {
      notification.value.show = false
    }, 5000)
  }
  
  // 显示警告通知
  const showWarning = (message, title = '警告') => {
    notification.value = {
      show: true,
      type: 'warning',
      title,
      message
    }
    
    // 自动关闭
    setTimeout(() => {
      notification.value.show = false
    }, 4000)
  }

  return {
    notification,
    showSuccess,
    showError,
    showWarning
  }
} 