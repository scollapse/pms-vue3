import Mock from 'mockjs'

// 基础URL前缀
const baseUrl = '/api'

// 成就列表
const achievementList = [
  {
    id: 1,
    name: '坚持不懈',
    description: '连续完成任意习惯10天',
    icon: 'trophy',
    unlocked: true,
    progress: 10,
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
  },
  {
    id: 4,
    name: '阅读爱好者',
    description: '累计阅读30天',
    icon: 'book-open',
    unlocked: true,
    progress: 30,
    total: 30,
    reward: 60,
    rewardClaimed: true
  },
  {
    id: 5,
    name: '冥想大师',
    description: '连续冥想15天',
    icon: 'zap',
    unlocked: false,
    progress: 8,
    total: 15,
    reward: 45,
    rewardClaimed: false
  },
  {
    id: 6,
    name: '首次完成',
    description: '首次完成任意习惯',
    icon: 'check-circle',
    unlocked: true,
    progress: 1,
    total: 1,
    reward: 10,
    rewardClaimed: true
  }
]

// 模拟获取成就列表
Mock.mock(`${baseUrl}/achievements`, 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: achievementList
  }
})

// 模拟获取成就详情
Mock.mock(new RegExp(`${baseUrl}/achievements/\\d+`), 'get', (options) => {
  const id = parseInt(options.url.match(/\/achievements\/(\d+)/)[1])
  const achievement = achievementList.find(item => item.id === id)
  
  if (achievement) {
    return {
      code: 200,
      message: '获取成功',
      data: achievement
    }
  } else {
    return {
      code: 404,
      message: '成就不存在',
      data: null
    }
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

// 模拟获取已解锁的成就
Mock.mock(`${baseUrl}/achievements/unlocked`, 'get', () => {
  const unlockedAchievements = achievementList.filter(item => item.unlocked)
  
  return {
    code: 200,
    message: '获取成功',
    data: unlockedAchievements
  }
})

// 模拟获取未解锁的成就
Mock.mock(`${baseUrl}/achievements/locked`, 'get', () => {
  const lockedAchievements = achievementList.filter(item => !item.unlocked)
  
  return {
    code: 200,
    message: '获取成功',
    data: lockedAchievements
  }
})

// 模拟获取已领取奖励的成就
Mock.mock(`${baseUrl}/achievements/claimed`, 'get', () => {
  const claimedAchievements = achievementList.filter(item => item.unlocked && item.rewardClaimed)
  
  return {
    code: 200,
    message: '获取成功',
    data: claimedAchievements
  }
})

// 模拟获取未领取奖励的成就
Mock.mock(`${baseUrl}/achievements/unclaimed`, 'get', () => {
  const unclaimedAchievements = achievementList.filter(item => item.unlocked && !item.rewardClaimed)
  
  return {
    code: 200,
    message: '获取成功',
    data: unclaimedAchievements
  }
}) 