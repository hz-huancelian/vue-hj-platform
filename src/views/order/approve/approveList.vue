<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:180px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="报价单号:">
            <el-input v-model="searchForm.id" style="width:180px" placeholder="报价单号" />
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
        border
        stripe
        :data="orderData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
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
        <el-table-column type="index" width="55" label="序号" fixed="left" align="center" />
        <el-table-column prop="projectName" label="项目名称" fixed="left" min-width="120px" align="center" />
        <el-table-column prop="id" label="报价单号" width="180px" align="center" />
        <el-table-column prop="checkType" label="检测类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.checkType === '0'?"委托检测":"样品送检" }}
          </template>
        </el-table-column>
        <el-table-column prop="certificationType" label="认证类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.certificationType === '1'?"CMA":"CNAS" }}
          </template>
        </el-table-column>
        <el-table-column prop="consignorName" label="客户名称" min-width="120px" align="center" />
        <el-table-column prop="finishDate" label="完成时间" width="120" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.status | statusQualityFilter">
              {{ ACCOUNT_STATUS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkTaskCount" label="任务数" align="center" />

        <!-- <el-table-column prop="checkCircle" label="周期" align="center">
          <template slot-scope="{row}">
            {{ CHECK_STATUS[row.checkCircle] }}
          </template>
        </el-table-column> -->
        <el-table-column prop="draftAmount" label="费用总计" align="center" />
        <el-table-column prop="createUserId" label="报价人" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <div v-if="scope.row.status==='1'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.status==='1'" type="text" @click="handleApprove(scope.row)"> 审核</el-button>
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

    <el-dialog title="报价单审核" :visible.sync="approveVisible" center>
      <div style="width: 400px;margin:0 auto">
        <el-form :model="approveForm" label-width="100px">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="approveForm.isPass">
              <el-radio label="0">通过</el-radio>
              <el-radio label="1">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="approveForm.isPass==='1'" label="审核意见:">
            <el-input v-model="approveForm.remark" type="textarea" :rows="3" maxlength="50" placeholder="审核意见" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as apprServer from '@/api/approve'
import * as orderServer from '@/api/offer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const ACCOUNT_STATUS = {
  '0': '草稿',
  '1': '待审核',
  '2': '审核驳回',
  '3': '审核通过'
}
const CHECK_STATUS = {
  '0': '单次',
  '1': '周',
  '2': '月',
  '3': '季度',
  '4': '半年',
  '5': '年'
}
export default {
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
  data() {
    return {
      ACCOUNT_STATUS,
      CHECK_STATUS,
      orderData: [],
      searchForm: {
        id: '',
        projectName: '',
        status: '1',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      approveVisible: false,

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
      orderDetailPlans: [], // 订单计划详情表
      approveForm: {
        offerId: '',
        isPass: '0',
        remark: ''
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      apprServer.findOfferInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.orderData = res.result.records
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      // 获取数据
      orderServer.findOfferDetailsByOfferId(row.id).then(res => {
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
      this.approveForm.offerId = row.id
      this.approveForm.isPass = '0'
      this.approveForm.remark = ''
      this.approveVisible = true
    },
    confirmDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apprServer.offerInfosCheck(this.approveForm).then(res => {
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
