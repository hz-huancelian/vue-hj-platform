<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="角色名称:">
            <el-input v-model="searchForm.roleName" style="width:165px" placeholder="角色名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-plus" @click="handleCreate">新增</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        stripe
        :data="roleData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无角色,
              </span>
              <el-button type="text" size="small" style="font-size:14px;" @click="handleCreate">新建用户角色</el-button>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="roleName" label="角色名称" align="center" />
        <el-table-column prop="platformPositionName" label="平台岗位" align="center" />
        <el-table-column prop="roleDesc" label="角色描述" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleRelation(scope.row)">关联菜单</el-button>
            <div class="erc-divider-vertical" />
            <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <div class="erc-divider-vertical" />
            <el-button type="text" @click="handleDelete(scope.row.roleId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>

    <el-dialog :title="titleMap[roleDialogStatus]" :visible.sync="roleDialogVisible" width="50%">
      <div style="width: 550px;margin:0 auto;">
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="130px">
          <el-form-item prop="roleName" label="岗位:">
            <el-input v-model="roleForm.roleName" placeholder="岗位" maxlength="8" show-word-limit style="width: 70%;" />
          </el-form-item>
          <el-form-item prop="platformPositionId" label="角色:">
            <el-select v-model="roleForm.platformPositionId" placeholder="角色" style="width: 70%;">
              <el-option
                v-for="item in Object.keys(positionArray)"
                :key="item"
                :label="positionArray[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="roleDesc" label="岗位描述:">
            <el-input v-model="roleForm.roleDesc" type="textarea" :rows="2" maxlength="50" show-word-limit placeholder="岗位描述" style="width: 70%;" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配菜单权限" :visible.sync="permissionsVisible">
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :data="routesData"
        :props="defaultProps"
        show-checkbox
        node-key="path"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionsVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermissions">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as roleServer from '@/api/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import { getDicKey } from '@/api/dict'
import { asyncRoutes } from '@/router'
import path from 'path'
export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      roleData: [],
      searchForm: {
        roleName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      titleMap: {
        edit: '修改角色',
        create: '新增角色'
      },
      roleForm: {
        roleId: '',
        roleName: '',
        platformPositionId: '',
        roleDesc: ''
      },
      roleRules: {
        roleName: [{ required: true, message: '请录入角色名称', trigger: 'blur' }],
        platformPositionId: [{ required: true, message: '请关联岗位', trigger: 'change' }]
      },
      roleDialogStatus: 'create',
      roleDialogVisible: false,
      permissionsVisible: false,
      checkStrictly: false,
      routes: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      currentItem: {},
      positionArray: []

    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getDicKey('positionArray', 1003)
    this.handleSearch()
    this.getRoutes()
  },
  methods: {
    getDicKey(type, code) {
      getDicKey(code).then(result => {
        if (result.code === 200) {
          this[type] = result.result
        }
      })
    },
    getRoutes() {
      const newRoutes = asyncRoutes
      this.routes = this.generateRoutes(newRoutes)
    },
    handleSearch() {
      roleServer.getRoleList(this.searchForm).then(res => {
        if (res.code === 200) {
          this.roleData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    // 重置
    handleCreate() {
      this.clearForm()
      this.roleDialogStatus = 'create'

      if (this.$refs.roleForm !== undefined) {
        this.$refs.roleForm.resetFields()
      }
      this.roleDialogVisible = true
    },
    handleUpdate(row) {
      if (this.$refs.roleForm !== undefined) {
        this.$refs.roleForm.resetFields()
      }
      this.roleForm.roleId = row.roleId
      this.roleForm.roleName = row.roleName || ''
      this.roleForm.platformPositionId = row.platformPositionId || ''
      this.roleForm.roleDesc = row.roleDesc || ''
      this.roleDialogStatus = 'edit'
      this.roleDialogVisible = true
    },
    confirmDialog() {
      if (this.roleDialogStatus === 'create') {
        this.confirmCreate()
      } else {
        this.confirmUpdate()
      }
    },
    confirmCreate() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          roleServer.addRoleInfo(this.roleForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.roleDialogVisible = false
            this.$refs.roleForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    confirmUpdate() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          roleServer.updRoleInfo(this.roleForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.roleDialogVisible = false
            this.$refs.roleForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleServer.delRolePerms(id).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
    },
    clearForm() {
      this.roleForm = {
        roleId: '',
        roleName: '',
        platformPositionId: '',
        roleDesc: ''
      }
    },
    handleRelation({ roleId, roleName, rolesDesc }) {
      this.currentItem = { roleId, roleName, rolesDesc }
      roleServer.findPermsByRoleId(roleId).then(res => {
        if (res.code === 200) {
          const result = res.result || []
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(result)
          })
        }
      })
      this.permissionsVisible = true
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }
        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },

    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    confirmPermissions() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()

      const params = {
        roleId: this.currentItem.roleId,
        permUrls: checkedKeys
      }
      roleServer.saveRolePerms(params).then(result => {
        if (result.code === 200) {
          this.$notify({
            title: '成功',
            message: result.message,
            type: 'success'
          })
          this.resetChecked()
          this.permissionsVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: result.message,
            type: 'error'
          })
        }
      }).catch(() => {})
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      // 原始数据被修改 这里传入数据要深拷贝
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    }

  }
}
</script>

<style scoped lang="scss" type="text/scss">
  .search_div {
    >div {
      &:nth-child(1){
        margin-right: 10px;
      }
      display: inline-block;
    }
  }

  .search_input {
    width: 200px;
    margin-bottom: 5px;
  }
  .search-right {
    text-align: right;
    padding-right: 25px;
  }
</style>
