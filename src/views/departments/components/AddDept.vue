<template>
  <el-dialog :visible="showDialog" :title="showTitle" width="40%" @close="handleClose">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          placeholder="请选择负责人"
          @focus="getEmployees"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          type="textarea"
          placeholder="请输入部门介绍"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="add">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartment, getDepartDetail, updateDepartment } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const res = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        // 修改
        if (value === this.node.name) {
          return callback()
        }
        // 获取同级部门列表 可以和自己重复
        const result = res.depts.filter(item => item.pid === this.node.pid)
        isRepeat = result.some(item => item.name === value)
      } else {
        // 添加
        const result = res.depts.filter(item => item.pid === this.node.id)
        isRepeat = result.some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下${value}已经存在了`)) : callback()
    }

    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      if (this.form.id) {
        // 是修改, code允许和自己重复
        if (this.node.code === value) {
          return callback()
        }
      }
      // 判断是否重复
      const isRepeat = depts.some(item => item.code === value)
      isRepeat ? callback(new Error(`部门编码${value}已经存在了`)) : callback()
    }
    return {
      form: {
        code: '',
        introduce: '',
        manager: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门长度为1-50', trigger: ['blur', 'change'] },
          // 失去焦点的时候，发送请求，检查部门是否重复，所以，不推荐使用change
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-50个字符', trigger: ['blur', 'change'] }
        ]
      },
      employees: []
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '添加子部门'
    }
  },
  methods: {
    handleClose() {
      // console.log('关闭了。。。。。')
      this.$emit('update:showDialog', false)
      // 清空表单的内容以及校验的结果
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    async getEmployees() {
      const res = await getEmployeeSimple()
      this.employees = res
    },
    add() {
      // 让整个表单进行校验
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (this.form.id) {
          // 有 id值，需要编辑
          await updateDepartment(this.form)
          // 1. 提示
          this.$message.success('修改成功')
        } else {
          // 没有id，新增
          await addDepartment({
            ...this.form,
            pid: this.node.id
          })
          // 1. 提示
          this.$message.success('添加成功')
        }

        // 2. 关闭对话框
        this.$emit('update:showDialog', false)
        // 3. 让父组件重新渲染
        this.$emit('getDepartments')
      })
    },
    async getDepartDetail(id) {
      console.log(this.node.id)
      const res = await getDepartDetail(id)
      this.form = res
    }
  }
}
</script>

<style>

</style>
