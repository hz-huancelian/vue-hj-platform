<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="样品编号:">
            <el-input v-model="searchForm.sampItemId" style="width:165px" placeholder="样品编号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch"> 查询</el-button>
            <el-button type="primary" @click="handleBatchApprove">批量审核</el-button>
            <el-button type="" @click="goBack">返回</el-button>
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
        @selection-change="handleSelectionChange"
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="sampleNo" label="样品编号" min-width="140px" align="center" />
        <el-table-column prop="projectName" label="项目名称" align="center" min-width="140px" />
        <el-table-column prop="inspectionName" label="受检单位" align="center" />
        <el-table-column prop="collectUser" label="采样人" width="190px" align="center" />
        <el-table-column prop="reviewUser" label="复核人" width="190px" align="center" />
        <el-table-column prop="factorPoint" label="采样点位" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" width="120px" align="center" />
        <el-table-column prop="finishTime" label="采样登记时间" width="190px" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <div class="erc-divider-vertical" />
            <el-button type="text" @click="handleApprove(scope.row)">审核</el-button>
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

    <el-dialog :title="currentSample + '-详情'" :visible.sync="sampleVisible" width="85%" center top="5vh">
      <el-form :model="sampleDetailForm" label-width="180px" label-position="right">
        <el-card style="margin-top: 5px;padding-bottom: 20px;">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>基础信息</span>
          </div>
          <el-col :span="16" style="height:32px;">
            <el-form-item label-width="100" label="检测因子:">
              <span class="showTile">{{ sampleDetailForm.factorName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="height:32px;">
            <el-form-item label-width="100" label="点位:">
              <span class="showTile">{{ sampleDetailForm.factorPoint }}</span>
            </el-form-item>
          </el-col>
          <!--动态二级类别信息-->
        </el-card>
        <el-card v-for="item in sampleSecInfo" :key="item.groupKey" style="margin-top: 5px;padding-bottom: 20px;">
          <div v-if="item.groupName && item.groupName != ''" slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>{{ item.groupName }}</span>
          </div>
          <el-col v-for="(sitem,index) in item.params" :key="index" :span="8" style="height:32px;">
            <el-form-item label-width="100">
              <span slot="label">{{ sitem.name }}:</span>
              <span class="showTile">{{ sitem.value?sitem.value.toString():'' }}</span>
            </el-form-item>
          </el-col>
        </el-card>

        <el-card v-if="sampleDataInfo && sampleDataInfo.length > 0" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>现场检测因子信息</span>
          </div>
          <el-table :data="sampleDataInfo" stripe>
            <el-table-column prop="factorName" label="检测因子项目" />
            <el-table-column label="因子结果集">
              <template slot-scope="{row}">
                <template v-if="row.measuredForm">
                  {{ '第一值: ' +row.measuredForm.firstVal + ' 第二值: ' + row.measuredForm.secondVal + " 均值: " + row.measuredForm.avgVal }}
                </template>
                <template v-else>
                  {{ row.factorData?row.factorData:'' }}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="checkEquipment" label="检测设备">
              <template slot-scope="{row}">
                {{ row.checkEquipment&&row.checkEquipment.length>0?row.checkEquipment.replaceAll('^_^',' '):'' }}
              </template>
            </el-table-column>
            <el-table-column prop="theoreticalVal" label="理论值" />
            <el-table-column prop="groundConditions" label="测定值" />
          </el-table>
        </el-card>

        <el-card style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>现场信息</span>
          </div>
          <el-col :span="12">
            <el-form-item label-width="100" label="采样地址:">
              <span class="showTile">{{ sampleDetailForm.sampleDataVo.collectLocation }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100" label="采样日期:">
              <span class="showTile">{{ sampleDetailForm.sampleDataVo.collectDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="100" label="现场图片:">
              <div v-if="sampleImageList && sampleImageList.length > 0" class="demo-image__lazy">
                <el-image v-for="(url, index) in sampleImageList" :key="index" :src="url" :preview-src-list="sampleImageList" style="width: 100px; height: 100px;margin-left: 10px;" />
              </div>
            </el-form-item>
          </el-col>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sampleVisible=false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="showTitle" :visible.sync="approveVisible" center>
      <div style="width: 400px;margin:0 auto">
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
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="showTitle" :visible.sync="batchApproveVisible" center>
      <div style="width: 400px;margin:0 auto">
        <el-form :model="batchApprove" label-width="100px">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="batchApprove.auditFlag">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="batchApprove.auditFlag === '2'" label="审核意见:">
            <el-input v-model="batchApprove.auditReason" type="textarea" :rows="3" maxlength="50" show-word-limit placeholder="审核意见" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchApproveVisible=false">取消</el-button>
        <el-button type="primary" @click="batchConfirmDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as sampleServer from '@/api/sample'
import * as stockServer from '@/api/stock'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const ACCOUNT_STATUS = {
  '0': '草稿',
  '1': '待审核',
  '2': '审核驳回',
  '3': '审核通过'
}

export default {
  name: 'SampleApprove',
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'danger',
        '3': 'success'
      }
      return statusMap[status]
    }
  },
  props: {
    sampTaskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ACCOUNT_STATUS,
      sampleData: [],
      searchForm: {
        jobId: '',
        sampItemId: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      approveVisible: false,
      sampleVisible: false,
      sampleDetailForm: {
        factorName: '',
        factorPoint: '',
        secdClassName: '',
        factorDataVos: [],
        sampleDataVo: {
          collectDate: '',
          collectLocation: '',
          imageList: [],
          sampleData: [],
          specialNote: ''
        },
        sampleJobVo: {
          projectName: '',
          jobRemark: ''
        }
      },
      currentSample: '',
      approveForm: {
        sampItemId: '',
        auditFlag: '1',
        auditReason: ''
      },
      sampleImage: '',
      sampleImageList: [],
      showTitle: '',
      sampleDetails: [],
      multipleSelection: [],
      batchApproveVisible: false,
      batchApprove: {
        sampItemId: '',
        auditFlag: '1',
        auditReason: ''
      },
      sampleDataInfo: [],
      sampleSecInfo: []

    }
  },
  created() {
    this.searchForm.sampTaskId = this.sampTaskId
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      sampleServer.findAuditSampItemForManageByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.sampleData = res.result.records
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      // 获取数据
      this.currentSample = row.sampleNo
      this.sampleImageList = []
      this.sampleDataInfo = []
      this.sampleSecInfo = []
      this.sampleImage = ''
      var baseUrl = this.$store.getters.sysBaseUrl + '/cyImg/'
      stockServer.getSampleDataBySampItemId(row.sampItemId).then(res => {
        if (res.code === 200 && res.result) {
          this.sampleDetailForm = res.result || {}
          this.$nextTick(() => {
            // 提取图片
            this.sampleImageList = res.result.sampleDataVo.imageList.map(i => {
              return baseUrl + i
            })
            // 二级类别
            this.sampleSecInfo = res.result.sampleDataVo.sampleData || []

            var nfactorDataVos = res.result.factorDataVos.filter(i => i.dataEntryStep === '1') || []
            // 因子
            this.sampleDataInfo = nfactorDataVos.map(i => {
              if (i.measuredFormVal && i.measuredFormVal.length > 0) {
                this.$set(i, 'measuredForm', JSON.parse(i.measuredFormVal))
              }
              return i
            })
          })
          this.sampleVisible = true
        }
      })
      // 封装展示数据
    },
    handleApprove(row) {
      this.approveForm.sampItemId = row.sampItemId
      this.approveForm.auditFlag = '1'
      this.approveForm.auditReason = ''
      this.showTitle = '样品审核'
      this.approveVisible = true
    },
    handleBatchApprove() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        const samples = this.multipleSelection.map(i => {
          return i.sampItemId
        })
        this.batchApprove.sampItemId = samples.toString()
        this.batchApprove.auditFlag = '1'
        this.batchApprove.auditReason = ''
        this.showTitle = '样品审核'
        this.batchApproveVisible = true
      } else {
        this.$message.warning('至少选择一个任务进行审核')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchConfirmDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sampleServer.batchDoAuditSampItemForManager(this.batchApprove).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.batchApproveVisible = false
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
    },
    confirmDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sampleServer.doAuditSampItemForManager(this.approveForm).then(res => {
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
    },
    goBack() {
      this.$router.back()
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
  .clearfix {
    line-height: 40px;
    display: flex;
  }

</style>
