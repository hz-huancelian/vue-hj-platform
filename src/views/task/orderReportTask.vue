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
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleDetail(row)"> 查看任务</el-button>
          <div class="erc-divider-vertical" />
          <el-button v-if="row.scheduleFlag==='0'" type="text" @click="handleScheduler(row)"> 调度新增</el-button>
          <el-button v-if="row.scheduleFlag==='1'" type="text" @click="handleUpdateScheduler(row)"> 调度编辑</el-button>
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

    <!-- <el-dialog :title="taskTitle + ' 任务详情'" :visible.sync="taskVisible" center width="70%">
      <el-row>
        <el-col :span="12">
          <span>合同编号: {{ taskForm.contCode }}</span>
        </el-col>
        <el-col :span="12">
          <span>报价单号: {{ taskForm.offerId }}</span>
        </el-col>
      </el-row>
      <table class="info-table-new" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="background: #f5f5f5;">项目名称:</td>
          <td>{{ taskForm.projectName }}</td>
          <td style="background: #f5f5f5;">委托单位:</td>
          <td>{{ taskForm.consignorName }}</td>
        </tr>
        <tr>
          <td style="background: #f5f5f5;">委托联系人:</td>
          <td>{{ taskForm.consignorLinker }} </td>
          <td style="background: #f5f5f5;">委托联系人方式:</td>
          <td>{{ taskForm.consignorLinkerPhone }}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;padding-left:15px;">
            检测内容:
          </td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;padding-left:15px;">
            <el-row v-for="(item, index) in factorData" :key="index">
              <el-col :span="24" style="font-weight: bolder">{{ item.secdClassName + ':' }}</el-col>
              <el-col v-for="el in item.factList" :key="el.id" :span="24">
                {{ el.factorPoint + '（'+ el.dayCount +'*'+ el.frequency+'）: ' }}{{ el.showFactName }} <span v-if="el.fbFlag==='1'" style="color: red;"> (分包)</span>
              </el-col>
            </el-row>
          </td>
        </tr>
      </table>

    </el-dialog> -->

    <el-dialog title="任务分配" :visible.sync="taskSedVisible" width="80%" center top="5vh">
      <el-form ref="offerDisForm" :model="offerDisForm" :rules="OfferDisRules" label-width="130px">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span slot="label">
              任务基础信息<i class="el-input__icon " />
            </span>
          </div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="合同编号:">
                <el-input v-model="currentRow.contCode" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="项目名称:">
                <el-input v-model="currentRow.projectName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="委托单位:">
                <el-input v-model="offerDisForm.consignorName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="consignorLinker" label="委托联系人:">
                <el-input v-model="offerDisForm.consignorLinker" placeholder="委托联系人" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="consignorLinkerPhone" label="委托联系人电话:">
                <el-input v-model="offerDisForm.consignorLinkerPhone" placeholder="委托联系人电话" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="inspectionName" label="受检单位:">
                <el-input v-model="offerDisForm.inspectionName" placeholder="受检单位" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="inspectionLinker" label="受检联系人:">
                <el-input v-model="offerDisForm.inspectionLinker" placeholder="受检联系人" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="inspectionLinkerPhone" label="受检联系人电话:">
                <el-input v-model="offerDisForm.inspectionLinkerPhone" placeholder="受检联系人电话" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item prop="projectAddress" label="项目地址:">
                <div style="width: 100%;">

                  <el-select v-model="offerDisForm.province" placeholder="请选择省" style="width: 33%;" @change="getSubRegionByRegionCode('cityArray',$event)">
                    <el-option
                      v-for="item in provinceArray"
                      :key="item.regionCode"
                      :label="item.regionName"
                      :value="item.regionCode"
                    />
                  </el-select>
                  <el-select v-model="offerDisForm.city" placeholder="请选择市" style="width: 33%;" @change="getSubRegionByRegionCode('areaArray',$event)">
                    <el-option
                      v-for="item in cityArray"
                      :key="item.regionCode"
                      :label="item.regionName"
                      :value="item.regionCode"
                    />
                  </el-select>
                  <el-select v-model="offerDisForm.county" style="width: 33%;" placeholder="请选择区">
                    <el-option
                      v-for="item in areaArray"
                      :key="item.regionCode"
                      :label="item.regionName"
                      :value="item.regionCode"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-input v-model="offerDisForm.projectAddress" placeholder="请录入详细地址" style="width: 100%;" />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="startDate">
                <span slot="label">
                  开始日期
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="以预估的采样开始日期计，系统不做强制日期限制，仅做任务进度提示"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-date-picker
                  v-model="offerDisForm.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="endDate">
                <span slot="label">
                  结束日期
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="以预估的检测报告签发日期计，系统不做强制日期限制，仅做任务进度提示"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-date-picker
                  v-model="offerDisForm.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="checkGoal">
                <span slot="label">
                  检测目的
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="检测目的的内容会在最终的检测报告中展示"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-input v-model="offerDisForm.checkGoal" placeholder="检测目的" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input v-model="offerDisForm.jobRemark" placeholder="备注" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card title="" shadow="never" style="margin-top:10px">
          <div slot="header" class="clearfix">
            <span slot="label">
              选择待调度计划<i class="el-input__icon " />
            </span>
          </div>
          <el-table
            ref="multipleTable"
            :data="planTaskData"
            stripe
            highlight-current-row
            :header-cell-style="{background:'#ECF3FC'}"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" :selectable="checkSelectable" align="center" />
            <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="planName" label="计划名称" align="center" />
            <el-table-column prop="checkFreq" label="监测频次" align="center" />
            <el-table-column prop="checkFactorCnt" label="检测因子数" align="center" />
            <el-table-column label="调度进度" align="center">
              <template slot-scope="{row}">
                {{ row.scheduledTimes }}/{{ row.scheduleTimes }}
              </template>
            </el-table-column>
            <el-table-column prop="lastScheduleDate" label="上次调度日期" align="center" />
            <el-table-column label="计划调度完成进度" align="center">
              <template slot-scope="{row}">
                {{ row.finishTimes }}/{{ row.scheduleTimes }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="checkPlanDetail(row)">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 90px;" @click="taskSedVisible=false">取消</el-button>
        <el-button type="primary" style="width: 90px;" :disabled="multipleSelection.length === 0" @click="handlePreStep">下一步</el-button>
      </div>
    </el-dialog>

    <el-dialog append-to-body title="检测因子" :visible.sync="planFactorVisible" width="70%">
      <el-table :data="planFactorDetails" border stripe height="450">
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" width="100px" align="center" />
        <el-table-column prop="factorName" label="检测因子" align="center">
          <template slot-scope="{row}">
            {{ row.factorName }}{{ row.meanName&&row.meanName.length > 0?'('+ row.meanName +')':'' }}
          </template>
        </el-table-column>
        <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
        <el-table-column prop="factorPoint" label="检测位置" align="center" />
        <el-table-column prop="frequency" label="频次(次/天)" align="center" />
        <el-table-column prop="dayCount" label="天数" align="center" />
        <el-table-column label="次数" align="center">
          <template slot-scope="{row}">
            {{ Number(row.dayCount * row.frequency) }}
          </template>
        </el-table-column>
        <el-table-column label="是否分包" align="center">
          <template slot-scope="{row}">
            {{ row.fbFlag==='1'?"Y":"N" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="taskFacotyVisible" center append-to-body fullscreen>
      <el-card shadow="never">

        <div slot="header" class="clearfix">
          <span>任务检测因子<i class="el-input__icon" /></span>
          <el-button style="float: right; margin:4px 2px;" type="primary" plain size="mini" @click="addFactor">添加因子</el-button>
        </div>
        <el-table :data="offerDisForm.factorTdos" border stripe>
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="secdClassName" label="检测类别" width="100px" align="center" />
          <el-table-column prop="factorName" label="检测因子" align="center">
            <template slot-scope="{row}">
              {{ row.factorName }}{{ row.meanName&&row.meanName.length > 0?'('+ row.meanName +')':'' }}
            </template>
          </el-table-column>
          <el-table-column prop="standardNo" label="检测标准" min-width="130px" align="center" />
          <el-table-column prop="factorPoint" label="检测位置" align="center" />
          <el-table-column prop="frequency" label="频次(次/天)" align="center" />
          <el-table-column prop="dayCount" label="天数" align="center" />
          <el-table-column label="次数" align="center">
            <template slot-scope="{row}">
              {{ Number(row.dayCount * row.frequency) }}
            </template>
          </el-table-column>
          <el-table-column label="是否分包" align="center">
            <template slot-scope="{row}">
              {{ row.fbFlag==='1'?"Y":"N" }}
            </template>
          </el-table-column>
          <el-table-column prop="factorRemark" label="因子备注" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{$index}">
              <el-button type="text" @click="delFactor($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" style="width: 90px;" @click="handleNavStep">上一步</el-button>
        <el-button type="" style="width: 90px;" @click="taskFacotyVisible = false">取 消</el-button>
        <el-button type="info" style="width: 90px;" @click="handlePlanSave">保 存</el-button>
        <el-button type="primary" style="width: 90px;" @click="handlePlanConfirm">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="factorVisible" append-to-body width="85%" :close-on-click-modal="false" top="5vh">
      <factor-chose-list :clear-type="cleanAttr" @handleCancel="getTabStatus" @handleConfim="getResultForAdd" />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="factorVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmChoseFactor">确 认</el-button>
      </div> -->
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import FactorChoseList from '@/components/FactorChoseList'
import * as taskServer from '@/api/task'
import * as dictServer from '@/api/dict'
import { validPhone } from '@/utils/validate'
import { uuid } from 'vue-uuid'

const TASK_STATUS = {
  '0': '待调度',
  '1': '调度中',
  '2': '调度完成'
}
export default {
  components: { Pagination, FactorChoseList },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': '',
        '1': 'warning',
        '2': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value && value.length > 0) {
        if (validPhone(value)) {
          callback()
        } else {
          callback(new Error('输入正确的电话号码'))
        }
      } else {
        callback()
      }
    }
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
      taskData: [],
      taskVisible: false,
      taskForm: {
        projectName: '',
        offerId: '',
        contCode: '',
        consignorName: '',
        consignorLinker: '',
        consignorLinkerPhone: ''
      },
      factorData: [],
      factorTaskData: [],
      planTaskData: [],
      offerDisForm: {
        taskId: '',
        jobId: '',
        projectName: '',
        consignorName: '',
        consignorLinker: '',
        consignorLinkerPhone: '',
        inspectionName: '',
        inspectionLinker: '',
        inspectionLinkerPhone: '',
        startDate: '',
        endDate: '',
        projectAddress: '',
        province: '',
        city: '',
        county: '',
        checkGoal: '',
        jobRemark: '',
        factorTdos: []
      },
      OfferDisRules: {
        consignorLinker: [{ required: true, message: '请录入委托人', trigger: 'blur' }],
        consignorLinkerPhone: [{ required: true, message: '请录入委托人联系方式', trigger: 'blur' }],
        inspectionName: [{ required: true, message: '请录入受检单位', trigger: 'blur' }],
        inspectionLinker: [{ required: true, message: '请录入受检人', trigger: 'blur' }],
        inspectionLinkerPhone: [{ required: true, message: '请录入受检人联系方式', trigger: 'blur' }, { required: true, validator: validatePhone, trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        projectAddress: [{ required: true, message: '地址信息不能为空', trigger: 'blur' }]
      },
      provinceArray: [],
      cityArray: [],
      areaArray: [],
      currentRow: {},
      taskTitle: '',
      taskSedVisible: false,
      multipleSelection: [],
      planFactorVisible: false,
      planFactorDetails: [], // 因子列表-详情查看
      taskFacotyVisible: false,
      // 添加因子
      currentUUid: '',
      cleanAttr: '',
      choseFatcors: [],
      factorVisible: false,
      currentJobId: '',
      clearData: false

    }
  },
  created() {
    this.getProvince()
    this.handleSearch()
  },
  methods: {
    getProvince() {
      dictServer.getFirstLevel().then(res => {
        this.provinceArray = res.result
      })
    },
    getSubRegionByRegionCode(type, regionCode) {
      if (regionCode === 'cityArray') {
        this.offerDisForm.city = ''
        this.offerDisForm.county = ''
      } else {
        this.offerDisForm.county = ''
      }
      this.getRegionCode(type, regionCode)
    },
    getRegionCode(type, regionCode) {
      dictServer.getSubRegionByRegionCode(regionCode).then(res => {
        this[type] = res.result
      })
    },
    handleSearch() {
      taskServer.findByCondition(this.searchForm).then(res => {
        this.taskData = res.result.records || []
        this.total = res.result.total
      })
    },
    handleDetail(row) {
      this.$router.push(`/other/orderReportTaskList/${row.taskId}`)
    },
    doProcessData(data) {
      const parentArray = []
      if (data.length > 0) {
        const factMap = new Map()
        data.forEach(i => {
          const o = parentArray.find(j => j.secdClassName === i.secdClassName && j.fbFlag === i.fbFlag)
          if (!o) {
            parentArray.push({
              secdClassName: i.secdClassName,
              fbFlag: i.fbFlag,
              factList: []
            })
          }
          if (factMap.get(i.secdClassName + '-' + i.fbFlag)) {
            const ls = factMap.get(i.secdClassName + '-' + i.fbFlag)
            ls.push(i)
          } else {
            const li = []
            li.push(i)
            factMap.set(i.secdClassName + '-' + i.fbFlag, li)
          }
        })
        if (parentArray) {
          parentArray.forEach(e => {
            const flist = factMap.get(e.secdClassName + '-' + e.fbFlag)
            const nList = []
            if (flist) {
              flist.forEach(j => {
                const n = nList.find(x => {
                  if (x.factorPoint === j.factorPoint && x.frequency === j.frequency && x.dayCount === j.dayCount) {
                    if (x.showFactName === '') {
                      x.showFactName = j.factorName
                    } else {
                      x.showFactName = x.showFactName + ',' + j.factorName
                    }
                    return x
                  } else {
                    return null
                  }
                })
                if (!n) {
                  this.$set(j, 'showFactName', j.factorName)
                  this.$set(j, 'fbFlag', e.fbFlag)
                  nList.push(j)
                }
              })

              e.factList = nList.sort((a, b) => ((a.checkStandardId > b.checkStandardId) ? -1 : (a.checkStandardId < b.checkStandardId) ? 1 : 0))
            }
          })
        }
      }
      return parentArray
    },
    handleScheduler(row) {
      this.currentRow = row
      this.clearForm()
      this.offerDisForm.taskId = row.taskId
      this.offerDisForm.consignorName = row.consignorName
      this.offerDisForm.consignorLinker = row.consignorLinker
      this.offerDisForm.consignorLinkerPhone = row.consignorLinkerPhone

      this.offerDisForm.inspectionName = row.consignorName
      this.offerDisForm.inspectionLinker = row.consignorLinker
      this.offerDisForm.inspectionLinkerPhone = row.consignorLinkerPhone

      this.offerDisForm.jobId = row.jobId
      this.offerDisForm.projectName = row.projectName
      this.findPlanInfos(row.taskId, 1)
    },
    handleUpdateScheduler(row) {
      this.currentRow = row
      this.clearForm()
      // 获取任务对象
      taskServer.findJobByTaskId(row.taskId).then(res => {
        this.currentJobId = res.result.jobId || ''
        this.offerDisForm = res.result || {}
        this.offerDisForm.projectName = row.projectName
        this.offerDisForm.taskId = row.taskId
        this.offerDisForm.consignorName = row.consignorName
        // 获取地区信息
        if (this.offerDisForm.province) {
          this.getRegionCode('cityArray', this.offerDisForm.province)
        }
        if (this.offerDisForm.city) {
          this.getRegionCode('areaArray', this.offerDisForm.city)
        }
        debugger
        this.findPlanInfos(row.taskId, 2)
      })
    },
    findPlanInfos(taskId, type) {
      // 计划列表
      taskServer.findOfferPlanByTaskId(taskId).then(result => {
        if (result.code === 200) {
          this.planTaskData = result.result || []
          if (this.offerDisForm.offerPlanIds && this.offerDisForm.offerPlanIds.length > 0) {
            result.result.forEach(i => {
              if (this.offerDisForm.offerPlanIds.includes(i.offerPlanId)) {
                this.multipleSelection.push(i)
              }
            })
            this.multipleSelection.forEach(j => {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowSelection(j)
              })
            })
          }
          this.taskSedVisible = true
        }
      })
    },
    getTaskInfo(dispatchTaskId) {
      taskServer.getLastScheduInfoByTaskId(dispatchTaskId).then(res => {
        if (res.code === 200 && res.result) {
          this.offerDisForm = res.result
          // 获取 市区字典列表信息
          this.getSubRegionByRegionCode('cityArray', res.result.province)
          this.getSubRegionByRegionCode('areaArray', res.result.city)
          this.taskSedVisible = true
        }
      })
      taskServer.getOfferFactorByTaskId(dispatchTaskId).then(result => {
        if (result.code === 200) {
          this.factorTaskData = result.result || []
          this.taskSedVisible = true
        }
      })
    },
    confirmDialog() {
      if (this.offerDisForm.province &&
         this.offerDisForm.city &&
         this.offerDisForm.county) {
        this.$refs.offerDisForm.validate(valid => {
          if (valid) {
            taskServer.doScheduTask(this.offerDisForm).then(result => {
              if (result.code === 200) {
                this.$notify({
                  title: '成功',
                  message: result.message,
                  type: 'success'
                })
                this.handleSearch()
                this.taskSedVisible = false
              } else {
                this.$notify({
                  title: '失败',
                  message: result.message,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message.warning('请完善信息后在提交')
          }
        })
      } else {
        this.$message.warning('省、市、区信息不能为空')
      }
    },
    handleSelectionChange(val) {
      this.clearData = true
      this.multipleSelection = val
    },
    handleNavStep() {
      this.clearData = false
      this.taskFacotyVisible = false
    },
    handlePreStep() {
      // 处于编辑状态
      if (this.clearData) {
        if (this.currentJobId !== '') {
          taskServer.findJobFactorsById(this.currentJobId).then(res => {
            this.offerDisForm.factorTdos = res.result || []
            this.taskFacotyVisible = true
          })
        } else {
          if (this.multipleSelection.length >= 1) {
            const planIds = this.multipleSelection.map(i => i.offerPlanId)
            taskServer.findFactorsByOfferPlanIds({ offerPlanId: planIds.toString() }).then(res => {
              this.offerDisForm.factorTdos = res.result.map(i => {
                this.$set(i, 'factorRemark', i.remark)
                return i
              }) || []
              this.taskFacotyVisible = true
            })
          } else {
            this.$message.warning('至少选择一个计划信息!')
          }
        }
      } else {
        this.taskFacotyVisible = true
      }
    },
    checkPlanDetail(row) {
      taskServer.findFactorsByPlanId(row.offerPlanId).then(res => {
        this.planFactorDetails = res.result || []
      })
      this.planFactorVisible = true
    },
    delFactor(index) {
      this.offerDisForm.factorTdos.splice(index, 1)
    },
    handlePlanSave() { // 任务分配保存
      taskServer.saveScheduleJob(this.offerDisForm).then(result => {
        if (result.code === 200) {
          this.$notify({
            title: '成功',
            message: result.message,
            type: 'success'
          })
          this.handleSearch()
          this.taskSedVisible = false
          this.taskFacotyVisible = false
        } else {
          this.$notify({
            title: '失败',
            message: result.message,
            type: 'error'
          })
        }
      })
      // if (this.offerDisForm.province &&
      //    this.offerDisForm.city &&
      //    this.offerDisForm.county) {
      //   this.$refs.offerDisForm.validate(valid => {
      //     if (valid) {
      //       taskServer.saveScheduleJob(this.offerDisForm).then(result => {
      //         if (result.code === 200) {
      //           this.$notify({
      //             title: '成功',
      //             message: result.message,
      //             type: 'success'
      //           })
      //           this.handleSearch()
      //           this.taskSedVisible = false
      //           this.taskFacotyVisible = false
      //         } else {
      //           this.$notify({
      //             title: '失败',
      //             message: result.message,
      //             type: 'error'
      //           })
      //         }
      //       })
      //     } else {
      //       this.$message.warning('请完善信息后在提交')
      //     }
      //   })
      // } else {
      //   this.$message.warning('省、市、区信息不能为空')
      // }
    },
    handlePlanConfirm() {
      if (this.offerDisForm.province &&
         this.offerDisForm.city &&
         this.offerDisForm.county) {
        this.$refs.offerDisForm.validate(valid => {
          if (valid) {
            taskServer.confirmScheduleJob(this.offerDisForm).then(result => {
              if (result.code === 200) {
                this.$notify({
                  title: '成功',
                  message: result.message,
                  type: 'success'
                })
                this.handleSearch()
                this.taskSedVisible = false
                this.taskFacotyVisible = false
              } else {
                this.$notify({
                  title: '失败',
                  message: result.message,
                  type: 'error'
                })
              }
            })
          } else {
            this.$message.warning('请完善信息后在提交')
          }
        })
      } else {
        this.$message.warning('省、市、区信息不能为空')
      }
    },
    addFactor() {
      // 获取UUID
      this.cleanAttr = uuid.v4().replaceAll('-', '')
      this.factorVisible = true
    },

    getTabStatus(val) {
      if (!val) {
        this.factorVisible = false
      }
    },
    getResultForAdd(val) {
      this.offerDisForm.factorTdos = this.offerDisForm.factorTdos.concat(val)
      this.factorVisible = false
    },
    confirmChoseFactor() {},
    clearForm() {
      this.currentJobId = ''
      this.offerDisForm = {
        taskId: '',
        jobId: '',
        projectName: '',
        consignorName: '',
        consignorLinker: '',
        consignorLinkerPhone: '',
        inspectionName: '',
        inspectionLinker: '',
        inspectionLinkerPhone: '',
        startDate: '',
        endDate: '',
        projectAddress: '',
        province: '',
        city: '',
        county: '',
        checkGoal: '',
        jobRemark: '',
        factorTdos: []
      }
    },
    checkSelectable(item) {
      if (item.scheduledTimes >= item.scheduleTimes) {
        return false
      }
      return true
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
