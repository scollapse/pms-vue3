import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export const vTooltip = {
  mounted(el, binding) {
    // 如果绑定值是字符串，直接使用该字符串作为提示内容
    // 如果绑定值是对象，则使用对象的content属性作为提示内容
    const content = typeof binding.value === 'string' ? binding.value : binding.value?.content
    
    if (content) {
      tippy(el, {
        content,
        placement: 'top',
        arrow: true,
        theme: 'light',
        ...(typeof binding.value === 'object' ? binding.value : {})
      })
    }
  },
  unmounted(el) {
    // 销毁tippy实例
    if (el._tippy) {
      el._tippy.destroy()
    }
  }
}

export default {
  install(app) {
    app.directive('tooltip', vTooltip)
  }
}