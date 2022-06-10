<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="工号:">
            <el-input v-model="searchForm.empCode" style="width:165px" placeholder="员工工号" />
          </el-form-item>
          <el-form-item label="名称:">
            <el-input v-model="searchForm.empName" style="width:165px" placeholder="员工名称" />
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="searchForm.status" clearable style="width:165px" filterable placeholder="账号状态">
              <el-option
                v-for="item in Object.keys(ACCOUNT_STATUS)"
                :key="item"
                :label="ACCOUNT_STATUS[item]"
                :value="item"
              />
            </el-select>
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
        :data="userData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无用户,
              </span>
              <el-button type="text" size="small" style="font-size:14px;" @click="handleCreate">新建用户信息</el-button>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="empCode" label="员工工号" align="center" />
        <el-table-column prop="username" label="登录账号" align="center" />
        <el-table-column prop="empName" label="员工名称" align="center" />
        <el-table-column prop="deptName" label="部门/角色" align="center">
          <template slot-scope="{row}">
            {{ row.deptName }}{{ row.platformPositionName?'/'+row.platformPositionName:'' }}
          </template>
        </el-table-column>
        <el-table-column label="兼职" align="center">
          <template slot-scope="{row}">
            {{ row.positionNames }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="绑定手机号1" align="center" />
        <el-table-column prop="status" label="账号状态" align="center" width="90">
          <template slot-scope="{row}">
            <el-tag :type="row.status==='0'?'success':'danger'">{{ row.status==='0'?'有效':'停用' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="210">
          <template slot-scope="scope">
            asd
            <el-button type="text" size="small" @click="handleUpdate(scope.row)"> 编辑</el-button>
            <div v-if="scope.row.deptId!=='-1'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.deptId!=='-1'" type="text" size="small" @click="handleRelation(scope.row)"> 兼职</el-button>
            <div v-if="scope.row.deptId!=='-1'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.deptId!=='-1'" type="text" size="small" @click="handleDelete(scope.row.userId)"> 离职注销</el-button>
            <div v-if="scope.row.deptId!=='-1'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.deptId!=='-1'" type="text" size="small" @click="handleResetPwd(scope.row.userId)"> 重置密码</el-button>
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

    <el-dialog :title="titleMap[userDialogStatus]" :visible.sync="userDialogVisible" width="50%">
      <div style="width: 550px;margin:0 auto;">
        <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="140px">
          <el-form-item prop="empCode" label="员工工号:">
            <el-input v-model="userForm.empCode" placeholder="员工工号" maxlength="15" style="width: 70%;" />
          </el-form-item>
          <el-form-item prop="empName" label="姓名:">
            <el-input v-model="userForm.empName" placeholder="用户姓名" maxlength="15" style="width: 70%;" />
          </el-form-item>

          <el-form-item prop="deptId" label="部门:">
            <el-select
              v-model="userForm.deptId"
              filterable
              placeholder="主部门选择"
              style="width: 70%;"
              @change="handleChange"
            >
              <el-option
                v-for="item in deptArray"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="platformPositionId" label="岗位:">
            <el-select
              v-model="userForm.platformPositionId"
              filterable
              placeholder="岗位选择"
              style="width: 70%;"
            >
              <el-option
                v-for="item in Object.keys(postionArray)"
                :key="item"
                :label="postionArray[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="手机号:">
            <el-input v-model="userForm.phone" placeholder="手机号" maxlength="11" style="width: 70%;" />
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="兼职岗位信息" :visible.sync="postionVisible">
      <el-form label-width="100px">
        <el-form-item label="岗位:">
          <el-input v-model="currentRow.platformPositionName" disabled style="width:300px;" />
        </el-form-item>
        <el-form-item label="兼职岗位:">
          <template v-if="chosePosition && chosePosition.length > 0">
            <el-tag
              v-for="item in chosePosition"
              :key="item.platformPositionId"
              closable
              :disable-transitions="false"
              style="margin:2px 3px"
              @close="handleClose(item)"
            >
              {{ item.platformDeptName }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="岗位选择:">
          <el-row>
            <el-col :span="6">
              <el-select
                v-model="otherDeptId"
                clearable
                filterable
                placeholder="部门选择"
                style="width: 98%;"
                @change="handleDepartChange"
              >
                <el-option
                  v-for="item in deptArray"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="otherPostId"
                clearable
                filterable
                style="width: 98%;"
                placeholder="请选择角色"
                @change="handlePosChange"
              >
                <el-option
                  v-for="item in Object.keys(otherPositArray)"
                  :key="item"
                  :label="otherPositArray[item]"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postionVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmOtherDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as userServer from '@/api/user'
import * as deptServer from '@/api/dept'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { validPhone } from '@/utils/validate'
const ACCOUNT_STATUS = {
  '0': '有效',
  '1': '无效'
}
export default {
  name: 'UserList',
  components: { Pagination },
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
      ACCOUNT_STATUS,
      userData: [],
      searchForm: {
        empCode: '',
        empName: '',
        deptId: '',
        status: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      titleMap: {
        edit: '修改用户',
        create: '新增用户'
      },
      userForm: {
        empCode: '',
        userId: '',
        deptId: '',
        empName: '',
        platformPositionId: '',
        phone: ''
      },
      userRules: {
        phone: [{ required: true, message: '请录入联系方式', trigger: 'blur' }, { required: true, validator: validatePhone, trigger: 'blur' }],
        empName: [{ required: true, message: '请录入姓名信息', trigger: 'blur' }],
        empCode: [{ required: true, message: '请录入员工编号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        platformPositionId: [{ required: true, message: '请选择岗位', trigger: 'change' }]
      },
      userDialogStatus: 'create',
      userDialogVisible: false,
      deptArray: [],
      currentRow: {},
      postionVisible: false,
      chosePosition: [],
      postionArray: {},
      otherPositArray: {},
      otherDeptId: '',
      otherPostId: ''
    }
  },
  created() {
    this.getDeptTreeList()
    this.handleSearch()
  },
  methods: {
    getDeptTreeList() {
      deptServer.getDeptList().then(res => {
        this.deptArray = res.result || []
      })
    },
    handleSearch() {
      userServer.getUserListForPage(this.searchForm).then(res => {
        if (res.code === 200) {
          this.userData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    // 重置
    handleCreate() {
      this.clearForm()
      this.userDialogStatus = 'create'
      this.userDialogVisible = true
      if (this.$refs.userForm !== undefined) {
        this.$refs.userForm.resetFields()
      }
    },
    handleUpdate(row) {
      if (this.$refs.userForm !== undefined) {
        this.$refs.userForm.resetFields()
      }
      this.userForm.userId = row.id
      this.userForm.empCode = row.empCode
      this.userForm.empName = row.empName || ''
      this.userForm.deptId = row.deptId || ''
      this.userForm.phone = row.phone || ''
      this.handleChange(row.deptId)
      this.userForm.platformPositionId = row.platformPositionId || ''
      this.userDialogStatus = 'edit'
      this.userDialogVisible = true
    },
    confirmDialog() {
      if (this.userDialogStatus === 'create') {
        this.confirmCreate()
      } else {
        this.confirmUpdate()
      }
    },
    confirmOtherDialog() {
      if (this.chosePosition && this.chosePosition.length > 0) {
        const data = {
          userId: this.currentRow.id,
          postIds: this.chosePosition.map(i => {
            const { deptId, platformPositionId } = i
            return { deptId, platformPositionId }
          })
        }
        userServer.saveOtherPositions(data).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.postionVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      } else {
        this.$message.warning('至少选择一个挂职的岗位')
      }
    },
    confirmCreate() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          userServer.addUserInfo(this.userForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.userDialogVisible = false
            this.$refs.userForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    confirmUpdate() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          userServer.saveUserInfo(this.userForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.userDialogVisible = false
            this.$refs.userForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    handleDelete(userId) {
      this.$confirm('确定注销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userServer.resetUser(userId).then(result => {
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
    handleResetPwd(userId) {
      this.$confirm('确定重置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userServer.resetUser(userId).then(result => {
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
      this.userForm = {
        userId: '',
        deptId: '',
        empCode: '',
        empName: '',
        platformPositionId: '',
        phone: ''
      }
    },
    handleChange(val) {
      this.postionArray = {}
      this.userForm.platformPositionId = ''
      if (val) {
        const obj = this.deptArray.find(i => i.id === val)
        if (obj) {
          deptServer.dpfindPositionIdByDeptId(obj.platformDeptId).then(res => {
            this.$nextTick(() => {
              this.postionArray = res.result || {}
            })
          })
        }
      }
    },
    handleDepartChange(val) {
      this.otherPositArray = {}
      this.otherPostId = ''
      if (val) {
        const obj = this.deptArray.find(i => i.id === val)
        if (obj) {
          deptServer.dpfindPositionIdByDeptId(obj.platformDeptId).then(res => {
            this.otherPositArray = res.result || {}
          })
        }
      }
    },
    handlePosChange(val) {
      if (val) {
        const ob = this.chosePosition.find(j => j.platformPositionId === val)
        if (!ob) {
          this.chosePosition.push({
            platformPositionId: val,
            deptId: this.otherDeptId,
            platformDeptName: this.otherPositArray[val]
          })
        }
      }
    },
    handleRelation(row) {
      this.chosePosition = []
      this.currentRow = Object.assign({}, row)
      let posIds = []
      const depNames = []
      const posNames = []
      if (row.positionNames && row.positionNames.length > 0) {
        const firstPos = row.positionNames.split(';')
        const firstPosIds = row.positionIds.split(',')
        if (firstPos && firstPos.length > 0) {
          firstPos.forEach(element => {
            depNames.push(element.split('/')[0])
            posNames.push(element.split('/')[1])
          })
          posIds = firstPosIds
        } else {
          posIds.push(row.positionIds)
          depNames.push(row.positionNames.split('/')[0])
          posNames.push(row.positionNames.split('/')[1])
        }
        posIds.forEach((i, index) => {
          const ob = {
            platformPositionId: i,
            deptId: this.getDepartIdForName(depNames[index]),
            platformDeptName: posNames[index]
          }
          this.chosePosition.push(ob)
        })
      }
      this.postionVisible = true
    },
    getDepartIdForName(name) {
      const o = this.deptArray.find(i => i.deptName === name)
      return o.id || ''
    },
    handleClose(item) {
      // 移除存储的因子
      this.chosePosition.splice(this.chosePosition.indexOf(item), 1)
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
