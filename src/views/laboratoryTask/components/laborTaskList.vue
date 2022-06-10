<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务单号:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="任务单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>

          <el-form-item label="任务状态">
            <el-select v-model="searchForm.checkTaskStatus" clearable filterable style="width:165px" placeholder="请选择状态">
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
        :data="sampleData"
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
        <el-table-column type="index" width="50" label="序号" fixed="left" align="center" />
        <el-table-column prop="jobId" label="任务单号" fixed="left" width="130px" align="center" />
        <el-table-column prop="projectName" label="项目名称" width="150px" align="center" />
        <el-table-column prop="inspectionName" label="受检单位" align="center" />
        <el-table-column label="任务时间" align="center" width="190px">
          <template slot-scope="{row}">
            {{ row.startDate }}~{{ row.endDate }}
          </template>
        </el-table-column>
        <el-table-column prop="checkTaskStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.checkTaskStatus | statusQualityFilter">
              {{ SAMPLE_STATUS[row.checkTaskStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scheduUser" label="任务下发人" width="135" align="center" />
        <el-table-column prop="jobRemark" label="备注" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.checkTaskStatus > 0" type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <el-button v-if="scope.row.checkTaskStatus === '0'" type="text" @click="handleSchedTask(scope.row)"> 任务分配</el-button>
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

    <el-dialog title="因子详情" :visible.sync="detailVisible" width="80%" style="max-height; 600px" top="5vh">
      <checkSample :task-id="checkTaskId" />
    </el-dialog>

    <el-dialog title="任务分配" :visible.sync="laborTaskVisible" width="75%" top="2vh" :close-on-click-modal="false">
      <el-row :gutter="10" style="height: 400px">
        <el-col :span="10">
          <el-card shadow="never" style="height:400px">
            <div slot="header" class="clearfix">
              <span>待分配检测因子<i class="el-input__icon" /></span>
            </div>
            <el-table
              :data="factorData"
              stripe
              border
              max-height="300"
              size="small"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column prop="secdClassName" label="检测对象" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="100px" align="center" />
              <el-table-column prop="fbFlag" label="状态" align="center" width="70">
                <template slot-scope="{row}">
                  <el-tag :type="row.fbFlag==='0'?'success':'danger'">{{ row.fbFlag==='0'?'自检':'分包' }}</el-tag>

                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card shadow="never" style="height:400px">
            <div slot="header" class="clearfix">
              <span>实验室人员列表<i class="el-input__icon" /></span>
            </div>
            <el-table
              :data="userData"
              stripe
              border
              size="small"
              max-height="380"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%"
            >
              <el-table-column type="index" width="50" align="center" label="序号" />
              <el-table-column prop="empName" align="center" label="员工姓名" />
              <el-table-column prop="username" align="center" label="员工账号" />
              <el-table-column prop="cnt" align="center" label="待完成因子数" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                  <el-button type="text" size="small" @click="checkPerson(row)">因子分配</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-table
          :data="choseData"
          stripe
          border
          highlight-current-row
          :header-cell-style="{background:'#ECF3FC'}"
          style="width: 100%"
        >
          <el-table-column type="index" width="50" label="序号" align="center" />
          <el-table-column prop="empName" label="员工姓名" align="center" />
          <el-table-column prop="username" label="员工账号" align="center" />
          <el-table-column prop="factorNames" label="检测因子" min-width="100px" align="center">
            <template slot-scope="{row}">
              <template v-if="row.factorNames">
                <el-row v-for="(item, index) in row.factorNames" :key="index" style="width:100%;height: 25px;">
                  <el-col :span="24">
                    {{ item.factorName }}
                  </el-col>
                </el-row>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="{row, $index}">
              <el-button type="text" @click="handleDelFactor(row, $index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="laborTaskVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as checkServer from '@/api/check'
import checkSample from './checkSample'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import qs from 'qs'
const SAMPLE_STATUS = {
  '0': '待分配',
  '1': '检测中'
}
export default {
  components: { Pagination, checkSample },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      SAMPLE_STATUS,
      sampleData: [],
      searchForm: {
        jobId: '',
        projectName: '',
        checkTaskStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      checkTaskId: '',
      detailVisible: false,
      userData: [],
      laborTaskVisible: false,
      currentRow: {},
      multipleSelection: [],
      factorData: [],
      choseData: [],
      loading: false
    }
  },
  created() {
    this.getPersons()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      checkServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.sampleData = res.result.records
          this.total = res.result.total
        }
      })
    },
    getPersons() {
      checkServer.getCheckUsers().then(res => {
        this.userData = res.result || []
      })
    },
    handleDetail(row) {
      this.checkTaskId = row.checkTaskId
      this.detailVisible = true
    },
    handleSchedTask(row) {
      this.currentRow = Object.assign({}, row)
      this.choseData = []
      this.factorData = []
      // 获取因子列表
      checkServer.getOfferFactorsByTaskId(row.checkTaskId).then(result => {
        if (result.code === 200 && result.result) {
          this.factorData = result.result || []
        }
        this.laborTaskVisible = true
      })
    },
    confirmDialog() {
      if (this.factorData.length > 0) {
        this.$message.warning('因子需要一次分配完成')
        return
      }

      if (!this.choseData || this.choseData.length === 0) {
        this.$message.warning('分配列表不能为空')
        return
      }
      this.loading = true
      const resdata = this.choseData.map(i => {
        let offerFactorId = ''
        if (i.factorNames) {
          i.factorNames.forEach(j => {
            if (offerFactorId === '') {
              offerFactorId = j.jobPlanFactorId
            } else {
              offerFactorId += ',' + j.jobPlanFactorId
            }
          })
        }
        return { checkUser: i.userId, jobPlanFactorId: offerFactorId }
      })
      const data = {
        checkTaskId: this.currentRow.checkTaskId,
        params: resdata
      }

      checkServer.assignmentsFactor(qs.stringify({ param: JSON.stringify(data) })).then(result => {
        if (result.code === 200) {
          this.$notify({
            title: '成功',
            message: result.message,
            type: 'success'
          })
          this.handleSearch()
          this.laborTaskVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: result.message,

            type: 'error'
          })
        }
        this.loading = false
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelFactor(row, index) {
      const items = [...row.factorNames]

      this.factorData = this.factorData.concat(items)
      this.choseData.splice(index, 1)
    },
    checkPerson(row) {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        const obj = this.choseData.find(i => i.userId === row.userId)
        if (obj) { // 存在进行追加
          obj.factorNames = obj.factorNames.concat(this.multipleSelection)
        } else { // 不存在新增
          this.choseData.push({
            userId: row.userId,
            empName: row.empName,
            username: row.username,
            factorNames: this.multipleSelection
          })
        }
        // 移除因子列表信息
        this.multipleSelection.forEach(item => {
          const index = this.factorData.indexOf(item)
          this.factorData.splice(index, 1)
        })
        this.multipleSelection = []
      } else {
        this.$message.warning('至少选择一个因子')
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
  // /deep/.el-table__header-wrapper  .el-checkbox{
  //   display:none
  // }

</style>
<style scoped>

table {
    background-color: transparent
}

caption {
    padding-top: 8px;
    padding-bottom: 8px;
    color: #777;
    text-align: left
}

th {
    text-align: left
}

.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px
}

.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: middle;
    border-top: 1px solid #ddd
}

