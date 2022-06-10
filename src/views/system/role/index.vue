<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 170px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          style="width: 170px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          style="width: 170px"
        >
          <el-option
            v-for="item in Object.keys(ROLE_STATUS)"
            :key="item"
            :label="ROLE_STATUS[item]"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row> -->
    <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="smal"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col> -->
    <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col> -->
    <!-- <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>-->

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="55" label="序号" align="center" />
      <!-- <el-table-column label="角色编号" prop="roleId" width="120" align="center" /> -->
      <el-table-column label="角色名称" prop="roleName" sortable align="center" />
      <!-- <el-table-column label="权限字符" prop="roleKey" align="center" /> -->
      <!-- <el-table-column label="显示顺序" prop="roleSort" width="100" /> -->
      <!-- <el-table-column key="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status?'正常':'停用' }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="创建日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-if="scope.row.roleId !== 1" slot-scope="scope">
          <!-- <el-button
            v-hasPermi="['system:role:menu']"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
          >菜单权限</el-button> -->
          <el-button
            v-hasPermi="['system:role:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <!-- <el-button
            v-hasPermi="['system:role:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button> -->

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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" disabled />
        </el-form-item>
        <!-- <el-form-item label="权限字符" prop="roleKey">
          <span slot="label">
            权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item> -->
        <!-- <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" style="width: 200px;" />
        </el-form-item> -->
        <el-form-item label="数据权限">
          <el-select v-model="form.dataScope" style="width: 200px;">
            <el-option
              v-for="item in Object.keys(AUTH_STATUS)"
              :key="item"
              :label="AUTH_STATUS[item]"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in Object.keys(ROLE_STATUS)"
              :key="item"
              :label="item"
            >{{ ROLE_STATUS[item] }}</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>

          <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :check-strictly="!menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from '@/api/system/role'
import { menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'
// import { roleMenuTreeselect } from '@/api/system/dept'

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const ROLE_STATUS = {
  '0': '正常',
  '1': '停用'
}
const AUTH_STATUS = {
  '1': '所有数据权限',
  // '2': '本部门数据权限',
  '3': '本部门及以下数据权限',
  '4': '仅本人数据权限'
}
export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      ROLE_STATUS,
      AUTH_STATUS,
      // 遮罩层
      loading: true,
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuNodeAll: false,

      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 选择控制
      menuCheckStrictly: true,
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 20,
        roleName: '',
        roleKey: '',
        status: ''
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.queryParams).then(
        response => {
          this.roleList = response.result.records || []
          this.total = response.result.total
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.result
      })
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      // deptTreeselect().then(response => {
      //   this.deptOptions = response.data
      // })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的部门节点
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.result.treeSelect
        return response.result
      })
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      // return roleDeptTreeselect(roleId).then(response => {
      //   this.deptOptions = response.depts
      //   return response
      // })
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.roleId, row.status)
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.menuNodeAll = false
      this.form = {
        roleId: undefined,
        roleName: '',
        roleKey: '',
        roleSort: 0,
        status: '0',
        menuIds: [],
        dataScope: '',
        remark: ''
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
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleDataScope':
          this.handleDataScope(row)
          break
        case 'handleAuthUser':
          this.handleAuthUser(row)
          break
        default:
          break
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      this.menuCheckStrictly = !!value
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      getRole(roleId).then(response => {
        this.form = response.result
        this.$delete(this.form, 'createTime')
        this.$delete(this.form, 'updateTime')
        this.$delete(this.form, 'delFlag')
        this.open = true
        this.$nextTick(() => {
          roleMenu.then(res => {
            const checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
        this.title = '修改角色'
      })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset()
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
      getRole(row.roleId).then(response => {
        this.form = response.data
        this.openDataScope = true
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys)
          })
        })
        this.title = '分配数据权限'
      })
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId
      this.$router.push('/auth/user/' + roleId)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId !== undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then(response => {
          this.msgSuccess('修改成功')
          this.openDataScope = false
          this.getList()
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoading = true
        return exportRole(queryParams)
      }).then(response => {
        this.download(response.msg)
        this.exportLoading = false
      }).catch(() => {})
    }
  }
}
</script>
