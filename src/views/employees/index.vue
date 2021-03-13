<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #left>总记录数：{{ total }}条</template>
        <template #right>
          <el-button
            v-if="checkPermission('EMPLOYEE-IMPORT')"
            size="small"
            type="warning"
            @click="$router.push('/import?type=employee')"
          >excel导入</el-button>
          <el-button
            v-if="checkPermission('EMPLOYEE-EXPORT')"
            size="small"
            type="danger"
            @click="handleDownload"
          >excel导出</el-button>
          <el-button
            v-if="checkPermission('EMPLOYEE-ADD')"
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table border :data="list">
          <el-table-column
            label="序号"
            sortable
            type="index"
            width="100"
            align="center"
            :index="indexMethod"
          />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="手机号" sortable prop="mobile" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <img
                v-imgerror="defaultImg"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column
            :formatter="formatEmployment"
            label="聘用形式"
            sortable
            prop="formOfEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable align="center">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable align="center">
            <template v-slot="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable width="280" fixed="right">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="showAssign(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <el-pagination
            :total="total"
            :page-size="size"
            :current-page="page"
            layout="total, prev, pager, next"
            background
            @current-change="handleChange"
          />
        </el-row>
      </el-card>
      <add-employee :show-dialog.sync="showDialog" @updateList="updateList" />
      <assign-role :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
      <el-dialog width="40%" title="二维码" :visible.sync="showCodeDialog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatTime } from '@/filters'
import AssignRole from './components/assign-role'
import QrCode from 'qrcode'
import permission from '@/mixins/permission'
export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
  },
  mixins: [permission],
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      size: 5,
      // 控制添加员工的显示
      showDialog: false,
      defaultImg: require('@/assets/common/bigUserHeader.png'),
      // 二维码弹窗
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page, this.size)
      this.list = rows
      this.total = total
    },
    handleChange(value) {
      this.page = value
      this.getEmployeeList()
    },
    indexMethod(index) {
      return (this.page - 1) * this.size + index + 1
    },
    formatEmployment(row, column, cellValue, index) {
      // console.log('row', row)
      // console.log('column', column)
      // console.log('cellValue', cellValue)
      // console.log(EmployeesEnum)
      const result = EmployeesEnum.hireType.find(item => item.id === cellValue)
      return result ? result.value : ''
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('你确定要删除吗', '提示', {
          type: 'warning'
        })
      } catch {
        return
      }
      await delEmployee(id)
      // 提示
      this.$message.success('删除成功')
      // 重新渲染
      if (this.list.length === 1 && this.page > 1) {
        this.page--
      }
      this.getEmployeeList()
    },
    updateList() {
      // 设置页码值
      this.total++
      this.page = Math.ceil(this.total / this.size)
      this.getEmployeeList()
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then(async excel => {
        // 先发送请求，获取所有的员工的数据
        const { rows } = await getEmployeeList(1, this.total)
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        // ['姓名', '年龄', '成绩']
        /*
      [
        ['张三', 18, 100],
      ]
    */
        // 1. 处理表头
        const tHeader = Object.keys(headers)
        const multiHeader = [
          ['姓名', '员工信息', '', '', '', '', '部门']
        ]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // 2. 处理data数据
        const data = rows.map(item => {
          return tHeader.map(k => {
            const value = item[headers[k]]
            // 如果value没有值，不管是什么，都不需要处理
            if (!value) return value
            // 如果value有值，判断是否是日期或者是聘用形式
            if (k === '入职日期' || k === '转正日期') {
              return formatTime(value)
            }
            if (k === '聘用形式') {
              return EmployeesEnum.hireType.find(v => v.id === value).value
            }
            return value
          })
        })
        // console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工',
          autoWidth: true,
          bookType: 'xlsx',
          // 复杂的表头
          multiHeader,
          // 合并表头
          merges
        })
      })
    },
    async showQrCode(staffPhoto) {
      if (!staffPhoto) return
      // 显示弹窗
      this.showCodeDialog = true
      // 把图片地址生成二维码
      // console.log(staffPhoto)
      // 参数1： canvas标签
      // 参数2：具体的网址
      // console.log(this.$refs.myCanvas)
      await this.$nextTick()
      QrCode.toCanvas(this.$refs.myCanvas, staffPhoto)
    },
    showAssign(id) {
      this.showRoleDialog = true
      this.userId = id
    }
  }
}
</script>

<style></style>