.table>thead>tr>th {
    vertical-align: bottom;
    border-bottom: 2px solid #ddd
}

.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th {
    border-left: 1px solid #F1F2F4
}

.table>tbody+tbody {
    border-top: 2px solid #ddd
}

.table .table {
    background-color: #fff
}

.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th {
    padding: 5px
}

.table-bordered {
    border: 1px solid #ddd
}

.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
    border: 1px solid #ddd
}

.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
    border-bottom-width: 2px
}

.table-striped>tbody>tr:nth-of-type(odd) {
    background-color: #f9f9f9
}

.table-hover>tbody>tr:hover {
    background-color: #f5f5f5
}

table col[class*=col-] {
    position: static;
    display: table-column;
    float: none
}

table td[class*=col-],table th[class*=col-] {
    position: static;
    display: table-cell;
    float: none
}

.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active {
    background-color: #f5f5f5
}

.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover {
    background-color: #e8e8e8
}

.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success {
    background-color: #dff0d8
}

.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover {
    background-color: #d0e9c6
}

.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info {
    background-color: #d9edf7
}

.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover {
    background-color: #c4e3f3
}

.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning {
    background-color: #fcf8e3
}

.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover {
    background-color: #faf2cc
}

.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger {
    background-color: #f2dede
}

.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover {
    background-color: #ebcccc
}

.table-responsive {
  min-height: 3.01%;
  overflow-x: auto;
}

.table-bordered, .table-bordered > tbody > tr > td, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > td, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > thead > tr > th {
    border: 1px solid #e9ecef;
    text-align: center;
}

.table-bordered, td, th {
    border-radius: 0 !important;
}

.table-bordered > tbody > tr:last-child > td {
    border-bottom: 1px solid #e9ecef;
}

.bootstrap-table .fixed-table-container .fixed-table-header {
    overflow: hidden;
    background: rgba(0, 0, 0, .05);
}

.fixed-table-header .table > thead > tr {
    background: none !important;
}

.table > thead > tr {
    color: #636363;
    font-weight: 400;
    background: rgba(0, 0, 0, .05);
    /*   background: repeat-x #fafafa;
  background-image: -webkit-linear-gradient(top,#F8F8F8 0,#fafafa 100%);
  background-image: -o-linear-gradient(top,#F8F8F8 0,#fafafa 100%);
  background-image: linear-gradient(to bottom,#F8F8F8 0,#fafafa 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff8f8f8', endColorstr='#ffececec', GradientType=0); */
}

.table > thead > tr > th {
    border-color: #e9ecef;
    font-weight: 700;
    border-right-color: transparent;
}

.table > thead > tr > th .ace-icon:first-child {
    margin-right: 2px;
}

.table > thead > tr > th:first-child {
    border-left-color: #F1F1F1;
}

.table > thead > tr > th:last-child {
    border-right-color: #F1F1F1;
}

.table.table-bordered > thead > tr > th {
    vertical-align: middle;
}

td.center, th.center {
    text-align: center;
}

td .lbl, th .lbl {
    margin-bottom: 0;
}

td .lbl:only-child, th .lbl:only-child {
    vertical-align: top;
}

.table-header {
    background-color: #307ECC;
    color: #FFF;
    font-size: 14px;
    line-height: 30px;
    padding-left: 12px;
    margin-bottom: 1px;
}

.table-header .close {
    margin-right: 8px;
    margin-top: 0;
    opacity: .45;
    filter: alpha(opacity=45);
}

.table-header .close:hover {
    opacity: .75;
    filter: alpha(opacity=75);
}

th.detail-col {
    width: 48px;
    text-align: center;
}

tr.detail-row {
    display: none;
}

tr.detail-row.open {
    display: block;
    display: table-row;
}

tr.detail-row > td {
    background-color: #f1f6f8;
    border-top: 3px solid #d1e1ea !important;
}

.table-detail {
    background-color: #fff;
    border: 1px solid #dcebf7;
    width: 100%;
    padding: 12px;
}

.table-detail td > .profile-user-info {
    width: 100%;
}

</style>
