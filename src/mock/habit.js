import Mock from 'mockjs'

// 基础URL前缀
const baseUrl = '/api'

// 习惯列表
const habitList = [
  {
    id: 1,
    name: '阅读',
    category: '学习',
    icon: 'book-open',
    frequency: ['周一', '周二', '周三', '周四', '周五'],
    points: 5,
    createdAt: '2023-05-01'
  },
  {
    id: 2,
    name: '运动',
    category: '健康',
    icon: 'fire',
    frequency: ['周一', '周三', '周五'],
    points: 10,
    createdAt: '2023-05-01'
  },
  {
    id: 3,
    name: '冥想',
    category: '健康',
    icon: 'sun',
    frequency: ['每天'],
    points: 3,
    createdAt: '2023-05-01'
  },
  {
    id: 4,
    name: '写作',
    category: '工作',
    icon: 'pencil',
    frequency: ['周一', '周二', '周三', '周四', '周五'],
    points: 8,
    createdAt: '2023-05-01'
  }
]

// 打卡记录
const checkinList = [
  { id: 1, habitId: 1, date: '2023-05-01', status: 'completed' },
  { id: 2, habitId: 2, date: '2023-05-01', status: 'completed' },
  { id: 3, habitId: 3, date: '2023-05-01', status: 'completed' },
  { id: 4, habitId: 1, date: '2023-05-02', status: 'completed' },
  { id: 5, habitId: 3, date: '2023-05-02', status: 'completed' },
  { id: 6, habitId: 1, date: '2023-05-03', status: 'completed' },
  { id: 7, habitId: 2, date: '2023-05-03', status: 'completed' },
  { id: 8, habitId: 3, date: '2023-05-03', status: 'completed' }
]

// 成就列表
const achievementList = [
  {
    id: 1,
    name: '坚持不懈',
    description: '连续完成任意习惯10天',
    icon: 'trophy',
    unlocked: false,
    progress: 7,
    total: 10,
    reward: 50,
    rewardClaimed: false
  },
  {
    id: 2,
    name: '早起鸟',
    description: '连续一周早起',
    icon: 'sun',
    unlocked: false,
    progress: 5,
    total: 7,
    reward: 30,
    rewardClaimed: false
  },
  {
    id: 3,
    name: '健身达人',
    description: '累计完成20次运动',
    icon: 'fire',
    unlocked: false,
    progress: 12,
    total: 20,
    reward: 40,
    rewardClaimed: false
  }
]

// 奖励列表
const rewardList = [
  {
    id: 1,
    name: '看一部电影',
    description: '给自己放松的时间',
    icon: 'film',
    cost: 50,
    redeemed: false
  },
  {
    id: 2,
    name: '购买一本书',
    description: '投资自己的知识',
    icon: 'book',
    cost: 100,
    redeemed: false
  },
  {
    id: 3,
    name: '外出餐厅晚餐',
    description: '犒劳自己的努力',
    icon: 'cake',
    cost: 150,
    redeemed: false
  }
]

// 用户积分初始值
const userPoints = 120

// 模拟获取习惯列表
Mock.mock(/\/api\/habits$/, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: habitList
  }
})

// 模拟获取习惯详情
Mock.mock(/\/api\/habits\/\d+$/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/habits\/(\d+)/)[1])
  const habit = habitList.find(item => item.id === id)
  
  if (habit) {
    return {
      code: 200,
      message: '获取成功',
      data: habit
    }
  } else {
    return {
      code: 404,
      message: '习惯不存在',
      data: null
    }
  }
})

// 模拟创建习惯
Mock.mock(/\/api\/habits$/, 'post', (options) => {
  const newHabit = JSON.parse(options.body)
  newHabit.id = habitList.length + 1
  newHabit.createdAt = new Date().toISOString().split('T')[0]
  habitList.push(newHabit)
  
  return {
    code: 200,
    message: '创建成功',
    data: newHabit
  }
})

// 模拟更新习惯
Mock.mock(/\/api\/habits\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/habits\/(\d+)/)[1])
  const habitIndex = habitList.findIndex(item => item.id === id)
  
  if (habitIndex !== -1) {
    const updatedHabit = JSON.parse(options.body)
    habitList[habitIndex] = { ...habitList[habitIndex], ...updatedHabit }
    
    return {
      code: 200,
      message: '更新成功',
      data: habitList[habitIndex]
    }
  } else {
    return {
      code: 404,
      message: '习惯不存在',
      data: null
    }
  }
})

