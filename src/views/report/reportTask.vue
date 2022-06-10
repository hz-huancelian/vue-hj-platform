<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="报价单号:">
            <el-input v-model="searchForm.offerId" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="报告状态:">
            <el-select v-model="searchForm.status" clearable style="width:165px" filterable placeholder="报告状态">
              <el-option
                v-for="item in Object.keys(REPORT_STATUS)"
                :key="item"
                :label="REPORT_STATUS[item]"
                :value="item"
              />
            </el-select>
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
    <el-table
      :data="reportData"
      border
      stripe
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
    >
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="reportCode" label="报告编号" align="center" />
      <el-table-column prop="offerId" label="任务单号" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="consignorName" label="委托单位" align="center" />
      <el-table-column prop="inspectionName" label="受检单位" align="center" />
      <el-table-column prop="createTime" label="生成时间" align="center" />
      <el-table-column prop="reportStatus" label="报告状态" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleTask(row)">任务分配</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const REPORT_STATUS = {
  '0': '待审核'
}
export default {
  data() {
    return {
      REPORT_STATUS,
      searchForm: {

      },
      total: 0,
      reportData: [],
      path: 'offer_template.docx'

    }
  },
  created() {},
  methods: {
    handleSearch() {
    },
    handleToFile() {
    },
    handleDetail(row) {}
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
