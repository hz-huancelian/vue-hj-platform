<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务单号:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="任务单号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        ref="stockTable"
        stripe
        border
        :data="taskData"
        class="table-item"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无审核信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="jobId" label="任务单号" width="130px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="150px" align="center" />
        <el-table-column prop="inspectionName" label="受检单位" align="center" />
        <el-table-column prop="totalSamples" label="样品总数" min-width="100px" align="center" />
        <el-table-column prop="inBoundSamples" label="入库样品数" align="center" />
        <el-table-column prop="outBoundSamples" label="出库样品数" width="100px" align="center" />
        <el-table-column fixed="right" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
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
  </div>
</template>

<script>
import * as stockServer from '@/api/stock'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const STOCK_STATUS = {
  '6': '在库',
  '7': '部分出库',
  '8': '已出库'
}
const CHECK_STATUS = {
  '0': '单次',
  '1': '周',
  '2': '月',
  '3': '季度',
  '4': '半年',
  '5': '年'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '6': '',
        '7': 'success',
        '8': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      STOCK_STATUS,
      CHECK_STATUS,
      taskData: [],
      searchForm: {
        jobId: '',
        sampItemId: '',
        sampStatus: '',
        date: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      approveVisible: false,
      sampleVisible: false,
      sampleDetailForm: {
        collectUser: '', // 采样员
        sampleProperties: '',
        sampleFixative: '',
        collectRemark: '',
        collectLocation: '',
        collectIamge1: '',
        collectIamge2: '',
        collectIamge3: '',
        collectIamge4: '',
        factorName: ''
      },
      currentSample: '',
      approveForm: {
        sampItemId: '',
        auditFlag: '1',
        auditReason: ''
      },
      sampleImage: '',
      sampleImageList: [],
      multipleSelection: [],
      downVisible: false,
      recordForm: {
        taskId: '',
        classId: '',
        secClassId: '',
        sampleDate: ''
      },
      classArray: [],
      secClassArray: [],
      sampleDetails: [],
      sampleDataInfo: [],
      sampleSecInfo: [],
      currentSelectionRow: {
        jobId: '',
        secdClassName: '',
        storeData: ''
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      stockServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.taskData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      this.$router.push(`/other/stockList/${row.sampTaskId}`)
    }
  }
}
</script>

<style scoped lang="scss" >
    .clearfix {
    line-height: 40px;
    display: flex;
  }
  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
  /deep/ .el-table__fixed-header-wrapper .el-checkbox {
    display: none;
  }
  .table-item /deep/ .el-table__header-wrapper .el-checkbox {//table-item 父级类名
    display: none;
  }
</style>
