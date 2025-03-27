import axios from "@/axios";

/**
 * 获取成就列表
 * @returns {Promise<Array>} 成就列表
 */
export function fetchAchievements() {
  return axios.get("/achievements");
}

/**
 * 获取单个成就详情
 * @param {number} id - 成就ID
 * @returns {Promise<Object>} 成就详情
 */
export function fetchAchievementDetail(id) {
  return axios.get(`/achievements/${id}`);
}

/**
 * 领取成就奖励
 * @param {number} id - 成就ID
 * @returns {Promise<Object>} 结果
 */
export function claimAchievementReward(id) {
  return axios.post(`/achievements/${id}/claim`);
}

/**
 * 获取用户已解锁的成就
 * @returns {Promise<Array>} 已解锁的成就列表
 */
export function fetchUnlockedAchievements() {
  return axios.get("/achievements/unlocked");
}

/**
 * 获取用户未解锁的成就
 * @returns {Promise<Array>} 未解锁的成就列表
 */
export function fetchLockedAchievements() {
  return axios.get("/achievements/locked");
}

/**
 * 获取用户已领取奖励的成就
 * @returns {Promise<Array>} 已领取奖励的成就列表
 */
export function fetchClaimedAchievements() {
  return axios.get("/achievements/claimed");
}

/**
 * 获取用户未领取奖励的成就
 * @returns {Promise<Array>} 未领取奖励的成就列表
 */
export function fetchUnclaimedAchievements() {
  return axios.get("/achievements/unclaimed");
} 