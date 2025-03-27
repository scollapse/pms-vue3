import axios from "@/axios";

/**
 * 获取奖励列表
 * @returns {Promise<Array>} 奖励列表
 */
export function fetchRewards() {
  return axios.get("/rewards");
}

/**
 * 获取单个奖励详情
 * @param {number} id - 奖励ID
 * @returns {Promise<Object>} 奖励详情
 */
export function fetchRewardDetail(id) {
  return axios.get(`/rewards/${id}`);
}

/**
 * 兑换奖励
 * @param {number} id - 奖励ID
 * @returns {Promise<Object>} 兑换结果
 */
export function redeemReward(id) {
  return axios.post(`/rewards/${id}/redeem`);
}

/**
 * 获取可用的奖励列表（积分足够兑换的）
 * @returns {Promise<Array>} 可用奖励列表
 */
export function fetchAvailableRewards() {
  return axios.get("/rewards/available");
}

/**
 * 获取已兑换的奖励列表
 * @returns {Promise<Array>} 已兑换奖励列表
 */
export function fetchRedeemedRewards() {
  return axios.get("/rewards/redeemed");
}

/**
 * 获取用户当前积分
 * @returns {Promise<Object>} 包含积分信息的对象
 */
export function fetchUserPoints() {
  return axios.get("/user/points");
} 