import axios from "@/axios";

/**
 * 获取习惯列表
 * @returns {Promise<Array>} 习惯列表
 */
export function fetchHabits() {
  return axios.get("/habits");
}

/**
 * 获取单个习惯详情
 * @param {number} id - 习惯ID
 * @returns {Promise<Object>} 习惯详情
 */
export function fetchHabitDetail(id) {
  return axios.get(`/habits/${id}`);
}

/**
 * 创建新习惯
 * @param {Object} habitData - 习惯数据
 * @returns {Promise<Object>} 创建结果
 */
export function createHabit(habitData) {
  return axios.post("/habits", habitData);
}

/**
 * 更新习惯
 * @param {number} id - 习惯ID
 * @param {Object} habitData - 更新数据
 * @returns {Promise<Object>} 更新结果
 */
export function updateHabit(id, habitData) {
  return axios.put(`/habits/${id}`, habitData);
}

/**
 * 删除习惯
 * @param {number} id - 习惯ID
 * @returns {Promise<Object>} 删除结果
 */
export function deleteHabit(id) {
  return axios.delete(`/habits/${id}`);
}

/**
 * 切换习惯完成状态
 * @param {number} habitId - 习惯ID
 * @param {string} date - 日期，格式YYYY-MM-DD
 * @returns {Promise<Object>} 切换结果
 */
export function toggleHabitStatus(habitId, date) {
  return axios.post("/habits/toggle", { habitId, date });
}

/**
 * 获取热力图数据
 * @param {string} [startDate] - 开始日期，格式YYYY-MM-DD
 * @param {string} [endDate] - 结束日期，格式YYYY-MM-DD
 * @returns {Promise<Array>} 热力图数据
 */
export function fetchHeatmapData(startDate, endDate) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return axios.get("/habits/heatmap", { params });
}

/**
 * 获取打卡记录
 * @param {string} [startDate] - 开始日期，格式YYYY-MM-DD
 * @param {string} [endDate] - 结束日期，格式YYYY-MM-DD
 * @returns {Promise<Array>} 打卡记录列表
 */
export function fetchCheckins(startDate, endDate) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  return axios.get("/habits/checkins", { params });
}

/**
 * 获取连续打卡天数
 * @returns {Promise<Object>} 包含streak字段的对象
 */
export function fetchStreakDays() {
  return axios.get("/habits/streak");
} 