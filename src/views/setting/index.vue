<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="showAdd"
            >添加角色</el-button>
            <el-table
              v-loading="loading"
              :data="list"
              border
              style="margin-top: 10px;"
            >
              <el-table-column
                type="index"
                label="序号"
                width="120"
                :index="indexMethod"
              />
              <el-table-column prop="name" label="角色名" width="120" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="360" align="center">
                <template v-slot="{ row }">
                  <el-button size="small" type="success" @click="showAssign(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="showEdit(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <!--
                total: 总共有多少条数据
                page-size: 每页显示几条
                current-page: 当前显示第几页
                background: 带背景的分页
                layout: 控制分页显示那些内容
               -->
              <el-pagination
                :total="total"
                :page-size="pagesize"
                :current-page="page"
                background
                layout="total, prev, pager, next"
                @current-change="handleChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
              style="margin-bottom: 20px;"
            />
            <el-row>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="企业名称">
                    <el-input v-model="company.name" disabled />
                  </el-form-item>
                  <el-form-item label="公司地址">
                    <el-input v-model="company.companyAddress" disabled />
                  </el-form-item>
                  <el-form-item label="公司电话">
                    <el-input v-model="company.companyPhone" disabled />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="company.mailbox" disabled />
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input v-model="company.remarks" disabled />
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog
        :title="form.id ? '编辑角色':'新增角色'"
        :visible="showDialog"
        width="40%"
        @close="closeDialog"
      >
        <el-form ref="form" label-width="100px" :model="form" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-row type="flex" justify="center">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button size="small" type="primary" @click="addRole">确定</el-button>
          </el-row>
        </template>
      </el-dialog>

      <el-dialog title="分配权限" :visible.sync="showAssignDialog">
        <el-tree
          ref="tree"
          v-loading="loading"
          :data="permissionList"
          :props="{label: 'name'}"
          show-checkbox
          default-expand-all
          check-strictly
          node-key="id"
        />
        <template #footer>
          <div style="text-align: center;">
            <el-button>取消</el-button>
            <el-button type="primary" @click="assign">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, addRole, getRoleDetail, updateRole, deleteRole, getCompanyById, assignPerm } from '@/api/settings'
import { getPermissionList } from '@/api/permission'
import { mapState } from 'vuex'
import { listToTree } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      pagesize: 2,
      loading: false,
      showDialog: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: ['change', 'blur'] }
        ]
      },
      company: {},
      // 控制分配权限的对话框
      showAssignDialog: false,
      permissionList: [],
      roleId: ''
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.getRoleList()
    this.getCompanyById()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const res = await getRoleList(this.page, this.pagesize)
      console.log(res)
      this.list = res.rows
      this.total = res.total
      this.loading = false
    },
    handleChange(value) {
      // console.log('我执行了吗', value)
      this.page = value
      this.getRoleList()
    },
    indexMethod(index) {
      return index + 1 + (this.page - 1) * this.pagesize
    },
    showAdd() {
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    async addRole() {
      // 1. 对整个表单进行校验
      try {
        await this.$refs.form.validate()
      } catch {
        return
      }
      if (this.form.id) {
        // 更新
        await updateRole(this.form)
      } else {
        // 新增
        await addRole(this.form)
        // 跳转到最后一页
        this.total++
        this.page = Math.ceil(this.total / this.pagesize)
      }
      this.$message.success('操作成功')
      // 关闭弹窗
      this.showDialog = false
      // 重新渲染
      this.getRoleList()
    },
    async showEdit({ id }) {
      // console.log('编辑')
      // this.form = row
      this.showDialog = true
      const res = await getRoleDetail(id)
      this.form = res
    },
    async delRole(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return
      }
      // 发送请求删除
      await deleteRole(id)
      // 提示
      this.$message.success('删除成功')
      // 重新渲染
      if (this.list.length === 1 && this.page > 1) {
        this.page--
      }
      this.getRoleList()
    },
    async getCompanyById() {
      const res = await getCompanyById(this.userInfo.companyId)
      this.company = res
    },
    async showAssign(id) {
      this.loading = true
      this.showAssignDialog = true

      // 发送请求，加载全部的权限信息
      const res = await getPermissionList()
      // console.log(res)
      this.permissionList = listToTree(res, '0')
      console.log(this.permissionList)

      // 发送请求-获取当前角色的详细信息
      const { permIds } = await getRoleDetail(id)

      // 回显
      this.$refs.tree.setCheckedKeys(permIds)

      this.roleId = id
      this.loading = false
    },
    async assign() {
      const permIds = this.$refs.tree.getCheckedKeys()
      await assignPerm({
        id: this.roleId,
        permIds
      })
      this.$message.success('分配权限成功')
      this.showAssignDialog = false
    }
  }
}
</script>

<style>

</style>
