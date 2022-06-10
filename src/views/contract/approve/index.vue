<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="合同编号:">
            <el-input v-model="searchForm.contCode" style="width:180px" placeholder="合同编号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.contName" style="width:180px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        stripe
        border
        :data="contractData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无合同信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="contCode" label="合同编号" width="190px" align="center" />
        <el-table-column prop="offerId" label="报价单号" width="170px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="120px" align="center" />
        <el-table-column prop="partA" label="客户名称" min-width="110px" align="center" />
        <el-table-column prop="signDate" label="签订时间" width="110px" align="center" />
        <el-table-column prop="validity" label="有效期" width="" align="center">
          <template slot-scope="{row}">
            {{ row.validity }} 年
          </template>
        </el-table-column>
        <el-table-column prop="contStatus" label="制作方式" width="120px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.makeType==='0'?'success':''">{{ row.makeType==='0'?'在线制作':'本地上传' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="120">
          <template slot-scope="{row}">

            <el-button v-if="row.contStatus>0" type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-if="row.contStatus==='1'" class="erc-divider-vertical" />
            <el-button v-if="row.contStatus==='1'" type="text" @click="handleApproveRes(row)"> 审核</el-button>

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

    <el-dialog title="合同审核" :visible.sync="approveVisible" center>
      <div style="width: 500px;margin:0 auto">
        <el-form :model="approveForm" label-width="100px">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="approveForm.auditFlag">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="approveForm.auditFlag === '2'" label="审核意见:">
            <el-input v-model="approveForm.auditReason" type="textarea" :rows="3" maxlength="50" show-word-limit placeholder="审核意见" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmApproveDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as contractServer from '@/api/contract'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const CONTRACT_STATUS = {
  '0': '待完善',
  '6': '待提交',
  '1': '待审核',
  '2': '审核失败',
  '4': '完成',
  '5': '已作废'
}
export default {
  components: { Pagination },
  data() {
    return {
      CONTRACT_STATUS,
      contractData: [],
      searchForm: {
        contCode: '',
        contName: '',
        contStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      approveVisible: false,
      currentItem: {},
      approveForm: {
        contId: '',
        auditFlag: '1',
        auditReason: ''
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      contractServer.findApproveConByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.contractData = res.result.records || []
          this.total = res.result.total
        }
      })
    },

    handleDetail(row) {
      contractServer.findContFileById(row.id).then(res => {
        if (res.code === 200 && res.result && res.result.length > 0) {
          const path = res.result // 合同文件存放地址
          // this.$router.push(`/report/pdfView/${path}/1`)
          this.$router.push({ name: 'sysPdfView', params: { path: path, type: 1 }})
        } else {
          this.$message.error('合同PDF还未生成')
        }
      })
    },
    handleApproveRes(row) {
      this.approveForm.contId = row.id
      this.approveForm.auditFlag = '1'
      this.approveForm.auditReason = ''
      this.approveVisible = true
    },
    confirmApproveDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contractServer.auditCont(this.approveForm).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.approveVisible = false
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
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
