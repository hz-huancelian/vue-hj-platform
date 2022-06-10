<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item>
            <el-input v-model="searchForm.sampleNo" style="width:145px" placeholder="请录入样品编号" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.sampStatus" style="width:145px" placeholder="请选择库存状态">
              <el-option label="已入库" :value="6" />
              <el-option label="部分出库" :value="7" />
              <el-option label="已出库" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item prop="signDate">
            <el-date-picker
              v-model="searchForm.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择入库日期"
              style="width: 145px;"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" size="small" @click="handleSearch"> 查询</el-button>
            <el-button type="primary" class="iconfont icon-fanhui" size="small" @click="goBack"> 返回</el-button>
            <!-- <el-button type="primary" icon="el-icon-download" @click="handleDownlond"> 交接单导出</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-download" @click="handleDownlond">交接单下载</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        ref="stockTable"
        stripe
        border
        :data="stockData"
        class="table-item"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
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
        <el-table-column type="selection" width="55" :selectable="checkSelectable" align="center" />
        <el-table-column prop="sampleNo" label="样品编号" fixed="left" width="150px" align="center" />
        <el-table-column prop="jobId" label="任务单号" width="130px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="150px" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" align="center" />
        <el-table-column prop="factorPoint" label="采样点位" min-width="100px" align="center" />
        <el-table-column prop="collectUser" label="采样人" align="center" />
        <el-table-column prop="reviewUser" label="复核人" width="100px" align="center" />
        <el-table-column prop="storeLocation" label="存放位置" min-width="100px" align="center" />
        <el-table-column prop="inspectionName" label="受检单位" min-width="120px" align="center" />

        <el-table-column label="库存状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.sampStatus|statusQualityFilter">
              {{ STOCK_STATUS[row.sampStatus] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="storeTime" label="入库时间" width="160" align="center" />
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

    <el-dialog title="交接单下载" :visible.sync="downVisible" center>
      <div style="width: 500px;margin:0 auto">
        <el-form :model="recordForm" label-width="130px">
          <el-form-item label="任务单号:">
            <el-input v-model="recordForm.taskId" placeholder="请录入任务单号" style="width:300px" />
          </el-form-item>
          <el-form-item label="检测对象:">
            <el-select v-model="recordForm.classId" clearable style="width:300px" filterable placeholder="检测对象" @change="findSecClass">
              <el-option
                v-for="item in classArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检测类别:">
            <el-select v-model="recordForm.secClassId" clearable style="width:300px" filterable placeholder="检测类别">
              <el-option
                v-for="item in secClassArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="采样信息记录时间:">
            <el-date-picker
              v-model="recordForm.sampleDate"
              type="date"
              placeholder="采样信息记录时间"
              value-format="yyyy-MM-dd"
              style="width:300px"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="downVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDownload">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as stockServer from '@/api/stock'
import * as dictServer from '@/api/dict'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const STOCK_STATUS = {
  '0': '待采样',
  '1': '已采样',
  '2': '待组长审核',
  '3': '待负责人审核',
  '4': '审核通过',
  '5': '审核失败',
  '6': '已入库',
  '7': '部分出库',
  '8': '已出库',
  '9': '入库中',
  '10': '待复核'
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
      stockData: [],
      searchForm: {
        sampTaskId: '',
        sampleNo: '',
        sampStatus: '',
        date: '',
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
        sampleNo: '',
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
    if (this.$route.params.sampTaskId) {
      this.searchForm.sampTaskId = this.$route.params.sampTaskId
      this.getClassList()
      this.handleSearch()
    }
  },
  methods: {
    handleSearch() {
      if (this.searchForm.jobId !== '') {
        this.clearSelectionRow()
        stockServer.getSamplesBySampTaskId(this.searchForm).then(res => {
          if (res.code === 200 && res.result) {
            this.stockData = res.result.records.map(i => {
              const sData = parseTime(i.storeTime, '{y}-{m}-{d}')
              this.$set(i, 'storeData', sData)
              return i
            }) || []
            this.total = res.result.total
          }
        })
      }
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

            // 因子
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

      // stockServer.getSampleDetailBySampItemId(row.sampleNo).then(res => {
      //   if (res.code === 200) {
      //     this.sampleForm = res.result || {}
      //   }
      //   this.sampleVisible = true
      // })
      // 封装展示数据
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownlond() {
      // this.recordForm.taskId = ''
      // this.recordForm.classId = ''
      // this.recordForm.secClassId = ''
      // this.downVisible = true
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        const samples = this.multipleSelection.map(i => {
          return i.sampleNo
        })
        const url = '/api/word/downLoadHandover?secdClassId=' + this.multipleSelection[0].secdClassId + '&sampleNos=' + samples.toString()
        window.open(url)
      } else {
        this.$message.warning('至少选择一条记录')
      }
    },
    getClassList() {
      dictServer.findFstClasses().then(res => {
        this.classArray = res.result || []
      })
    },
    findSecClass(val) {
      this.recordForm.secClassId = ''
      dictServer.findSecdClassByClassId(val).then(res => {
        this.secClassArray = res.result || []
      })
    },
    confirmDownload() {
      if (this.recordForm.taskId && this.recordForm.secClassId && this.recordForm.sampleDate) {
        const url = '/api/word/downLoadHandover?taskId=' + this.recordForm.taskId + '&secdClassId=' + this.recordForm.secClassId + '&sampleDate=' + this.recordForm.sampleDate
        window.open(url)
        this.downVisible = false
      } else {
        this.$message.warning('任务单号和检测类别不能为空')
      }
    },
    handleSelect(selection, row) {
      if (selection.length > 0) {
        this.currentSelectionRow.jobId = row.jobId
        this.currentSelectionRow.secdClassName = row.secdClassName
        this.currentSelectionRow.storeData = row.storeData
      } else {
        this.clearSelectionRow()
      }
    },
    clearSelectionRow() {
      this.currentSelectionRow = {
        jobId: '',
        secdClassName: '',
        storeData: ''
      }
    },
    checkRow(item) {
      if (!this.currentSelectionRow.jobId || this.currentSelectionRow.jobId === '') {
        return true
      }
      if (item.jobId === this.currentSelectionRow.jobId &&
        item.secdClassName === this.currentSelectionRow.secdClassName &&
        item.storeData === this.currentSelectionRow.storeData) {
        return true
      }
      return false
    },
    checkSelectable(row) {
      return this.checkRow(row)
    },
    goBack() {
      this.$router.back()
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
