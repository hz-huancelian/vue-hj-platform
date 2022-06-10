<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="分包机构名称:">
            <el-input v-model="searchForm.judgeOrganName" style="width:165px" placeholder="分包机构名称" />
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
        border
        :data="mechanData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无分包机构信息
              </span>
              <el-button type="text" size="small" style="font-size:14px;" @click="handleCreate">新建分包机构</el-button>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" fixed="left" align="center" />
        <el-table-column prop="judgeOrganName" label="机构名称" min-width="160px" align="center" />
        <el-table-column prop="legalPerson" label="企业法人" width="120px" align="center" />
        <el-table-column prop="judgeOrganLinker" label="联系人" width="120px" align="center" />
        <el-table-column prop="judgeOrganLinkerPhone" label="联系人电话" width="120px" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="bankName" label="开户行" align="center" />
        <el-table-column prop="bankNumber" label="银行账号" min-width="120px" align="center" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip="true" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
            <div class="erc-divider-vertical" />
            <el-button type="text" @click="handleDelete(scope.row.id)"> 删除</el-button>
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
    <el-dialog :title="titleMap[judgeDialogStatus]" :visible.sync="judgeVisible" center width="65%" top="5vh" :close-on-click-modal="false">

      <div style="width: 500px;margin:0 auto">
        <el-form ref="judgeForm" :model="judgeForm" :rules="judgeRules" label-width="100px">
          <el-form-item prop="judgeOrganName" label="机构名称:">
            <el-input v-model="judgeForm.judgeOrganName" placeholder="分包机构名称" maxlength="30" style="width:80%" />
          </el-form-item>
          <el-form-item prop="legalPerson" label="企业法人:">
            <el-input v-model="judgeForm.legalPerson" placeholder="企业法人" maxlength="15" style="width:80%" />
          </el-form-item>
          <el-form-item prop="judgeOrganLinker" label="联系人:">
            <el-input v-model="judgeForm.judgeOrganLinker" placeholder="联系人" maxlength="15" style="width:80%" />
          </el-form-item>
          <el-form-item prop="judgeOrganLinkerPhone" label="联系人电话:">
            <el-input v-model="judgeForm.judgeOrganLinkerPhone" placeholder="联系人电话" maxlength="15" style="width:80%" />
          </el-form-item>
          <el-form-item prop="email" label="邮箱:">
            <el-input v-model="judgeForm.email" pattern="[^@]*@[^@]*" type="email" maxlength="25" placeholder="邮箱" style="width:80%" />
          </el-form-item>
          <el-form-item prop="bankName" label="开户行:">
            <el-input v-model="judgeForm.bankName" placeholder="开户行" maxlength="30" style="width:80%" />
          </el-form-item>
          <el-form-item prop="bankNumber" label="银行账号:">
            <el-input v-model="judgeForm.bankNumber" placeholder="银行账号" maxlength="30" style="width:80%" />
          </el-form-item>
          <el-form-item label="备注:">
            <el-input
              v-model="judgeForm.remark"
              type="textarea"
              :rows="3"
              maxlength="50"
              show-word-limit
              placeholder="备注"
              style="width:80%"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="judgeVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as judgeServer from '@/api/judge'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      mechanData: [],
      searchForm: {
        judgeOrganName: '',
        pageNumber: 1,
        pageSize: 10
      },
      titleMap: {
        edit: '修改分包机构信息',
        create: '新增分包机构信息'
      },
      total: 0,
      judgeVisible: false,
      judgeDialogStatus: 'create',
      judgeForm: {
        organId: '',
        judgeOrganName: '',
        judgeOrganLinker: '',
        judgeOrganLinkerPhone: '',
        email: '',
        legalPerson: '',
        bankName: '',
        bankNumber: '',
        remark: ''
      },
      judgeRules: {
        judgeOrganName: [{ required: true, message: '请录入机构名称', trigger: 'blur' }],
        judgeOrganLinker: [{ required: true, message: '请录入机构联系人', trigger: 'blur' }],
        judgeOrganLinkerPhone: [{ required: true, message: '请录入联系方式', trigger: 'blur' }],
        email: [{ required: true, message: '请录入邮箱地址', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '请录入法人', trigger: 'blur' }],
        bankName: [{ required: true, message: '请录入开户行', trigger: 'blur' }],
        bankNumber: [{ required: true, message: '请录入银行账号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      judgeServer.getMachanListForPage(this.searchForm).then(res => {
        if (res.code === 200) {
          this.mechanData = res.result.records
          this.total = res.result.total
        }
      })
    },
    handleCreate() {
      this.clearForm()
      this.judgeDialogStatus = 'create'
      this.judgeVisible = true
    },
    handleUpdate(row) {
      this.clearForm()
      this.judgeDialogStatus = 'edit'
      this.judgeForm = Object.assign({}, row)
      this.judgeVisible = true
    },
    confirmDialog() {
      this.$refs.judgeForm.validate(valid => {
        if (valid) {
          if (this.judgeDialogStatus === 'create') {
            judgeServer.addJudgeOrgan(this.judgeForm).then(request => {
              this.$notify({
                title: '成功',
                message: request.message,
                type: 'success'
              })
              this.judgeVisible = false
              this.handleSearch()
              this.$refs.judgeForm.resetFields()
            }).catch(() => {})
          } else {
            judgeServer.updateJudgeOrgan(this.judgeForm).then(request => {
              this.$notify({
                title: '成功',
                message: request.message,
                type: 'success'
              })
              this.judgeVisible = false
              this.handleSearch()
              this.$refs.judgeForm.resetFields()
            }).catch(() => {})
          }
        } else {
          return false
        }
      })
    },
    handleDelete(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        judgeServer.delById(id).then(result => {
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
      this.judgeForm = {
        organId: '',
        judgeOrganName: '',
        judgeOrganLinker: '',
        judgeOrganLinkerPhone: '',
        email: '',
        legalPerson: '',
        bankName: '',
        bankNumber: '',
        remark: ''
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
  .item {
    font-size: 16px;
  }
  ::v-deep .el-card .el-card__header {
    padding: 5px 20px;
    background: #F3F2F2;
  }
</style>
