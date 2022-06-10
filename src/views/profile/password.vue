<template>
  <div class="create-container">
    <el-form ref="userForm" :model="userForm" :rules="userRule" label-width="100px">
      <el-form-item label="原密码:" prop="oldPassword">
        <el-input v-model="userForm.oldPassword" type="password" maxlength="15" />
      </el-form-item>

      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="userForm.newPassword" type="password" maxlength="15" />
      </el-form-item>

      <el-form-item label="新密码确认:" prop="confirmPasswordVis">
        <el-input v-model="userForm.confirmPasswordVis" type="password" maxlength="15" />
      </el-form-item>

      <el-form-item style="text-align: center;margin-top: 50px">
        <el-button
          class="iconfont icon-right_circle"
          type="primary"
          @click="onSubmit"
        >更新</el-button>
        <el-button type="" class="iconfont icon-fanhui" @click="goBack">返回</el-button>
        <!-- <el-button class="iconfont icon-zhongzhi1" @click="resetForm('userForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { modifyPassword } from '@/api/organ'
export default {
  components: {},
  data() {
    var validatorPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('录入信息不能为空'))
      } else if (value.length < 6) {
        callback(new Error('密码固定长度不能低于6位'))
      } else {
        callback()
      }
    }
    var validatorConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('录入信息不能为空'))
      } else if (this.userForm.newPassword !== value) {
        callback(new Error('两次密码不相同!'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        userId: this.$store.getters.userInfo.userId,
        oldPassword: '',
        newPassword: '',
        confirmPasswordVis: ''
      },
      userRule: {
        oldPassword: [
          { required: true, validator: validatorPassword, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatorPassword, trigger: 'blur' }
        ],
        confirmPasswordVis: [
          { required: true, validator: validatorConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {

  },
  methods: {

    onSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const params = {
            ...this.userForm
          }
          this.$delete(params, 'confirmPasswordVis')
          modifyPassword(params).then(request => {
            if (request.code === 200) {
              this.$notify({
                title: '成功',
                message: request.message,
                type: 'success'
              })
              this.$router.back()
            } else {
              this.$notify({
                title: '失败',
                message: request.message,
                type: 'error'
              })
            }
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.create-container {
  width: 500px;
  margin: 60px auto;
}
</style>
