<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="19">
          <el-form-item label="任务单号1111111:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="任务单号" />
          </el-form-item>
          <el-form-item label="项目名称1111111:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      :data="reportData"
      stripe
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
    >
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="reportCode" label="报告编号" width="140px" align="center" />
      <el-table-column prop="jobId" label="任务单号" width="140px" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="consignorName" label="委托单位" align="center" />
      <el-table-column prop="inspectionName" label="受检单位" align="center" />
      <el-table-column prop="checkTime" label="审核时间" width="160px" align="center" />
      <el-table-column label="操作" align="center" width="185px">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleDetail(row)">查看</el-button>

          <div v-if="checkPermission(['admin','sqqzi'])" class="erc-divider-vertical" />
          <el-button v-if="checkPermission(['admin','sqqzi'])" type="text" @click="handleIssue(row)">签发</el-button>

          <div class="erc-divider-vertical" />
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-link :underline="false" @click="handleDownload(row)">
                <el-dropdown-item>最新报告下载</el-dropdown-item>
              </el-link>
              <el-link :underline="false" @click="handleOldDownload(row)">
                <el-dropdown-item>原始报告下载</el-dropdown-item>
              </el-link>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <div v-if="row.reportStatus === '2'" class="erc-divider-vertical" />
          <el-button v-if="row.reportStatus>1 && row.reportStatus<6" type="text" @click="handleUpload(row)">上传报告</el-button> -->

        </template>
      </el-table-column>
    </el-table>
    <div style="float: right">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>

    <el-dialog title="报告签发确认" :visible.sync="issueVisible" center>
      <div style="width: 400px;margin:0 auto">
        <el-form :model="issueForm" label-width="100px">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="issueForm.auditFlag">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="issueForm.auditFlag === '2'" label="审核意见:">
            <el-input v-model="issueForm.auditReason" type="textarea" :rows="3" maxlength="50" show-word-limit placeholder="审核意见" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="issueVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmIssueDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import * as reportServer from '@/api/report'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusQualityFilter(status) {
      if (status < 3) {
        return 'info'
      } else if (status < 6) {
        return ''
      } else if (status === '6') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      searchForm: {
        jobId: '',
        projectName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      reportData: [],
      issueVisible: false,
      issueForm: {
        reportId: '',
        auditFlag: '1',
        remark: ''
      }

    }
  },
  computed: {
    ...mapGetters(['platformPositionId', 'userId'])
  },
  created() {
    this.handleSearch()
  },
  methods: {
    checkPermission,
    handleSearch() {
      reportServer.findReportSignByPage(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.reportData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      const path = row.reportCode + '.pdf'
      this.$router.push({ name: 'sysPdfView', params: { path: path, type: 2 }})
    },
    handleDownload(row) {
      var url = this.$store.getters.sysBaseUrl + '/file/report/' + row.reportFileId
      window.open(url)
    },
    handleOldDownload(row) {
      var url = this.$store.getters.sysBaseUrl + '/file/report/' + row.reportCode + '.docx'
      window.open(url)
    },
    handleIssue(row) {
      this.issueForm.reportId = row.reportId
      this.issueForm.auditFlag = '1'
      this.issueForm.remark = ''
      this.issueVisible = true
    },

    confirmIssueDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportServer.reportIssue(this.issueForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.issueVisible = false
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
   .info-table-new {
    font-size: 14px;
    width: 100%;
    text-align: center;
    margin-top: 10px;
    border-top: 1px solid #ececec;
    border-left: 1px solid #ececec;
    line-height: 35px;
    td {
      border-bottom: 1px solid #ececec;
      border-right: 1px solid #ececec;
      width: 25%;
      height: 35px;
      // &:nth-child(2n + 1) {
      //   width: 25%;
      //   background: #f5f5f5;
      // }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /deep/.hide .el-upload--picture-card {
    display: none;
  }
</style>
