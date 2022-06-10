<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-card class="card-left" shadow="never">
          <el-input
            v-model="filterText"
            placeholder="输入名称"
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="positionTreeData"
            :props="defaultProps"
            highlight-current
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="onSelectDepart"
          />
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card class="card-right" shadow="never">
          <el-form :inline="true">
            <el-row>
              <el-col :span="24" class="search-right">
                <el-button v-if="currentPosId && currentPosId !== '-1001'" type="text" icon="el-icon-plus" @click="handleCreate">新增</el-button>
                <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div>
            <el-table
              stripe
              :data="positionData"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%"
            >
              <template slot="empty">
                <div class="table_empty">
                  <div class="empty_tips">
                    <span>
                      暂无岗位
                    </span>
                  </div>
                </div>
              </template>
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="positionName" label="岗位名称" align="center" />
              <el-table-column prop="roleName" label="关联角色" align="center" />
              <el-table-column prop="positionDesc" label="岗位描述" align="center" />
              <el-table-column prop="parentName" label="上级岗位" align="center" />
              <el-table-column fixed="right" align="center" width="170px" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleRelation(scope.row)">关联角色</el-button>
                  <div class="erc-divider-vertical" />
                  <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                  <div class="erc-divider-vertical" />
                  <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="titleMap[positionDialogStatus]" :visible.sync="positionVisible" center>
      <div style="width: 400px;margin:0 auto;">
        <el-form ref="positionForm" :model="positionForm" :rules="positionRules" label-width="90px">
          <el-form-item prop="positionName" label="部门名称:">
            <el-input v-model="positionForm.positionName" placeholder="请录入部门名称" />
          </el-form-item>
          <el-form-item label="部门描述:">
            <el-input v-model="positionForm.positionDesc" type="textarea" :rows="2" maxlength="50" show-word-limit placeholder="请录入部门描述" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="positionVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDepart">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联角色" :visible.sync="roleVisible" center>
      <div style="width: 500px;margin:0 auto;">
        <el-form :model="posRelationForm" label-width="100px">
          <el-form-item label="角色关联:">
            <el-select v-model="posRelationForm.roleIds" clearable multiple placeholder="请选择角色" style="width:280px">
              <el-option
                v-for="(item, index) in roleRelations"
                :key="index"
                :value="item.roleId"
                :label="item.roleName"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRelation">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as positionServer from '@/api/dept'
import * as roleServer from '@/api/role'
export default {
  name: 'PositionList',
  data() {
    return {
      positionTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'positionName',
        id: 'id'
      },
      titleMap: {
        edit: '修改岗位',
        create: '新增岗位'
      },
      positionDialogStatus: 'create',
      currentPosId: '',
      currentPosName: '',
      positionData: [],
      filterText: '',
      positionVisible: false,
      positionForm: {
        parentPositionId: '',
        positionId: '',
        positionName: '',
        positionDesc: ''
      },
      positionRules: {
        positionName: [{ required: true, message: '岗位名称', trigger: 'blur' }]
      },
      currentTreeItem: {},
      positionName: '',
      currentNode: {},
      currentResolve: {},
      roleVisible: false,
      posRelationForm: {
        positionId: '',
        roleIds: []
      },
      roleRelations: []

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.findPositionTreeList()
    this.getRoleList()
  },
  methods: {
    findPositionTreeList() {
      this.positionTreeData = []
      positionServer.findPositionTreeList().then(res => {
        const resObj = res.result || {}
        this.positionTreeData.push(resObj)
      })
    },
    filterNode(value, data) {
      if (!value) return true

      return data.positionName.indexOf(value) !== -1
    },
    getRoleList() {
      roleServer.findRoleList().then(res => {
        this.roleRelations = res.result || []
      })
    },
    loadNode(node, resolve) {
      this.currentNode = node
      this.currentResolve = resolve
      const obj = node.data
      this.currentPosId = obj.id
      this.currentPosName = obj.positionName
      if (node.level === 0) {
        return resolve([{
          id: -1001,
          positionName: this.$store.getters.userInfo.organName || '当前机构',
          children: []
        }])
      }
      if (this.currentPosId) {
        this.positionData = []
        positionServer.findSubPositionListByParentId(this.currentPosId).then(res => {
          if (res.code === 200 && res.result) {
            this.positionData = res.result.map(i => {
              return { ...i, parentName: this.currentPosName }
            }) || []
            resolve(res.result)
          } else {
            resolve([])
          }
        }).catch(() => {
          resolve([])
        })
      } else {
        resolve([])
      }
    },
    addNode() {
      this.currentNode.children = []
      this.loadNode(this.currentNode, this.currentResolve)
    },
    onSelectDepart(even) {
      if (even.id === this.currentPosId) {
        return
      }
      this.currentPosId = even.id
      this.currentPosName = even.positionName
      this.$nextTick(() => {
        this.handleSearch()
      })
    },
    confirmDepart() {
      this.$refs.positionForm.validate(valid => {
        if (valid) {
          if (this.positionDialogStatus === 'create') {
            const params = {
              parentPositionId: this.positionForm.parentPositionId,
              positionName: this.positionForm.positionName,
              positionDesc: this.positionForm.positionDesc
            }
            positionServer.saveDeptPositions(params).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                this.findPositionTreeList()
                this.positionVisible = false
              }
            })
          } else {
            const params = {
              positionId: this.positionForm.positionId,
              positionName: this.positionForm.positionName,
              positionDesc: this.positionForm.positionDesc
            }
            positionServer.updateDeptPositions(params).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                this.findPositionTreeList()
                this.positionVisible = false
              }
            })
          }
        }
      })
    },
    handleSearch() {
      this.positionData = []
      positionServer.findSubPositionListByParentId(this.currentPosId).then(res => {
        if (res.code === 200 && res.result) {
          this.positionData = res.result.map(i => {
            return { ...i, parentName: this.currentPosName }
          }) || []
        }
      }).catch(() => {
      })
    },
    // 重置
    handleCreate() {
      this.clearForm()
      this.positionForm.parentPositionId = this.currentPosId
      this.positionDialogStatus = 'create'
      this.positionVisible = true
    },
    handleUpdate(row) {
      this.clearForm()
      this.positionForm.positionId = row.id
      this.positionForm.positionName = row.positionName || ''
      this.positionForm.positionDesc = row.positionDesc || ''
      this.positionDialogStatus = 'edit'
      this.positionVisible = true
    },
    handleDelete(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        positionServer.delPositionById(id).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.findPositionTreeList()
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
    handleRelation(row) {
      this.posRelationForm.positionId = row.id
      this.posRelationForm.roleIds = row.roleIds
      this.roleVisible = true
    },
    confirmRelation() {
      if (this.posRelationForm.roleIds && this.posRelationForm.roleIds.length > 0) {
        positionServer.savePositionRoles(this.posRelationForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.roleVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      } else {
        this.$message.error('角色选择不能为空')
      }
    },
    clearForm() {
      this.positionForm = {
        parentPositionId: '',
        positionId: '',
        positionName: '',
        positionDesc: ''
      }
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
  .info-container {
    padding: 0;
    margin: 0;
    height: auto;
    width: 100%;
  }
  .card-left {
    width: 100%;
    min-height: 600px;
  }
  .card-right {
    width: 100%;
    min-height: 600px;
  }
  .card-right {
    right: 0px;
    width: 100%;
    height: 100%;
  }
  .filter-tree {
    margin-top: 15px;
    line-height: 10px;;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
