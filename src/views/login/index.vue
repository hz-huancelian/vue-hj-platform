<template>
  <div class="login-container ng-scope">
    <div class="login-wrap">
      <div class="bg-opacity">
        <div class="logo" />
        <div class="title" />
      </div>
      <el-card class="card-container">
        <el-tabs type="card" :tab-position="tabPosition" style="height:350px;">
          <el-tab-pane>
            <span slot="label" style="width: 248px;"><i class="el-icon-user" /> 账号登录</span>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
              <div class="title-container">
                <h1 class="title">登录</h1>
              </div>
              <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入账号"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>
              <el-tooltip v-model="capsTooltip" content="密码明文查看" placement="right" manual>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请填写密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>
              <el-button type="primary" @click.native.prevent="handleLogin">登 录</el-button>
              <span style="font-size:13px;cursor:pointer;color:#9b9ea0;text-decoration:none;position: absolute;right:20px;padding-top:20px;" @click="forgetPwd">忘记密码</span>
              <!-- <el-row>
                <el-col :span="24" style="text-align:right;margin-top:-20px"><span style="font-size:13px;cursor:pointer;color:#9b9ea0;text-decoration:none" @click="forgetPwd">忘记密码</span></el-col>
              </el-row> -->
              <el-row>
                <el-col :span="24" style="text-align:center;padding-top:25px">
                  <span style="font-size:12px;cursor:pointer;color:#9b9ea0;text-decoration:none">
                    登录并使用“环测链”即为同意<a href="https://www.jshengzheng.com/aggrement" target="_blank" style="color:#1890FF">《用户协议》</a>和
                    <a href="https://www.jshengzheng.com/privacyPolicy" target="_blank" style="color:#1890FF">《隐私政策》</a>
                  </span>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" style="width: 249px;"><i class="el-icon-phone" /> 手机号登录</span>
            <el-form ref="loginPhoneForm" :model="loginPhoneForm" :rules="loginPhoneRules" class="login-form" autocomplete="on" label-position="left">
              <div class="title-container">
                <h1 class="title">登录</h1>
              </div>
              <el-form-item prop="username">
                <span class="svg-container">
                  <img src="@/assets/image/login/shoujitianchong.png" class="svgImg">
                </span>
                <el-input
                  ref="phone"
                  v-model="loginPhoneForm.phone"
                  placeholder="请输入手机号码"
                  name="phone"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>
              <el-tooltip v-model="capsTooltip" content="密码明文查看" placement="right" manual>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginPhoneForm.password"
                    :type="passwordType"
                    placeholder="请填写密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>
              <el-button type="primary" @click.native.prevent="phoneLogin">登 录</el-button>
              <span style="font-size:13px;cursor:pointer;color:#9b9ea0;text-decoration:none;position: absolute;right:20px;padding-top:20px;" @click="forgetPwd">忘记密码</span>

              <!-- <el-row>
                <el-col :span="24" style="text-align:right;margin-top:-20px">
                  <span style="font-size:13px;cursor:pointer;color:#9b9ea0;text-decoration:none" @click="forgetPwd">忘记密码</span></el-col>
              </el-row> -->
              <el-row>
                <el-col :span="24" style="text-align:center;padding-top:25px">
                  <span style="font-size:12px;cursor:pointer;color:#9b9ea0;text-decoration:none">
                    登录并使用“环测链”即为同意<a href="https://www.jshengzheng.com/aggrement" target="_blank" style="color:#1890FF">《用户协议》</a>和
                    <a href="https://www.jshengzheng.com/privacyPolicy" target="_blank" style="color:#1890FF">《隐私政策》</a>
                  </span>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog
      title="忘记密码"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      center
    >
      <p> 机构员工遗失密码，请联系本机构管理员进行密码重置；</p>
      <p>机构管理员遗失密码，请联系平台客服，QQ：2546125360，并提供相关身份证明材料。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginPhoneForm: {
        phone: '',
        password: ''
      },
      tabPosition: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名称' }],
        password: [{ required: true, trigger: 'blur', message: '请录入密码' }]
      },
      loginPhoneRules: {
        phone: [{ required: true, trigger: 'blur', message: '请输入手机号码' }],
        password: [{ required: true, trigger: 'blur', message: '请录入密码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      dialogVisible: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              debugger
              this.$router.push({ path: '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    phoneLogin() {
      this.$refs.loginPhoneForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/phoneLogin', this.loginPhoneForm)
            .then(() => {
              debugger
              this.$router.push({ path: '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    forgetPwd() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:#000;
$cursor: #858585;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    line-height: 44px;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 44px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 6px 5px 12px 15px;
      border-bottom: 1px solid #e0e0e0;
      color: $light_gray;
      height: 44px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:rgb(29, 27, 27);
  $light_gray:#eee;

  .login-container {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../../assets/image/login/login_bg.png') no-repeat center ;
    background-size: 100%;
    content: "";
    z-index: 0;

    .bg-opacity {
      padding-bottom: 10px;
      background-color: rgba(0,0,0,.3);
    }
    .logo {
        position: relative;
        width: 266px;
        height: 110px;
        margin:0 auto 20px;
        background: url('../../assets/image/login/logo_white.png') no-repeat center;
        background-size: 100% 100%;
    }
    .logo:after {
        position: absolute;
        content: "";
        left: -15%;
        bottom: 0;
        height: 1px;
        width: 130%;
        border-bottom: 1px solid #fff;
    }
    .logo + .title {
      width: 340px;
      height: 44px;
      margin: 0 auto;
      background: url('../../assets/image/login/login_title.png') no-repeat center;
      background-size: 100% 100%;
      color: white;
      // font-size: 24px;
      // letter-spacing: 4px
    }
    .login-content {
      overflow: hidden;
      height: 100%;
    }

  .card-container{
    width: 500px;
    margin: 0 auto;
    padding:0 auto;
  }
  .el-card{
    // padding: 5px 10px 0px 0px;
    padding: 0px;
  }
  >>>.el-card__body {
     padding: 0px;
     .el-tabs__item {
       width: 250px;
     }
  }
  .login-form {
    display: block;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0px 15px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 0px 6px 5px;
    margin-bottom: -10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    .svgImg {
        width: 1em;
        height: 1em;
        vertical-align: -0.16em;
        fill: currentColor;
        overflow: hidden;
    }
  }

  .title-container {
    .title {
      color: #7E7E7E;
      text-align: center;
      letter-spacing: -0.05em;
      line-height: 20px;
      font-weight: 500;
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
      margin-bottom: 10px;
    }
    h1.title:before, h1.title:after {
      content: "";
      height: 1px;
      position: absolute;
      top: 37px;
      width: 35%;
    }
    h1.title:before {
      background: rgb(126,126,126);
      background: -moz-linear-gradient(to left,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -webkit-linear-gradient(to left,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -moz-linear-gradient(to left,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -ms-linear-gradient(to left,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: linear-gradient(to left,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      left: 0px;
    }
    h1.title:after {
      background: rgb(126,126,126);
      background: -moz-linear-gradient(to right,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -webkit-linear-gradient(to right,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -moz-linear-gradient(to right,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: -ms-linear-gradient(to right,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      background: linear-gradient(to right,rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
      right: 0px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .login-wrap {
    position: absolute;
    top: 90%;
    left: 0;
    right: 0;
    width: 100%;
    height: 418px;
    text-align: center;
    transform: translate(0, -50%);
  }

}
</style>
