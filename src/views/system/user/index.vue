<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px;"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-row>
          <el-col :span="18">

            <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
              <el-form-item label="员工姓名" prop="empName">
                <el-input
                  v-model="queryParams.empName"
                  placeholder="请输入"
                  clearable
                  style="width: 120px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input
                  v-model="queryParams.phonenumber"
                  placeholder="请输入"
                  clearable
                  style="width: 120px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="状态"
                  clearable
                  style="width: 100px"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            <el-button type="text" size="small" icon="el-icon-upload2" @click="handleUpload">批量导入</el-button>
            <el-button type="text" size="small" icon="el-icon-download" @click="handleDownload">导出</el-button>
            <el-button type="text" size="small" icon="el-icon-refresh" @click="handleQuery">刷新</el-button>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="small"
              @click="handleAdd"
            >新增</el-button>
            <el-button
              type="primary"
              plain
              icon="el-icon-download"
              size="small"
              @click="handleDownload"
            >导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" :columns="columns" @queryTable="getList" />
        </el-row> -->

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column label="员工工号" align="center" prop="empCode" :show-overflow-tooltip="true" />
          <el-table-column label="员工姓名" align="center" prop="empName" :show-overflow-tooltip="true" />
          <el-table-column label="登录账号" align="center" width="100px" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
          <el-table-column label="岗位" align="center" prop="postNames" :show-overflow-tooltip="true" />
          <el-table-column label="角色" align="center" prop="roleNames" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==='0'?'success':'danger'">{{ scope.row.status==='0'?'正常':'停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="columns[6].visible" label="创建日期" align="center" prop="createTime" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template v-if="scope.row.deptId !== '-1'" slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置密码</el-button> -->
              <el-button
                v-if="scope.row.status==='0'"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >注销</el-button>
              <el-button
                v-if="scope.row.status==='1'"
                size="mini"
                type="text"
                icon="el-icon-success"
                @click="handleOnline(scope.row)"
              >启用</el-button>
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
                <span class="el-dropdown-link" style="font-size:12px;">
                  <i class="el-icon-d-arrow-right el-icon--right" />更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleResetPwd"
                    icon="el-icon-key"
                  >重置密码</el-dropdown-item>
                  <!-- <el-dropdown-item
                    command="handleAuthRole"
                    icon="el-icon-circle-check"
                  >分配角色</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNumber"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="720px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="员工工号" prop="empCode">
              <el-input v-model="form.empCode" placeholder="请输入员工工号" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="empName">
              <el-input v-model="form.empName" placeholder="请输入姓名" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item>
              <span slot="label">
                岗位
                <el-popover
                  placement="top-start"
                  title=""
                  width="400"
                  trigger="hover"
                  content="岗位是员工在公司里的内部职称，一个员工对应一个岗位，岗位名称可以任意命名，员工岗位与权限没有任何关联。"
                >
                  <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                </el-popover>
              </span>
              <el-select v-model="postId" placeholder="请选择" @change="getPostInfo">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <span slot="label">
                角色
                <el-popover
                  placement="top-start"
                  title=""
                  width="300"
                  trigger="hover"
                  content="角色是平台内设定的统一固定称谓，一个员工可以对应多个角色，
                  也就是说可以同时拥有多个角色的权限，以解决某些员工身兼数职的问题。
                  角色名称是系统默认固定的，但是角色的数据权限和菜单权限管理员可以进行更改，
                  请根据需要谨慎更改。平台后期可能新增角色，但不会对现有角色进行修改，
                  若点击恢复默认权限，则会恢复到平台给予当前角色的默认权限。"
                >
                  <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                </el-popover>
              </span>
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="isAppLogin">
              <span slot="label">
                小程序
                <el-popover
                  placement="top-start"
                  title=""
                  width="300"
                  trigger="hover"
                  content="允许采样组长/采样员通过手机端进行现场采样录样操作，如果员工的角色含有采样组长或采样员，建议打开允许按钮"
                >
                  <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                </el-popover>
              </span>
              <el-switch
                v-model="form.isAppLogin"
                active-text="允许"
                inactive-text="不允许"
                active-value="1"
                inactive-value="0"
                @change="switchChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.isAppLogin==1" label="小程序角色" prop="appRoles">
              <el-select v-model="form.appRoles" multiple clearable>
                <el-option
                  v-for="item in dataAppOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入员工" :visible.sync="uploadVisible" append-to-body>
      <div class="block">
        <el-timeline>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              1
            </span>
            <el-row>
              <el-col :span="24">
                下载模板，批量填写员工信息
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-button size="mini" type="primary" @click="downloadTem()">模板下载</el-button>
              </el-col>
            </el-row>
          </el-timeline-item>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              2
            </span>
            <el-row>
              <el-col :span="24">
                上传填写好的员工信息表格
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-upload
                  class="upload-demo"
                  action="/api/dataImport/uploadEmployee"
                  :on-change="uploadChange"
                  :file-list="excelFileList"
                  accept=".xlsx,.xls"
                  :limit="1"
                  style="width: 300px;"
                >
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
                  <div slot="tip" class="el-upload__tip" style="color:red;">您只能上传.xlsx,.xls格式的文件</div>
                </el-upload>
              </el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
        <el-row>
          <el-col :span="24" style="">
            <span style="color:red; font-size: 13px">备注：批量导入员工功能，只会将上传的员工信息列表内的员工新增到系统内，不对原有员工信息做任何替换或修改</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, addUser, updateUser, resetOriganPassword, changeUserStatus, invalidUserByUserId, onlineUserByUserId } from '@/api/system/user'