// 模拟删除习惯
Mock.mock(/\/api\/habits\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/habits\/(\d+)/)[1])
  const habitIndex = habitList.findIndex(item => item.id === id)
  
  if (habitIndex !== -1) {
    const deletedHabit = habitList.splice(habitIndex, 1)[0]
    
    return {
      code: 200,
      message: '删除成功',
      data: deletedHabit
    }
  } else {
    return {
      code: 404,
      message: '习惯不存在',
      data: null
    }
  }
})

// 模拟切换习惯状态
Mock.mock(/\/api\/habits\/toggle$/, 'post', (options) => {
  const { habitId, date } = JSON.parse(options.body)
  let checkin = checkinList.find(item => item.habitId === habitId && item.date === date)
  
  if (checkin) {
    // 切换状态
    checkin.status = checkin.status === 'completed' ? 'pending' : 'completed'
  } else {
    // 创建新记录
    checkin = {
      id: checkinList.length + 1,
      habitId,
      date,
      status: 'completed'
    }
    checkinList.push(checkin)
  }
  
  // 获取对应习惯的积分
  const habit = habitList.find(item => item.id === habitId)
  const pointsChange = checkin.status === 'completed' ? habit.points : -habit.points
  
  return {
    code: 200,
    message: '更新成功',
    data: {
      checkin,
      pointsChange
    }
  }
})

// 模拟获取打卡记录
Mock.mock(/\/api\/habits\/checkins$/, 'get', (options) => {
  // 解析查询参数
  const url = new URL(options.url, 'http://mockjs.com')
  const startDate = url.searchParams.get('startDate')
  const endDate = url.searchParams.get('endDate')
  
  let filteredCheckins = [...checkinList]
  
  if (startDate) {
    filteredCheckins = filteredCheckins.filter(item => item.date >= startDate)
  }
  
  if (endDate) {
    filteredCheckins = filteredCheckins.filter(item => item.date <= endDate)
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: filteredCheckins
  }
})

// 模拟获取热力图数据
Mock.mock(/\/api\/habits\/heatmap$/, 'get', () => {
  // 模拟生成热力图数据
  const heatmapData = []
  const now = new Date()
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  
  for (let d = new Date(yearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const random = Math.floor(Math.random() * 100)
    
    heatmapData.push({
      date: dateStr,
      count: random
    })
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: heatmapData
  }
})

// 模拟获取连续打卡天数
Mock.mock(/\/api\/habits\/streak$/, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      streak: 12 // 模拟12天连续打卡
    }
  }
})

// 模拟获取成就列表
Mock.mock(`${baseUrl}/achievements`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: achievementList
  }
})

// 模拟领取成就奖励
Mock.mock(new RegExp(`${baseUrl}/achievements/\\d+/claim`), 'post', (options) => {
  const id = parseInt(options.url.match(/\/achievements\/(\d+)\/claim/)[1])
  const achievement = achievementList.find(item => item.id === id)
  
  if (achievement && achievement.unlocked && !achievement.rewardClaimed) {
    achievement.rewardClaimed = true
    
    return {
      code: 200,
      message: '领取成功',
      data: {
        achievement,
        pointsAdded: achievement.reward
      }
    }
  } else if (!achievement) {
    return {
      code: 404,
      message: '成就不存在',
      data: null
    }
  } else if (!achievement.unlocked) {
    return {
      code: 400,
      message: '成就未解锁，无法领取奖励',
      data: null
    }
  } else {
    return {
      code: 400,
      message: '奖励已领取',
      data: null
    }
  }
})

// 模拟获取奖励列表
Mock.mock(`${baseUrl}/rewards`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: rewardList
  }
})

// 模拟兑换奖励
Mock.mock(new RegExp(`${baseUrl}/rewards/\\d+/redeem`), 'post', (options) => {
  const id = parseInt(options.url.match(/\/rewards\/(\d+)\/redeem/)[1])
  const reward = rewardList.find(item => item.id === id)
  
  if (reward && !reward.redeemed && userPoints >= reward.cost) {
    reward.redeemed = true
    
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

// 模拟获取用户积分
Mock.mock(`${baseUrl}/user/points`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: {
      points: userPoints
    }
  }
})

// 导出给测试使用
export {
  habitList,
  checkinList
} 