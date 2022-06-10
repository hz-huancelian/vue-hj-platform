<template>
  <div class="app-continer">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item>
            <el-input v-model="searchForm.sampleNo" style="width:165px" placeholder="样品编号" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.factorName" style="width:165px" placeholder="因子名称" />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.checkStatus"
              clearable
              filterable
              style="width:165px"
              placeholder="检测状态"
            >
              <el-option
                v-for="item in Object.keys(CHECK_STATUS)"
                :key="item"
                :label="CHECK_STATUS[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
            <el-button type="primary" class="iconfont icon-fanhui" @click="goBack"> 返回</el-button>
            <el-button type="primary" @click="batchApply">一键申请领样</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="checkData"
      stripe
      border
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
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column prop="factorName" label="检测因子" width="130px" align="center" />
      <el-table-column prop="sampleNo" label="样品编号" width="160px" align="center" />
      <el-table-column prop="factorPoint" label="采样点位" width="110px" align="center" />
      <el-table-column prop="dayAndCount" label="频次(次/天)" width="120px" align="center" />
      <el-table-column prop="standardName" label="检测标准" min-width="220px" align="center" />
      <el-table-column prop="checkRes" label="检测结果" min-width="150px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.checkRes && row.checkRes.length >0">
            {{ row.masterRes }}
            <template v-if="row.exponRes!==''&&row.exponRes!==0">×10<sup>{{ row.exponRes }}</sup></template>
            {{ row.unitName && row.unitName!=='无量纲'?' ' + row.unitName:'' }}
          </template>
          <template v-else />
        </template>
      </el-table-column>
      <el-table-column prop="assignUser" label="分析员" align="center" />
      <el-table-column prop="collectTime" label="采样时间" width="160" align="center">
        <template slot-scope="{row}">
          <template v-if="row.collectTime || row.collectDate">
            {{ row.collectTime && row.collectTime!=''?((row.collectDate?(row.collectDate + ' '):'')+row.collectTime):row.collectDate }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="storeTime" label="入库时间" width="160" align="center" />
      <!-- <el-table-column prop="endDate" label="任务截止时间" width="120px" align="center" /> -->
      <el-table-column prop="dataEntryStep" label="样品归类" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.sampleType ==='1'?'danger':''">
            {{ row.sampleType ==='1'?"样品分包":"样品自检" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="checkStatus" label="检测状态" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.checkStatus|statusQualityFilter">
            {{ CHECK_STATUS[row.checkStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="190" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.checkStatus>2" type="text" @click="handleDetail(row)">查看</el-button>
          <div v-if="row.checkStatus>2" class="erc-divider-vertical" />
          <el-button type="text" @click="handleLocalDetail(row)">采样记录</el-button>
          <div v-if="row.assignUserId === userId && row.checkStatus==='0'" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && row.checkStatus==='0' && row.secdClassName !=='噪声'" type="text" @click="handleApply(row)">申请领样</el-button>
          <div v-if="row.assignUserId === userId && (row.checkStatus==='2' ||row.checkStatus==='6')" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && (row.checkStatus==='2' ||row.checkStatus==='3' ||row.checkStatus==='6')" type="text" @click="handleSetResult(row)">结果录入</el-button>
          <div v-if="row.assignUserId === userId && row.checkStatus==='3'" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && row.checkStatus==='3' " type="text" @click="handleApprove(row.checkFactorId)">提交审核</el-button>
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

    <el-dialog title="检测详情" :visible.sync="detailVisible" width="70%" center top="5vh">
      <div style="width: 700px;margin:0 auto;">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="样品编号:">{{ sampleForm.sampleNo }}</el-form-item>
          <el-form-item label="检测因子:">{{ sampleForm.factorName }}</el-form-item>
          <el-form-item label="检测标准:">{{ sampleForm.standardName }}</el-form-item>
          <el-form-item label="因子备注:">{{ sampleForm.factorRemark }}</el-form-item>
          <el-form-item label="检测备注:">{{ sampleForm.remark }}</el-form-item>
          <el-form-item label="检测结果:">
            <template v-if="sampleForm.factorSubsetVos && sampleForm.factorSubsetVos.length >0">
              <el-table
                :data="sampleForm.factorSubsetVos"
                border
                style="width:100%;"
                :header-cell-style="{background:'#ECF3FC'}"
              >
                <el-table-column prop="factorName" label="套餐因子" align="center" />
                <el-table-column prop="name" label="检测结果" align="center">
                  <template slot-scope="{row}">
                    {{ row.factorInfo&&row.factorInfo.v1?row.factorInfo.v1:0 }}
                    <template v-if="row.factorInfo&&row.factorInfo.v2!==''&&row.factorInfo.v2!==0">
                      ×10<sup>{{ row.factorInfo.v2?Number(row.factorInfo.v2):0 }}</sup>
                    </template>
                    {{ row.unitName && row.unitName!=='无量纲'&& sampleForm.unitName!=null?' ' + row.unitName:'' }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-else-if="sampleForm.checkRes && sampleForm.checkRes.length > 0">
              {{ sampleForm.factorInfo&&sampleForm.factorInfo.v1?sampleForm.factorInfo.v1:0 }}
              <template v-if="sampleForm.factorInfo&&sampleForm.factorInfo.v2!==''&&sampleForm.factorInfo.v2!==0">
                ×10<sup>{{ sampleForm.factorInfo.v2?Number(sampleForm.factorInfo.v2):0 }}</sup>
              </template>
              {{ sampleForm.unitName && sampleForm.unitName!=='无量纲'&& sampleForm.unitName!=null?' ' + sampleForm.unitName:'' }}
            </template>
            <template v-else>暂无检测结果</template>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="样品结果录入" :visible.sync="testResultVisible" width="70%" center top="5vh">
      <div style="width: 700px;margin:0 auto;">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="样品编号:">{{ testResultForm.sampleNo }}</el-form-item>
          <el-form-item label="检测因子:">{{ testResultForm.factorName }}</el-form-item>
          <el-form-item label="检测标准:">{{ testResultForm.standardName }}</el-form-item>
          <el-form-item>
            <span slot="label">
              备注信息
              <el-popover
                placement="top-start"
                title=""
                width="300"
                trigger="hover"
                content="新建报价单时业务员录入的针对检测因子的备注信息"
              >
                <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
              </el-popover>
              :
            </span>
            {{ testResultForm.factorRemark }}
          </el-form-item>
          <el-form-item label="检测结果:">
            <el-row v-for="(item, index) in subFactorData" :key="index">
              <el-col :span="4" style="text-align: right;padding-bottom: 5px;">
                {{ item.name }}:
              </el-col>
              <el-col :span="9" style="margin-left:10px;padding-bottom: 5px;">
                <el-input v-model="item.masterRes" type="Number" controls-position="right" :min="0" placeholder="结果值">
                  <template slot="append">E</template>
                </el-input>
              </el-col>
              <el-col :span="9" style="margin-left:10px;padding-bottom: 5px;">
                <el-input v-model="item.subRes" type="Number" controls-position="right" :min="0" placeholder="幂数">
                  <template v-if="item.unitName" slot="append">{{ item.unitName }}</template>
                </el-input>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">例:3.45E2=3.45×10²  ;  234E0=234 ; 1.62E-3=1.62×10⁻³</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">无子因子的：输入0代表未检出</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">有子因子的：输入0代表未检出，不填代表未检查此项</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              备注
              <el-popover
                placement="top-start"
                title=""
                width="300"
                trigger="hover"
                content="分析员录入结果时录入的备注信息，可流转到实验室负责人和报告部门"
              >
                <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
              </el-popover>
              :
            </span>
            <el-input v-model="testResultForm.remark" type="textarea" maxlength="50" show-word-limit placeholder="备注信息" :rows="3" />
          </el-form-item>
          <el-form-item label="检测设备:">
            <el-row>
              <el-col :span="8">
                <el-select v-model="equipmentType" placeholder="设备分类" style="width: 170px;" @change="handleChangeEqu">
                  <el-option
                    v-for="(item,index) in level"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="equipmentClass" clearable placeholder="请选择设备型号" style="width: 170px;" @change="handleChangeEquType">
                  <el-option
                    v-for="(item,index) in levelTwo"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select v-model="equipmentId" clearable placeholder="请选择设备编号" style="width: 170px;">
                  <el-option
                    v-for="item in levelThree"
                    :key="item.id"
                    :label="item.equipmentNumber"
                    :value="item.id"
                  />
                </el-select>

              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testResultVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmChecks">保存</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as stockServer from '@/api/stock'
import * as checkServer from '@/api/check'
import { laboratoryEquipmentTree } from '@/api/equipment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import qs from 'qs'
const CHECK_STATUS = {
  '0': '待领样',
  '1': '领样已申请',
  '2': '待检测',
  '6': '审核失败'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0') {
        return 'info'
      } else if (status === '2') {
        return ''
      } else if (status === '1' || status === '4') {
        return ''
      } else if (status === '3' || status === '5') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  props: {
    checkTaskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      props: { multiple: true },
      CHECK_STATUS,
      checkData: [],
      searchForm: {
        checkTaskId: '',
        sampleNo: '',
        factorName: '',
        checkStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      detailVisible: false,
      sampleForm: {
        factorInfo: {},
        subFactors: {}
      },
      subSampleData: [],
      testResultVisible: false,
      testResultForm: {
        checkFactorId: '',
        checkRes: '',
        checkSubRes: '',
        remark: ''
      },
      subFactorData: [],
      sampleVisible: false,
      sampleDetails: [],
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
      sampleImageList: [],
      sampleImage: '',
      multipleSelection: [],
      level: [],
      levelTwo: [],
      levelThree: [],
      equipmentType: '',
      equipmentClass: '',
      equipmentId: '',
      sampleDataInfo: [],
      sampleSecInfo: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    if (this.checkTaskId && this.checkTaskId.length > 0) {
      this.searchForm.checkTaskId = this.checkTaskId
    }
    this.getEquipment()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      if (this.checkTaskId && this.checkTaskId.length > 0) {
        checkServer.findCheckTaskDetailByCondition0(this.searchForm).then(res => {
          if (res.code === 200) {
            this.checkData = res.result.records.map(i => {
              if (i.checkRes && i.checkRes !== '') {
                const ob = JSON.parse(i.checkRes)
                this.$set(i, 'masterRes', ob.v1 ? ob.v1 : '')
                this.$set(i, 'exponRes', ob.v2 ? ob.v2 : '')
              } else {
                this.$set(i, 'masterRes', '')
                this.$set(i, 'exponRes', '')
              }
              return i
            }) || []
            this.total = res.result.total
          }
        })
      }
    },
    handleDetail(row) {
      this.sampleForm = { ...row }
      if (row.factorSubsetVos && row.factorSubsetVos.length > 0) {
        this.sampleForm.factorSubsetVos.forEach(i => {
          const factorInfo = JSON.parse(i.checkSubRes)
          this.$set(i, 'factorInfo', factorInfo)
        })
      }
      if (row.checkRes && row.checkRes.length > 0) {
        const factorInfo = JSON.parse(row.checkRes)
        this.$set(this.sampleForm, 'factorInfo', factorInfo)
      }
      this.detailVisible = true
    },
    handleLocalDetail(row) {
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchApply() {
      // const testObj = this.multipleSelection.find(f => f.checkStatus !== '0')
      // if (testObj) {
      //   this.$message.error('必须全是待领样状态才能进行批量处理!')
      //   return
      // }
      // 获取满足条件的样品列表
      const sampleInfos = this.checkData.filter(i => i.checkStatus === '0')
      if (!sampleInfos || sampleInfos.length === 0) {
        this.$message.error('当前样品不需要领样操作!')
        return
      }
      this.$confirm('确定批量申请领样?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkFactorIds = sampleInfos.map(i => {
          return i.checkFactorId
        })
        checkServer.batchSampDrawApply(qs.stringify({ checkFactorId: checkFactorIds.toString() })).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      })
    },
    handleApply(row) {
      this.$confirm('确定申请领样?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkServer.sampDrawApply(qs.stringify({ checkFactorId: row.checkFactorId })).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
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
    handleSetResult(row) {
      this.testResultForm = { ...row }
      this.subFactorData = []
      if (row.factorSubsetVos && row.factorSubsetVos.length > 0) {
        this.subFactorData = row.factorSubsetVos.map(m => {
          return {
            id: m.id,
            name: m.factorName,
            masterRes: '',
            subRes: '',
            unitName: m.unitName
          }
        })
      } else {
        this.subFactorData = [{
          name: row.factorName,
          masterRes: '',
          subRes: '',
          unitName: row.unitName
        }]
      }
      this.testResultVisible = true
    },
    handleApprove(id) {
      this.$confirm('确认提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkServer.submitCheckFactor({ 'checkFactorId': id }).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      })
    },
    confirmChecks() {
      this.$confirm('确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const equipmentInfo = this.levelThree.find(i => i.id === this.equipmentId)

        let data
        if (this.testResultForm.isFactor === '0') { // 正常因子
          const checkResInfo = {
            name: this.subFactorData[0].name,
            v1: this.subFactorData[0].masterRes,
            v2: this.subFactorData[0].subRes
          }
          data = {
            checkFactorId: this.testResultForm.checkFactorId,
            checkRes: JSON.stringify(checkResInfo),
            remark: this.testResultForm.remark,
            checkEquipment: JSON.stringify(equipmentInfo)
          }
        } else {
          const checkResInfo = this.subFactorData.map(i => {
            const resInfo = {
              name: i.name,
              v1: i.masterRes,
              v2: i.subRes
            }
            return {
              id: i.id,
              unitName: i.unitName,
              checkSubRes: JSON.stringify(resInfo)
            }
          })
          data = {
            checkFactorId: this.testResultForm.checkFactorId,
            checkRes: '',
            factorSubsetVos: checkResInfo,
            remark: this.testResultForm.remark,
            checkEquipment: JSON.stringify(equipmentInfo)
          }
        }
        checkServer.saveCheckFactorData(data).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.testResultVisible = false
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      })
    },
    goBack() {
      this.$router.back()
    },
    getEquipment() {
      this.level = []
      this.levelTwo = []
      this.levelThree = []
      laboratoryEquipmentTree().then(res => {
        if (res.result) {
          const treeData = res.result ? res.result : []
          if (treeData !== '') {
            this.level = treeData
          }
        }
      })
    },
    handleChangeEqu(val) {
      this.levelTwo = []
      this.levelThree = []
      const o = this.level.find(i => i.name === val)
      if (o) {
        this.levelTwo = o.children || []
      }
    },
    handleChangeEquType(val) {
      this.levelThree = []
      const o = this.levelTwo.find(i => i.name === val)
      if (o) {
        this.levelThree = o.children || []
      }
      debugger
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
  /deep/ .el-input.is-disabled .el-input__inner {
    color:unset
  }
    .demo-image__lazy {
    height: 300px;
    overflow-y: auto;
  }
  .demo-image__lazy .el-image {
    display: block;
    max-height: 300px;
    width: 100%;
    margin-bottom: 10px;
  }
  .clearfix {
    line-height: 40px;
    display: flex;
  }
</style>
