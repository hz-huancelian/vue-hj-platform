(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a5cf6d98"],{"0a37":function(t,e,o){t.exports=o.p+"static/img/shoujitianchong.59da20d4.png"},"119d":function(t,e,o){},2017:function(t,e,o){"use strict";o("d8d0")},"2b1d":function(t,e,o){"use strict";o("119d")},"9ed6":function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"login-container ng-scope"},[s("div",{staticClass:"login-wrap"},[t._m(0),s("el-card",{staticClass:"card-container"},[s("el-tabs",{staticStyle:{height:"350px"},attrs:{type:"card","tab-position":t.tabPosition}},[s("el-tab-pane",[s("span",{staticStyle:{width:"248px"},attrs:{slot:"label"},slot:"label"},[s("i",{staticClass:"el-icon-user"}),t._v(" 账号登录")]),s("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:t.loginForm,rules:t.loginRules,autocomplete:"on","label-position":"left"}},[s("div",{staticClass:"title-container"},[s("h1",{staticClass:"title"},[t._v("登录")])]),s("el-form-item",{attrs:{prop:"username"}},[s("span",{staticClass:"svg-container"},[s("svg-icon",{attrs:{"icon-class":"user"}})],1),s("el-input",{ref:"username",attrs:{placeholder:"请输入账号",name:"username",type:"text",tabindex:"1","auto-complete":"on"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username",e)},expression:"loginForm.username"}})],1),s("el-tooltip",{attrs:{content:"密码明文查看",placement:"right",manual:""},model:{value:t.capsTooltip,callback:function(e){t.capsTooltip=e},expression:"capsTooltip"}},[s("el-form-item",{attrs:{prop:"password"}},[s("span",{staticClass:"svg-container"},[s("svg-icon",{attrs:{"icon-class":"password"}})],1),s("el-input",{key:t.passwordType,ref:"password",attrs:{type:t.passwordType,placeholder:"请填写密码",name:"password",tabindex:"2",autocomplete:"on"},on:{blur:function(e){t.capsTooltip=!1}},nativeOn:{keyup:function(e){return t.checkCapslock(e)}},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password",e)},expression:"loginForm.password"}}),s("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[s("svg-icon",{attrs:{"icon-class":"password"===t.passwordType?"eye":"eye-open"}})],1)],1)],1),s("el-button",{attrs:{type:"primary"},nativeOn:{click:function(e){return e.preventDefault(),t.handleLogin(e)}}},[t._v("登 录")]),s("span",{staticStyle:{"font-size":"13px",cursor:"pointer",color:"#9b9ea0","text-decoration":"none",position:"absolute",right:"20px","padding-top":"20px"},on:{click:t.forgetPwd}},[t._v("忘记密码")]),s("el-row",[s("el-col",{staticStyle:{"text-align":"center","padding-top":"25px"},attrs:{span:24}},[s("span",{staticStyle:{"font-size":"12px",cursor:"pointer",color:"#9b9ea0","text-decoration":"none"}},[t._v("\n                  登录并使用“环测链”即为同意"),s("a",{staticStyle:{color:"#1890FF"},attrs:{href:"https://www.jshengzheng.com/aggrement",target:"_blank"}},[t._v("《用户协议》")]),t._v("和\n                  "),s("a",{staticStyle:{color:"#1890FF"},attrs:{href:"https://www.jshengzheng.com/privacyPolicy",target:"_blank"}},[t._v("《隐私政策》")])])])],1)],1)],1),s("el-tab-pane",[s("span",{staticStyle:{width:"249px"},attrs:{slot:"label"},slot:"label"},[s("i",{staticClass:"el-icon-phone"}),t._v(" 手机号登录")]),s("el-form",{ref:"loginPhoneForm",staticClass:"login-form",attrs:{model:t.loginPhoneForm,rules:t.loginPhoneRules,autocomplete:"on","label-position":"left"}},[s("div",{staticClass:"title-container"},[s("h1",{staticClass:"title"},[t._v("登录")])]),s("el-form-item",{attrs:{prop:"username"}},[s("span",{staticClass:"svg-container"},[s("img",{staticClass:"svgImg",attrs:{src:o("0a37")}})]),s("el-input",{ref:"phone",attrs:{placeholder:"请输入手机号码",name:"phone",type:"text",tabindex:"1","auto-complete":"on"},model:{value:t.loginPhoneForm.phone,callback:function(e){t.$set(t.loginPhoneForm,"phone",e)},expression:"loginPhoneForm.phone"}})],1),s("el-tooltip",{attrs:{content:"密码明文查看",placement:"right",manual:""},model:{value:t.capsTooltip,callback:function(e){t.capsTooltip=e},expression:"capsTooltip"}},[s("el-form-item",{attrs:{prop:"password"}},[s("span",{staticClass:"svg-container"},[s("svg-icon",{attrs:{"icon-class":"password"}})],1),s("el-input",{key:t.passwordType,ref:"password",attrs:{type:t.passwordType,placeholder:"请填写密码",name:"password",tabindex:"2",autocomplete:"on"},on:{blur:function(e){t.capsTooltip=!1}},nativeOn:{keyup:function(e){return t.checkCapslock(e)}},model:{value:t.loginPhoneForm.password,callback:function(e){t.$set(t.loginPhoneForm,"password",e)},expression:"loginPhoneForm.password"}}),s("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[s("svg-icon",{attrs:{"icon-class":"password"===t.passwordType?"eye":"eye-open"}})],1)],1)],1),s("el-button",{attrs:{type:"primary"},nativeOn:{click:function(e){return e.preventDefault(),t.phoneLogin(e)}}},[t._v("登 录")]),s("span",{staticStyle:{"font-size":"13px",cursor:"pointer",color:"#9b9ea0","text-decoration":"none",position:"absolute",right:"20px","padding-top":"20px"},on:{click:t.forgetPwd}},[t._v("忘记密码")]),s("el-row",[s("el-col",{staticStyle:{"text-align":"center","padding-top":"25px"},attrs:{span:24}},[s("span",{staticStyle:{"font-size":"12px",cursor:"pointer",color:"#9b9ea0","text-decoration":"none"}},[t._v("\n                  登录并使用“环测链”即为同意"),s("a",{staticStyle:{color:"#1890FF"},attrs:{href:"https://www.jshengzheng.com/aggrement",target:"_blank"}},[t._v("《用户协议》")]),t._v("和\n                  "),s("a",{staticStyle:{color:"#1890FF"},attrs:{href:"https://www.jshengzheng.com/privacyPolicy",target:"_blank"}},[t._v("《隐私政策》")])])])],1)],1)],1)],1)],1)],1),s("el-dialog",{attrs:{title:"忘记密码",visible:t.dialogVisible,width:"30%","append-to-body":"",center:""},on:{"update:visible":function(e){t.dialogVisible=e}}},[s("p",[t._v(" 机构员工遗失密码，请联系本机构管理员进行密码重置；")]),s("p",[t._v("机构管理员遗失密码，请联系平台客服，QQ：2546125360，并提供相关身份证明材料。")]),s("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),s("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dialogVisible=!1}}},[t._v("确 定")])],1)])],1)},n=[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"bg-opacity"},[o("div",{staticClass:"logo"}),o("div",{staticClass:"title"})])}],a=(o("ac6a"),o("456d"),{name:"Login",data:function(){return{loginForm:{username:"",password:""},loginPhoneForm:{phone:"",password:""},tabPosition:"",loginRules:{username:[{required:!0,trigger:"blur",message:"请输入用户名称"}],password:[{required:!0,trigger:"blur",message:"请录入密码"}]},loginPhoneRules:{phone:[{required:!0,trigger:"blur",message:"请输入手机号码"}],password:[{required:!0,trigger:"blur",message:"请录入密码"}]},passwordType:"password",capsTooltip:!1,loading:!1,redirect:void 0,otherQuery:{},dialogVisible:!1}},watch:{$route:{handler:function(t){var e=t.query;e&&(this.redirect=e.redirect,this.otherQuery=this.getOtherQuery(e))},immediate:!0}},created:function(){},mounted:function(){""===this.loginForm.username?this.$refs.username.focus():""===this.loginForm.password&&this.$refs.password.focus()},methods:{checkCapslock:function(t){var e=t.key;this.capsTooltip=e&&1===e.length&&e>="A"&&e<="Z"},showPwd:function(){var t=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick((function(){t.$refs.password.focus()}))},handleLogin:function(){var t=this;this.$refs.loginForm.validate((function(e){if(!e)return console.log("error submit!!"),!1;t.loading=!0,t.$store.dispatch("user/login",t.loginForm).then((function(){t.$router.push({path:"/",query:t.otherQuery}),t.loading=!1})).catch((function(){t.loading=!1}))}))},phoneLogin:function(){var t=this;this.$refs.loginPhoneForm.validate((function(e){if(!e)return console.log("error submit!!"),!1;t.loading=!0,t.$store.dispatch("user/phoneLogin",t.loginPhoneForm).then((function(){t.$router.push({path:"/",query:t.otherQuery}),t.loading=!1})).catch((function(){t.loading=!1}))}))},getOtherQuery:function(t){return Object.keys(t).reduce((function(e,o){return"redirect"!==o&&(e[o]=t[o]),e}),{})},forgetPwd:function(){this.dialogVisible=!0}}}),i=a,r=(o("2017"),o("2b1d"),o("2877")),l=Object(r["a"])(i,s,n,!1,null,"57fac890",null);e["default"]=l.exports},d8d0:function(t,e,o){}}]);