<template>
  <el-row class="tree-tools" type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%;">
    <el-col :span="20">
      <span>
        <i v-if="isRoot" class="el-icon-phone" />
        {{ nodeData.name }}
      </span>
    </el-col>
    <el-col :span="4">
      <el-row>
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <el-dropdown @command="handleCommand">
            <span @click.stop.prevent>操作<i class="el-icon-arrow-down" /></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="add"
                >添加子部门</el-dropdown-item>
                <el-dropdown-item
                  v-if="!isRoot"
                  command="edit"
                >查看部门</el-dropdown-item>
                <el-dropdown-item
                  v-if="!isRoot"
                  command="del"
                >删除部门</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  name: 'TreeTools',
  props: {
    nodeData: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'add':
          this.add()
          break
        case 'edit':
          this.edit()
          break
        case 'del':
          this.del()
          break
      }
    },
    add() {
      // console.log('添加')
      // 让父组件显示弹窗，并且需要携带nodeData
      this.$emit('addDepart', this.nodeData)
    },
    edit() {
      // console.log('修改')
      this.$emit('editDepart', this.nodeData)
    },
    async del() {
      console.log('删除')
      console.log(this.nodeData)
      try {
        await this.$confirm('你确定要删除该部门吗', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return
      }
      // 删除部门
      await delDepartment(this.nodeData.id)
      // 提示删除功能
      this.$message.success('删除成功')
      // 重新渲染，通知父组件更新数据
      this.$emit('getDepartments')
    }
  }
}
</script>

<style scoped lang="scss">
.el-col {
  height: 30px;
  line-height: 30px;
}

</style>
