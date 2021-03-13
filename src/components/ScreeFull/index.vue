<template>
  <svg-icon
    :icon-class="isFullScreen ? 'exit-fullscreen': 'fullscreen'"
    class="fullscreen"
    @click="toggle"
  />
</template>

<script>
import screenFull from 'screenfull'
export default {
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    toggle() {
      if (!screenFull.isEnabled) {
        return this.$message.warning('你的浏览器不支持全屏效果')
      }
      screenFull.toggle()
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
