<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card" style="height: 550px;">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" style="margin-right: 6px;" />员工工号
                <div class="pull-right">{{ user.empCode }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" style="margin-right: 6px;" />员工姓名
                <div class="pull-right">{{ user.empName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" style="margin-right: 6px;" />登录账号
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" style="margin-right: 6px;" />手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" style="margin-right: 6px;" />个人邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" style="margin-right: 6px;" />所属部门
                <div v-if="user.deptName" class="pull-right">{{ user.deptName }} </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" style="margin-right: 6px;" />所属岗位
                <div class="pull-right">{{ user.postNames?user.postNames:'' }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" style="margin-right: 6px;" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card style="height:550px;">
          <div slot="header" class="clearfix">
            <span>修改信息</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="修改手机号" name="userinfo">
              <userInfo :user="user" :old-phone="user.phonenumber" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUser } from '@/api/system/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUser(this.$store.getters.userInfo.userId).then(response => {
        this.user = response.result.user
        this.$set(this.user, 'oldPhone', response.result.user.phonenumber)
      })
    }
  }
}
</script>
