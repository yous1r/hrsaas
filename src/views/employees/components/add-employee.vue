<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    width="40%"
    @close="close"
  >
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" placeholder="1-30个字符" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="form.timeOfEntry"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="form.correctionTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment" placeholder="请选择">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="form.departmentName"
          :options="treeData"
          :props="defaultProps"
          @focus="getDepartmentList"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="addEmployee">提交</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { listToTree } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '', // 入职时间
        correctionTime: ''// 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '用户姓名为2-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      hireType: EmployeeEnum.hireType,
      treeData: [],
      defaultProps: {
        label: 'name',
        value: 'name',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
      // 重置表单
      this.$refs.form.resetFields()
      this.form = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '', // 入职时间
        correctionTime: ''// 转正时间
      }
    },
    async getDepartmentList() {
      const res = await getDepartments()
      // console.log(res)
      this.treeData = listToTree(res.depts)
    },
    async addEmployee() {
      // 表单验证
      try {
        await this.$refs.form.validate()
      } catch {
        return
      }
      // 发送请求
      await addEmployee({
        ...this.form,
        departmentName: this.form.departmentName.slice(-1)[0]
      })
      this.$message.success('添加成功')
      this.$emit('update:showDialog', false)
      // this.$emit('updateList')
      // console.log(this.$parent)
      // this.$parent.getEmployeeList()
      this.$emit('updateList')
    }
  }
}
</script>

<style>

</style>
