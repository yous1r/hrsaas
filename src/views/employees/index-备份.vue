<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #left>总记录数：{{ total }}条</template>
        <template #right>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=employee')"
          >excel导入</el-button>
          <el-button size="small" type="danger" @click="handleDownload">excel导出</el-button>
          <el-button
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
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
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
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeesEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatTime } from '@/filters'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      size: 5,
      // 控制添加员工的显示
      showDialog: false
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
        console.log('rows', rows)
        const tHeader = Object.keys(headers)
        console.log(tHeader)
        const data = []
        rows.forEach(item => {
          const arr = []
          // item=> arr
          tHeader.forEach(k => {
            const value = item[headers[k]]
            if (value && ['入职日期', '转正日期'].includes(k)) {
              arr.push(formatTime(value))
            } else if (k === '聘用形式') {
              // debugger
              const obj = EmployeesEnum.hireType.find(v => v.id === value)
              console.log(obj)
              obj ? arr.push(obj.value) : arr.push('')
            } else {
              arr.push(value)
            }
          })
          data.push(arr)
        })
        // console.log(data)
        // const tHeader = ['姓名', '年龄', '工资']
        // const data = [
        //   ['张三', 18, 2000],
        //   ['李四', 20, 3000]
        // ]
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    }
  }
}
</script>

<style></style>
