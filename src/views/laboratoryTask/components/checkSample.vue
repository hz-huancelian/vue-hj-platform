<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-form-item label="样品编号:">
        <el-input v-model="searchForm.smapleNo" style="width:165px" placeholder="样品编号" />
      </el-form-item>
      <el-form-item label="因子名称:">
        <el-input v-model="searchForm.factorName" style="width:165px" placeholder="因子名称" />
      </el-form-item>
      <el-form-item label="检测状态:">
        <el-select v-model="searchForm.checkStatus" clearable placeholder="检测状态">
          <el-option
            v-for="item in Object.keys(SAMPLE_STATUS)"
            :key="item"
            :label="SAMPLE_STATUS[item]"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        stripe
        :data="sampleTaskData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="sampleNo" label="样品编号" width="150px" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" align="center" />
        <el-table-column prop="factorName" label="检测因子" align="center" />
        <el-table-column prop="factorPoint" label="采样点位" width="130px" align="center" />
        <el-table-column prop="standardName" label="检验标准" min-width="160px" align="center" />
        <el-table-column prop="assignUser" label="分析员" align="center" />

        <el-table-column prop="checkStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.checkStatus | statusQualityFilter">
              {{ SAMPLE_STATUS[row.checkStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkRes" label="总计值" align="center">
          <template slot-scope="{row}">
            <template v-if="row.checkRes && row.checkRes.length >0">
              {{ row.masterRes }}<template v-if="row.exponRes>0">×10<sup>{{ row.exponRes }}</sup></template>
            </template>
            <template v-else />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="searchForm.pageNumber"
      :limit.sync="searchForm.pageSize"
      @pagination="handleSearch"
    />
  </div>
</template>

<script>
import * as checkServer from '@/api/check'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const SAMPLE_STATUS = {
  '0': '待领样',
  '1': '领样申请',
  '2': '待检测',
  '3': '已录入',
  '4': '待审核',
  '5': '审核通过',
  '6': '审核失败'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0' || status === '2') {
        return 'info'
      } else if (status === '1' || status === '3') {
        return ''
      } else if (status === '4') {
        return 'warning'
      } else if (status === '5') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      SAMPLE_STATUS,
      sampleTaskData: [],
      searchForm: {
        smapItemId: '',
        factorName: '',
        checkStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.searchForm.checkTaskId = this.taskId
      checkServer.getCheckFactorInfos(this.searchForm).then(res => {
        if (res.code === 200) {
          this.sampleTaskData = res.result.records.map(i => {
            if (i.checkRes && i.checkRes !== '') {
              const ob = JSON.parse(i.checkRes)
              this.$set(i, 'masterRes', ob.v1 ? ob.v1 : 0)
              this.$set(i, 'exponRes', ob.v2 ? ob.v2 : 0)
            } else {
              this.$set(i, 'masterRes', 0)
              this.$set(i, 'exponRes', 0)
            }
            return i
          }) || []
          this.total = res.result.total
        }
      })
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
</style>

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

</style>
