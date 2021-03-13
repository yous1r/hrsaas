<template>
  <div class="dashboard-container employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-row>
              <el-col :span="8">
                <el-form
                  ref="form"
                  label-width="100px"
                  :model="userInfo"
                  :rules="rules"
                >
                  <el-form-item label="姓名：" prop="username">
                    <el-input v-model="userInfo.username" />
                  </el-form-item>
                  <el-form-item label="密码：" prop="newPassword">
                    <el-input v-model="userInfo.newPassword" type="password" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="update">更新</el-button>
                    <el-button @click="$router.back()">取消</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${id}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${id}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserById, saveUserDetailById } from '@/api/user'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  name: 'EmployeeDetail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userInfo: {
        username: '',
        newPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: ['change', 'blur'] }
        ],
        newPassword: [
          { min: 6, max: 9, message: '密码长度6-9位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const res = await getUserById(this.id)
      console.log(res)
      this.userInfo = {
        ...this.userInfo,
        ...res
      }
    },
    async update() {
      try {
        await this.$refs.form.validate()
      } catch {
        return
      }
      // 发送请求-修改账户
      await saveUserDetailById({
        ...this.userInfo,
        password: this.userInfo.newPassword
      })
      this.$message.success('密码修改成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
