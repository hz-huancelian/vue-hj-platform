<template>
  <div class="create-container">
    <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="100px">
      <el-form-item label="登录账号:" prop="username">
        <el-input v-model="userForm.username" :disabled="true" style="width:300px" />
      </el-form-item>
      <el-form-item v-if="!userForm.deptId==='-1'" label="所属部门:" prop="username">
        <el-select
          v-model="userForm.deptId"
          clearable
          filterable
          style="width: 300px"
          :disabled="true"
        >
          <el-option
            v-for="item in deptArray"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!userForm.deptId==='-1'" prop="platformPositionId" label="岗位:">
        <el-select
          v-model="userForm.platformPositionId"
          filterable
          style="width: 300px"
          :disabled="true"
        >
          <el-option
            v-for="item in Object.keys(postionArray)"
            :key="item"
            :label="postionArray[item]"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名称:" prop="empName">
        <el-input v-model="userForm.empName" maxlength="15" style="width:300px" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="userForm.phone" maxlength="11" style="width:300px" />
      </el-form-item>

      <el-form-item style="margin-top: 50px">
        <el-button
          class="iconfont icon-right_circle"
          type="primary"
          @click="onSubmit"
        >保 存</el-button>
        <el-button type class="iconfont icon-fanhui" @click="goBack">返 回</el-button>
        <!-- <el-button class="iconfont icon-zhongzhi1" @click="resetForm('userForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import * as deptServer from '@/api/dept'
import * as userServer from '@/api/user'
import { validPhone } from '@/utils/validate'
export default {
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value && value.length > 0) {
        if (validPhone(value)) {
          callback()
        } else {
          callback(new Error('输入正确的电话号码'))
        }
      } else {
        callback()
      }
    }
    return {
      departmentArray: [],
      roleList: [],
      userForm: {
        userId: '',
        username: '',
        empCode: '',
        deptId: '',
        empName: '',
        phone: '',
        platformPositionId: ''
      },
      userRules: {
        empName: [{ required: true, message: '请录入用户姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请录入联系方式', trigger: 'blur' }, { required: true, validator: validatePhone, trigger: 'blur' }]
      },
      postionArray: {},
      deptArray: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    if (this.userInfo.deptId === '-1') {
      this.handleChange(-1)
    } else {
      this.getDeptTreeList()
    }
    this.userForm.userId = this.userInfo.userId
    this.userForm.username = this.userInfo.username
    this.userForm.platformPositionId = this.userInfo.platformPositionId
    this.userForm.deptId = this.userInfo.deptId
    this.userForm.empCode = this.userInfo.empCode
    this.userForm.empName = this.userInfo.empName
    this.userForm.phone = this.userInfo.phone
  },
  methods: {
    getDeptTreeList() {
      deptServer.getDeptList().then(res => {
        if (res.result) {
          this.deptArray = res.result || []
          const o = res.result.find(i => i.id === this.userInfo.deptId)
          this.handleChange(o.platformDeptId)
        }
      })
    },
    handleChange(platformDeptId) {
      deptServer.dpfindPositionIdByDeptId(platformDeptId).then(res => {
        this.$nextTick(() => {
          this.postionArray = res.result || {}
        })
      })
    },
    onSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const data = {
            userId: this.userForm.userId,
            empName: this.userForm.empName,
            phone: this.userForm.phone
          }
          debugger
          userServer.editUserById(data).then(request => {
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
          })
        } else {
          return false
        }
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
.create-container {
  width: 500px;
  height: 100%;
  margin: 60px auto;
}

.avatar-wrapper {
  position: relative;
  .user-name {
    margin-right: 2px;
    font-size: 14px;
  }
  .user-avatar {
    vertical-align: middle;
    cursor: pointer;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    margin-right: 10px;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
}
</style>
