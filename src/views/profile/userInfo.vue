<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="员工姓名" prop="nickName">
      <el-input v-model="user.empName" maxlength="30" disabled />
    </el-form-item>
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11" />
    </el-form-item>
    <!-- <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" size="small" @click="submit">保存</el-button>
      <el-button type="danger" size="small" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { editUserById } from '@/api/system/user'

export default {
  props: {
    user: {
      type: Object
    },
    oldPhone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        empName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit() {
      if (this.user.oldPhone !== this.user.phonenumber) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const data = {
              userId: this.user.userId,
              empName: this.user.empName,
              phone: this.user.phonenumber
            }
            debugger
            editUserById(data).then(request => {
              this.msgSuccess('修改成功')
            })
          }
        })
      } else {
        this.msgSuccess('信息没有改变!')
      }
    },
    close() {
      // this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/' })
    }
  }
}
</script>
