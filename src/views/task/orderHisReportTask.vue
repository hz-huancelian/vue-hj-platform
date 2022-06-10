<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form :model="searchForm" inline>
          <el-form-item label="合同编号:">
            <el-input v-model="searchForm.contCode" style="width:180px" placeholder="合同编号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:180px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="search-right">
        <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="taskData"
      stripe
      border
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            <span>
              暂无任务信息
            </span>
          </div>
        </div>
      </template>
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="contCode" label="合同编号" width="185px" align="center" />
      <el-table-column prop="projectName" label="项目名称" min-width="120px" align="center" />
      <el-table-column prop="consignorName" label="委托单位" align="center" />
      <el-table-column prop="latestScheduleDate" label="上次调度日期" align="center" />
      <el-table-column prop="finishProgress" label="计划调度完成进度" align="center">
        <template slot-scope="{row}">
          {{ row.scheduledPlanNum }}/{{ row.planNum }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleDetail(row)"> 查看任务</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import * as taskServer from '@/api/task'

const TASK_STATUS = {
  '0': '待调度',
  '1': '调度中',
  '2': '调度完成'
}
export default {
  components: { Pagination },
  data() {
    return {
      TASK_STATUS,
      searchForm: {
        scheduCircle: '',
        contCode: '',
        projectName: '',
        scheduStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      taskData: []

    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      taskServer.findHistoryByCondition(this.searchForm).then(res => {
        this.taskData = res.result.records || []
        this.total = res.result.total
      })
    },
    handleDetail(row) {
      this.$router.push(`/other/orderReportTaskList/${row.taskId}`)
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
  .card-left {
    width: 100%;
    min-height: 200px;
    max-height: 400px;
  }
  .card-right {
    width: 100%;
    min-height: 200px;
    max-height: 400px;
  }
  .el-card {
    overflow: auto;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /deep/.el-table__header-wrapper  .el-checkbox{
    display:none
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
</style>
