<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="showAdd(1, '0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button
                :disabled="row.type === 2"
                size="small"
                type="text"
                @click="showAdd(2, row.id)"
              >添加权限点</el-button>
              <el-button size="small" type="text" @click="showEdit(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增编辑的弹层 -->
    <el-dialog
      :visible.sync="showDialog"
      width="40%"
      :title="form.id ? '编辑权限':'新增权限'"
      @close="close"
    >
      <!-- 表单内容 -->
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="form.enVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="不启用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: center;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permission'
import { listToTree } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      form: {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: ['change', 'blur'] }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = listToTree(res, '0')
      console.log(this.list)
      // console.log(this.list)
    },
    showAdd(type, pid) {
      this.showDialog = true
      this.form.type = type
      this.form.pid = pid
    },
    async add() {
      // 校验表单
      try {
        await this.$refs.form.validate()
      } catch {
        return
      }
      if (this.form.id) {
        await updatePermission(this.form)
      } else {
        await addPermission(this.form)
      }
      // 提示消息
      this.$message.success('操作成功')
      this.showDialog = false
      // 重新渲染
      this.getPermissionList()
    },
    close() {
      this.$refs.form.resetFields()
      this.form = {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    },
    async showEdit(id) {
      // 发送请求-回显数据
      this.showDialog = true
      this.form = await getPermissionDetail(id)
    },
    async del(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return
      }
      await delPermission(id)
      // 提示消息
      this.$message.success('删除成功')
      this.getPermissionList()
    }
  }
}
</script>

<style>

</style>
