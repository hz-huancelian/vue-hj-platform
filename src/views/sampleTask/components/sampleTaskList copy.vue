<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务单号:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="样品状态:">
            <el-select v-model="searchForm.sampTaskStatus" clearable filterable style="width:165px" placeholder="请选择状态">
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
        <el-table-column prop="sampTaskStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.sampTaskStatus | statusQualityFilter">
              {{ SAMPLE_STATUS[row.sampTaskStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <div v-if="scope.row.sampTaskStatus > 0" class="erc-divider-vertical" />
            <el-button v-if="scope.row.sampTaskStatus > 0" type="text" @click="handlePrint(scope.row)"> 标签打印</el-button>
            <div v-if="scope.row.sampTaskStatus === '0'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.sampTaskStatus === '0'" type="text" @click="handleSchedTask(scope.row)"> 任务分配</el-button>
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

    <el-dialog :title="taskTitle + ' 任务详情'" :visible.sync="taskVisible" center width="70%" top="5vh">
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
            工作要求:
          </td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: left;padding-left:15px;">
            <el-row v-for="(item, index) in factorData" :key="index">
              <el-col :span="24" style="font-weight: bolder">{{ item.secdClassName }}:</el-col>
              <el-col v-for="el in item.factList" :key="el.id" :span="24">
                {{ el.factorPoint + '（'+ el.dayCount +'*'+ el.frequency+'）: ' }}{{ el.showFactName }} <span v-if="el.fbFlag==='1'" style="color: red;">(分包)</span>
              </el-col>
            </el-row>
          </td>
        </tr>
      </table>

    </el-dialog>

    <el-dialog title="采样任务分配" :visible.sync="sampleTaskVisible" width="80%" top="2vh">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-form-item label="任务单号:">
              {{ currentRow.jobId }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="受检单位:">
              {{ currentRow.inspectionName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话:">
              {{ currentRow.inspectionLinkerPhone }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="要求完成时间:">
              {{ currentRow.startDate }}~{{ currentRow.endDate }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-tabs type="border-card">
        <el-tab-pane label="自检因子">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="4">
                  <span>自检因子信息<i class="el-input__icon " /></span>
                </el-col>
                <el-col :span="15" style="padding:10px; text-align:right;">
                  <span style="color:red;width: 100%;">注意：仅需选取需要合样的因子进行合样，剩余未合样的因子按照默认样品数采样。</span>
                </el-col>
                <el-col :span="5" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="moveFactors">剩余自成样品</el-button>
                  <el-button type="primary" plain size="mini" @click="mergeFactors">合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="24">
                <el-input v-model="showFactorName" placeholder="请录入因子名称" style="width: 250px;" />
              </el-col>
            </el-row>
            <el-table
              ref="choseTable"
              stripe
              size="small"
              :data="filterData"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%;padding-top: 10px"
              max-height="300px"
              @selection-change="handleSelectionChange"
              @select="handleSelect"
            >
              <el-table-column type="selection" width="50" :selectable="checkSelectable" align="center" />
              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="次数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template>
                  <el-tag type="">自检</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card shadow="never" style="margin-top: 10px;">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="6">
                  <span>合样列表<i class="el-input__icon " /></span>
                </el-col>
                <el-col :span="18" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="sortData">位置排序</el-button>
                  <el-button type="primary" plain size="mini" @click="delMergeData">移除合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-table
              :data="mergeData"
              size="small"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              max-height="400px"
              style="width: 100%"
            >
              <el-table-column type="index" width="50" align="center" label="序号" />

              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="160px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="样品数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column label="采样组长" align="center" width="135">
                <template slot-scope="{row}">
                  <el-select
                    slot="small"
                    v-model="row.collectLeaderId"
                    filterable
                    placeholder="请选择采样组长"
                    @change="handleChangeRow(row)"
                  >
                    <el-option
                      v-for="item in perGroups"
                      :key="item.userId"
                      :label="item.empName"
                      :value="item.userId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{row, $index}">
                  <el-button type="text" @click="delGroupRow(row, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-tab-pane>
        <el-tab-pane label="分包因子">

          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="4">
                  <span>分包因子信息<i class="el-input__icon " /></span>
                </el-col>
                <el-col :span="15" style="padding:10px; text-align:right;">
                  <span style="color:red;width: 100%;">注意：仅需选取需要合样的因子进行合样，剩余未合样的因子按照默认样品数采样。</span>
                </el-col>
                <el-col :span="5" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="moveOutFactors">剩余自成样品</el-button>
                  <el-button type="primary" plain size="mini" @click="mergeOutFactors">合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="24">
                <el-input v-model="showOutFactorName" placeholder="请录入因子名称" style="width: 250px;" />
              </el-col>
            </el-row>
            <el-table
              ref="choseOutTable"
              stripe
              size="small"
              :data="outFilterData"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%;padding-top: 10px"
              max-height="300px"
              @selection-change="handleOutSelectionChange"
              @select="handleOutSelect"
            >
              <el-table-column type="selection" width="45" :selectable="checkOutSelectable" align="center" />
              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="样品数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template>
                  <el-tag type="danger">分包</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card shadow="never" style="margin-top: 10px;">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="6">
                  <span>合样列表<i class="el-input__icon " /></span>
                </el-col>
                <el-col :span="18" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="sortOutData">位置排序</el-button>
                  <el-button type="primary" plain size="mini" @click="delMergeOutData">移除合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-table
              :data="mergeOutData"
              size="small"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              max-height="400px"
              style="width: 100%"
            >
              <el-table-column type="index" width="45" align="center" label="序号" />

              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="160px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="样品数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column label="采样组长" align="center" width="135">
                <template slot-scope="{row}">
                  <el-select
                    slot="small"
                    v-model="row.collectLeaderId"
                    filterable
                    placeholder="请选择采样组长"
                    @change="handleOutChangeRow(row)"
                  >
                    <el-option
                      v-for="item in perGroups"
                      :key="item.userId"
                      :label="item.empName"
                      :value="item.userId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{row, $index}">
                  <el-button type="text" @click="delOutGroupRow(row, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="sampleTaskVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as sampleServer from '@/api/sample'
import * as dictServer from '@/api/dict'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import qs from 'qs'
const SAMPLE_STATUS = {
  '0': '待分配',
  '1': '采样中'
}
export default {
  components: { Pagination },
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
        sampTaskStatus: '',
        pageNumber: 1,
        pageSize: 50
      },
      total: 0,

      taskTitle: '',
      taskVisible: false,
      factorData: [],
      factorDetailData: [], // 自检因子
      factorOldDetailData: [], // 自检因子历史
      factorOutDetailData: [], // 分包因子
      factorOldOutDetailData: [], // 分包因子历史
      taskForm: {
        projectName: '',
        offerId: '',
        contCode: '',
        consignorName: '',
        consignorLinker: '',
        consignorLinkerPhone: ''
      },
      sampleTaskVisible: false,
      currentRow: {},
      multipleSelection: [],
      multipleOutSelection: [],
      perGroups: [],
      mergeData: [],
      mergeOutData: [],
      currentSelectionRow: {
        secdClassId: '',
        factorPoint: '',
        frequency: '',
        dayCount: ''
      },
      currentOutSelectionRow: {
        secdClassId: '',
        factorPoint: '',
        frequency: '',
        dayCount: ''
      },
      showFactorName: '',
      showOutFactorName: ''
    }
  },
  computed: {
    filterData() {
      if (this.showFactorName && this.showFactorName.length > 0) {
        const reg = new RegExp(this.showFactorName.trim())
        return this.factorDetailData.filter(i => reg.test(i.factorName))
      }
      return this.factorDetailData
    },
    outFilterData() {
      if (this.showOutFactorName && this.showOutFactorName.length > 0) {
        const reg = new RegExp(this.showOutFactorName.trim())
        return this.factorOutDetailData.filter(i => reg.test(i.factorName))
      }
      return this.factorOutDetailData
    }
  },
  created() {
    this.getFactorPeople()
    this.handleSearch()
  },
  methods: {
    getFactorPeople() {
      dictServer.findSampLeaders().then(res => {
        this.perGroups = res.result || []
      })
    },
    handleSearch() {
      sampleServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.sampleData = res.result.records
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      // 获取数据
      this.taskTitle = row.projectName
      this.taskForm = Object.assign({}, row)
      sampleServer.getOfferFactorsByTaskId(row.sampTaskId).then(result => {
        if (result.code === 200 && result.result) {
          this.factorData = this.doProcessData(result.result)
          this.taskVisible = true
        }
      })
      // 封装展示数据
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
                    x.showFactName = x.showFactName + ',' + j.factorName
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

    handleSchedTask(row) {
      this.currentRow = Object.assign({}, row)
      // 获取因子列表
      this.factorDetailData = []
      this.factorOldDetailData = []
      this.mergeData = []

      this.factorOutDetailData = []
      this.factorOldOutDetailData = []
      this.mergeOutData = []

      // sampleServer.getOfferFactorsById(row.sampTaskId).then(result => {
      //   if (result.code === 200 && result.result) {
      //     this.factorDetailData = result.result || []
      //     this.factorOldDetailData = [...result.result] || []
      //   }
      //   this.sampleTaskVisible = true
      //   this.clearSelectionRow()
      // })
      // 获取自检因子列表
      sampleServer.getZjOfferFactorsByTaskId(row.sampTaskId).then(result => {
        if (result.code === 200 && result.result) {
          this.factorDetailData = result.result || []
          this.factorOldDetailData = [...result.result] || []
        }
        this.sampleTaskVisible = true
        this.clearSelectionRow()
      })
      // 获取分包因子列表
      sampleServer.getWbOfferFactorsByTaskId(row.sampTaskId).then(result => {
        if (result.code === 200 && result.result) {
          this.factorOutDetailData = result.result || []
          this.factorOldOutDetailData = [...result.result] || []
        }
        this.clearOutSelectionRow()
      })
    },
    confirmDialog() {
      if (this.factorDetailData && this.factorDetailData.length > 0) {
        this.$message.warning('剩余样品请进行自成样品操作！')
        return
      }
      debugger
      if (this.factorOutDetailData && this.factorOutDetailData.length > 0) {
        this.$message.warning('剩余分包样品请进行自成样品操作！')
        return
      }
      const b = this.mergeData.find(i => !i.collectLeaderId || i.collectLeaderId.length <= 0)
      if (b) {
        this.$message.error('采样组长不能为空')
        return
      }
      const wb = this.mergeOutData.find(i => !i.collectLeaderId || i.collectLeaderId.length <= 0)
      if (wb) {
        this.$message.error('分包样品采样组长不能为空')
        return
      }
      this.$confirm('确定提交合样?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取自检信息
        const resSdata = this.factorDetailData.map(i => {
          const { collectLeaderId, offerFactorId } = i
          return { collectLeaderId, offerFactorId, sampleType: '0' }
        })
        const resEdata = this.mergeData.map(i => {
          const { collectLeaderId, offerFactorId } = i
          return { collectLeaderId, offerFactorId, sampleType: '0' }
        })
        const mineParams = resSdata.concat(resEdata)
        // 获取分包
        let outParams = []
        if (this.mergeOutData && this.mergeOutData.length > 0) {
          const resOutSdata = this.factorOutDetailData.map(i => {
            const { collectLeaderId, offerFactorId } = i
            return { collectLeaderId, offerFactorId, sampleType: '1' }
          })
          const resOutEdata = this.mergeOutData.map(i => {
            const { collectLeaderId, offerFactorId } = i
            return { collectLeaderId, offerFactorId, sampleType: '1' }
          })
          outParams = resOutSdata.concat(resOutEdata)
        }
        const seParams = mineParams.concat(outParams)
        const data = {
          sampTaskId: this.currentRow.sampTaskId,
          params: seParams
        }
        sampleServer.combinedSampleAndAssignments(qs.stringify({ param: JSON.stringify(data) })).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.sampleTaskVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
    },
    delGroupRow(item, index) {
      const its = item.offerFactorId.split(',')
      its.forEach(i => {
        const obj = this.factorOldDetailData.find(j => j.offerFactorId === i)
        if (obj) {
          this.factorDetailData.push(obj)
        }
      })
      this.mergeData.splice(index, 1)
    },
    delOutGroupRow(item, index) {
      const its = item.offerFactorId.split(',')
      its.forEach(i => {
        const obj = this.factorOldOutDetailData.find(j => j.offerFactorId === i)
        if (obj) {
          this.factorOutDetailData.push(obj)
        }
      })
      this.mergeOutData.splice(index, 1)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleOutSelectionChange(val) {
      this.multipleOutSelection = val
    },
    clearSelectionRow() {
      this.currentSelectionRow = {
        secdClassId: '',
        factorPoint: '',
        frequency: '',
        dayCount: ''
      }
    },
    clearOutSelectionRow() {
      this.currentOutSelectionRow = {
        secdClassId: '',
        factorPoint: '',
        frequency: '',
        dayCount: ''
      }
    },
    handleSelect(selection, row) {
      if (selection.length > 0) {
        this.currentSelectionRow.secdClassId = row.secdClassId
        this.currentSelectionRow.factorPoint = row.factorPoint
        this.currentSelectionRow.frequency = row.frequency
        this.currentSelectionRow.dayCount = row.dayCount
      } else {
        this.clearSelectionRow()
      }
    },
    handleOutSelect(selection, row) {
      if (selection.length > 0) {
        this.currentOutSelectionRow.secdClassId = row.secdClassId
        this.currentOutSelectionRow.factorPoint = row.factorPoint
        this.currentOutSelectionRow.frequency = row.frequency
        this.currentOutSelectionRow.dayCount = row.dayCount
      } else {
        this.clearOutSelectionRow()
      }
    },
    checkRow(item) {
      if (!this.currentSelectionRow.secdClassId || this.currentSelectionRow.secdClassId === '') {
        return true
      }
      if (item.secdClassId === this.currentSelectionRow.secdClassId &&
        item.factorPoint === this.currentSelectionRow.factorPoint &&
        item.frequency === this.currentSelectionRow.frequency &&
        item.dayCount === this.currentSelectionRow.dayCount) {
        return true
      }
      return false
    },
    checkSelectable(row) {
      return this.checkRow(row)
    },
    checkOutSelectable(item) {
      if (!this.currentOutSelectionRow.secdClassId || this.currentOutSelectionRow.secdClassId === '') {
        return true
      }
      if (item.secdClassId === this.currentOutSelectionRow.secdClassId &&
        item.factorPoint === this.currentOutSelectionRow.factorPoint &&
        item.frequency === this.currentOutSelectionRow.frequency &&
        item.dayCount === this.currentOutSelectionRow.dayCount) {
        return true
      }
      return false
    },
    delMergeData() {
      this.mergeData = []
      this.factorDetailData = [...this.factorOldDetailData]
      this.clearSelectionRow()
      this.$refs.choseTable.clearSelection()
    },
    delMergeOutData() {
      this.mergeOutData = []
      this.factorOutDetailData = [...this.factorOldOutDetailData]
      this.clearOutSelectionRow()
      this.$refs.choseOutTable.clearSelection()
    },
    sortData() {
      this.mergeData.sort(function(a, b) {
        if (a.secdClassId === b.secdClassId) {
          return a.factorPoint - b.factorPoint
        }
        return b.secdClassId - a.secdClassId
      })
      this.mergeData.reverse()
    },
    sortOutData() {
      this.mergeOutData.sort(function(a, b) {
        if (a.secdClassId === b.secdClassId) {
          return a.factorPoint - b.factorPoint
        }
        return b.secdClassId - a.secdClassId
      })
      this.mergeOutData.reverse()
    },
    moveFactors() {
      if (this.factorDetailData && this.factorDetailData.length > 0) {
        this.factorDetailData.forEach(item => {
          this.mergeData.push({ ...item, collectLeaderId: '' })
        })
        this.factorDetailData = []
        this.clearSelectionRow()
      }
    },
    moveOutFactors() {
      if (this.factorOutDetailData && this.factorOutDetailData.length > 0) {
        this.factorOutDetailData.forEach(item => {
          this.mergeOutData.push({ ...item, collectLeaderId: '' })
        })
        this.factorOutDetailData = []
        this.clearOutSelectionRow()
      }
    },
    mergeFactors() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        // this.$confirm('确定合样?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        var choseItem = {}
        this.multipleSelection.forEach(item => {
          if (choseItem && choseItem.offerFactorId) {
            choseItem.factorName += ',' + item.factorName
            choseItem.offerFactorId += ',' + item.offerFactorId
          } else {
            choseItem = { ...item, collectLeaderId: '' }
          }
          // 列表中移除
          const index = this.factorDetailData.indexOf(item)
          this.factorDetailData.splice(index, 1)
        })
        this.mergeData.push(choseItem)
        this.multipleSelection = []
        this.clearSelectionRow()
        this.$refs.choseTable.clearSelection()
        // })
      } else {
        this.$message.error('至少选择一个因子合样')
      }
    },
    mergeOutFactors() {
      if (this.multipleOutSelection && this.multipleOutSelection.length > 0) {
        var choseItem = {}
        this.multipleOutSelection.forEach(item => {
          if (choseItem && choseItem.offerFactorId) {
            choseItem.factorName += ',' + item.factorName
            choseItem.offerFactorId += ',' + item.offerFactorId
          } else {
            choseItem = { ...item, collectLeaderId: '' }
          }
          // 列表中移除
          const index = this.factorOutDetailData.indexOf(item)
          this.factorOutDetailData.splice(index, 1)
        })
        this.mergeOutData.push(choseItem)
        this.multipleOutSelection = []
        this.clearOutSelectionRow()
        this.$refs.choseOutTable.clearSelection()
      } else {
        this.$message.error('至少选择一个因子合样')
      }
    },
    handlePrint(row) {
      this.$router.push(`/sampleDetail/${row.sampTaskId}`)
    },
    handleChangeRow(row) {
      this.mergeData.forEach(i => {
        if (!i.collectLeaderId || i.collectLeaderId === '') {
          if (row.factorPoint === i.factorPoint) {
            this.$set(i, 'collectLeaderId', row.collectLeaderId)
          }
        }
      })
    },
    handleOutChangeRow(row) {
      this.mergeOutData.forEach(i => {
        if (!i.collectLeaderId || i.collectLeaderId === '') {
          if (row.factorPoint === i.factorPoint) {
            this.$set(i, 'collectLeaderId', row.collectLeaderId)
          }
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
