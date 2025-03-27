import Mock from 'mockjs'

// 基础URL前缀
const baseUrl = '/api'

// 用户积分初始值
const userPoints = 120

// 奖励列表
const rewardList = [
  {
    id: 1,
    name: '看一部电影',
    description: '给自己放松的时间',
    icon: 'film',
    cost: 50,
    redeemed: false,
    validPeriod: '30天',
    createdAt: null,
    redeemedAt: null
  },
  {
    id: 2,
    name: '购买一本书',
    description: '投资自己的知识',
    icon: 'book',
    cost: 100,
    redeemed: false,
    validPeriod: '60天',
    createdAt: null,
    redeemedAt: null
  },
  {
    id: 3,
    name: '外出餐厅晚餐',
    description: '犒劳自己的努力',
    icon: 'cake',
    cost: 150,
    redeemed: true,
    validPeriod: '30天',
    createdAt: null,
    redeemedAt: '2023-05-01'
  },
  {
    id: 4,
    name: '一小时休息时间',
    description: '给自己放松一下',
    icon: 'coffee',
    cost: 30,
    redeemed: false,
    validPeriod: '7天',
    createdAt: null,
    redeemedAt: null
  },
  {
    id: 5,
    name: '跳过一天的习惯',
    description: '允许你跳过一天的习惯而不破坏连续性',
    icon: 'skip-forward',
    cost: 80,
    redeemed: false,
    validPeriod: '15天',
    createdAt: null,
    redeemedAt: null
  },
  {
    id: 6,
    name: '健身房会员卡',
    description: '一个月的健身房会员资格',
    icon: 'activity',
    cost: 200,
    redeemed: false,
    validPeriod: '90天',
    createdAt: null,
    redeemedAt: null
  }
]

// 模拟获取奖励列表
Mock.mock(`${baseUrl}/rewards`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: rewardList
  }
})

// 模拟获取奖励详情
Mock.mock(new RegExp(`${baseUrl}/rewards/\\d+`), 'get', (options) => {
  const id = parseInt(options.url.match(/\/rewards\/(\d+)/)[1])
  const reward = rewardList.find(item => item.id === id)
  
  if (reward) {
    return {
      code: 200,
      message: '获取成功',
      data: reward
    }
  } else {
    return {
      code: 404,
      message: '奖励不存在',
      data: null
    }
  }
})

// 模拟兑换奖励
Mock.mock(new RegExp(`${baseUrl}/rewards/\\d+/redeem`), 'post', (options) => {
  const id = parseInt(options.url.match(/\/rewards\/(\d+)\/redeem/)[1])
  const reward = rewardList.find(item => item.id === id)
  
  if (reward && !reward.redeemed && userPoints >= reward.cost) {
    reward.redeemed = true
    reward.redeemedAt = new Date().toISOString().split('T')[0]
    
    return {
      code: 200,
      message: '兑换成功',
      data: {
        reward,
        pointsDeducted: reward.cost
      }
    }
  } else if (!reward) {
    return {
      code: 404,
      message: '奖励不存在',
      data: null
    }
  } else if (reward.redeemed) {
    return {
      code: 400,
      message: '奖励已兑换',
      data: null
    }
  } else {
    return {
      code: 400,
      message: '积分不足',
      data: null
    }
  }
})

// 模拟获取可用的奖励列表（积分足够兑换的）
Mock.mock(`${baseUrl}/rewards/available`, 'get', () => {
  const availableRewards = rewardList.filter(item => !item.redeemed && item.cost <= userPoints)
  
  return {
    code: 200,
    message: '获取成功',
    data: availableRewards
  }
})

// 模拟获取已兑换的奖励列表
Mock.mock(`${baseUrl}/rewards/redeemed`, 'get', () => {
  const redeemedRewards = rewardList.filter(item => item.redeemed)
  
  return {
    code: 200,
    message: '获取成功',
    data: redeemedRewards
  }
})

// 模拟获取用户当前积分
Mock.mock(`${baseUrl}/user/points`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      points: userPoints
    }
  }
})