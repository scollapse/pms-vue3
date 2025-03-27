import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import * as habitApi from '@/api/admin/habit'
import * as achievementApi from '@/api/admin/achievement'
import * as rewardApi from '@/api/admin/reward'

export const useHabitStore = defineStore('habit', () => {
  // 状态
  const habits = ref([])
  const checkins = ref([])
  const achievements = ref([])
  const rewards = ref([])
  const userPoints = ref(0)
  const loading = ref({
    habits: false,
    checkins: false,
    achievements: false,
    rewards: false,
    points: false
  })

  // 当前选择的日期
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

  // 获取类别
  const categories = computed(() => {
    if (!habits.value || !Array.isArray(habits.value)) {
      return []
    }
    const categorySet = new Set(habits.value.map(habit => habit.category))
    return Array.from(categorySet)
  })

  // 按类别分组的习惯
  const habitsByCategory = computed(() => {
    const grouped = {}
    categories.value.forEach(category => {
      grouped[category] = habits.value.filter(habit => habit.category === category)
    })
    return grouped
  })

 // 修改 habitsByDate 计算属性
const habitsByDate = computed(() => {
  const date = dayjs(selectedDate.value)
  const dayOfWeek = '周' + '日一二三四五六'[date.day()]
  
  // 确保 habits.value 已初始化且为数组
  if (!habits.value || !Array.isArray(habits.value)) {
    return []
  }
  
  // 确保 habits.value 已初始化且为数组
if (!habits.value || !Array.isArray(habits.value)) {
  return []
}

return (Array.isArray(habits.value) ? habits.value : []).filter(habit => {
    // 确保 habit.frequency 存在
    if (!habit.frequency) return false
    
    return habit.frequency.includes('每天') || 
           habit.frequency.includes(dayOfWeek)
  })
})

  // 今日进度
  const todayProgress = computed(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const todayHabits = habitsByDate.value.length
    const completedHabits = (Array.isArray(checkins.value) ? checkins.value : []).filter(checkin => 
      checkin.date === today && checkin.status === 'completed'
    ).length
    
    return {
      total: todayHabits,
      completed: completedHabits,
      percentage: todayHabits > 0 ? Math.round((completedHabits / todayHabits) * 100) : 0
    }
  })

  // 连续打卡天数
  const streakDays = ref(0)

  // 本周完成率
  const weeklyCompletionRate = computed(() => {
    const startOfWeek = dayjs().startOf('week')
    const endOfWeek = dayjs().endOf('week')
    
    let totalTasks = 0
    let completedTasks = 0
    
    for (let d = startOfWeek; d.isBefore(endOfWeek) || d.isSame(endOfWeek); d = d.add(1, 'day')) {
      const dateStr = d.format('YYYY-MM-DD')
      const dayOfWeek = '周' + '日一二三四五六'[d.day()]
      
      const dateHabits = Array.isArray(habits.value) ? habits.value.filter(habit => 
        habit.frequency.includes('每天') || habit.frequency.includes(dayOfWeek)
      ) : []
      
      totalTasks += dateHabits.length
      
      const completed = (Array.isArray(checkins.value) ? checkins.value : []).filter(checkin => 
        checkin.date === dateStr && checkin.status === 'completed'
      ).length
      
      completedTasks += completed
    }
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  })

  // 热力图数据
  const heatmapData = ref([]);

  // 获取习惯列表
  const fetchHabits = async () => {
    loading.value.habits = true
    try {
      const response = await habitApi.fetchHabits()
      habits.value = response.data
    } catch (error) {
      console.error('获取习惯列表失败', error)
    } finally {
      loading.value.habits = false
    }
  }

  // 获取打卡记录
  const fetchCheckins = async (startDate, endDate) => {
    loading.value.checkins = true
    try {
      const response = await habitApi.fetchCheckins(startDate, endDate)
      checkins.value = response.data
    } catch (error) {
      console.error('获取打卡记录失败', error)
    } finally {
      loading.value.checkins = false
    }
  }

  // 获取成就列表
  const fetchAchievements = async () => {
    loading.value.achievements = true
    try {
      const response = await achievementApi.fetchAchievements()
      achievements.value = response.data
    } catch (error) {
      console.error('获取成就列表失败', error)
    } finally {
      loading.value.achievements = false
    }
  }

  // 获取奖励列表
  const fetchRewards = async () => {
    loading.value.rewards = true
    try {
      const response = await rewardApi.fetchRewards()
      rewards.value = response.data
    } catch (error) {
      console.error('获取奖励列表失败', error)
    } finally {
      loading.value.rewards = false
    }
  }

  // 获取用户积分
  const fetchUserPoints = async () => {
    loading.value.points = true
    try {
      const response = await rewardApi.fetchUserPoints()
      userPoints.value = response.data.points
    } catch (error) {
      console.error('获取用户积分失败', error)
    } finally {
      loading.value.points = false
    }
  }

  // 获取连续打卡天数
  const fetchStreakDays = async () => {
    try {
      const response = await habitApi.fetchStreakDays()
      if (response?.data?.data?.streak) {
        streakDays.value = response.data.streak
      } else {
        streakDays.value = 0
      }
    } catch (error) {
      console.error('获取连续打卡天数失败', error)
    }
  }

  // 获取热力图数据
  const fetchHeatmapData = async () => {
    try {
      const response = await habitApi.fetchHeatmapData()
      heatmapData.value = response.data
    } catch (error) {
      console.error('获取热力图数据失败', error)
    }
  }

  // 根据日期获取该日完成的习惯
  const getCompletedHabitsByDate = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const completedCheckins = (Array.isArray(checkins.value) ? checkins.value : []).filter(checkin => 
      checkin.date === dateStr && checkin.status === 'completed'
    )
    
    return completedCheckins.map(checkin => {
      const habit = habits.value.find(h => h.id === checkin.habitId)
      return { ...checkin, habit }
    })
  }

  // 切换习惯的完成状态
  const toggleHabitStatus = async (habitId, date = selectedDate.value) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    
    try {
      const response = await habitApi.toggleHabitStatus(habitId, dateStr)
      if (response.code === 200) {
        // 按照依赖顺序刷新数据
        await fetchCheckins() // 首先更新打卡记录
        
        // 然后并行更新积分和连续打卡天数
        await Promise.all([
          fetchUserPoints(),
          fetchStreakDays()
        ])
        
        await fetchHeatmapData() // 更新热力图数据
        await fetchAchievements() // 最后检查成就
        return true
      }
      return false
    } catch (error) {
      console.error('切换习惯状态失败', error)
      return false
    }
  }

  // 添加新习惯
  const addHabit = async (habit) => {
    try {
      const response = await habitApi.createHabit(habit)
      if (response.code === 200) {
        // 刷新习惯列表
        await fetchHabits()
        return true
      }
      return false
    } catch (error) {
      console.error('添加习惯失败', error)
      return false
    }
  }

  // 兑换奖励
  const redeemReward = async (rewardId) => {
    try {
      const response = await rewardApi.redeemReward(rewardId)
      if (response.code === 200) {
        // 刷新奖励列表和用户积分
        await Promise.all([
          fetchRewards(),
          fetchUserPoints()
        ])
        return true
      }
      return false
    } catch (error) {
      console.error('兑换奖励失败', error)
      return false
    }
  }

  // 领取成就奖励
  const claimAchievementReward = async (achievementId) => {
    try {
      const response = await achievementApi.claimAchievementReward(achievementId)
      if (response.code === 200) {
        // 刷新成就列表和用户积分
        await Promise.all([
          fetchAchievements(),
          fetchUserPoints()
        ])
        return true
      }
      return false
    } catch (error) {
      console.error('领取成就奖励失败', error)
      return false
    }
  }

  // 设置选择的日期
  const setSelectedDate = (date) => {
    selectedDate.value = dayjs(date).format('YYYY-MM-DD')
  }

  // 初始化数据
  const initData = async () => {
    try {
      // 先获取基础数据
      await Promise.all([
        fetchHabits(),
        fetchUserPoints()
      ])
      
      // 获取依赖于习惯数据的相关信息
      await Promise.all([
        fetchCheckins(),
        fetchStreakDays(),
        fetchHeatmapData()
      ])
      
      // 获取成就和奖励信息
      await Promise.all([
        fetchAchievements(),
        fetchRewards()
      ])
    } catch (error) {
      console.error('初始化数据失败', error)
    }
  }

  // 初始化
  initData()

  return {
    habits,
    checkins,
    achievements,
    rewards,
    userPoints,
    loading,
    selectedDate,
    categories,
    habitsByCategory,
    habitsByDate,
    todayProgress,
    streakDays,
    weeklyCompletionRate,
    heatmapData,
    fetchHabits,
    fetchCheckins,
    fetchAchievements,
    fetchRewards,
    fetchUserPoints,
    fetchStreakDays,
    fetchHeatmapData,
    getCompletedHabitsByDate,
    toggleHabitStatus,
    addHabit,
    redeemReward,
    claimAchievementReward,
    setSelectedDate
  }
})