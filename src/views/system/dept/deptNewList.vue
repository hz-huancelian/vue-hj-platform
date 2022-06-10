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
            :data="deptTreeData"
            :props="defaultProps"
            highlight-current
            default-expand-all
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            @node-click="onSelectDepart"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => appendDepart(data)"
                >
                  添加
                </el-button>
                <el-button
                  v-if="data.id !== '-1001'"
                  type="text"
                  size="mini"
                  @click="() => updateDepart(data)"
                >
                  修改
                </el-button>
                <el-button
                  v-if="data.id !== '-1001'"
                  type="text"
                  size="mini"
                  @click="() => removeDepart(node, data)"
                >
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card class="card-right" shadow="never">
          <div slot="header" class="clearfix">
            <span>当前部门: <i class="el-input__icon" /></span>{{ currentDeptName }}
            <el-button style="float: right; margin:4px 2px;" type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
            <el-button v-if="currentDeptId && currentDeptId !== '-1001' && currentDeptId.length > 0" style="float: right; margin:4px 2px;" type="text" icon="el-icon-plus" @click="handlePostCreate">新增岗位</el-button>
          </div>
          <div>
            <el-table
              stripe
              :data="departData"
              border
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%"
            >
              <template slot="empty">
                <div class="table_empty">
                  <div class="empty_tips">
                    <span>
                      暂无部门
                    </span>
                  </div>
                </div>
              </template>
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="positionName" label="岗位名称" align="center" />
              <el-table-column prop="platformPositionVal" label="系统角色" align="center">
                <template slot-scope="{row}">
                  <el-tag>{{ row.platformPositionVal }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="positionDesc" label="岗位描述" align="center" />
              <el-table-column fixed="right" align="center" width="140px" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="handlePostUpdate(scope.row)">编辑</el-button>
                  <div class="erc-divider-vertical" />
                  <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="titleMap[deptDialogStatus]" :visible.sync="departVisible" center>
      <div style="width: 400px;margin:0 auto;">
        <el-form ref="departForm" :model="departForm" :rules="departRules" label-width="110px">
          <el-form-item prop="deptName" label="部门名称:">
            <el-input
              v-model="departForm.deptName"
              placeholder="请录入部门名称"
              maxlength="15"
              show-word-limit
              style="width:90%"
            />
          </el-form-item>
          <el-form-item prop="platformDeptId" label="部门职能:">
            <el-select
              v-model="departForm.platformDeptId"
              style="width:90%"
              placeholder="业务流转权限关联"
            >
              <el-option
                v-for="item in Object.keys(plDeptmentArray)"
                :key="item"
                :label="plDeptmentArray[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门描述:">
            <el-input
              v-model="departForm.deptDesc"
              type="textarea"
              :rows="4"
              maxlength="50"
              show-word-limit
              placeholder="请录入部门描述"
              style="width:90%"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDepart">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="postTitleMap[postDialogStatus]" :visible.sync="postVisible" center>
      <div style="width: 400px;margin:0 auto;">
        <el-form ref="postForm" :model="postForm" :rules="postRules" label-width="110px">
          <el-form-item prop="positionName" label="岗位名称:">
            <el-input
              v-model="postForm.positionName"
              placeholder="请录入岗位名称"
              maxlength="15"
              show-word-limit
              style="width:90%"
            />
          </el-form-item>
          <el-form-item prop="platformDeptId" label="关联系统角色:">
            <el-select
              v-model="postForm.platformPositionId"
              filterable
              placeholder="关联系统角色"
              style="width: 90%;"
            >
              <el-option
                v-for="item in Object.keys(postionArray)"
                :key="item"
                :label="postionArray[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位描述:">
            <el-input
              v-model="postForm.positionDesc"
              type="textarea"
              :rows="4"
              maxlength="50"
              show-word-limit
              placeholder="请录入岗位描述"
              style="width:90%"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="postVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPost">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as deptServer from '@/api/dept'
import * as posiServer from '@/api/position'
import { getDicKey } from '@/api/dict'
export default {
  name: 'DeptList',
  data() {
    return {
      deptTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'deptName',
        id: 'id'
      },
      titleMap: {
        edit: '修改部门',
        create: '新增部门'
      },
      postTitleMap: {
        edit: '修改岗位',
        create: '新增岗位'
      },
      deptDialogStatus: 'create',
      postDialogStatus: 'create',
      currentDeptId: '',
      currentDeptName: '',
      departData: [],
      filterText: '',
      departVisible: false,
      departForm: {
        parentDeptId: '',
        platformDeptId: '',
        deptId: '',
        deptName: '',
        deptDesc: ''
      },
      departRules: {
        deptName: [{ required: true, message: '部门名称', trigger: 'blur' }],
        platformDeptId: [{ required: true, message: '请选择平台流转权限', trigger: 'change' }]
      },
      currentTreeItem: {},
      departName: '',
      roleListArray: [],
      currentNode: {},
      currentResolve: {},
      plDeptmentArray: [],

      postVisible: false,
      postForm: {
        positionId: '',
        platformPositionId: '',
        deptId: '',
        positionName: '',
        positionDesc: ''
      },
      postionArray: {},
      currentPlatformDeptId: '',
      postRules: {
        positionName: [{ required: true, message: '请录入岗位名称', trigger: 'blur' }],
        platformPositionId: [{ required: true, message: '请选择系统角色', trigger: 'change' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getDicKey('plDeptmentArray', 1001)
    this.getDeptTreeList()
  },
  methods: {
    getDicKey(type, code) {
      getDicKey(code).then(result => {
        if (result.code === 200) {
          this[type] = result.result
        }
      })
    },
    getDeptTreeList() {
      this.deptTreeData = []
      deptServer.getDeptTreeList().then(res => {
        const resObj = res.result || {}
        this.deptTreeData.push(resObj)
      })
    },
    getPlDepartList() {

    },
    filterNode(value, data) {
      if (!value) return true

      return data.deptName.indexOf(value) !== -1
    },
    loadNode(node, resolve) {
      this.currentNode = node
      this.currentResolve = resolve
      const obj = node.data
      this.currentDeptId = obj.id
      this.currentDeptName = obj.deptName
      if (node.level === 0) {
        return resolve([{
          id: -1001,
          deptName: this.$store.getters.userInfo.organName || '当前机构',
          children: []
        }])
      }
      if (this.currentDeptId) {
        this.departData = []
        deptServer.findTopDeptListByParentId(this.currentDeptId).then(res => {
          if (res.code === 200 && res.result) {
            this.departData = res.result.map(i => {
              return { ...i, parentName: this.currentDeptName }
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
    onSelectDepart(even) {
      if (even.id === this.currentDeptId) {
        return
      }
      this.currentPlatformDeptId = even.platformDeptId
      this.currentDeptId = even.id
      this.currentDeptName = even.deptName
      this.$nextTick(() => {
        this.handleSearch()
      })
    },
    confirmDepart() {
      this.$refs.departForm.validate(valid => {
        if (valid) {
          if (this.deptDialogStatus === 'create') {
            const params = {
              parentDeptId: this.departForm.parentDeptId,
              platformDeptId: this.departForm.platformDeptId,
              deptName: this.departForm.deptName,
              deptDesc: this.departForm.deptDesc
            }
            deptServer.createDeptInfo(params).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                this.getDeptTreeList()
                this.departVisible = false
              }
            })
          } else {
            const params = {
              deptId: this.departForm.deptId,
              platformDeptId: this.departForm.platformDeptId,
              deptName: this.departForm.deptName,
              deptDesc: this.departForm.deptDesc
            }
            deptServer.updateDeptInfo(params).then(res => {
              if (res.code === 200) {
                this.handleSearch()
                this.getDeptTreeList()
                this.departVisible = false
              }
            })
          }
        }
      })
    },
    confirmPost() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.postDialogStatus === 'create') {
            posiServer.createPositionInfo(this.postForm).then(result => {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.handleSearch()
              this.postVisible = false
            })
          } else {
            posiServer.updatePositionInfo(this.postForm).then(result => {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.handleSearch()
              this.postVisible = false
            })
          }
        }
      }).catch(() => {})
    },
    handleSearch() {
      if (this.currentDeptId) {
        this.departData = []
        // deptServer.findTopDeptListByParentId(this.currentDeptId).then(res => {
        //   if (res.code === 200 && res.result) {
        //     this.departData = res.result.map(i => {
        //       return { ...i, parentName: this.currentDeptName }
        //     }) || []
        //   }
        // }).catch(() => {})
        posiServer.getDeptListForId(this.currentDeptId).then(res => {
          if (res.code === 200 && res.result) {
            this.departData = res.result.map(i => {
              return { ...i, parentName: this.currentDeptName }
            }) || []
          }
        }).catch(() => {})
      }
    },
    // 新增岗位
    // handleCreate() {
    //   this.clearForm()
    //   this.departForm.parentDeptId = this.currentDeptId
    //   this.deptDialogStatus = 'create'
    //   this.postVisible = true
    // },
    handlePostCreate() { // 岗位新增
      this.clearForm()
      this.postionArray = {}
      this.postForm.deptId = this.currentDeptId
      if (this.currentPlatformDeptId) {
        deptServer.dpfindPositionIdByDeptId(this.currentPlatformDeptId).then(res => {
          this.$nextTick(() => {
            this.postionArray = res.result || {}
          })
        })
      }
      this.postDialogStatus = 'create'
      this.postVisible = true
    },
    handlePostUpdate(row) { // 岗位修改
      this.clearForm()
      this.postionArray = {}
      this.postForm.positionId = row.positionId
      this.postForm.platformPositionId = row.platformPositionId
      this.postForm.deptId = row.deptId
      this.postForm.positionName = row.positionName
      this.postForm.positionDesc = row.positionDesc
      if (this.currentPlatformDeptId) {
        deptServer.dpfindPositionIdByDeptId(this.currentPlatformDeptId).then(res => {
          this.$nextTick(() => {
            this.postionArray = res.result || {}
          })
        })
      }
      this.postDialogStatus = 'edit'
      this.postVisible = true
    },

    // handleUpdate(row) {
    //   this.clearForm()
    //   this.departForm.deptId = row.id
    //   this.departForm.platformDeptId = row.platformDeptId
    //   this.departForm.deptName = row.deptName || ''
    //   this.departForm.deptDesc = row.deptDesc || ''
    //   this.deptDialogStatus = 'edit'
    //   this.departVisible = true
    // },
    handleDelete(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deptServer.delDeptById(id).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.getDeptTreeList()
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      })
    },
    appendDepart(data) {
      this.clearForm()
      this.departForm.parentDeptId = data.id
      this.departForm.platformDeptId = data.platformDeptId
      this.deptDialogStatus = 'create'
      this.departVisible = true
    },
    updateDepart(data) {
      this.clearForm()
      this.departForm = data
      this.deptDialogStatus = 'edit'
      this.departVisible = true
    },
    removeDepart(node, data) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deptServer.delDeptById(data.id).then(res => {
          if (res.code === 200) {
            this.getDeptTreeList()
            this.currentDeptId = ''
            this.positionData = []
          }
        })
      })
    },
    clearForm() {
      this.departForm = {
        parentDeptId: '',
        platformDeptId: '',
        deptId: '',
        deptName: '',
        deptDesc: ''
      }
      this.postForm = {
        positionId: '',
        platformPositionId: '',
        deptId: '',
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
  ::v-deep .el-card .el-card__header {
    padding: 5px 20px;
  }
  .block-flex {
    position: relative;
    display: flex;
    &>div{
      border: 1px solid #B7B7B7;
      width: 100px;
      margin: 0;
      line-height: 30px;
      text-align: center;
    }
    &>div:first-child {
      background: #B7B7B7;
    }
  }
</style>