import * as deptServer from '@/api/dept'
import { selectPostAll } from '@/api/system/post'
import { getAllRole } from '@/api/system/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        { dictLabel: '正常', dictValue: '0' },
        { dictLabel: '停用', dictValue: '1' }
      ],
      // 性别状态字典
      sexOptions: [
        { dictLabel: '男', dictValue: '0' },
        { dictLabel: '女', dictValue: '1' }
      ],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id'
      },
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10,
        empName: '',
        phonenumber: '',
        deptId: undefined
      },
      dataAppOptions: [
        {
          value: '1',
          label: '采样组长'
        },
        {
          value: '2',
          label: '采样员'
        }
        // {
        //   value: '3',
        //   label: '样品管理员'
        // },
        // {
        //   value: '4',
        //   label: '检测员'
        // }
      ],
      postId: '',
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户账号`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        empCode: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        empName: [
          { required: true, message: '真实名称不能为空', trigger: 'blur' }
        ],
        email: [
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
      },

      excelFileList: [],
      uploadVisible: false
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    this.getPostAndRoleList()
    // this.getDicts('sys_normal_disable').then(response => {
    //   this.statusOptions = response.data
    // })
    // this.getDicts('sys_user_sex').then(response => {
    //   this.sexOptions = response.data
    // })
    // this.getConfigKey('sys.user.initPassword').then(response => {
    //   this.initPassword = response.msg
    // })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(response => {
        this.userList = response.result.records
        this.total = response.result.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      this.deptOptions = []
      deptServer.treeselect().then(res => {
        this.deptOptions = this.doProcessDept(res.result) || []
      })
    },
    doProcessDept(depts) {
      const res = []
      depts.forEach(e => {
        const tmp = { ...e }
        if (tmp.children && tmp.children.length > 0) {
          tmp.children = this.doProcessDept(tmp.children)
        } else {
          tmp.children = undefined
        }
        res.push(tmp)
      })
      return res
    },
    // treeselect().then(response => {
    //   this.deptOptions = response.data
    // })
    // },
    // 筛选节点
    getPostInfo() {
      this.form.postIds = []
      this.form.postIds.push(this.postId)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.parentId !== '0') {
        this.queryParams.deptId = data.id
      } else {
        this.queryParams.deptId = ''
      }
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        empCode: '',
        empName: '',
        phonenumber: '',
        email: '',
        sex: '',
        status: '0',
        isAppLogin: '0',
        appRoles: [],
        remark: '',
        postIds: [],
        roleIds: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNumber = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleAuthRole':
          this.handleAuthRole(row)
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加员工信息'
    },
    getPostAndRoleList() {
      selectPostAll().then(res => {
        this.postOptions = res.result || []
      })
      getAllRole().then(res => {
        this.roleOptions = res.result || []
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      const userId = row.userId
      getUser(userId).then(res => {
        this.form = res.result.user
        this.postId = res.result.checkedPostIds && res.result.checkedPostIds.length > 0 ? res.result.checkedPostIds[0] : ''
        this.$set(this.form, 'postIds', res.result.checkedPostIds)
        this.$set(this.form, 'roleIds', res.result.checkedRoleIds)
        this.$set(this.form, 'appRoles', res.result.appRoles)
        this.$delete(this.form, 'loginIp')
        this.$delete(this.form, 'organId')
        this.$delete(this.form, 'password')
        this.$delete(this.form, 'createTime')
        this.$delete(this.form, 'avatarPath')
        this.$delete(this.form, 'userType')
        this.open = true
        this.title = '修改员工信息'
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$confirm('是否确认重置用户为"' + row.empName + '"的密码?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        resetOriganPassword(row.userId).then(response => {
          this.msgSuccess('重置成功')
        })
      }).catch(() => {})
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId
      this.$router.push('/auth/role/' + userId)
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.isAppLogin === '1' && this.form.appRoles.length === 0) {
        this.msgErrot('小程序角色不能为空')
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId
      this.$confirm('是否确认注销用户为"' + row.empName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return invalidUserByUserId(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('注销成功')
      }).catch(() => {})
    },
    /** 启用 */
    handleOnline(row) {
      const userIds = row.userId
      this.$confirm('是否确认启用该账号', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return onlineUserByUserId(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('注销成功')
      }).catch(() => {})
    },
    switchChange() {
      if (this.form.isAppLogin === '0') this.form.appRoles = []
    },

    handleDownload() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/exportEmployee'
      window.open(url)
    },

    downloadTem() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/downloadEmployeeExcel'
      window.open(url)
    },
    uploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.fileResult = file.response.result
          this.$message({
            type: 'success',
            message: file.response.message
          })
          this.handleQuery()
          this.uploadVisible = false
        } else {
          this.$message.error('上传失败!')
          this.excelFileList = []
        }
      } else {
        this.$message.error('上传失败!')
        this.excelFileList = []
      }
    },
    handleUpload() {
      this.uploadVisible = true
      this.excelFileList = []
    }

  }
}
</script>

<style scoped lang="scss" type="text/scss">
  .time-dot {
    text-align: center;
    justify-content: center;
    padding-top: 4px;
    position: relative;
    border-radius: 50%;
    background: #dfe4ed;
    height: 25px;
    width: 25px;
    left: -7px;
  }
  </style>
