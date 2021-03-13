export const imgerror = {
  // el 指令所在的元素
  // binding 指令的相关信息对象, binding.value 指令的值
  // mounted
  inserted(el, binding) {
    // console.log('我执行了')
    if (!el.src) {
      el.src = binding.value
    }
    el.onerror = function() {
      // console.log('图片加载失败了'), 设置备用图片地址
      el.src = binding.value
    }
  },
  // 指令所在的组件发生了更新的时候，也会执行
  // updated
  componentUpdated(el, binding) {
    // console.log('我也要执行')
    if (!el.src) {
      el.src = binding.value
    }
    el.onerror = function() {
      // console.log('图片加载失败了'), 设置备用图片地址
      el.src = binding.value
    }
  }
}

export const focus = {
  inserted(el) {
    el.focus()
  }
}
