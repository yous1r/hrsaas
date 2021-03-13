<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <tree-tools :node-data="company" :is-root="true" @addDepart="addDepart" />
        <hr>
        <!-- 树状菜单 -->
        <el-tree :data="departments" :props="defaultProps" default-expand-all>
          <template v-slot="{ data }">
            <tree-tools
              :node-data="data"
              @getDepartments="getDepartmentList"
              @addDepart="addDepart"
              @editDepart="editDepart"
            />
          </template>
        </el-tree>
      </el-card>
      <add-dept
        ref="add"
        :show-dialog.sync="showDialog"
        :node="currentNode"
        @getDepartments="getDepartmentList"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/TreeTools'
import AddDept from './components/AddDept'
import { getDepartments } from '@/api/departments'
import { listToTree } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      departments: [],
      defaultProps: {
        // 指定显示的文本
        label: 'name',
        children: 'children'
      },
      company: {
        name: '江苏传智播客',
        manager: '负责人',
        id: ''
      },
      // 是否显示loading效果
      loading: false,
      // 控制弹窗的显示
      showDialog: false,
      // 当前点击的部门
      currentNode: {}
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      this.loading = true
      // 发送请求，获取部门数据
      const res = await getDepartments()
      // console.log(res)
      // 修改数据
      this.departments = listToTree(res.depts)
      this.company.name = res.companyName
      this.loading = false
    },
    addDepart(nodeData) {
      this.showDialog = true
      this.currentNode = nodeData
    },
    // 修改部门
    async editDepart(nodeData) {
      this.showDialog = true
      this.currentNode = nodeData
      // 回显
      // console.log(nodeData)
      // this.$refs.add.form = nodeData
      await this.$nextTick()
      this.$refs.add.getDepartDetail(nodeData.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
  ::v-deep {
    .el-icon-caret-right:before {
      content: "\e723";
      color: #000;
    }
    .el-tree-node__expand-icon.expanded {
      transform: rotate(0deg);
    }
    .el-tree-node__expand-icon.expanded::before {
      content: "\e722";
      color: #000;
    }

    .el-tree-node__expand-icon.is-leaf::before {
      content: "\e7a5";
      color: #000;
    }
  }
}
</style>
