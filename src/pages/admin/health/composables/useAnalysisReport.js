import { ref } from 'vue'

export function useAnalysisReport() {
  // 分析报告数据
  const analysisData = ref({
    period: '3个月',
    overall: '良好',
    summary: '您的体重和体脂率保持稳定，与健康范围指标接近。坚持当前的生活方式和运动计划，有望达成您设定的健康目标。',
    metrics: {
      weight: {
        current: 70,
        trend: '下降',
        change: '-2.5kg',
        analysis: '您的体重正在向目标值稳步靠近，过去三个月平均每月下降0.8kg，这是一个健康的减重速度。'
      },
      bodyFat: {
        current: 20,
        trend: '下降',
        change: '-1.2%',
        analysis: '体脂率降低表明您的减重方式是健康的，正在减少脂肪而非肌肉组织。'
      },
      bmi: {
        current: 22.6,
        status: '健康',
        analysis: '您的BMI处于健康范围(18.5-24.9)内，降低体重是为了进一步优化身体组成而非健康需求。'
      }
    },
    suggestions: [
      '维持每周3-4次的有氧运动和力量训练组合',
      '确保睡眠充足，每晚7-8小时',
      '增加高蛋白食物摄入，协助肌肉恢复和增长',
      '关注饮食中的精制糖和碳水摄入，可以尝试间歇性禁食',
      '每周测量并记录身体数据，以便及时调整计划'
    ],
    exercises: [
      {
        name: '高强度间歇训练',
        type: '有氧运动',
        description: '短时间高强度运动和休息交替，高效燃烧脂肪',
        frequency: '每周2-3次',
        duration: '20-30分钟',
        intensity: '中高强度'
      },
      {
        name: '复合力量训练',
        type: '力量训练',
        description: '以大肌群动作为主的力量训练，提高基础代谢',
        frequency: '每周2次',
        duration: '45-60分钟',
        intensity: '中等强度'
      },
      {
        name: '瑜伽/普拉提',
        type: '柔韧性',
        description: '改善柔韧性和核心力量，促进身体恢复',
        frequency: '每周1-2次',
        duration: '30-45分钟',
        intensity: '低强度'
      },
      {
        name: '有氧步行',
        type: '有氧运动',
        description: '低强度长时间有氧运动，稳定燃烧脂肪',
        frequency: '每周3-5次',
        duration: '30-60分钟',
        intensity: '低强度'
      }
    ]
  });

  // 生成分析报告
  const generateAnalysisReport = async () => {
    // 实际项目中，这里会从API获取分析数据
    // 这里为了演示，使用模拟的延迟来模拟API请求
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这里可以更新analysisData，例如：
        // analysisData.value = 从API获取的数据
        resolve();
      }, 1500);
    });
  };

  // 导出分析报告
  const exportAnalysisReport = (data) => {
    console.log('导出分析报告', data);
    // 实际实现可能包括生成PDF或导出到其他格式
    // 这里仅作示例
    alert('分析报告已导出');
  };

  return {
    analysisData,
    generateAnalysisReport,
    exportAnalysisReport
  };
} 