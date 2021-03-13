<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close" @open="open">
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="assign">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/settings'
import { getUserById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  created() {
    // 获取所有的角色
    // this.getRoleList()
    // 获取用户信息，包含角色数据
    // this.getUserById()
  },
  methods: {
    close() {
      this.$emit('update:showRoleDialog', false)
    },
    async getRoleList() {
      const res = await getRoleList(1, 100)
      this.roleList = res.rows
    },
    async getUserById() {
      const res = await getUserById(this.userId)
      this.roleIds = res.roleIds
    },
    async open() {
      // console.log('当对话框显示的时候')
      this.loading = true
      // 获取所有的角色
      // await this.getRoleList()
      // 获取用户信息，包含角色数据
      // await this.getUserById()
      // 整合多个接口请求
      await Promise.all([this.getRoleList(), this.getUserById()])
      this.loading = false
    },
    async assign() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$emit('update:showRoleDialog', false)
      this.$message.success('修改成功')
    }
  }
}
</script>

<style>

</style>
