import Mock from 'mockjs'

// 设置模拟响应延迟
Mock.setup({
  timeout: '200-600'
})

// 配置baseURL
const baseUrl = '/api'

// 只拦截习惯系统相关的API请求
const mockUrls = [
  // 习惯相关
  new RegExp(`${baseUrl}/habits.*`),
  // 成就相关
  new RegExp(`${baseUrl}/achievements.*`),
  // 奖励相关
  new RegExp(`${baseUrl}/rewards.*`),
  // 用户积分
  new RegExp(`${baseUrl}/user/points.*`)
]

// 拦截请求的过滤器
const originalMock = Mock.mock
Mock.mock = function(...args) {
  if (typeof args[0] === 'string' || args[0] instanceof RegExp) {
    const urlPattern = args[0]
    
    // 检查是否是习惯系统相关的请求
    const shouldMock = mockUrls.some(pattern => {
      if (typeof urlPattern === 'string') {
        return pattern instanceof RegExp ? pattern.test(urlPattern) : pattern === urlPattern
      } else if (urlPattern instanceof RegExp) {
        return pattern.toString() === urlPattern.toString()
      }
      return false
    })
    
    // 只拦截习惯系统相关的请求
    if (shouldMock) {
      return originalMock.apply(this, args)
    }
    
    // 其他请求不进行拦截
    return
  }
  
  return originalMock.apply(this, args)
}

// 导入习惯系统相关Mock
import './habit'
import './achievement' 
import './reward'

export default Mock 