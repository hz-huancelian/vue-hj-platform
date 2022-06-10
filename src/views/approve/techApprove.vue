<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="报价单号:">
            <el-input v-model="searchForm.offerId" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="评审状态:">
            <el-select v-model="searchForm.taskStatus" clearable style="width:160px" filterable placeholder="评审状态">
              <el-option
                v-for="item in Object.keys(TASK_STATUS)"
                :key="item"
                :label="TASK_STATUS[item]"
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
        :data="orderData"
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
        <el-table-column type="index" width="55" label="序号" fixed="left" align="center" />
        <el-table-column prop="projectName" label="项目名称" fixed="left" min-width="140px" align="center" />
        <el-table-column prop="certificationType" label="认证类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.certificationType === '1'?"CMA":"CNAS" }}
          </template>
        </el-table-column>
        <el-table-column prop="consignorName" label="客户名称" min-width="120px" align="center" />
        <el-table-column label="评审状态" align="center" width="130px">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.judgeTaskStatus | statusQualityFilter">
              {{ TASK_STATUS[row.judgeTaskStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="finishDate" label="完成时间" width="120" align="center" />
        <!-- <el-table-column prop="checkTaskCount" label="检测任务数" align="center" /> -->
        <!-- <el-table-column prop="reviewNum" label="参与评审人数" align="center" />
        <el-table-column prop="reviewedNum" label="已评审人数" align="center" /> -->

        <el-table-column fixed="right" align="center" label="操作" width="210">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-if="row.judgeTaskStatus>=4" class="erc-divider-vertical" />
            <el-button v-if="row.judgeTaskStatus>=4" type="text" @click="handleAppDetail(row)"> 评审记录</el-button>
            <div v-if="row.judgeTaskStatus==='0'" class="erc-divider-vertical" />
            <el-button v-if="row.judgeTaskStatus==='0'" type="text" @click="handleApprove(row)"> 评审判定</el-button>
            <div v-if="row.judgeTaskStatus==='4' || row.judgeTaskStatus==='5'" class="erc-divider-vertical" />
            <el-button v-if="row.judgeTaskStatus==='4' || row.judgeTaskStatus==='5'" type="text" @click="handleLastApprove(row)"> 评审审批</el-button>
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

    <el-dialog :title="'报价单(' +orderDetailForm.offerId+ ')'" :visible.sync="detailVisible" top="5vh" width="70%">
      <el-form label-position="right" label-width="135px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称:">{{ orderDetailForm.offerBaseVo.consignorName || '' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人:">{{ orderDetailForm.offerBaseVo.consignorLinker || '' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:">{{ orderDetailForm.offerBaseVo.consignorLinkerPhone || '' }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户要求完成时间:">{{ orderDetailForm.offerBaseVo.finishDate|Time2Format }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注:">{{ orderDetailForm.offerBaseVo.remark || '' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-for="(item, index) in orderDetailPlans" :key="index">
        <el-divider>计划{{ index+1 }}因子列表</el-divider>
        <div class="table-responsive">
          <table class="table table-bordered table-hover" cellspacing="1" cellpadding="0">
            <thead>
              <tr>
                <th rowspan="2">序号</th>
                <th rowspan="2">检测类别</th>
                <th colspan="3">检测项目</th>
                <th rowspan="2">频次(次/天)</th>
                <th rowspan="2">天数</th>
                <th rowspan="2">监测频次</th>
                <th rowspan="2">执行次数</th>
                <th rowspan="2">总数</th>
                <th rowspan="2">检测单价(元)</th>
                <th rowspan="2">检测费(元)</th>
              </tr>
              <tr>
                <th>序号</th>
                <th>检测位置</th>
                <th>因子</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sitem, sindex) in item.factorTdos" :key="sindex">
                <template v-if="sitem.frIndex==0">
                  <td :rowspan="sitem.detailLength">{{ sitem.id }}</td>
                  <td :rowspan="sitem.detailLength">{{ sitem.secName }}</td>
                </template>
                <td>{{ sitem.sid }}</td>
                <td>{{ sitem.factorPoint }}</td>
                <td>{{ sitem.factorName }}{{ sitem.meanName&&sitem.meanName.length > 0?'('+ sitem.meanName +')':'' }}</td>
                <td>{{ sitem.frequency }}</td>
                <td>{{ sitem.dayCount }}</td>
                <template v-if="sindex==0">
                  <td :rowspan="item.oldPlanFactors.length">{{ item.checkFreq }}</td>
                  <td :rowspan="item.oldPlanFactors.length">{{ item.execTimes }}</td>
                </template>
                <td>{{ Number(sitem.frequency * sitem.dayCount * item.execTimes ).toFixed(0) }}</td>
                <td>{{ sitem.costPerTime }}</td>
                <td>{{ parseFloat(sitem.costPerTime*sitem.frequency * sitem.dayCount * item.execTimes).toFixed(2) }}</td>

              </tr>
              <tr>
                <td colspan="11">检测费合计</td>
                <td>{{ parseFloat(item.checkFee*item.execTimes).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-hover" cellspacing="1" cellpadding="0  ">
          <tbody>
            <tr><td colspan="2" style="width: 80%">检测费合计</td><td>{{ orderDetailForm.costVo.checkAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">报告编制费</td><td>{{ orderDetailForm.costVo.reportAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">报告加急费</td><td>{{ (orderDetailForm.costVo.expediteAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">采样费</td><td>{{ (orderDetailForm.costVo.laborAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">差旅费</td><td>{{ (orderDetailForm.costVo.tripAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">税额</td><td>{{ orderDetailForm.costVo.taxAmount|MoneyFormat }}</td></tr>
            <template v-if="orderDetailForm.selfCostVos">
              <tr v-for="(item, index) in orderDetailForm.selfCostVos" :key="index">
                <td colspan="2" style="width: 80%">{{ item.selfName }}</td>
                <td>{{ item.amount|MoneyFormat }}</td>
              </tr>
            </template>
            <tr><td colspan="2" style="width: 80%">总计</td><td>{{ orderDetailForm.costVo.sysAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="2" style="width: 80%">优惠价</td><td>{{ orderDetailForm.costVo.draftAmount|MoneyFormat }}</td></tr>
            <tr><td style="width: 20%">大写：</td><td colspan="2" style="width: 80%">{{ orderDetailForm.costVo.draftAmount|Money2Chinese }}</td></tr>
          </tbody>
        </table>
      </div>
    </el-dialog>

    <el-dialog title="合同评审判定" :visible.sync="approveVisible" center top="5vh">
      <el-form :model="approveForm">
        <el-form-item label="评审判定:">
          <el-radio-group v-model="approveForm.auditFlag">
            <el-radio label="2">直接评审通过</el-radio>
            <el-radio label="1">进入评审流程</el-radio>
            <el-radio label="3">评审不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div v-if="approveForm.auditFlag === '1'">
        <el-row>
          <el-button type="primary" size="small" @click="handleChosePerson">选择参与人员</el-button>
        </el-row>
        <el-table :data="judgeData" stripe style="padding-top:10px">
          <el-table-column prop="empName" label="姓名" align="center" />
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column prop="postNames" label="岗位" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{$index}">
              <el-button type="text" @click="delChoseRow($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
      <el-dialog title="人员选择" :visible.sync="innerChose" append-to-body>
        <el-form :model="innerForm" inline>
          <el-form-item>
            <el-button type="primary" @click="innerAdd">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="innerJudgeData" stripe max-height="450px" @selection-change="handleSelection">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="empName" label="姓名" align="center" />
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column prop="postNames" label="岗位" align="center" />
        </el-table>
      </el-dialog>
    </el-dialog>

    <el-dialog title="评审详情" :visible.sync="appDetailsVisible" center top="5vh">
      <el-table
        :data="appDetails"
        border
        stripe
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
      >
        <el-table-column prop="judgeUser" label="技术评审人" align="center" />
        <el-table-column prop="judgeRecordStatus" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.judgeRecordStatus | judgeStatusQualityFilter">
              {{ APPROVE_STATUS[row.judgeRecordStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appDetailsVisible=false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="评审判定" :visible.sync="lastApproveVisible" center top="5vh">
      <el-form :model="lastApproveForm">
        <el-form-item label="评审判定:">
          <el-radio-group v-model="lastApproveForm.auditFlag">
            <el-radio label="6">通过</el-radio>
            <el-radio label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lastApproveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmLastDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as orderServer from '@/api/offer'
import * as judgeServer from '@/api/judge'
import * as dictServer from '@/api/dict'
import * as deptServer from '@/api/dept'
import { selectPostAll } from '@/api/system/post'

const TASK_STATUS = {
  '0': '待判定',
  '1': '进入评审流程',
  '2': '直接评审通过',
  '3': '评审不通过',
  '4': '部门经理审核',
  '5': '技术负责人审核',
  '6': '评审通过'
}
const APPROVE_STATUS = {
  '0': '等待处理',
  '1': '通过',
  '2': '不通过'
}
const CHECK_STATUS = {
  '0': '单次',
  '1': '周',
  '2': '月',
  '3': '季度',
  '4': '半年',
  '5': '年'
}
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'TechContList',
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'success',
        '3': 'danger',
        '4': '',
        '5': '',
        '6': 'success'
      }
      return statusMap[status]
    },

    judgeStatusQualityFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      TASK_STATUS,
      APPROVE_STATUS,
      CHECK_STATUS,
      orderData: [],
      searchForm: {
        offerId: '',
        projectName: '',
        taskStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      detailVisible: false,
      orderDetailForm: {
        offerId: '',
        offerBaseVo: {
          consignorName: '',
          consignorLinker: '',
          consignorLinkerPhone: '',
          createUserName: '',
          finishDate: '',
          remark: '',
          checkCircle: '',
          checkTaskCount: ''
        },
        factorTdos: [],
        costVo: {},
        oncePrice: '',
        selfCostVos: []
      },
      approveVisible: false,
      approveForm: {
        judgeTaskId: '',
        auditFlag: '1',
        remark: '',
        auditUsers: ''
      },
      approveJudgeForm: {
        judgeTaskId: '',
        auditFlag: '1',
        remark: ''
      },
      appDetailsVisible: false,
      appDetails: [],
      lastApproveVisible: false,
      lastApproveForm: {
        judgeTaskId: '',
        auditFlag: '6',
        remark: ''
      },
      judgeData: [],
      innerChose: false,
      postOptions: [],
      // 部门树选项
      deptOptions: [],
      innerForm: {
        empName: '',
        deptId: undefined,
        postId: undefined
      },
      multipleSelection: [],
      innerJudgeData: [],
      orderDetailPlans: []
    }
  },
  created() {
    this.innerSearch()
    this.handleSearch()
    this.getTreeselect()
    this.getPostAndRoleList()
  },
  methods: {
    getDicKey(type, code) {
      dictServer.getDicKey(code).then(result => {
        if (result.code === 200) {
          this[type] = result.result
        }
      })
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      this.deptOptions = []
      deptServer.treeselect().then(res => {
        this.deptOptions = res.result
      })
    },
    getPostAndRoleList() {
      selectPostAll().then(res => {
        this.postOptions = res.result || []
      })
    },
    handleAppDetail(row) {
      judgeServer.getJudgeRecordByJudgeTaskId(row.judgeTaskId).then(res => {
        if (res.code === 200 && res.result) {
          this.appDetails = res.result || []
          this.appDetailsVisible = true
        }
      })
    },
    handleDetail(row) {
      // 获取数据
      orderServer.findOfferDetailsByOfferId(row.offerId).then(res => {
        if (res.code === 200) {
          var factors = []
          this.orderDetailForm.offerId = res.result.offerId || ''
          this.orderDetailForm.offerBaseVo = res.result.offerBaseVo || {}
          this.orderDetailForm.costVo = res.result.costVo || {}
          this.orderDetailForm.selfCostVos = res.result.selfCostVos || []
          this.orderDetailForm.offerPlanVos = factors = res.result.offerPlanVos.map(i => {
            if (i.planFactorVoList && i.planFactorVoList.length > 0) {
              i.planFactorVoList.forEach(j => {
                if (j.dynamicParam !== '{}' && j.dynamicParam.indexOf('meanName') > -1) {
                  const dynParam = JSON.parse(j.dynamicParam)
                  this.$set(j, 'meanName', dynParam.meanName)
                }
              })
              this.$set(i, 'oldPlanFactors', i.planFactorVoList)
            }
            return i
          }) || [] // 处理展示meanName
          // 处理因子展示数据

          this.orderDetailPlans = this.doProcessOrder(factors) || []
          this.detailVisible = true
        }
      })
      // 封装展示数据
    },
    handleSearch() {
      judgeServer.findJudgeTaskForTecManagerByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.orderData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    doProcessOrder(factors) {
      if (factors && factors.length > 0) {
        const resFoactors = [...factors]
        resFoactors.forEach(i => {
          debugger
          const factorTdos = this.doProcessDate(i.planFactorVoList)
          this.$set(i, 'factorTdos', factorTdos)
          debugger
        })
        return resFoactors
      }
    },
    doProcessDate(vos) {
      if (vos && vos.length > 0) {
        const factorArray = []
        const factorMap = new Map()
        const resFactorarray = []
        let fIndex = 1
        vos.forEach((item, index) => {
          const o = factorArray.find(j => j.secdClassName === item.secdClassName)
          if (!o) {
            factorArray.push({
              id: fIndex,
              secdClassName: item.secdClassName,
              totalPrice: 0,
              detailLength: 0
            })
            fIndex++
          }
          if (factorMap.get(item.secdClassName)) {
            const ls = factorMap.get(item.secdClassName)
            ls.push(item)
          } else {
            const li = []
            li.push(item)
            factorMap.set(item.secdClassName, li)
          }
        })
        debugger
        if (factorArray) {
          factorArray.forEach(i => {
            const deList = factorMap.get(i.secdClassName)
            if (deList && deList.length > 0) {
              deList.forEach((j, index) => {
                const oo = resFactorarray.find(x => x.secName === j.secdClassName)
                if (!oo) {
                  this.$set(j, 'frIndex', 0)
                } else {
                  this.$set(j, 'frIndex', 1)
                }
                this.$set(j, 'id', i.id)
                this.$set(j, 'sid', i.id + '.' + (index + 1))
                this.$set(j, 'secName', i.secdClassName)
                this.$set(j, 'detailLength', deList.length)
                this.$set(j, 'dateType', 0)
                resFactorarray.push(j)
              })
              // resFactorarray.push({
              //   'secName': i.secdClassName,
              //   'frIndex': 1,
              //   'totalPrice': parseFloat(totalPrice).toFixed(2),
              //   'dateType': 1
              // })
            }
          })
        }
        return resFactorarray
      }
      return []
    },
    countTotal(arr, keyName) {
      let $total = 0
      $total = arr.reduce((total, currentValue, currentIndex, arr) => {
        return currentValue[keyName] ? (total + currentValue[keyName]) : total
      }, 0)
      return $total
    },
    handleApprove(row) {
      this.approveForm.judgeTaskId = row.judgeTaskId
      this.approveForm.auditFlag = '2'
      this.approveVisible = true
      this.judgeData = []
    },
    handleLastApprove(row) {
      this.lastApproveForm.judgeTaskId = row.judgeTaskId
      this.lastApproveForm.auditFlag = '6'
      this.lastApproveForm.reamrk = ''
      this.lastApproveVisible = true
    },
    confirmLastDialog() {
      this.$confirm('是否确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        judgeServer.doAuditTask(this.lastApproveForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.lastApproveVisible = false
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
    confirmDialog() {
      if (this.approveForm.auditFlag === '1' && this.judgeData.length <= 0) {
        this.msgError('进入评审环节，评审人员不能为空')
        return
      }
      this.$confirm('是否确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          judgeTaskId: this.approveForm.judgeTaskId,
          auditFlag: this.approveForm.auditFlag
        }
        if (this.approveForm.auditFlag === '1') {
          const ids = this.judgeData.map(i => i.userId)
          data.auditUsers = ids.toString()
        }
        judgeServer.doAuditTask(data).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.approveVisible = false
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
    handleChosePerson() {
      this.innerChose = true
      this.innerSearch()
    },
    delChoseRow(index) {
      this.judgeData.splice(index, 1)
    },
    innerSearch() {
      // judgeServer.findAuditUser(this.innerForm).then(res => {
      //   this.innerJudgeData = res.result
      // })
      judgeServer.findAuditUser().then(res => {
        this.innerJudgeData = res.result
      })
    },
    handleSelection(val) {
      this.multipleSelection = val
    },
    innerAdd() {
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(i => {
          const obj = this.judgeData.find(j => j.userId === i.userId)
          if (!obj) {
            this.judgeData.push(i)
          }
        })
        this.innerChose = false
      } else {
        this.msgInfo('至少选择一个评审用户')
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
    font-size: 14px;
  }
  /deep/.el-table__header-wrapper  .el-checkbox{
    display:none
  }
  .agreement_picture {
    min-height: calc(100%);
    .pdf{
      height: calc(100%);
    }
  }

  /deep/ .el-input.is-disabled .el-input__inner {
    color:unset
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
    line-height: 14px;
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
    line-height: 38px;
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
