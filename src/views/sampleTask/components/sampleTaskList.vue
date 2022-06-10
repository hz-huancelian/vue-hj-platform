<template>
  <div class="tab-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务单号:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="任务状态:">
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
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
        <el-table-column prop="sampTaskStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.sampTaskStatus | statusQualityFilter">
              {{ SAMPLE_STATUS[row.sampTaskStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <div class="erc-divider-vertical" />
            <el-button v-if="scope.row.sampTaskStatus > 1" type="text" @click="handlePrint(scope.row)"> 标签打印</el-button>
            <el-button v-if="scope.row.sampTaskStatus <2" type="text" @click="handleSchedTask(scope.row)"> 合样</el-button>
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

    <el-dialog title="合样" :visible.sync="sampleTaskVisible" width="80%" :close-on-click-modal="false" top="1vh">
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
      <el-card shadow="never" style="margin-top:10px;padding-bottom: 10px">
        <div slot="header" class="clearfix">
          <span slot="label">
            采样位置分配 <i class="el-input__icon " />
            <el-popover
              placement="top-start"
              title=""
              width="300"
              trigger="hover"
              content="该采样任务分配信息仅作为给采样组长的提示信息，不与后续流程强关联，采样负责人也可以不分配。建议该位置分配给哪个组长就由该组长进行合样操作。"
            >
              <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
            </el-popover>
          </span>
          <el-button v-if="roles.indexOf('Pm') > -1" slot="small" style="float: right; margin:4px 2px;" type="primary" :disabled="multipleLeaderSelection.length==0" plain @click="choseLeader">确认</el-button>
          <el-select
            v-if="roles.indexOf('Pm') > -1"
            slot="small"
            v-model="leaderfactorPoint"
            style="float: right; margin:4px 2px; width: 250px;"
            filterable
            multiple
            placeholder="请选择采样组长"
          >
            <el-option
              v-for="item in perGroups"
              :key="item.userId"
              :label="item.empName"
              :value="item.userId"
            />
          </el-select>
        </div>
        <el-table
          ref="pointAddressInfo"
          :data="pointAddress"
          border
          stripe
          max-height="300"
          @selection-change="handleLeaderSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" width="50" label="序号" align="center" />
          <el-table-column prop="factorPoint" label="检测位置" align="center" />
          <el-table-column prop="sampleUsers" label="采样组长" align="center" />
        </el-table>
      </el-card>
      <el-card shadow="never" style="margin-top:10px;padding-bottom: 10px">
        <div slot="header" class="clearfix">
          <span slot="label">
            合样操作备忘录<i class="el-input__icon " />
            <el-popover
              placement="top-start"
              title=""
              width="300"
              trigger="hover"
              content="您可以录入任意备忘录信息以协同合样操作，采样负责人和采样组长都可以在文本框中增添信息并查看"
            >
              <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
            </el-popover>
          </span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-input v-model="combinedRemark" type="textarea" :rows="3" placeholder="请输入备注信息" />
          </el-col>
        </el-row>
      </el-card>
      <el-tabs type="border-card">
        <el-tab-pane label="自检因子">
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="4">
                  <span>自检因子信息<i class="el-input__icon " /></span>
                </el-col>
                <el-col :span="15" style="padding:10px; text-align:left;">
                  <span style="color:red;width: 100%;">注意：选择需要合样的因子进行“合样”操作，其他不需要合样的因子可以在合样完成后，点击“全选”按钮，进行“自成样品”操作。</span>
                </el-col>
                <el-col :span="5" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="moveFactors">自成样品</el-button>
                  <el-button type="primary" plain size="mini" @click="mergeFactors">合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="4">
                &nbsp;
                <el-button type="text" @click="toggleZjSelection(0)">全选</el-button>
                <el-button type="text" @click="toggleZjSelection(1)">取消</el-button>
              </el-col>
              <el-col :span="20" style="text-align: right;">
                <el-input v-model="showFactorName" placeholder="请录入因子名称" style="width: 250px;padding-bottom: 5px;" />
              </el-col>
            </el-row>
            <el-table
              ref="choseTable"
              stripe
              border
              size="small"
              :data="filterData"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%;"
              max-height="400px"
              @selection-change="handleSelectionChange"
              @select="handleSelect"
            >
              <el-table-column type="selection" width="50" :selectable="checkSelectable" align="center" />
              <el-table-column prop="secdClassName" label="检测类别" :filters="zjClassNames" :filter-method="filterZJClass" :column-key="'secdClassName'" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="200px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" :filters="zjFactorNames" :filter-method="filterZjTable" :column-key="'factorPoint'" align="center" />
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
              <span>合样列表<i class="el-input__icon " /></span>
              <!-- <el-button type="primary" plain size="mini" @click="sortData">位置排序</el-button> -->
              <!-- <el-button type="primary" plain size="mini" style="float: right; margin:4px 2px;" @click="delMergeData">移除合样</el-button> -->
              <!-- <el-button v-if="roles.indexOf('Pm') > -1" slot="small" style="float: right; margin:4px 2px;" type="primary" :disabled="multipleSampleSelection.length==0" plain @click="choseSampleLeader">确认</el-button> -->
              <el-select
                v-if="roles.indexOf('Pm') > -1"
                slot="small"
                v-model="mergeOnline"
                style="float: right; margin:4px 2px; width: 250px;"
                filterable
                clearable
                placeholder="请选择采样组长"
                @change="handleOnlineChangeRow()"
              >
                <el-option
                  v-for="item in perGroups"
                  :key="item.userId"
                  :label="item.empName"
                  :value="item.userId"
                />
              </el-select>
            </div>
            <el-table
              ref="mergerInfo"
              border
              :data="mergeData"
              size="small"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              max-height="400px"
              style="width: 100%"
              @selection-change="handleMergeChange"
            >
              <el-table-column v-if="roles.indexOf('Pm') > -1" align="center" type="selection" width="50" />
              <el-table-column type="index" width="50" align="center" label="序号" />
              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="200px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="样品数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column prop="sampleUser" label="采样组长" align="center" width="135" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row, $index}">
                  <el-button v-if="roles.indexOf('Pm') > -1 || userInfo.userId === row.sampleUserId" type="text" @click="delGroupRow(row, $index)">删除</el-button>
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
                  <span style="color:red;width: 100%;">注意：选择需要合样的因子进行“合样”操作，其他不需要合样的因子可以在合样完成后，点击“全选”按钮，进行“自成样品”操作。</span>
                </el-col>
                <el-col :span="5" style="padding: 5px;text-align:right">
                  <el-button type="primary" plain size="mini" @click="moveOutFactors">自成样品</el-button>
                  <el-button type="primary" plain size="mini" @click="mergeOutFactors">合样</el-button>
                </el-col>
              </el-row>
            </div>
            <el-row>
              <el-col :span="4">
                &nbsp;
                <el-button type="text" @click="toggleFbSelection(0)">全选</el-button>
                <el-button type="text" @click="toggleFbSelection(1)">取消</el-button>
              </el-col>
              <el-col :span="20" style="text-align: right;">
                <el-input v-model="showOutFactorName" placeholder="请录入因子名称" style="width: 250px;padding-bottom: 5px" />
              </el-col>
            </el-row>
            <el-table
              ref="choseOutTable"
              stripe
              border
              size="small"
              :data="outFilterData"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              style="width: 100%;marggin-top: 10px"
              max-height="300px"
              @selection-change="handleOutSelectionChange"
              @select="handleOutSelect"
            >
              <el-table-column type="selection" width="45" :selectable="checkOutSelectable" align="center" />
              <el-table-column prop="secdClassName" label="检测类别" :filters="wbClassNames" :filter-method="filterFbClass" :column-key="'secdClassName'" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="200px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" :filters="wbFactorNames" :filter-method="filterFbTable" :column-key="'factorPoint'" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="次数" align="center">
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
              <span>分包合样列表<i class="el-input__icon " /></span>
              <el-select
                v-if="roles.indexOf('Pm') > -1"
                slot="small"
                v-model="mergeOutOnline"
                style="float: right; margin:4px 2px; width: 250px;"
                filterable
                placeholder="请选择采样组长"
                @change="handleOutOnlineChangeRow()"
              >
                <el-option
                  v-for="item in perGroups"
                  :key="item.userId"
                  :label="item.empName"
                  :value="item.userId"
                />
              </el-select>
              <!-- <el-button type="primary" plain size="mini" @click="delMergeOutData">移除合样</el-button> -->
            </div>
            <el-table
              ref="mergeOutRef"
              border
              :data="mergeOutData"
              size="small"
              highlight-current-row
              :header-cell-style="{background:'#ECF3FC'}"
              max-height="400px"
              style="width: 100%"
              @selection-change="handleMergeOutChange"
            >
              <el-table-column v-if="roles.indexOf('Pm') > -1" type="selection" align="center" width="50" />
              <el-table-column type="index" width="50" align="center" label="序号" />
              <el-table-column prop="secdClassName" label="检测类别" align="center" />
              <el-table-column prop="factorName" label="检测因子" min-width="200px" align="center" />
              <el-table-column prop="factorPoint" label="检测位置" align="center" />
              <el-table-column prop="frequency" label="频次(次/天)" align="center" />
              <el-table-column prop="dayCount" label="天数" align="center" />
              <el-table-column label="样品数" align="center">
                <template slot-scope="{row}">
                  {{ Number(row.frequency*row.dayCount).toFixed(0) }}
                </template>
              </el-table-column>
              <el-table-column prop="sampleUser" label="采样组长" align="center" width="135" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row, $index}">
                  <el-button v-if="roles.indexOf('Pm') > -1 || userInfo.userId === row.sampleUserId" type="text" @click="delOutGroupRow(row, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="sampleTaskVisible=false">取消</el-button>
        <el-button :disabled="saveDisable" type="primary" @click="saveDialog">保存</el-button>
        <el-button v-if="roles.indexOf('Pm')>-1" type="primary" :disabled="currentRow.sampTaskStatus!=='1'" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as sampleServer from '@/api/sample'
import * as dictServer from '@/api/dict'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import qs from 'qs'
import { mapGetters } from 'vuex'

const SAMPLE_STATUS = {
  '0': '待合样',
  '1': '已合样',
  '2': '采样中'
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
      multipleLeaderSelection: [],
      multipleSampleSelection: [],
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
      showOutFactorName: '',
      pointAddress: [], // 采样位置
      leaderfactorPoint: '',
      combinedRemark: '',
      mergeOnline: '',
      mergeOutOnline: '',
      saveDisable: false,
      zjFactorNames: [],
      wbFactorNames: [],
      zjClassNames: [],
      wbClassNames: [],
      checkZjVisible: false,
      checkFbVisible: false,
      checkZjClassVisible: false,
      checkFbClassVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userInfo'
    ]),
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
      sampleServer.findNewSampTaskByCondition(this.searchForm).then(res => {
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
      sampleServer.getJobFactorsByJobId(row.jobId).then(result => {
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

    getPointAddress(sampTaskId) {
      sampleServer.getSampleTaskPointBySampTaskId(sampTaskId).then(res => {
        this.pointAddress = res.result || []
      })
    },
    filterZjTable(value, row) {
      this.checkZjVisible = true
      return row.factorPoint === value
    },
    filterZJClass(value, row) {
      this.checkZjClassVisible = true
      return row.secdClassName === value
    },
    // filterTagTable(val) {
    //   debugger
    //   if (val.secdClassName && val.secdClassName.length === 0) {
    //     this.checkZjClassVisible = false
    //   }
    //   if (val.factorPoint && val.factorPoint.length === 0) {
    //     this.checkZjVisible = false
    //   }
    // },
    // filterFbTagTable(val) {
    //   if (val.secdClassName && val.secdClassName.length === 0) {
    //     this.checkFbClassVisible = false
    //   }
    //   if (val.factorPoint && val.factorPoint.length === 0) {
    //     this.checkFbVisible = false
    //   }
    // },
    filterFbTable(value, row) {
      return row.factorPoint === value
    },
    filterFbClass(value, row) {
      return row.secdClassName === value
    },
    handleSchedTask(row) {
      this.currentRow = Object.assign({}, row)
      if (row.sampTaskStatus > 0) {
        this.saveDisable = true
      } else {
        this.saveDisable = false
      }
      // 获取位置分配信息
      this.getPointAddress(row.sampTaskId)
      this.combinedRemark = row.combinedRemark

      // 清空选择树
      this.zjFactorNames = []
      this.wbFactorNames = []
      this.zjClassNames = []
      this.wbClassNames = []

      this.multipleSampleSelection = []
      this.multipleOutSampleSelection = []
      this.mergeOnline = ''
      this.mergeOutOnline = ''
      // 获取因子列表
      this.factorDetailData = []
      this.factorOldDetailData = []
      this.mergeData = []
      this.oldMergeData = []

      this.factorOutDetailData = []
      this.factorOldOutDetailData = []
      this.mergeOutData = []

      // 获取自检因子列表
      sampleServer.getZjJobFactorsByJobId({ jobId: this.currentRow.jobId, fbFlag: '0' }).then(result => {
        if (result.code === 200 && result.result) {
          this.factorDetailData = result.result || []
          this.factorOldDetailData = [...result.result] || []
          result.result.forEach(i => {
            const obj = this.zjFactorNames.find(t => t.text === i.factorPoint)
            if (!obj) {
              this.zjFactorNames.push(
                {
                  'text': i.factorPoint,
                  'value': i.factorPoint
                }
              )
            }
            const cObj = this.zjClassNames.find(t => t.text === i.secdClassName)
            if (!cObj) {
              this.zjClassNames.push(
                {
                  'text': i.secdClassName,
                  'value': i.secdClassName
                }
              )
            }
          })
        }
        this.sampleTaskVisible = true
        this.clearSelectionRow()
      })
      // 获取分包因子列表
      sampleServer.getWbJobFactorsByJobId({ jobId: this.currentRow.jobId, fbFlag: '1' }).then(result => {
        if (result.code === 200 && result.result) {
          this.factorOutDetailData = result.result || []
          this.factorOldOutDetailData = [...result.result] || []
          result.result.forEach(i => {
            const obj = this.wbFactorNames.find(t => t.text === i.factorPoint)
            if (!obj) {
              this.wbFactorNames.push(
                {
                  'text': i.factorPoint,
                  'value': i.factorPoint
                }
              )
            }

            const cObj = this.wbClassNames.find(t => t.text === i.secdClassName)
            if (!cObj) {
              this.wbClassNames.push(
                {
                  'text': i.secdClassName,
                  'value': i.secdClassName
                }
              )
            }
          })
        }
        this.clearOutSelectionRow()
      })
      // 获取已经分配的信息
      this.getSampleListOn()
    },
    getSampleListOn() {
      sampleServer.getSampleListByCondition({ sampTaskId: this.currentRow.sampTaskId, fbFlag: '0' }).then(res => {
        if (res.code === 200 && res.result) {
          this.mergeData = res.result.map(i => {
            this.$set(i, 'isBack', 1)
            return i
          }) || []
        }
      })
      sampleServer.getSampleListByCondition({ sampTaskId: this.currentRow.sampTaskId, fbFlag: '1' }).then(res => {
        if (res.code === 200 && res.result) {
          this.mergeOutData = res.result.map(i => {
            this.$set(i, 'isBack', 1)
            return i
          }) || []
        }
      })
    },
    choseLeader() {
      const userInfos = {
        sampleUserIds: '',
        sampleUsers: ''
      }
      this.perGroups.forEach(f => {
        if (this.leaderfactorPoint.indexOf(f.userId) > -1) {
          userInfos.sampleUserIds += f.userId + ','
          userInfos.sampleUsers += f.empName + ','
        }
      })

      this.multipleLeaderSelection.forEach(i => {
        this.pointAddress.forEach(m => {
          if (m.factorPoint === i.factorPoint) {
            this.$set(i, 'sampleUserIds', this.leaderfactorPoint)
            this.$set(i, 'sampleUsers', userInfos.sampleUsers)
          }
        })
      })
      this.$refs.pointAddressInfo.clearSelection()
    },
    choseSampleLeader() {
      const choseUser = this.perGroups.find(j => j.userId === this.mergeOnline)
      if (choseUser) {
        this.multipleSampleSelection.forEach(i => {
          this.mergeData.forEach(m => {
            if (m.factorPoint === i.factorPoint) {
              this.$set(i, 'sampleUserIds', this.mergeOnline)
              this.$set(i, 'sampleUser', choseUser.empName)
            }
          })
        })
        this.$refs.mergerInfo.clearSelection()
      }
    },
    saveDialog() { // 保存 只处理合样的样品信息
      this.saveLeaders()
      if (this.mergeData.length > 0 || this.mergeOutData.length > 0) {
        this.$confirm('确定提交合样?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 获取自检信息
          const mineParams = this.mergeData.map(i => {
            const { secdClassId, secdClassName, jobPlanFactorId, factorName, dayCount, frequency, sampleUserId, sampleUser, factorPoint, factorGroupKey } = i
            return {
              sampleTaskId: this.currentRow.sampTaskId,
              jobId: this.currentRow.jobId,
              secdClassId,
              secdClassName,
              factorName,
              dayCount,
              frequency,
              sampleUserId,
              sampleUser,
              factorPoint,
              jobPlanFactorId,
              fbFlag: '0',
              factorGroupKey }
          })
          // 获取分包
          let outParams = []
          if (this.mergeOutData && this.mergeOutData.length > 0) {
            outParams = this.mergeOutData.map(i => {
              const { secdClassId, secdClassName, jobPlanFactorId, factorName, dayCount, frequency, sampleUserId, sampleUser, factorPoint, factorGroupKey } = i
              return {
                sampleTaskId: this.currentRow.sampTaskId,
                jobId: this.currentRow.jobId,
                secdClassId,
                secdClassName,
                factorName,
                dayCount,
                frequency,
                sampleUserId,
                sampleUser,
                factorPoint,
                jobPlanFactorId,
                fbFlag: '1',
                factorGroupKey }
            })
          }
          const seParams = mineParams.concat(outParams)
          sampleServer.saveSampleList(JSON.stringify(seParams)).then(result => {
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
      }
    },
    confirmDialog() { // 确认处理所有样品信息-负责人操作
      if (this.factorDetailData && this.factorDetailData.length > 0) {
        this.$message.warning('样品必须全部合样后才能确认')
        return
      }
      debugger
      if (this.factorOutDetailData && this.factorOutDetailData.length > 0) {
        this.$message.warning('剩余分包样品请进行自成样品操作！')
        return
      }
      const b = this.mergeData.find(i => !i.sampleUserId || i.sampleUserId.length <= 0 || !i.isBack)
      if (b) {
        this.$message.error('人员分配完成后请先进行保存！')
        return
      }
      const wb = this.mergeOutData.find(i => !i.sampleUserId || i.sampleUserId.length <= 0 || !i.isBack)
      if (wb) {
        this.$message.error('人员分配完成后请先进行保存！')
        return
      }
      this.$confirm('确定提交合样?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sampleServer.confirmSampleList(qs.stringify({ sampTaskId: this.currentRow.sampTaskId })).then(result => {
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
      if (item.isBack === 1) { // 数据库删除
        this.$confirm('该删除会刷新当前合样列表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sampleServer.deleteSampleListById(item.id).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.currentRow.sampTaskStatus = 0
              this.handleSearch()
              // 刷新当前合样列表
              this.handleSchedTask(this.currentRow)
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          return
        })
      } else {
        const its = item.jobPlanFactorId.split(',')
        its.forEach(i => {
          const obj = this.factorOldDetailData.find(j => j.jobPlanFactorId === i)
          if (obj) {
            this.factorDetailData.push(obj)
          }
        })
        this.mergeData.splice(index, 1)
      }
    },
    delOutGroupRow(item, index) {
      if (item.isBack === 1) { // 数据库删除
        this.$confirm('该删除会刷新当前合样列表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sampleServer.deleteSampleListById(item.id).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.currentRow.sampTaskStatus = 0
              this.handleSearch()
              // 刷新当前合样列表
              this.handleSchedTask(this.currentRow)
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          return
        })
      } else {
        const its = item.jobPlanFactorId.split(',')
        its.forEach(i => {
          const obj = this.factorOldOutDetailData.find(j => j.jobPlanFactorId === i)
          if (obj) {
            this.factorOutDetailData.push(obj)
          }
        })
        this.mergeOutData.splice(index, 1)
      }
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
      if (this.checkZjVisible) {
        return true
      }
      if (!this.currentSelectionRow.secdClassId || this.currentSelectionRow.secdClassId === '') {
        return true
      }
      if (item.secdClassId === this.currentSelectionRow.secdClassId &&
        item.factorPoint.trim() === this.currentSelectionRow.factorPoint.trim() &&
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
      if (this.checkFbVisible) {
        return true
      }
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
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          if (this.roles.indexOf('Po') > -1) { // 判定是否组长操作的
            this.$set(item, 'sampleUserId', this.userInfo.userId)
            this.$set(item, 'sampleUser', this.userInfo.empName)
          }

          const index = this.factorDetailData.indexOf(item)
          this.factorDetailData.splice(index, 1)

          this.mergeData.push(item)
        })
        this.multipleSelection = []
        this.clearSelectionRow()
      }
    },
    moveOutFactors() {
      if (this.multipleOutSelection && this.multipleOutSelection.length > 0) {
        this.multipleOutSelection.forEach(item => {
          if (this.roles.indexOf('Po') > -1) { // 判定是否组长操作的
            this.$set(item, 'sampleUserId', this.userInfo.userId)
            this.$set(item, 'sampleUser', this.userInfo.empName)
          }
          // 列表中移除
          const index = this.factorOutDetailData.indexOf(item)
          this.factorOutDetailData.splice(index, 1)

          this.mergeOutData.push({ ...item, collectLeaderId: '' })
        })
        this.multipleOutSelection = []
        this.clearOutSelectionRow()
      }
    },
    mergeFactors() {
      if (this.roles.indexOf('Po') > -1 || this.roles.indexOf('Pm') > -1) {
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          // 判定是否可以合样
          const chose = []
          this.multipleSelection.forEach(j => {
            debugger
            const obj = chose.find(i => (i.secdClassId === j.secdClassId &&
                i.factorPoint.trim() === j.factorPoint.trim() &&
                i.frequency === j.frequency &&
                i.dayCount === j.dayCount))
            if (!obj) {
              chose.push(j)
            }
          })
          if (chose.length > 1) {
            this.$message.error('当前选择不符合合样标准')
            return
          }
          // 合样
          var choseItem = {}
          this.multipleSelection.forEach(item => {
            if (choseItem && choseItem.jobPlanFactorId) {
              choseItem.factorName += ',' + item.factorName
              choseItem.jobPlanFactorId += ',' + item.jobPlanFactorId
            } else {
              choseItem = { ...item }
            }
            if (this.roles.indexOf('Po') > -1) { // 判定是否组长操作的
              this.$set(choseItem, 'sampleUserId', this.userInfo.userId)
              this.$set(choseItem, 'sampleUser', this.userInfo.empName)
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
      } else {
        this.$message.error('只有负责任/采样组长才能进行合样')
      }
    },
    mergeOutFactors() {
      if (this.roles.indexOf('Po') > -1 || this.roles.indexOf('Pm') > -1) {
        if (this.multipleOutSelection && this.multipleOutSelection.length > 0) {
          const chose = []
          this.multipleOutSelection.forEach(j => {
            const obj = chose.find(i => (i.secdClassId === j.secdClassId &&
                i.factorPoint === j.factorPoint &&
                i.frequency === j.frequency &&
                i.dayCount === j.dayCount))
            if (!obj) {
              chose.push(j)
            }
          })
          if (chose.length > 1) {
            this.$message.error('当前选择不符合合样标准')
            return
          }

          var choseItem = {}
          this.multipleOutSelection.forEach(item => {
            if (choseItem && choseItem.jobPlanFactorId) {
              choseItem.factorName += ',' + item.factorName
              choseItem.jobPlanFactorId += ',' + item.jobPlanFactorId
            } else {
              choseItem = { ...item }
            }
            if (this.roles.indexOf('Po') > -1) { // 判定是否组长操作的
              this.$set(choseItem, 'sampleUserId', this.userInfo.userId)
              this.$set(choseItem, 'sampleUser', this.userInfo.empName)
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
      } else {
        this.$message.error('只有负责任/采样组长才能进行合样')
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
    handleLeaderChangeRow() { // 采样负责人分配采样组长
      if (this.multipleLeaderSelection.length > 0) {
        const userInfos = {
          sampleUserId: '',
          sampleUsers: ''
        }
        this.perGroups.forEach(f => {
          if (this.leaderfactorPoint.indexOf(f.userId) > -1) {
            userInfos.sampleUserId += f.userId + ','
            userInfos.sampleUsers += f.empName + ','
          }
        })

        this.multipleLeaderSelection.forEach(i => {
          this.pointAddress.forEach(m => {
            debugger
            if (m.factorPoint === i.factorPoint) {
              this.$set(i, 'sampleUserId', this.leaderfactorPoint)
              this.$set(i, 'sampleUsers', userInfos.sampleUsers)
            }
          })
        })
      }
    },
    handleMergeChange(val) {
      this.multipleSampleSelection = val
      this.mergeOnline = ''
      // this.handleOnlineChangeRow()
    },
    handleOnlineChangeRow() { // 采样负责人合样分配采样组长
      const choseUser = this.perGroups.find(j => j.userId === this.mergeOnline)
      if (choseUser) {
        this.multipleSampleSelection.forEach(i => {
          this.mergeData.forEach(m => {
            if (m.factorPoint === i.factorPoint) {
              this.$set(i, 'sampleUserId', this.mergeOnline)
              this.$set(i, 'sampleUser', choseUser.empName)
            }
          })
        })
        this.$refs.mergerInfo.clearSelection()
      }
    },
    handleMergeOutChange(val) {
      this.multipleOutSampleSelection = val
      this.mergeOutOnline = ''
      // this.handleOutOnlineChangeRow()
    },
    handleOutOnlineChangeRow() { // 采样负责人合样分配采样组长
      const choseUser = this.perGroups.find(j => j.userId === this.mergeOutOnline)
      if (choseUser) {
        this.multipleOutSampleSelection.forEach(i => {
          this.mergeOutData.forEach(m => {
            if (m.factorPoint === i.factorPoint) {
              this.$set(i, 'sampleUserId', this.mergeOutOnline)
              this.$set(i, 'sampleUser', choseUser.empName)
            }
          })
        })
        this.$refs.mergeOutRef.clearSelection()
      }
    },
    saveLeaders() { // 保存分配的组长信息
      // 备注信息保存
      const paramRemak = {
        sampTaskId: this.currentRow.sampTaskId,
        combinedRemark: this.combinedRemark
      }
      sampleServer.saveCombinedRemark(qs.stringify({ param: JSON.stringify(paramRemak) })).then(res => {
        this.$notify({
          title: '成功',
          message: '备注信息保存成功',
          type: 'success'
        })

        if (this.roles.indexOf('Pm') === -1 && !this.mergeOutData || this.mergeOutData.length <= 0) {
          this.sampleTaskVisible = false
          this.handleSearch()
        }
      })
      // 组长展示分配保存
      if (this.roles.indexOf('Pm') > -1) {
        const paData = []
        this.pointAddress.forEach(i => {
          if (i.sampleUserIds) {
            paData.push({
              factorPoint: i.factorPoint,
              sampleUserId: i.sampleUserIds.toString()
            })
          }
        })
        if (paData.length > 0) {
          const param = {
            sampTaskId: this.currentRow.sampTaskId,
            params: paData
          }
          sampleServer.assignFactorPoint(qs.stringify({ param: JSON.stringify(param) })).then(result => {
            if (result.code === 200) {
              // this.$notify({
              //   title: '成功',
              //   message: result.message,
              //   type: 'success'
              // })
              if (!this.mergeOutData || this.mergeOutData.length <= 0) {
                this.sampleTaskVisible = false
                this.handleSearch()
              }
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }
      }
    },
    handleLeaderSelectionChange(val) {
      this.multipleLeaderSelection = val
      // this.handleLeaderChangeRow()
    },
    toggleZjSelection(type) {
      if (type === 0) {
        this.checkZjVisible = true
        this.$refs.choseTable.toggleAllSelection()
      } else {
        this.clearSelectionRow()
        this.$refs.choseTable.clearSelection()
        this.checkZjVisible = false
      }
    },
    toggleFbSelection(type) {
      if (type === 0) {
        this.checkFbVisible = true
        this.$refs.choseOutTable.toggleAllSelection()
      } else {
        this.clearOutSelectionRow()
        this.$refs.choseOutTable.clearSelection()
        this.checkFbVisible = false
      }
    }
    // handleOutChangeRow(row) {
    //   this.mergeOutData.forEach(i => {
    //     if (!i.collectLeaderId || i.collectLeaderId === '') {
    //       if (row.factorPoint === i.factorPoint) {
    //         this.$set(i, 'collectLeaderId', row.collectLeaderId)
    //       }
    //     }
    //   })
    // }

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
