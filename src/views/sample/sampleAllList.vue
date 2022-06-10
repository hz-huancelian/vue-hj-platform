<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="19">
          <el-form-item label="样品编号:">
            <el-input v-model="searchForm.sampleNo" style="width:165px" placeholder="样品编号" />
          </el-form-item>
          <el-form-item label="样品状态:">
            <el-select v-model="searchForm.sampStatus" clearable filterable style="width:165px" placeholder="请选择状态">
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
            <el-button type="primary" class="iconfont icon-fanhui" @click="goBack"> 返回</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="search-right">
          <el-button type="text" icon="el-icon-plus" @click="handleAddRecords">采样记录单导出</el-button>
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
                暂无采样样品信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="50" label="序号" fixed="left" align="center" />
        <el-table-column prop="sampleNo" label="样品编号" fixed="left" width="150px" align="center" />
        <el-table-column prop="inspectionName" label="受检单位" align="center" />
        <el-table-column prop="factorPoint" label="采样点位" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" sortable width="130px" align="center" />
        <el-table-column prop="collectTime" label="采样时间" align="center" width="190px">
          <template slot-scope="{row}">
            {{ row.collectTime&&row.collectTime.length>0?(row.collectDate + ' ' + row.collectTime):row.collectDate }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sampleType" label="样品归类" width="120" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.sampleType ==='1'?'danger':''">
              {{ row.sampleType ==='1'?"样品分包":"样品自检" }}
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="sampTaskStatus" label="状态" width="120px" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.smapStatus | statusQualityFilter">
              {{ SAMPLE_STATUS[row.smapStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collectUser" label="采样人" width="160" align="center" />
        <el-table-column prop="storeTime" label="入库时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" width="80" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.smapStatus > 1" type="text" @click="handleDetail(scope.row)"> 查看</el-button>
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
          <el-table border :data="sampleDataInfo" stripe>
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

    <el-dialog title="现场采样记录单下载" :visible.sync="downVisible" width="400px" center>
      <div style="width: 500px;margin:0 auto">
        <el-form :model="recordForm" label-width="90px">
          <el-form-item label="检测对象:">
            <el-select v-model="recordForm.classId" clearable style="width:240px" filterable placeholder="检测对象" @change="findSecClass">
              <el-option
                v-for="item in classArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检测类别:">
            <el-select v-model="recordForm.secClassId" clearable style="width:240px" filterable placeholder="检测类别">
              <el-option
                v-for="item in secClassArray"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="8" style="text-align: left;">
            <el-button type="primary" size="small" @click="allDownload">全部下载</el-button>
          </el-col>
          <el-col :span="16" style="text-align: right;">
            <el-button size="small" @click="downVisible=false">取消</el-button>
            <el-button type="primary" size="small" @click="confirmDownload">确认</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as sampleServer from '@/api/sample'
import * as stockServer from '@/api/stock'
import * as dictServer from '@/api/dict'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const SAMPLE_STATUS = {
  '0': '待采样',
  '1': '已采样',
  '2': '组长待审核',
  '3': '负责人待审核',
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
      if (status === '0' || status === '5') {
        return ''
      } else if (status === '9') {
        return 'danger'
      } else if (status < 4) {
        return 'warning'
      } else if (status < 9) {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      SAMPLE_STATUS,
      sampleData: [],
      searchForm: {
        sampTaskId: '',
        sampleNo: '',
        sampStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,

      currentSample: '',
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
      sampleImage: '',
      sampleVisible: false,
      sampleImageList: [],
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
      sampleSecInfo: []
    }
  },
  created() {
    this.getClassList()
    if (this.$route.params.sampTaskId) {
      this.searchForm.sampTaskId = this.$route.params.sampTaskId
      this.handleSearch()
    }
  },
  methods: {
    handleSearch() {
      if (this.searchForm.sampTaskId) {
        sampleServer.findSampTaskDetailByCondition(this.searchForm).then(res => {
          if (res.code === 200) {
            this.sampleData = res.result.records
            this.total = res.result.total
          }
        })
      }
    },
    handleDetail(row) {
      // 获取数据
      this.currentSample = row.sampleNo
      this.sampleImageList = []
      this.sampleDataInfo = [] // 因子信息
      this.sampleSecInfo = [] // 二级类别信息
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

            debugger
            var nfactorDataVos = res.result.factorDataVos.filter(i => (i.dataEntryStep === '1' && i.checkStandardId.indexOf('100004-') === -1)) || []
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
    handleAddRecords() {
      this.recordForm.taskId = this.$route.params.sampTaskId
      this.recordForm.classId = ''
      this.recordForm.secClassId = ''
      this.recordForm.sampleDate = ''
      this.downVisible = true
    },
    allDownload() {
      const url = '/api/word/downBlankSampleRecordByTaskId?taskId=' + this.recordForm.taskId
      window.open(url)
    },
    confirmDownload() {
      if (this.recordForm.taskId && this.recordForm.secClassId) {
        const url = '/api/word/downSampleRecordByTaskIdAndSecdClassId?taskId=' + this.recordForm.taskId + '&secdClassId=' + this.recordForm.secClassId
        window.open(url)
      } else {
        this.$message.warning('检测类别不能为空')
      }
    },
    goBack() {
      this.$router.go(-1)
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

  .demo-image__lazy {
    display: flex;
    overflow-y: auto;
  }
  .demo-image__lazy .el-image {
    display: block;
    max-height: 300px;
    width: 100%;
    margin-bottom: 10px;
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

  /deep/ .el-input.is-disabled .el-input__inner {
    color:unset
  }
  .clearfix {
    line-height: 40px;
    display: flex;
  }
</style>
