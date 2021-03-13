<template>
  <div class="page-tools">
    <el-card>
      <el-row type="flex" justify="space-between" align="middle">
        <!-- 左侧 -->
        <div class="left">
          <div v-if="$slots.left" class="tips">
            <i class="el-icon-info" />
            <slot name="left" />
          </div>
        </div>
        <div class="right">
          <slot name="right" />
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PageTools'
  // created() {
  //   console.log('aa', this.$slots)
  // }
}
</script>

<style lang="scss" scoped>
.page-tools {
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
