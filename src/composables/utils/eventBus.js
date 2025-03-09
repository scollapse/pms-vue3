// 简单的事件总线实现，用于组件间通信
import { ref } from 'vue'

class EventBus {
  constructor() {
    this.events = {}
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
    
    // 返回取消订阅的函数
    return () => {
      this.off(eventName, callback)
    }
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.events[eventName]) return
    if (!callback) {
      delete this.events[eventName]
      return
    }
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
  }

  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return
    this.events[eventName].forEach(callback => {
      callback(...args)
    })
  }

  // 清空所有事件
  clear() {
    this.events = {}
  }
}

// 创建事件总线实例
const eventBus = new EventBus()

export default eventBus